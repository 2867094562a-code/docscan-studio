/* Local presentation preview and export. WebPpt is the bundled MIT renderer. */
const DocPresentation = (() => {
  const state = {generation:0, presentation:null, index:0, fileName:'', cancelled:false, exporting:false};
  const get = id => document.getElementById(id);
  function status(text) { get('pptPreviewStatus').textContent = text; }
  function ensureCurrent(generation) { if (state.cancelled || generation !== state.generation) throw new Error('已取消'); }
  function close() {
    state.cancelled = true; state.generation++;
    if (!state.exporting && state.presentation) state.presentation.dispose?.();
    state.presentation = null;
    get('pptPreviewModal').classList.add('hidden');
  }
  function preflight(bytes, ext) {
    if (bytes.byteLength > 25 * 1024 * 1024) throw new Error('文件超过 25 MB 限制');
    if (ext !== 'pptx') return [];
    const d = new DataView(bytes); let eocd = -1;
    for (let i = d.byteLength-22; i >= Math.max(0,d.byteLength-65557); i--) if (d.getUint32(i,true) === 0x06054b50) { eocd=i; break; }
    if (eocd < 0) throw new Error('不是有效的 PPTX 压缩文件');
    const count=d.getUint16(eocd+10,true), offset=d.getUint32(eocd+16,true);
    if (count === 65535 || offset === 0xffffffff || count > 3000) throw new Error('压缩包过大或使用不支持的 ZIP64');
    let pos=offset,total=0; const features=new Set();
    for (let i=0;i<count;i++) {
      if (pos+46>d.byteLength || d.getUint32(pos,true)!==0x02014b50) throw new Error('PPTX 压缩目录损坏');
      const nameLength=d.getUint16(pos+28,true);
      if (pos+46+nameLength>d.byteLength) throw new Error('PPTX 文件名目录损坏');
      const name=new TextDecoder().decode(new Uint8Array(bytes,pos+46,nameLength)).toLowerCase();
      if (name.startsWith('ppt/charts/')) features.add('图表');
      if (name.startsWith('ppt/diagrams/')) features.add('SmartArt');
      if (/\.(mp4|mov|avi|wav|mp3|m4a|wmv|wma)$/i.test(name)) features.add('音视频');
      const size=d.getUint32(pos+24,true); if (size===0xffffffff) throw new Error('不支持 ZIP64 文件'); total+=size;
      if (total>160*1024*1024) throw new Error('PPTX 解压后超过 160 MB 限制');
      pos+=46+d.getUint16(pos+28,true)+d.getUint16(pos+30,true)+d.getUint16(pos+32,true);
    }
    return [...features];
  }
  async function renderCanvas(presentation, index) {
    const svg = await WebPpt.slideToSvgFile(presentation, presentation.slides[index]);
    const url = URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
    try {
      const img = new Image(); img.src=url; await img.decode();
      const canvas=document.createElement('canvas');
      const ratio=Math.min(1600/presentation.width, 1600/presentation.height);
      canvas.width=Math.max(1,Math.round(presentation.width*ratio)); canvas.height=Math.max(1,Math.round(presentation.height*ratio));
      const ctx=canvas.getContext('2d'); ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      return canvas;
    } finally { URL.revokeObjectURL(url); }
  }
  async function preview(index, generation=state.generation) {
    if (!state.presentation || state.exporting) return;
    const pres=state.presentation; state.index=Math.max(0,Math.min(index,pres.slides.length-1)); const selected=state.index;
    status(`正在渲染第 ${selected+1} / ${pres.slides.length} 页…`);
    try {
      const canvas=await renderCanvas(pres,selected); ensureCurrent(generation); if(selected!==state.index)return;
      const dest=get('pptPreviewCanvas');dest.width=canvas.width;dest.height=canvas.height;dest.getContext('2d').drawImage(canvas,0,0);
      status(`第 ${selected+1} / ${pres.slides.length} 页`);
    } catch(err) { if (generation===state.generation) status('预览失败：'+err.message); }
  }
  async function open(file) {
    if(!file)return; const ext=file.name.split('.').pop().toLowerCase();
    if(!['pptx','ppt'].includes(ext)) return showToast('请选择 PPTX 或 PPT 文件');
    if(!window.WebPpt) return showToast('演示文稿渲染组件未加载，请检查 vendor 文件');
    close(); const gen=++state.generation;state.cancelled=false;state.exporting=false;state.fileName=file.name;
    get('pptPreviewModal').classList.remove('hidden');get('pptPreviewTitle').textContent=file.name;
    get('pptPreviewExport').disabled=true;status('正在解析文件…');
    const task=beginWorkspaceTask('正在解析演示文稿'); let pres;
    try {
      const bytes=await file.arrayBuffer();ensureCurrent(gen);const features=preflight(bytes,ext);
      get('pptPreviewWarnings').textContent = (features.length ? `检测到：${features.join('、')}。` : '') + '页面按原比例导出为图像 PDF，文字不可搜索。复杂动画、图表、字体和多媒体可能不同或缺失，请逐页检查预览。';
      await new Promise(resolve=>setTimeout(resolve,0));pres=await WebPpt.parse(bytes);ensureCurrent(gen);
      if(!pres.slides?.length)throw new Error('文件没有可显示的幻灯片');
      if(pres.slides.length>100)throw new Error('超过 100 页限制，请先拆分文件');
      if(!Number.isFinite(pres.width)||!Number.isFinite(pres.height)||pres.width<=0||pres.height<=0||pres.width>20000||pres.height>20000)throw new Error('幻灯片尺寸无效');
      state.presentation=pres;get('pptPreviewExport').disabled=false;await preview(0,gen);
    } catch(err) { if(pres && pres!==state.presentation)pres.dispose?.(); if(gen===state.generation)status('打开失败：'+err.message); }
    finally {endWorkspaceTask(task)}
  }
  async function exportPdf() {
    const pres=state.presentation;if(!pres||state.exporting)return;
    const gen=state.generation;state.exporting=true;get('pptPreviewExport').disabled=true;
    const task=beginWorkspaceTask('正在导出演示文稿');
    try {
      if(!window.PDFLib?.PDFDocument)throw new Error('PDF 组件未加载');
      const pdf=await PDFLib.PDFDocument.create();
      for(let i=0;i<pres.slides.length;i++) {
        ensureCurrent(gen);status(`正在导出第 ${i+1} / ${pres.slides.length} 页…`);
        await new Promise(resolve=>setTimeout(resolve,0));
        const canvas=await renderCanvas(pres,i);ensureCurrent(gen);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.92));if(!blob)throw new Error('页面图像生成失败');
        const image=await pdf.embedJpg(await blob.arrayBuffer());
        const width=pres.width*0.75,height=pres.height*0.75;
        const page=pdf.addPage([width,height]);page.drawImage(image,{x:0,y:0,width,height});
      }
      const bytes=await pdf.save();ensureCurrent(gen);
      downloadBytes(bytes,'application/pdf',state.fileName.replace(/\.(pptx|ppt)$/i,'')+'.pdf');
      status(`已导出 ${pres.slides.length} 页；PDF 页面为图像，文字不可搜索。`);showToast('演示文稿 PDF 已生成');
    } catch(err) { if(gen===state.generation) {status('导出未完成：'+err.message);showToast('导出未完成：'+err.message);} }
    finally {endWorkspaceTask(task);if(gen===state.generation){state.exporting=false;get('pptPreviewExport').disabled=false;}else pres.dispose?.();}
  }
  return {open,close,preview,exportPdf, get index() { return state.index; }};
})();
function downloadBytes(bytes,type,name) {
  const url=URL.createObjectURL(new Blob([bytes],{type}));
  try {const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();}
  finally {setTimeout(()=>URL.revokeObjectURL(url),60000);}
}
