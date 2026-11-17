"""Genera los PNG de la PWA. Ejecutar desde cualquier directorio con Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw

salida = Path(__file__).resolve().parents[1] / 'iconos'
salida.mkdir(exist_ok=True)
for tamano, nombre in [(180, 'apple-touch-icon.png'), (192, 'icono-192.png'), (512, 'icono-512.png')]:
    escala = 4
    imagen = Image.new('RGB', (tamano * escala, tamano * escala), '#702d46')
    dibujo = ImageDraw.Draw(imagen)
    def puntos(valores):
        return [(int(x * tamano * escala), int(y * tamano * escala)) for x, y in valores]
    dibujo.polygon(puntos([(.30,.22),(.70,.22),(.66,.48),(.58,.58),(.52,.60),(.52,.76),(.65,.79),(.65,.82),(.35,.82),(.35,.79),(.48,.76),(.48,.60),(.42,.58),(.34,.48)]), fill='#faf6f2')
    dibujo.polygon(puntos([(.34,.37),(.66,.37),(.63,.47),(.56,.54),(.44,.54),(.37,.47)]), fill='#b85879')
    imagen.resize((tamano, tamano), Image.Resampling.LANCZOS).save(salida / nombre)
