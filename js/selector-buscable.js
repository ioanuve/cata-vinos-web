const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

export function crearSelector({ opciones, multiple = false, titulo = 'Selecciona una opción' }) {
  const raiz = document.createElement('fieldset');
  const leyenda = document.createElement('legend');
  leyenda.textContent = titulo;
  const busqueda = document.createElement('input');
  busqueda.type = 'search';
  busqueda.placeholder = 'Buscar…';
  busqueda.setAttribute('aria-label', `Buscar: ${titulo}`);
  const etiquetas = document.createElement('div');
  etiquetas.className = 'etiquetas';
  etiquetas.setAttribute('aria-live', 'polite');
  const lista = document.createElement('div');
  lista.className = 'opciones';
  const otroLabel = document.createElement('label');
  otroLabel.textContent = 'Otro';
  const otro = document.createElement('input');
  otro.type = 'text';
  otro.placeholder = 'Escribe otra opción';
  otroLabel.append(otro);
  const saltar = document.createElement('button');
  saltar.type = 'button';
  saltar.textContent = 'Saltar';
  let elegidos = [];
  let libre = '';
  const valores = () => [...elegidos, ...(libre ? [libre] : [])];
  function avisar() {
    etiquetas.replaceChildren();
    valores().forEach(valor => {
      const etiqueta = document.createElement('button');
      etiqueta.type = 'button';
      etiqueta.className = 'etiqueta';
      etiqueta.textContent = `${valor} ×`;
      etiqueta.setAttribute('aria-label', `Quitar ${valor}`);
      etiqueta.onclick = () => {
        elegidos = elegidos.filter(item => item !== valor);
        if (libre === valor) { libre = ''; otro.value = ''; }
        avisar();
      };
      etiquetas.append(etiqueta);
    });
    dibujar();
    raiz.dispatchEvent(new CustomEvent('seleccion', { detail: valores() }));
  }
  function dibujar() {
    lista.replaceChildren();
    opciones.filter(valor => normalizar(valor).includes(normalizar(busqueda.value))).forEach(valor => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.textContent = valor;
      boton.setAttribute('aria-pressed', String(elegidos.includes(valor)));
      boton.onclick = () => {
        if (multiple) elegidos = elegidos.includes(valor) ? elegidos.filter(item => item !== valor) : [...elegidos, valor];
        else { elegidos = [valor]; libre = ''; otro.value = ''; }
        avisar();
      };
      lista.append(boton);
    });
    if (!lista.children.length) lista.textContent = 'Sin resultados. Puedes usar «Otro».';
  }
  otro.oninput = () => {
    libre = otro.value.trim();
    if (!multiple && libre) elegidos = [];
    avisar();
  };
  busqueda.oninput = dibujar;
  saltar.onclick = () => {
    elegidos = []; libre = ''; otro.value = ''; busqueda.value = ''; avisar();
    raiz.dispatchEvent(new CustomEvent('saltar'));
  };
  raiz.append(leyenda, busqueda, etiquetas, lista, otroLabel, saltar);
  dibujar();
  return { elemento: raiz, get valor() { return valores(); } };
}
