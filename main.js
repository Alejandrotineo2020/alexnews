// ============================================================
//  TechPulse News — main.js
//  Lógica: fetch API, renderizado de tarjetas, descarga .txt
// ============================================================

// 🔑 API Key desde variables de entorno de Vite
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';
const DEFAULT_IMG = 'https://placehold.co/600x400/111113/ffc107?text=TechPulse+News&font=syne';

// Estado global
let allArticles = [];       // todos los artículos cargados
let filtered    = [];       // artículos según filtro activo
let activeFilter = 'technology';

// ─── Referencias DOM ─────────────────────────────────────────
const grid       = document.getElementById('newsGrid');
const loader     = document.getElementById('loader');
const errorMsg   = document.getElementById('errorMsg');
const errorText  = document.getElementById('errorText');
const totalCount = document.getElementById('totalCount');
const techCount  = document.getElementById('techCount');
const sciCount   = document.getElementById('sciCount');
const lastUpdate = document.getElementById('lastUpdate');
const btnDown    = document.getElementById('btnDownload');
const pills      = document.querySelectorAll('.pill');

// ─── Fetch de noticias ────────────────────────────────────────
async function fetchNews(category = 'technology') {
  showLoader(true);
  hideError();

  const url = `${BASE_URL}?apikey=${API_KEY}&category=${category}&language=es&size=10`;

  try {
    const res  = await fetch(url);
    const data = await res.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Error desconocido de la API');
    }

    return data.results || [];
  } catch (err) {
    showError(`No se pudo cargar las noticias: ${err.message}`);
    return [];
  } finally {
    showLoader(false);
  }
}

// ─── Cargar todo (tech + ciencia) ────────────────────────────
async function loadAll() {
  showLoader(true);
  hideError();

  const [tech, sci] = await Promise.all([
    fetchNews('technology'),
    fetchNews('science')
  ]);

  // Etiquetar categoría para el badge
  const taggedTech = tech.map(a => ({ ...a, _cat: 'technology' }));
  const taggedSci  = sci.map(a => ({ ...a, _cat: 'science' }));

  allArticles = [...taggedTech, ...taggedSci];

  // Actualizar contadores
  totalCount.textContent = allArticles.length;
  techCount.textContent  = taggedTech.length;
  sciCount.textContent   = taggedSci.length;
  lastUpdate.textContent = new Date().toLocaleTimeString('es-DO');

  applyFilter(activeFilter);
}

// ─── Filtrar ──────────────────────────────────────────────────
function applyFilter(cat) {
  activeFilter = cat;
  if (cat === 'all') {
    filtered = allArticles;
  } else {
    filtered = allArticles.filter(a => a._cat === cat);
  }
  renderCards(filtered);
}

// ─── Renderizar tarjetas ──────────────────────────────────────
function renderCards(articles) {
  grid.innerHTML = '';

  if (!articles.length) {
    grid.innerHTML = '<p class="text-center text-muted mt-5 w-100">Sin noticias para mostrar 🔭</p>';
    return;
  }

  articles.forEach(article => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const catClass = article._cat === 'technology' ? 'cat-technology'
                   : article._cat === 'science'    ? 'cat-science'
                   : 'cat-default';
    const catLabel = article._cat === 'technology' ? '⚡ Tech'
                   : article._cat === 'science'    ? '🔬 Ciencia'
                   : '📰 News';

    const imgSrc = article.image_url || DEFAULT_IMG;
    const date   = article.pubDate
      ? new Date(article.pubDate).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Fecha no disponible';

    col.innerHTML = `
      <div class="news-card">
        <div class="card-img-wrap">
          <img src="${imgSrc}"
               alt="${escHtml(article.title)}"
               loading="lazy"
               onerror="this.src='${DEFAULT_IMG}'">
          <span class="cat-badge ${catClass}">${catLabel}</span>
        </div>
        <div class="card-content">
          <p class="card-source">
            <i class="fa-solid fa-rss me-1"></i>${escHtml(article.source_id || 'Fuente desconocida')}
          </p>
          <h3 class="card-headline">${escHtml(article.title)}</h3>
          <p class="card-desc">${escHtml(article.description || 'Sin descripción disponible.')}</p>
          <div class="card-footer-row">
            <span class="card-date">
              <i class="fa-regular fa-calendar"></i>${date}
            </span>
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="card-link">
              Leer <i class="fa-solid fa-arrow-up-right-from-square ms-1"></i>
            </a>
          </div>
        </div>
      </div>`;

    grid.appendChild(col);
  });
}

// ─── Generar y descargar Top 10 .txt ─────────────────────────
function downloadTop10() {
  // Tomar 5 de tech + 5 de ciencia = Top 10
  const top10tech = allArticles.filter(a => a._cat === 'technology').slice(0, 5);
  const top10sci  = allArticles.filter(a => a._cat === 'science').slice(0, 5);
  const top10     = [...top10tech, ...top10sci];

  if (!top10.length) {
    alert('⚠️ Primero carga las noticias antes de descargar el resumen.');
    return;
  }

  const now = new Date().toLocaleString('es-DO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  let content = '';
  content += '╔══════════════════════════════════════════════════════════════╗\n';
  content += '║           TECHPULSE NEWS — TOP 10 DE HOY                    ║\n';
  content += '║         Tecnología & Ciencia · Resumen Ejecutivo            ║\n';
  content += '╚══════════════════════════════════════════════════════════════╝\n\n';
  content += `📅 Generado el: ${now}\n`;
  content += `🔑 Fuente: NewsData.io\n`;
  content += '━'.repeat(66) + '\n\n';

  top10.forEach((article, i) => {
    const catEmoji = article._cat === 'technology' ? '⚡' : '🔬';
    const catLabel = article._cat === 'technology' ? 'TECNOLOGÍA' : 'CIENCIA';
    const date = article.pubDate
      ? new Date(article.pubDate).toLocaleDateString('es-DO', { day: '2-digit', month: 'long', year: 'numeric' })
      : 'Fecha no disponible';

    content += `${catEmoji} NOTICIA #${String(i + 1).padStart(2, '0')} · ${catLabel}\n`;
    content += '─'.repeat(66) + '\n';
    content += `📰 ${article.title || 'Sin título'}\n`;
    content += `📡 Fuente: ${article.source_id || 'Desconocida'}  |  📅 ${date}\n`;
    content += `🔗 ${article.link || 'Enlace no disponible'}\n\n`;

    // Párrafo 1: Contexto
    const rawDesc = article.description || article.content || '';
    const context = rawDesc
      ? truncate(rawDesc, 300)
      : 'Esta noticia no incluye descripción en la respuesta de la API. Se recomienda visitar el enlace original para conocer el contexto completo del artículo.';

    content += `📌 CONTEXTO:\n${wrapText(context, 66)}\n\n`;

    // Párrafo 2: Relevancia
    const relevancia = buildRelevance(article);
    content += `💡 RELEVANCIA:\n${wrapText(relevancia, 66)}\n`;
    content += '━'.repeat(66) + '\n\n';
  });

  content += '╔══════════════════════════════════════════════════════════════╗\n';
  content += '║  ¿Te fue útil este resumen? Visita TechPulse News 🛰️        ║\n';
  content += '╚══════════════════════════════════════════════════════════════╝\n';

  // Disparar descarga
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `techpulse-top10-${formatDateFile()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

// ─── Helpers ──────────────────────────────────────────────────

/** Construye el párrafo de relevancia a partir de los datos del artículo */
function buildRelevance(article) {
  const cat    = article._cat === 'technology' ? 'tecnología' : 'ciencia';
  const source = article.source_id || 'un medio especializado';
  const title  = article.title || '';

  // Extraer palabras clave del título (sustantivos largos)
  const keywords = title
    .split(/\s+/)
    .filter(w => w.length > 5)
    .slice(0, 3)
    .join(', ');

  return `Esta pieza periodística, publicada por ${source}, aborda temas de ${cat} ` +
         `con impacto potencial en la agenda digital y científica actual. ` +
         `Los conceptos clave identificados incluyen: ${keywords || 'innovación, avance y desarrollo'}. ` +
         `Se recomienda su lectura completa para profesionales, estudiantes e interesados en mantenerse ` +
         `actualizados en el ecosistema de la ${cat} contemporánea.`;
}

/** Trunca texto a n caracteres */
function truncate(str, n) {
  return str.length > n ? str.slice(0, n).trim() + '...' : str;
}

/** Ajusta texto a ancho máximo de caracteres */
function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach(word => {
    if ((line + ' ' + word).trim().length > maxWidth) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  });
  if (line) lines.push(line);
  return lines.join('\n');
}

/** Formatea fecha para nombre del archivo */
function formatDateFile() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

/** Escapa HTML para evitar XSS */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showLoader(v)  { loader.style.display = v ? 'block' : 'none'; }
function showError(msg) { errorText.textContent = msg; errorMsg.classList.remove('d-none'); }
function hideError()    { errorMsg.classList.add('d-none'); }

// ─── Event Listeners ──────────────────────────────────────────
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    applyFilter(pill.dataset.cat);
  });
});

btnDown.addEventListener('click', downloadTop10);

// ─── Arranque ────────────────────────────────────────────────
loadAll();
