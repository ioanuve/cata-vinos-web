import { listar } from '../db.js';
import { elemento, fecha, foto } from './util.js';
export async function mostrarLista(contenedor) {
  const limpiar = [];
  contenedor.append(elemento('h1', 'Mis catas'));
  const catas = (await listar()).sort((a, b) => String(b.fechaCreacion ?? '').localeCompare(String(a.fechaCreacion ?? '')));
  if (!catas.length) contenedor.append(elemento('p', 'Todavía no tienes catas. Añade la primera para empezar.', 'vacio'));
  const lista = elemento('ul', '', 'catas');
  catas.forEach(cata => {
    const item = elemento('li');
    const enlace = elemento('a', '', 'tarjeta');
    enlace.href = `#/cata/${encodeURIComponent(cata.id)}`;
    if (cata.foto instanceof Blob) {
      const imagen = foto(cata.foto, 'miniatura');
      enlace.append(imagen.imagen); limpiar.push(imagen.limpiar);
    } else enlace.append(elemento('span', 'Sin foto', 'miniatura sin-foto'));
    const texto = elemento('div');
    texto.append(elemento('strong', cata.nombre || 'Cata sin nombre'), elemento('small', fecha(cata.fechaCreacion)));
    enlace.append(texto); item.append(enlace); lista.append(item);
  });
  const nueva = elemento('a', '+', 'nueva');
  nueva.href = '#/nueva'; nueva.setAttribute('aria-label', 'Nueva cata');
  contenedor.append(lista, nueva);
  return () => limpiar.forEach(fn => fn());
}
