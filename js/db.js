const apertura = new Promise((resolve, reject) => {
  const solicitud = indexedDB.open('cata-de-vinos', 1);
  solicitud.onupgradeneeded = () => solicitud.result.createObjectStore('catas', { keyPath: 'id' });
  solicitud.onsuccess = () => {
    solicitud.result.onversionchange = () => solicitud.result.close();
    resolve(solicitud.result);
  };
  solicitud.onerror = () => reject(solicitud.error);
});

async function operacion(modo, ejecutar) {
  const db = await apertura;
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catas', modo);
    const solicitud = ejecutar(tx.objectStore('catas'));
    tx.oncomplete = () => resolve(solicitud.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Operación cancelada'));
  });
}

// No se exige ningún campo: los valores técnicos se completan al guardar.
export async function guardar(cata = {}) {
  const ahora = new Date().toISOString();
  const datos = { ...cata, id: cata.id ?? crypto.randomUUID(),
    fechaCreacion: cata.fechaCreacion ?? ahora, fechaEdicion: cata.fechaEdicion ?? ahora,
    versionDatos: cata.versionDatos ?? 1 };
  await operacion('readwrite', almacen => almacen.put(datos));
  return datos;
}
export const leer = id => operacion('readonly', almacen => almacen.get(id));
export const listar = () => operacion('readonly', almacen => almacen.getAll());
export const eliminar = id => operacion('readwrite', almacen => almacen.delete(id));
export async function actualizar(id, cambios = {}) {
  const anterior = await leer(id);
  if (!anterior) throw new Error('No se ha encontrado la cata.');
  return guardar({ ...anterior, ...cambios, id, fechaEdicion: new Date().toISOString() });
}
