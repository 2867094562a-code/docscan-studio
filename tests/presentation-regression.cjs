const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'..','presentation.js'),'utf8');
const fixture=fs.readFileSync(require('node:path').join(__dirname,'fixtures','sample-wide.pptx'));
let parsedBytes=0,pages=[],downloads=0,tasks=0;
const nodes={pptPreviewWarnings:{textContent:''},pptPreviewStatus:{textContent:''},pptPreviewTitle:{textContent:''},pptPreviewModal:{classList:{add(){},remove(){}}},pptPreviewExport:{disabled:true},pptPreviewCanvas:{width:0,height:0,getContext:()=>({drawImage(){}})}};
const canvas=()=>({width:0,height:0,getContext:()=>({fillRect(){},drawImage(){}}),toBlob:fn=>fn(new Blob(['jpeg']))});
const context={console,Blob,TextDecoder,URL:{createObjectURL:()=>`blob:test`,revokeObjectURL(){}},setTimeout:(fn)=>{fn();return 1},Image:class{async decode(){}},
 document:{getElementById:id=>nodes[id],createElement:type=>type==='canvas'?canvas():{click(){downloads++},remove(){}},body:{appendChild(){}}},
 window:{WebPpt:{},PDFLib:{}},WebPpt:{async parse(bytes){parsedBytes=bytes.byteLength;return {width:1280,height:720,slides:[{},{}],dispose(){}}},async slideToSvgFile(){return '<svg/>'}},
 PDFLib:{PDFDocument:{async create(){return {async embedJpg(){return {}},addPage(size){pages.push(size);return {drawImage(){}}},async save(){return new Uint8Array([1])}}}}},
 showToast(){},beginWorkspaceTask(){tasks++;return 1},endWorkspaceTask(){tasks--}};
context.window.PDFLib=context.PDFLib; vm.createContext(context);vm.runInContext(source+'\nthis.api=DocPresentation;',context);
(async()=>{const bytes=fixture.buffer.slice(fixture.byteOffset,fixture.byteOffset+fixture.byteLength);await context.api.open({name:'sample.pptx',arrayBuffer:async()=>bytes});assert.equal(parsedBytes,fixture.length);assert.equal(nodes.pptPreviewExport.disabled,false);assert.match(nodes.pptPreviewStatus.textContent,/1 \/ 2/);await context.api.preview(1);assert.match(nodes.pptPreviewStatus.textContent,/2 \/ 2/);await context.api.exportPdf();assert.equal(pages.length,2);assert.deepEqual(Array.from(pages[0]),[960,540]);assert.equal(downloads,1);assert.equal(tasks,0);console.log('PASS: PPTX preflight, source bytes, multi-page preview and PDF geometry (mocked renderer)')})().catch(e=>{console.error(e);process.exitCode=1});
