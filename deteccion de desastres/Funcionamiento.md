### Detección de Desastres con CNN y OpenCV

## Carga del Clasificador Haar

Primero, aseguramos que tenemos cargado el archivo del Haarcascade para la detección de rostros. Esto es esencial para cualquier operación de detección basada en Haarcascade.

```python
import numpy as np 
import cv2 as cv

# Cargar el clasificador de Haar para detección de rostros
rostro = cv.CascadeClassifier('haarcascade_frontalface_alt.xml')
```

## Extracción de Imágenes de Videos
A continuación, utilizamos un video para extraer fotogramas y guardarlos como imágenes. Estas imágenes se utilizarán para crear el dataset necesario para entrenar el modelo de detección de desastres.


```python
import numpy as np 
import cv2 as cv

# Cargar el clasificador de Haar para detección de rostros
rostro = cv.CascadeClassifier('haarcascade_frontalface_alt.xml')

# Abrir el video
cap = cv.VideoCapture('C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\deteccion de desastres\\Videos\\robocasa5.mp4')
i = 2599
while True:
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv.resize(frame, (50, 50), interpolation=cv.INTER_AREA)
    cv.imwrite('C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\deteccion de desastres\\5 situaciones\\robocasa\\robocasaimg'+str(i)+'.jpg', frame)
    
    cv.imshow('situacion', frame)
    i = i + 1
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()
```

# Explicación
Este código abre el video especificado y extrae cada fotograma, redimensionándolo a 50x50 píxeles para reducir el ruido y facilitar el procesamiento. Las imágenes se guardan en la carpeta especificada, creando un dataset con las situaciones a detectar. Se recomienda usar entre 2000 y 4000 imágenes para obtener buenos resultados.

## Entrenamiento del Modelo CNN
Después de obtener el dataset de imágenes, utilizamos una red neuronal convolucional (CNN) para entrenar un modelo de detección de desastres. 

Solo debes ir ejecutando linea por linea hasta llegar a la parte donde se crea el archivo h5, este es el que tiene el detector o el modelo, ya con eso solo sigue ejecutando el codigo y se realizaran las pruebas de su funcionamiento.


## Predicción de Imágenes
Finalmente, utilizamos el modelo entrenado para predecir la categoría de nuevas imágenes y mostrar los resultados.


```python
from keras.models import load_model
from skimage.transform import resize
import matplotlib.pyplot as plt
import numpy as np
import cv2 as cv

# Cargar el modelo entrenado
model = load_model('detector_desastres.h5')

# Clases de desastres
situaciones = ['incendio', 'inundacion', 'terremoto', 'deslizamiento', 'huracan']

# Especificar imágenes para prueba
filenames = ['C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\deteccion de desastres\\test\\test4.jpg']

images = []
for filepath in filenames:
    image = plt.imread(filepath, 0)
    image_resized = resize(image, (50, 50), anti_aliasing=True, clip=False, preserve_range=True)
    images.append(image_resized)

X = np.array(images, dtype=np.uint8)
test_X = X.astype('float32')
test_X = test_X / 255.0

predicted_classes = model.predict(test_X)

for i, img_tagged in enumerate(predicted_classes):
    print(filenames[i], situaciones[img_tagged.tolist().index(max(img_tagged))])

predicted_classes = np.argmax(predicted_classes, axis=1)

# Mostrar resultados y abrir la imagen con el texto de predicción
for i, img_tagged in enumerate(predicted_classes):
    pred_class = situaciones[img_tagged]

    img_color = cv.imread(filenames[i])
    if img_color is None:
        print(f"Error: no se pudo cargar la imagen {filenames[i]}")
    else:
        img_color = cv.resize(img_color, (500, 500))
        cv.putText(img_color, f"Prediccion: {pred_class}", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv.imshow(filenames[i], img_color)
        cv.waitKey(0)
        cv.destroyAllWindows()
```

# Explicación
Carga del Modelo: Se carga el modelo entrenado desde el archivo .h5.
Procesamiento de Imágenes: Se redimensionan las imágenes a 50x50 píxeles y se normalizan.
Predicción: El modelo predice la categoría de las imágenes procesadas.
Visualización: Se muestra cada imagen con el texto de la categoría predicha superpuesto.
Este flujo completo asegura que podamos capturar, procesar, entrenar y predecir categorías de desastres con un modelo de CNN utilizando OpenCV y Keras.

POR ULTIMO TE DEJO LOS COMANDOS NECESARIOS A INSTALAR (LOS QUE RECUERDO )

pip install numpy opencv-python matplotlib scikit-learn keras tensorflow

pip install scikit-image

