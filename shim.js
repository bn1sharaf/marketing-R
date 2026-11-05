// يحاكي واجهة قاعدة بيانات المنصة ويحوّلها إلى /api (Worker + D1)
(()=>{const subs={},H={'content-type':'application/json'};
const api=(p,o)=>fetch('/api/'+p,o).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});
const snap=rows=>({metadata:{fromCache:false},empty:!rows.length,docs:rows.map(r=>({id:r.id,data:()=>r.data}))});
async function pull(c,s){try{const rows=await api('col/'+c),j=JSON.stringify(rows);if(j!==s.last){s.last=j;s.cb(snap(rows))}}catch(e){s.err&&s.err(e)}}
const poke=c=>[...(subs[c]||[])].forEach(s=>pull(c,s));
const col=c=>({doc:id=>({
 set:d=>api(`col/${c}/${encodeURIComponent(id)}`,{method:'PUT',headers:H,body:JSON.stringify(d)}).then(()=>poke(c)),
 delete:()=>api(`col/${c}/${encodeURIComponent(id)}`,{method:'DELETE'}).then(()=>poke(c))}),
 onSnapshot:(cb,err)=>{const s={cb,err,last:null};(subs[c]=subs[c]||new Set()).add(s);pull(c,s);const t=setInterval(()=>pull(c,s),8000);return()=>{clearInterval(t);subs[c].delete(s)}}});
const dl={save:async({filename,data})=>{const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=filename;document.body.appendChild(a);a.click();a.remove()}};
window.claude={use:async n=>n==='db'?{collection:col}:n==='downloads'?dl:null};
})();
