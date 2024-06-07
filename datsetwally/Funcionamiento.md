# Encontrando a Wally con OpenCV y Haarcascade

## Introducción

Para este ejercicio, usaremos el repositorio disponible en el siguiente link: [vpcurso](https://github.com/eAlcaraz85/vpcurso). En este repositorio, encontrarás todos los códigos necesarios para completar el ejercicio.

## Objetivo

El objetivo de este ejercicio es encontrar a Wally en imágenes utilizando un clasificador Haarcascade entrenado específicamente con su rostro y características.

## Herramientas Necesarias

Para entrenar el clasificador Haarcascade, necesitamos utilizar la aplicación `Cascade Trainer GUI`. Puedes descargar la aplicación desde el siguiente link: [Cascade Trainer GUI](https://amin-ahmadi.com/cascade-trainer-gui/).

### Preparación del Dataset

1. **Descargar la Aplicación**: Descarga e instala la aplicación `Cascade Trainer GUI` desde el link proporcionado.
2. **Crear Carpeta Base**: Crea una carpeta base en tu sistema de archivos.
3. **Crear Subcarpetas**:
   - Dentro de la carpeta base, crea una subcarpeta llamada `n` para imágenes negativas.
   - Crea otra subcarpeta llamada `p` para imágenes positivas.

### Recomendaciones

- **Cantidad de Imágenes**: No uses más de 150 imágenes por cada categoría (positivas y negativas) para evitar problemas de rendimiento.
- **Imágenes Positivas**: Estas deben contener el rostro de Wally en diferentes posiciones y condiciones.
- **Imágenes Negativas**: Estas deben contener fondos y escenas sin el rostro de Wally.

## Entrenamiento del Clasificador Haarcascade

1. **Abrir la Aplicación**: Abre la aplicación `Cascade Trainer GUI`.
2. **Cargar Imágenes**: Carga las imágenes positivas y negativas en sus respectivas carpetas.
3. **Configurar Parámetros**: Configura los parámetros de entrenamiento según las recomendaciones de la aplicación.
4. **Iniciar Entrenamiento**: Inicia el entrenamiento y espera a que se genere el archivo XML del clasificador.

NOTA EL ENTRENAMIENTO ES TARDADO, MUCHAS VECES PUEDE TARDAR INCLUSO HORAS. 

# Dataset
para llenar el dataset es necesario utilizar el siguiente codigo se usa para procesar y aumentar las imágenes en el dataset. Este código redimensiona las imágenes, las convierte a escala de grises, y crea variantes mediante zoom, rotación e inversión.

```python
import numpy as np
import cv2 as cv
import os

def escala(imx, escala):
    width = int(imx.shape[1] * escala / 100)
    height = int(imx.shape[0] * escala / 100)
    size = (width, height)
    im = cv.resize(imx, size, interpolation=cv.INTER_AREA)
    return im

def zoom(img, scale_factor):
    height, width = img.shape[:2]
    new_height = int(height * scale_factor)
    new_width = int(width * scale_factor)
    img_zoom = cv.resize(img, (new_width, new_height), interpolation=cv.INTER_LINEAR)
    start_x = (new_width - width) // 2
    start_y = (new_height - height) // 2
    img_zoom = img_zoom[start_y:start_y + height, start_x:start_x + width]
    return img_zoom

def rotar(img, angle):
    h, w = img.shape[:2]
    mw = cv.getRotationMatrix2D((w // 2, h // 2), angle, 1)
    img_rotada = cv.warpAffine(img, mw, (w, h))
    return img_rotada

def invertir(img, horizontal=True, vertical=False):
    if horizontal:
        img = cv.flip(img, 1)
    if vertical:
        img = cv.flip(img, 0)
    return img

def procesar_imagenes(carpeta_origen, carpeta_destino):
    if not os.path.exists(carpeta_destino):
        os.makedirs(carpeta_destino)

    archivos = [f for f in os.listdir(carpeta_origen) if f.endswith('.jpg')]
    
    for i, archivo in enumerate(archivos):
        ruta_completa = os.path.join(carpeta_origen, archivo)
        img = cv.imread(ruta_completa)
        
        # Redimensionar a 50x50 píxeles
        img_redimensionada = cv.resize(img, (50, 50), interpolation=cv.INTER_AREA)
        
        # Guardar la imagen redimensionada
        cv.imwrite(os.path.join(carpeta_destino, f'redimensionada_{i}.jpg'), img_redimensionada)
        
        # Convertir a escala de grises y guardar
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        cv.imwrite(os.path.join(carpeta_destino, f'gris_{i}.jpg'), gray)
        
        # Aplicar y guardar múltiples imágenes con zoom
        for zoom_factor in [1.5, 0.5]:  # Zoom in y zoom out
            img_zoom = zoom(img_redimensionada, zoom_factor)
            cv.imwrite(os.path.join(carpeta_destino, f'zoom_{zoom_factor}_{i}.jpg'), img_zoom)
        
        # Aplicar y guardar múltiples imágenes rotadas
        for angle in [45, 90, 135, 180, 225, 270, 315]:
            img_rotada = rotar(img_redimensionada, angle)
            cv.imwrite(os.path.join(carpeta_destino, f'rotada_{angle}_{i}.jpg'), img_rotada)
        
        # Aplicar y guardar imágenes invertidas
        img_invertida_h = invertir(img_redimensionada, horizontal=True, vertical=False)
        cv.imwrite(os.path.join(carpeta_destino, f'invertida_h_{i}.jpg'), img_invertida_h)
        
        img_invertida_v = invertir(img_redimensionada, horizontal=False, vertical=True)
        cv.imwrite(os.path.join(carpeta_destino, f'invertida_v_{i}.jpg'), img_invertida_v)
        
        img_invertida_hv = invertir(img_redimensionada, horizontal=True, vertical=True)
        cv.imwrite(os.path.join(carpeta_destino, f'invertida_hv_{i}.jpg'), img_invertida_hv)
        
        print(f'Procesada imagen {i+1}/{len(archivos)}')

# Directorio con las imágenes originales
carpeta_origen = 'C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\datsetwally\\muestras\\n'
# Directorio donde se guardarán las imágenes procesadas
carpeta_destino = 'C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\datsetwally\\muestras\\n2'

# Procesar imágenes
procesar_imagenes(carpeta_origen, carpeta_destino)
```

## Explicación del Código

Redimensionar Imágenes: El código redimensiona las imágenes a 50x50 píxeles para facilitar el procesamiento.
Convertir a Escala de Grises: Convierte las imágenes a escala de grises.
Aplicar Zoom: Aplica factores de zoom para crear variantes de las imágenes.
Rotar Imágenes: Rota las imágenes en varios ángulos.
Invertir Imágenes: Invierte las imágenes horizontal y verticalmente.
Guardar Imágenes Procesadas: Guarda todas las variantes de las imágenes en la carpeta de destino.

# Ejecución del Código
Coloca las imágenes base en la carpeta de origen y especifica la carpeta de destino para las imágenes procesadas. El código generará múltiples variantes de cada imagen y las guardará en la carpeta de destino.

## Entrenamiento del Clasificador Haarcascade
Una vez que hayas procesado y aumentado tu dataset de imágenes, sigue estos pasos para entrenar el clasificador Haarcascade:

Abrir la Aplicación: Abre la aplicación Cascade Trainer GUI.
Cargar Imágenes: Carga las imágenes positivas y negativas en sus respectivas carpetas.
Configurar Parámetros: Ajusta los parámetros de entrenamiento según las recomendaciones de la aplicación, asegurándote de especificar la cantidad de imágenes negativas y el tamaño de las mismas.

# Iniciar Entrenamiento
Inicia el entrenamiento y espera a que se genere el archivo XML del clasificador.
Con estos pasos y el código proporcionado, podrás procesar, aumentar y entrenar un clasificador Haarcascade para detectar a Wally en nuevas imágenes.

## DETECCION 

Una vez que tengas creado el Cascade debe estar en la carpeta base, dentro de assets creo, y luego ya estamos listos para comprobar su funcionamiento para esto corremos este codigo 

```python

import numpy as np
import cv2 as cv
import math

# Cargar el clasificador entrenado
wally = cv.CascadeClassifier('cascade.xml')
if wally.empty():
    print("Error: no se pudo cargar el clasificador.")
else:
    print("Clasificador cargado correctamente.")
```

Cargamos el cascade con la ruta de donde se encuentre

```python

# Leer la imagen de prueba
frame = cv.imread("C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\datsetwally\\test7.png")
if frame is None:
    print("Error: no se pudo cargar la imagen.")
else:
    print("Imagen cargada correctamente.")

# Convertir la imagen a escala de grises
gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

# Detectar objetos en la imagen
wallys = wally.detectMultiScale(gray,1.14,6)


# Verificar si se ha detectado a Wally
if len(wallys) == 0:
    print("No se detectó a Wally.")
else:
    print(f"Se detectaron {len(wallys)} objetos.")

# Dibujar rectángulos alrededor de los objetos detectados
for (x, y, w, h) in wallys:
    frame = cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 4)
    
# Mostrar la imagen con los rectángulos
cv.imshow('rostros', frame)
cv.waitKey(0)
cv.destroyAllWindows()
```

aqui corremos el codigo con el test o la imagen donde queremos que reconozca a wally, aqui ya solamente es ajustar los parametros del detectMultiScale para tener una mejor deteccion y listo 
