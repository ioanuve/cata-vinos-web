# Cata de vinos - app web instalable (PWA)

## Objetivo
App web para móvil (iPhone y Android) para crear notas de cata de vino con pocos toques, usando botones y buscadores. Se instala desde el navegador con "Añadir a pantalla de inicio".

## Tecnología
- HTML, CSS y JavaScript puro con módulos ES. Sin frameworks, sin herramientas de compilación, sin dependencias externas y sin CDNs. Debe funcionar sin conexión.
- Estructura: index.html, manifest.webmanifest, sw.js (service worker), css/, js/ (app, base de datos, vistas, catalogo/) e iconos/.
- Datos en IndexedDB. Fotos reducidas a un máximo de 1280 px en JPEG.
- Copia de seguridad: exportar e importar todas las catas en un archivo JSON.
- El formato de datos lleva un número de versión y todos los campos son opcionales, para que añadir campos no rompa catas guardadas.

## Funciones
- Cata corta (una sola pantalla, unos 30 segundos) y cata larga (flujo completo).
- Flujo largo: foto de la etiqueta, país y región, tipo de vino (tinto, blanco, rosado, naranja, espumoso, especial), datos, crianza, estilo, vista, nariz, boca y conclusión.
- Hoja de cata final con la foto y una descripción escrita en español generada con plantillas a partir de las respuestas. Compartir como imagen o PDF.
- Ver, editar y eliminar catas (con confirmación). Lista con buscador y filtros.
- Fijar datos (productor, región, etc.) para las siguientes catas, con atajos "Nueva cata con los mismos datos".
- Buscadores que ignoran mayúsculas y acentos, y buscan en nombres alternativos. Siempre una opción "Otro" con texto libre.

## Diseño
- Móvil primero, botones grandes, textos en español, modo claro y oscuro automático.
- Una pregunta por pantalla en el flujo largo, con barra de progreso y botón "Atrás".

## Reglas
- Código simple con comentarios breves.
- Los catálogos (países, regiones, uvas, aromas...) en archivos JS separados y fáciles de editar.
- Cada tarea debe dejar la app funcionando al abrir index.html.
