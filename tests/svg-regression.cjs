const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');const src=[...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes('let qrGenerated'));
const a=src.indexOf('    let qrGenerated'),b=src.indexOf('    function watermarkCanvas(',a);assert(a>=0&&b>a);let output,encoded='';
const node=()=>({value:'',disabled:false,textContent:'',attrs:{},replaceChildren(){this.cleared=true},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},cloneNode(){return this},querySelector(){return {style:{}}}});
const ids=Object.fromEntries(['qrTextInput','qrCodeContainer','barcodeCanvas','qrSvgBtn','barcodeSvgBtn','qrBarcodeStatus','watermarkText','watermarkOpacity','watermarkAngle','watermarkColor'].map(x=>[x,node()]));
function qrcode(){return {getModuleCount:()=>2,isDark:(r,c)=>r===c,addData(){},make(){}}};
function JsBarcode(el,text){encoded=text;el.setAttribute('width','200');el.setAttribute('height','80')}
const context={document:{getElementById:id=>ids[id]},window:{JsBarcode},qrcode,JsBarcode,TextEncoder,XMLSerializer:class{serializeToString(){return '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'}},downloadBytes:(s,type,name)=>{output={s,type,name}},showToast(){},escapeHtml:v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
vm.createContext(context);vm.runInContext(src.slice(a,b),context);
ids.qrTextInput.value='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';context.generateQRAndBarcode();assert.equal(encoded,ids.qrTextInput.value);assert.equal(ids.barcodeSvgBtn.disabled,false);context.downloadQrSvg();assert.match(output.s,/viewBox="0 0 10 10"/);assert.match(output.s,/M4 4h1v1h-1z/);assert.match(output.s,/M5 5h1v1h-1z/);assert.doesNotMatch(output.s,/<image|base64/i);
ids.qrTextInput.value='中文';context.generateQRAndBarcode();assert.equal(ids.qrSvgBtn.disabled,false);assert.equal(ids.barcodeSvgBtn.disabled,true);assert.match(ids.qrBarcodeStatus.textContent,/ASCII/);
ids.qrTextInput.value='';context.generateQRAndBarcode();assert(ids.qrSvgBtn.disabled&&ids.barcodeSvgBtn.disabled);
ids.watermarkText.value='<script>alert("x")</script>&';ids.watermarkOpacity.value='35';ids.watermarkAngle.value='-30';ids.watermarkColor.value='#ff0000';context.downloadWatermarkSvg();assert.match(output.s,/&lt;script&gt;/);assert.doesNotMatch(output.s,/<script|<image|base64/i);assert.match(output.s,/rotate\(-30\)/);assert.match(output.s,/fill-opacity="0.35"/);assert.match(output.s,/#ff0000/);
console.log('PASS: QR module paths and quiet zone, full barcode input, invalid input, watermark vector and escaping');
