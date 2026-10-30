const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');const src=[...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes('function applyFilterToCanvas'));
const between=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i);return src.slice(i,j)};
let pixels=new Uint8ClampedArray([180,40,40,255]), written=null,added=null;
const off={width:0,height:0,getContext(){return {drawImage(){},getImageData(){return {data:pixels}},putImageData(v){written=v.data}}},toDataURL(){return 'data:image/jpeg;base64,AA=='}};
const ctx={console,document:{createElement:()=>off},state:{scanPages:[{currentImg:{width:400,height:200},filter:'seal'}]},window:{jspdf:{jsPDF:function(){this.addImage=(...args)=>{added=args};this.save=()=>{}}}},showToast(){},processMagicWhiteningFilter(){}};
vm.createContext(ctx);vm.runInContext(between('    function applyFilterToCanvas(', '    function applyScanFilter(')+between('    function exportMultiPageScanToPDF(', '    function extractSealAction('),ctx);ctx.exportMultiPageScanToPDF();
assert.deepEqual([...written],[230,30,30,255]);assert.equal(added[4],210);assert.equal(added[5],105);assert.equal(added[2],0);assert.equal(added[3],96);
console.log('PASS: scan PDF preserves aspect ratio and exports seal filter');

