(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function c(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=c(e);fetch(e.href,o)}})();const _="pub_78fb968934914a9fa50aebc7218a5083",I="https://newsdata.io/api/1/news",m="https://placehold.co/600x400/111113/ffc107?text=TechPulse+News&font=syne";let i=[],d=[],E="technology";const u=document.getElementById("newsGrid"),O=document.getElementById("loader"),w=document.getElementById("errorMsg"),x=document.getElementById("errorText"),N=document.getElementById("totalCount"),A=document.getElementById("techCount"),P=document.getElementById("sciCount"),B=document.getElementById("lastUpdate"),F=document.getElementById("btnDownload"),f=document.querySelectorAll(".pill");async function h(t="technology"){p(!0),$();const n=`${I}?apikey=${_}&category=${t}&language=es&size=10`;try{const a=await(await fetch(n)).json();if(a.status!=="success")throw new Error(a.message||"Error desconocido de la API");return a.results||[]}catch(c){return z(`No se pudo cargar las noticias: ${c.message}`),[]}finally{p(!1)}}async function U(){p(!0),$();const[t,n]=await Promise.all([h("technology"),h("science")]),c=t.map(e=>({...e,_cat:"technology"})),a=n.map(e=>({...e,_cat:"science"}));i=[...c,...a],N.textContent=i.length,A.textContent=c.length,P.textContent=a.length,B.textContent=new Date().toLocaleTimeString("es-DO"),L(E)}function L(t){E=t,t==="all"?d=i:d=i.filter(n=>n._cat===t),M(d)}function M(t){if(u.innerHTML="",!t.length){u.innerHTML='<p class="text-center text-muted mt-5 w-100">Sin noticias para mostrar 🔭</p>';return}t.forEach(n=>{const c=document.createElement("div");c.className="col-12 col-sm-6 col-lg-4";const a=n._cat==="technology"?"cat-technology":n._cat==="science"?"cat-science":"cat-default",e=n._cat==="technology"?"⚡ Tech":n._cat==="science"?"🔬 Ciencia":"📰 News",o=n.image_url||m,r=n.pubDate?new Date(n.pubDate).toLocaleDateString("es-DO",{day:"2-digit",month:"short",year:"numeric"}):"Fecha no disponible";c.innerHTML=`
      <div class="news-card">
        <div class="card-img-wrap">
          <img src="${o}"
               alt="${l(n.title)}"
               loading="lazy"
               onerror="this.src='${m}'">
          <span class="cat-badge ${a}">${e}</span>
        </div>
        <div class="card-content">
          <p class="card-source">
            <i class="fa-solid fa-rss me-1"></i>${l(n.source_id||"Fuente desconocida")}
          </p>
          <h3 class="card-headline">${l(n.title)}</h3>
          <p class="card-desc">${l(n.description||"Sin descripción disponible.")}</p>
          <div class="card-footer-row">
            <span class="card-date">
              <i class="fa-regular fa-calendar"></i>${r}
            </span>
            <a href="${n.link}" target="_blank" rel="noopener noreferrer" class="card-link">
              Leer <i class="fa-solid fa-arrow-up-right-from-square ms-1"></i>
            </a>
          </div>
        </div>
      </div>`,u.appendChild(c)})}function R(){const t=i.filter(s=>s._cat==="technology").slice(0,5),n=i.filter(s=>s._cat==="science").slice(0,5),c=[...t,...n];if(!c.length){alert("⚠️ Primero carga las noticias antes de descargar el resumen.");return}const a=new Date().toLocaleString("es-DO",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});let e="";e+=`╔══════════════════════════════════════════════════════════════╗
`,e+=`║           TECHPULSE NEWS — TOP 10 DE HOY                    ║
`,e+=`║         Tecnología & Ciencia · Resumen Ejecutivo            ║
`,e+=`╚══════════════════════════════════════════════════════════════╝

`,e+=`📅 Generado el: ${a}
`,e+=`🔑 Fuente: NewsData.io
`,e+="━".repeat(66)+`

`,c.forEach((s,b)=>{const v=s._cat==="technology"?"⚡":"🔬",C=s._cat==="technology"?"TECNOLOGÍA":"CIENCIA",D=s.pubDate?new Date(s.pubDate).toLocaleDateString("es-DO",{day:"2-digit",month:"long",year:"numeric"}):"Fecha no disponible";e+=`${v} NOTICIA #${String(b+1).padStart(2,"0")} · ${C}
`,e+="─".repeat(66)+`
`,e+=`📰 ${s.title||"Sin título"}
`,e+=`📡 Fuente: ${s.source_id||"Desconocida"}  |  📅 ${D}
`,e+=`🔗 ${s.link||"Enlace no disponible"}

`;const g=s.description||s.content||"",S=g?k(g,300):"Esta noticia no incluye descripción en la respuesta de la API. Se recomienda visitar el enlace original para conocer el contexto completo del artículo.";e+=`📌 CONTEXTO:
${y(S,66)}

`;const T=j(s);e+=`💡 RELEVANCIA:
${y(T,66)}
`,e+="━".repeat(66)+`

`}),e+=`╔══════════════════════════════════════════════════════════════╗
`,e+=`║  ¿Te fue útil este resumen? Visita TechPulse News 🛰️        ║
`,e+=`╚══════════════════════════════════════════════════════════════╝
`;const o=new Blob([e],{type:"text/plain;charset=utf-8"}),r=document.createElement("a");r.href=URL.createObjectURL(o),r.download=`techpulse-top10-${H()}.txt`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(r.href)}function j(t){const n=t._cat==="technology"?"tecnología":"ciencia",c=t.source_id||"un medio especializado",e=(t.title||"").split(/\s+/).filter(o=>o.length>5).slice(0,3).join(", ");return`Esta pieza periodística, publicada por ${c}, aborda temas de ${n} con impacto potencial en la agenda digital y científica actual. Los conceptos clave identificados incluyen: ${e||"innovación, avance y desarrollo"}. Se recomienda su lectura completa para profesionales, estudiantes e interesados en mantenerse actualizados en el ecosistema de la ${n} contemporánea.`}function k(t,n){return t.length>n?t.slice(0,n).trim()+"...":t}function y(t,n){const c=t.split(" "),a=[];let e="";return c.forEach(o=>{(e+" "+o).trim().length>n?(a.push(e.trim()),e=o):e=(e+" "+o).trim()}),e&&a.push(e),a.join(`
`)}function H(){const t=new Date;return`${t.getFullYear()}${String(t.getMonth()+1).padStart(2,"0")}${String(t.getDate()).padStart(2,"0")}`}function l(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function p(t){O.style.display=t?"block":"none"}function z(t){x.textContent=t,w.classList.remove("d-none")}function $(){w.classList.add("d-none")}f.forEach(t=>{t.addEventListener("click",()=>{f.forEach(n=>n.classList.remove("active")),t.classList.add("active"),L(t.dataset.cat)})});F.addEventListener("click",R);U();
