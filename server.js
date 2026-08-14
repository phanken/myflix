
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const API = process.env.KKPHIM_API || 'https://phimapi.com';

app.use(express.static('public'));

async function jfetch(url){
  const r = await fetch(url,{headers:{accept:'application/json','user-agent':'MyFlix-KKPhim/3.0'}});
  const t = await r.text();
  let d; try{d=JSON.parse(t)}catch{throw new Error('API trả dữ liệu không phải JSON')}
  if(!r.ok) throw new Error(d?.message || d?.msg || `HTTP ${r.status}`);
  return d;
}
function absImage(x,pathImage=''){
  if(!x) return '';
  if(/^https?:\/\//i.test(x)) return x;
  if(pathImage) return pathImage.replace(/\/$/,'')+'/'+x.replace(/^\//,'');
  return `https://phimimg.com/${x.replace(/^\//,'')}`;
}
function normList(d){
  const data=d?.data||d||{};
  const items=data.items||d.items||[];
  const pathImage=data.APP_DOMAIN_CDN_IMAGE || data.pathImage || d.pathImage || 'https://phimimg.com/';
  const pagination=data.params?.pagination || data.pagination || d.pagination || {};
  return {
    items:items.map(x=>({...x,thumb_abs:absImage(x.thumb_url,pathImage),poster_abs:absImage(x.poster_url,pathImage)})),
    pagination
  };
}
app.get('/api/home',async(req,res)=>{
  try{res.json({ok:true,...normList(await jfetch(`${API}/danh-sach/phim-moi-cap-nhat?page=${Number(req.query.page||1)}`))})}
  catch(e){res.status(500).json({ok:false,error:e.message})}
});
app.get('/api/list/:slug',async(req,res)=>{
  try{
    const q=new URLSearchParams(req.query);
    res.json({ok:true,...normList(await jfetch(`${API}/v1/api/danh-sach/${encodeURIComponent(req.params.slug)}?${q}`))})
  }catch(e){res.status(500).json({ok:false,error:e.message})}
});
app.get('/api/search',async(req,res)=>{
  try{
    const kw=String(req.query.q||'').trim();
    if(kw.length<2)return res.json({ok:true,items:[],pagination:{}});
    res.json({ok:true,...normList(await jfetch(`${API}/v1/api/tim-kiem?keyword=${encodeURIComponent(kw)}&limit=48&page=${Number(req.query.page||1)}`))})
  }catch(e){res.status(500).json({ok:false,error:e.message})}
});
function normalizeEpisodes(d,m){
  let eps = d?.episodes ?? m?.episodes ?? d?.data?.item?.episodes ?? [];
  if(!Array.isArray(eps)) eps=[];

  // Một số nguồn/format có thể trả danh sách tập phẳng.
  if(eps.length && !eps[0]?.server_data && (eps[0]?.link_embed || eps[0]?.link_m3u8)){
    eps=[{server_name:"Server 1",server_data:eps}];
  }

  return eps.map((sv,i)=>({
    server_name:sv?.server_name || sv?.name || `Server ${i+1}`,
    is_ai:!!sv?.is_ai,
    server_data:Array.isArray(sv?.server_data)
      ? sv.server_data
      : Array.isArray(sv?.episodes)
        ? sv.episodes
        : []
  })).filter(sv=>sv.server_data.length);
}

app.get('/api/movie/:slug',async(req,res)=>{
  try{
    // Format cổ điển của KKPhim: movie và episodes tách riêng.
    let d=await jfetch(`${API}/phim/${encodeURIComponent(req.params.slug)}`);
    let m=d.movie||d?.data?.item||{};
    let episodes=normalizeEpisodes(d,m);

    // Fallback format v1 nếu endpoint cổ điển chưa có tập.
    if(!episodes.length){
      try{
        const d1=await jfetch(`${API}/v1/api/phim/${encodeURIComponent(req.params.slug)}`);
        const m1=d1?.data?.item||d1?.movie||{};
        const e1=normalizeEpisodes(d1,m1);
        if(e1.length){ d=d1; m=m1; episodes=e1; }
      }catch{}
    }

    res.json({
      ok:true,
      movie:{...m,thumb_abs:absImage(m.thumb_url),poster_abs:absImage(m.poster_url)},
      episodes
    })
  }catch(e){res.status(500).json({ok:false,error:e.message})}
});
app.get('/health',(req,res)=>res.json({ok:true,version:'3.0.0',api:API}));
app.listen(PORT,'0.0.0.0',()=>console.log('Server listen on port',PORT));
