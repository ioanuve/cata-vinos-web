import { guardar } from '../db.js';
import { crearSelector } from '../selector-buscable.js';
import { paises } from '../catalogo/paises.js';
import { elemento, foto } from './util.js';

async function reducir(archivo) {
  const url = URL.createObjectURL(archivo);
  try {
    const imagen = new Image();
    imagen.src = url;
    await imagen.decode();
    const escala = Math.min(1, 1280 / Math.max(imagen.naturalWidth, imagen.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(imagen.naturalWidth * escala));
    canvas.height = Math.max(1, Math.round(imagen.naturalHeight * escala));
    const contexto = canvas.getContext('2d');
    contexto.fillStyle = '#fff'; contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No se pudo convertir la foto.')), 'image/jpeg', 0.8));
  } finally { URL.revokeObjectURL(url); }
}

export function mostrarNueva(contenedor) {
  contenedor.append(elemento('h1', 'Nueva cata'));
  const formulario = elemento('form');
  const previsualizacion = elemento('div');
  const mensaje = elemento('p'); mensaje.setAttribute('role', 'status');
  const guardarBoton = elemento('button', 'Guardar', 'primario');
  guardarBoton.type = 'submit';
  let blob, liberar = () => {}, activa = true, pendiente = 0;
  function entrada(texto, camara) {
    const label = elemento('label', texto, camara ? 'boton primario' : 'boton');
    const input = elemento('input'); input.type = 'file'; input.accept = 'image/*';
    input.className = 'archivo';
    if (camara) input.setAttribute('capture', 'environment');
    input.onchange = async () => {
      if (!input.files[0]) return;
      const turno = ++pendiente;
      guardarBoton.disabled = true; mensaje.textContent = 'Preparando foto…';
      try {
        const resultado = await reducir(input.files[0]);
        if (!activa || turno !== pendiente) return;
        blob = resultado; liberar();
        const preview = foto(blob, 'foto'); liberar = preview.limpiar;
        previsualizacion.replaceChildren(preview.imagen); mensaje.textContent = '';
      } catch { if (activa && turno === pendiente) mensaje.textContent = 'No se pudo abrir la foto. Elige una imagen compatible.'; }
      finally { if (activa && turno === pendiente) guardarBoton.disabled = false; input.value = ''; }
    };
    label.append(input); return label;
  }
  const nombreLabel = elemento('label', 'Nombre');
  const nombre = elemento('input'); nombre.type = 'text'; nombre.autocomplete = 'off'; nombreLabel.append(nombre);
  const selector = crearSelector({ opciones: paises, titulo: 'País (opcional)' });
  selector.elemento.addEventListener('saltar', () => guardarBoton.focus());
  formulario.append(entrada('Hacer foto', true), entrada('Elegir de la galería', false), previsualizacion,
    nombreLabel, selector.elemento, mensaje, guardarBoton);
  formulario.onsubmit = async evento => {
    evento.preventDefault(); guardarBoton.disabled = true;
    try {
      const cata = await guardar({ nombre: nombre.value.trim(), foto: blob, pais: selector.valor[0] });
      if (activa) location.hash = `#/cata/${encodeURIComponent(cata.id)}`;
    } catch { mensaje.textContent = 'No se pudo guardar la cata. Comprueba el espacio disponible e inténtalo de nuevo.'; guardarBoton.disabled = false; }
  };
  contenedor.append(formulario);
  return () => { activa = false; liberar(); };
}
