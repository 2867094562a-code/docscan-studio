/* Convert the editor's basic document structure to DOCX. */
function wordDomToDocx(root) {
  const warnings = new Set(), D = window.docx;
  function imageRun(el) {
    const src=el.getAttribute('src')||'', match=/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=\s]+)$/i.exec(src);
    if (!match) { warnings.add('不支持的图片'); return null; }
    try {
      const binary=atob(match[2].replace(/\s/g,'')); if(binary.length>10*1024*1024)throw Error('图片过大');
      const data=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
      let width=Number(el.getAttribute('width'))||el.naturalWidth||240, height=Number(el.getAttribute('height'))||el.naturalHeight||width;
      const scale=Math.min(1,560/width,720/height); width=Math.max(1,Math.round(width*scale));height=Math.max(1,Math.round(height*scale));
      return new D.ImageRun({data,transformation:{width,height},type:match[1].toLowerCase()==='jpeg'?'jpg':'png'});
    } catch (_) { warnings.add('无法读取的图片');return null; }
  }
  function runs(node,style={}) {
    if(node.nodeType===3) return node.nodeValue ? [new D.TextRun({text:node.nodeValue,...style})] : [];
    if(node.nodeType!==1) return [];
    const tag=node.tagName;
    if(tag==='BR')return [new D.TextRun({text:'',break:1,...style})];
    if(tag==='IMG'){const run=imageRun(node);return run?[run]:[];}
    if(['SCRIPT','STYLE','IFRAME','OBJECT'].includes(tag))return [];
    const next={...style};
    if(tag==='STRONG'||tag==='B'||/^(bold|[6-9]00)$/i.test(node.style?.fontWeight||''))next.bold=true;
    if(tag==='EM'||tag==='I'||node.style?.fontStyle==='italic')next.italics=true;
    if(tag==='U'||(node.style?.textDecoration||'').includes('underline'))next.underline={};
    return [...node.childNodes].flatMap(child=>runs(child,next));
  }
  function paragraph(el) {
    const opts={children:runs(el)};const heading=/^H([1-6])$/.exec(el.tagName||'');
    if(heading) opts.heading=D.HeadingLevel['HEADING_'+heading[1]];
    return new D.Paragraph(opts);
  }
  function table(el) {
    const rows=[...el.querySelectorAll('tr')].map(row => {
      const cells=[...row.children].filter(c=>c.tagName==='TD'||c.tagName==='TH').map(cell=>{
        if(cell.rowSpan>1||cell.colSpan>1)warnings.add('合并单元格');
        const blocks=[...cell.children].filter(c=>/^(P|H[1-6]|DIV)$/.test(c.tagName));
        return new D.TableCell({children:blocks.length?blocks.map(paragraph):[paragraph(cell)]});
      });
      return cells.length ? new D.TableRow({children:cells}) : null;
    }).filter(Boolean);
    return rows.length ? new D.Table({rows}) : null;
  }
  const children=[];
  for(const node of root.childNodes) {
    if(node.nodeType===3){if(node.nodeValue.trim())children.push(new D.Paragraph({children:runs(node)}));continue;}
    if(node.nodeType!==1)continue;
    if(node.tagName==='TABLE'){const item=table(node);if(item)children.push(item);continue;}
    if(['UL','OL'].includes(node.tagName)){for(const li of node.children)children.push(paragraph(li));warnings.add('列表编号');continue;}
    children.push(paragraph(node));
  }
  if(!children.length)children.push(new D.Paragraph({text:''}));
  return {document:new D.Document({sections:[{children}]}),warnings:[...warnings]};
}
