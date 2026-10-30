const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const source = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('function warpImagePerspective'));
const between = (a,b) => {const i=source.indexOf(a),j=source.indexOf(b,i); assert(i>=0 && j>i,a); return source.slice(i,j)};
const canvas={width:0,height:0,getContext:()=>({})}, pageInfo={innerText:''}, table={innerHTML:''};
const context={console, setTimeout, clearTimeout, Uint8ClampedArray, Uint32Array, MAX_SCAN_PIXELS:12000000,
 document:{getElementById:id=>id==='excelTableElement'?table:id==='pdfViewerCanvas'?canvas:id==='pdfViewerPageInfo'?pageInfo:null},
 state:{excelData:[['A','B','C'],['D']],excelColWidths:[51,52,53],excelRowHeights:[41,42],contextMenuColIndex:1,contextMenuRowIndex:1},
 escapeHtml:x=>String(x), showToast:x=>{throw Error(x)} };
vm.createContext(context);
vm.runInContext(between('    function initExcelGrid()', '    function selectExcelCell(') + between('    function insertColAt(', '    function setSpecificColWidth(') + between('    function rotateCornersGeometry(', '    function rotateScanImage(') + between('    function getPerspectiveTransform(', '    function executePerspectiveWarp('),context);
context.initExcelGrid(); context.insertColLeft();
assert.equal(context.state.excelData[0][2],'B'); assert.equal(context.state.excelColWidths[2],52);
context.deleteColByIndex(1); assert.equal(context.state.excelData[0][1],'B'); assert.equal(context.state.excelColWidths[1],52);
context.insertRowAbove(); assert.equal(context.state.excelData[1].length,context.state.excelData[0].length); assert.equal(context.state.excelRowHeights[2],42);
context.deleteRowByIndex(1); assert.equal(context.state.excelData[1][0],'D'); assert.equal(context.state.excelRowHeights[1],42);
context.state.excelData=[];context.state.excelColWidths=[];context.state.excelRowHeights=[];context.initExcelGrid();assert(context.state.excelData.length && context.state.excelData[0].length);
const pts=[{x:0,y:0},{x:3,y:0},{x:3,y:3},{x:0,y:3}], data=new Uint8ClampedArray(4*4*4);
for(let y=0;y<4;y++)for(let x=0;x<4;x++){let i=(y*4+x)*4;data[i]=x*80;data[i+3]=255}
const image=context.warpImagePerspective(data,4,4,pts), pixels=new Uint8ClampedArray(image.dstPixels.buffer);
assert.equal(image.dstW,20); assert.equal(pixels[(10*20+10)*4],120,'bilinear midpoint');
assert.throws(()=>context.warpImagePerspective(data,4,4,[pts[0],pts[2],pts[1],pts[3]]),/交叉|退化/);
assert.throws(()=>context.getPerspectiveTransform([pts[0],pts[0],pts[0],pts[0]],pts),/退化/);
assert.equal(context.rotateCornersGeometry(pts,4,4,90)[0].x,0);
console.log('PASS: Excel insert/delete dimensions, empty grid, bilinear pixels, invalid quadrilateral, singular transform and rotation');
