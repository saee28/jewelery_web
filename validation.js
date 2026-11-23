const email=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||''));
const money=v=>Number.isFinite(Number(v))&&Number(v)>=0;
const id=v=>/^\d+$/.test(String(v||''))&&Number(v)>0;
module.exports={email,money,id};
