# Cata de vinos

Base de una PWA móvil en español, sin dependencias de ejecución, frameworks ni CDNs. Permite guardar catas con nombre y foto en IndexedDB, consultarlas y eliminarlas. Todos los campos son opcionales; los identificadores, fechas y versión de datos se completan al guardar. El selector de país demuestra el componente reutilizable; admite selección única o múltiple mediante `multiple: true`, búsqueda sin acentos, etiquetas, «Otro» y «Saltar».

## Probar en local

Con Python 3, desde la raíz del repositorio:

```sh
python3 -m http.server 8000
```

Abre http://localhost:8000. No hace falta instalar ni compilar nada. Los módulos ES y el service worker necesitan un servidor: no uses `file://`. Fuera de localhost se necesita HTTPS para el service worker y las API de contexto seguro.

Crea una cata desde «+», toma una foto o elígela de la galería y guarda. La foto se convierte a JPEG con calidad 0.8 y un máximo de 1280 px en su lado mayor. Comprueba la miniatura en «Mis catas», abre el detalle y prueba la confirmación de eliminación. Puedes guardar sin nombre ni foto.

Para probar sin conexión, abre primero la app con conexión y espera a que el service worker esté activo (herramientas del navegador → Application → Service Workers). Recarga sin red y comprueba las tres pantallas y los datos guardados. Los datos se quedan en ese navegador/dispositivo; borrar sus datos elimina las catas.

## Instalar en iPhone

1. Publica estos archivos en un servidor estático con HTTPS y abre su URL en Safari en el iPhone.
2. Pulsa «Compartir» → «Añadir a pantalla de inicio» (activa «Abrir como app» si aparece) → «Añadir».
3. Abre «Cata de vinos» desde su icono. La primera carga debe hacerse con conexión para guardar los archivos; después puede usarse sin red.

La cámara requiere permiso del dispositivo. «Hacer foto» sugiere la cámara trasera mediante `capture`; «Elegir de la galería» usa un selector sin captura. Las opciones exactas dependen de iOS.

## Archivos y mantenimiento

- `js/db.js`: `guardar`, `leer`, `listar`, `actualizar` y `eliminar`; formato con `versionDatos` y campos opcionales.
- `js/vistas/`: lista, nueva cata y detalle. `js/catalogo/paises.js`: catálogo de 15 países.
- `js/selector-buscable.js`: `crearSelector({ opciones, multiple, titulo })`, con `elemento`, `valor` y eventos `seleccion` y `saltar`.
- `sw.js`: caché de todos los recursos de la app. Incrementa `CACHE` al modificar archivos y actualiza `ARCHIVOS` si añades recursos. La nueva versión se activa cuando se cierran las ventanas de la versión anterior; vuelve a abrir la app con conexión.
- Iconos PNG de 192, 512 y 180 px generados con `scripts/generar_iconos.py`. Para regenerarlos se necesita Python con Pillow (`python3 -m pip install Pillow` y `python3 scripts/generar_iconos.py`); Pillow solo se usa para generar los archivos, nunca en la app.
