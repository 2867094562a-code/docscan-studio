/* Small, non-eval spreadsheet formula evaluator. Unsupported formulas return an error. */
const SpreadsheetFormula = (() => {
  function colIndex(name) { let n=0;for(const c of name.toUpperCase()) n=n*26+c.charCodeAt(0)-64;return n-1; }
  function address(s) { const m=/^([A-Z]+)([1-9]\d*)$/i.exec(s);if(!m)throw Error('#REF!');const c=colIndex(m[1]),r=Number(m[2])-1;if(c>16383||r>1048575)throw Error('#REF!');return {r,c}; }
  function evaluate(data,row,col) {
    const active=new Set();
    function cell(r,c) {
      const key=r+','+c;if(active.has(key))throw Error('#CYCLE!');
      const raw=data[r]?.[c]??'';if(typeof raw!=='string'||!raw.startsWith('='))return raw;
      active.add(key);try{return parse(raw.slice(1));}finally{active.delete(key)}
    }
    function num(v) {if(Array.isArray(v))throw Error('#VALUE!');if(v===''||v==null)return 0;const n=Number(v);if(!Number.isFinite(n))throw Error('#VALUE!');return n;}
    function parse(input) {
      let pos=0,token=null;
      function next(){ while(/\s/.test(input[pos]||'')&&pos<input.length)pos++;if(pos>=input.length){token=null;return;}const rest=input.slice(pos),m=/^(\d+(?:\.\d*)?|\.\d+|[A-Za-z]+[1-9]\d*|[A-Za-z]+|[()+\-*/,:])/.exec(rest);if(!m)throw Error('#VALUE!');token=m[0].toUpperCase();pos+=m[0].length; }
      function expr(){let v=term();while(token==='+'||token==='-'){let op=token;next();const rhs=term();v=op==='+'?num(v)+num(rhs):num(v)-num(rhs)}return v;}
      function term(){let v=factor();while(token==='*'||token==='/'){let op=token;next();let rhs=num(factor());if(op==='/'&&rhs===0)throw Error('#DIV/0!');v=op==='*'?num(v)*rhs:num(v)/rhs}return v;}
      function factor(){if(token==='+'||token==='-'){const op=token;next();let v=num(factor());return op==='-'?-v:v;}if(token==='('){next();const v=expr();if(token!==')')throw Error('#VALUE!');next();return v;}
        if(token===null)throw Error('#VALUE!');
        if(/^(?:\d|\.)/.test(token)){let v=Number(token);next();return v;}
        if(/^[A-Z]+[1-9]\d*$/.test(token)){const start=address(token);next();if(token===':'){next();if(!token||!(/^[A-Z]+[1-9]\d*$/.test(token)))throw Error('#REF!');const end=address(token);next();const minR=Math.min(start.r,end.r),maxR=Math.max(start.r,end.r),minC=Math.min(start.c,end.c),maxC=Math.max(start.c,end.c);if((maxR-minR+1)*(maxC-minC+1)>10000)throw Error('#LIMIT!');const arr=[];for(let r=minR;r<=maxR;r++)for(let c=minC;c<=maxC;c++)arr.push(cell(r,c));return arr;}return cell(start.r,start.c);}
        if(/^[A-Z]+$/.test(token)){const fn=token;next();if(token!=='(')throw Error('#NAME?');next();const args=[];if(token!==')'){for(;;){args.push(expr());if(token!==',')break;next();}}if(token!==')')throw Error('#VALUE!');next();if(!['SUM','AVERAGE','COUNT'].includes(fn))throw Error('#NAME?');const numbers=args.flat().filter(x=>x!==''&&x!==null&&x!==undefined&&Number.isFinite(Number(x))).map(Number);if(fn==='COUNT')return numbers.length;const sum=numbers.reduce((a,b)=>a+b,0);if(fn==='AVERAGE'&&!numbers.length)throw Error('#DIV/0!');return fn==='AVERAGE'?sum/numbers.length:sum;}
        throw Error('#VALUE!'); }
      next();const result=expr();if(token!==null||Array.isArray(result)||!Number.isFinite(num(result)))throw Error('#VALUE!');return num(result);
    }
    try{return {value:cell(row,col),error:null};}catch(e){return {value:null,error:e.message?.startsWith('#')?e.message:'#VALUE!'};}
  }
  function columnLabel(col){let n=col+1,out='';while(n){n--;out=String.fromCharCode(65+n%26)+out;n=Math.floor(n/26);}return out;}
  return {evaluate,columnLabel};
})();
