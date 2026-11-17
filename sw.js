// Incrementar la versión al cambiar cualquier archivo de la app.
const CACHE = 'cata-vinos-v1';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './css/estilos.css',
  './js/app.js', './js/db.js', './js/selector-buscable.js', './js/catalogo/paises.js',
  './js/vistas/util.js', './js/vistas/lista.js', './js/vistas/nueva.js', './js/vistas/detalle.js',
  './iconos/icono-192.png', './iconos/icono-512.png', './iconos/apple-touch-icon.png', './sw.js'];
self.addEventListener('install', evento => {
  evento.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS)));
});
self.addEventListener('activate', evento => {
  evento.waitUntil(caches.keys().then(claves => Promise.all(
    claves.filter(clave => clave.startsWith('cata-vinos-') && clave !== CACHE).map(clave => caches.delete(clave))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', evento => {
  if (evento.request.method !== 'GET' || new URL(evento.request.url).origin !== self.location.origin) return;
  evento.respondWith(caches.open(CACHE).then(async cache => {
    const guardado = await cache.match(evento.request);
    if (guardado) return guardado;
    try { return await fetch(evento.request); }
    catch (error) {
      if (evento.request.mode === 'navigate') return cache.match('./index.html');
      throw error;
    }
  }));
});
