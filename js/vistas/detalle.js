import { leer, eliminar } from '../db.js';
import { elemento, fecha, foto } from './util.js';
export async function mostrarDetalle(contenedor, id) {
  const cata = await leer(id);
  if (!cata) { contenedor.append(elemento('h1', 'Cata no encontrada')); return; }
  contenedor.append(elemento('h1', cata.nombre || 'Cata sin nombre'), elemento('p', fecha(cata.fechaCreacion)));
  let limpiar = () => {};
  if (cata.foto instanceof Blob) {
    const imagen = foto(cata.foto, 'foto'); limpiar = imagen.limpiar; contenedor.append(imagen.imagen);
  }
  const boton = elemento('button', 'Eliminar', 'peligro');
  const error = elemento('p'); error.setAttribute('role', 'alert');
  boton.onclick = async () => {
    if (!confirm('¿Quieres eliminar esta cata? Esta acción no se puede deshacer.')) return;
    boton.disabled = true;
    try { await eliminar(id); location.hash = '#/lista'; }
    catch { error.textContent = 'No se pudo eliminar la cata. Inténtalo de nuevo.'; boton.disabled = false; }
  };
  contenedor.append(boton, error);
  return limpiar;
}
