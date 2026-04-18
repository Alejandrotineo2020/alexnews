# 🛰️ TechPulse News

Dashboard de noticias de Tecnología y Ciencia con descarga de Top 10 en `.txt`.  
Construido con HTML5, CSS3, JavaScript puro y Vite como bundler.

## 🚀 Instalación local

```bash
# 1. Clonar el repo
git clone https://github.com/TU_USUARIO/noticias-tech.git
cd noticias-tech

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Edita .env y pon tu API Key de NewsData.io

# 4. Correr en modo desarrollo
npm run dev
```

## 🔑 Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_NEWS_API_KEY` | Tu API Key de [NewsData.io](https://newsdata.io) |

## 📦 Build y despliegue

```bash
# Generar carpeta dist/
npm run build

# Previsualizar el build
npm run preview
```

## 🌐 Publicar en GitHub Pages

```bash
npm run build
# Sube el contenido de dist/ a la rama gh-pages
```

## ▲ Publicar en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. En **Settings → Environment Variables**, agrega:  
   `VITE_NEWS_API_KEY` = tu clave real
3. Deploy automático ✅

## 📁 Estructura del proyecto

```
noticias-tech/
├── index.html          # Estructura HTML principal
├── main.js             # Lógica: fetch, filtros, descarga .txt
├── style.css           # Estilos: dark theme, animaciones
├── vite.config.js      # Configuración de Vite
├── package.json
├── .env                # ⚠️ NO se sube (gitignore)
├── .env.example        # Plantilla pública sin credenciales
└── .gitignore
```
