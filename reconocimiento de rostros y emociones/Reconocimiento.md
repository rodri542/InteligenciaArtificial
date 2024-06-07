### Detección de Rostros y Emociones con OpenCV

## Explicación del Proceso
Creación del Dataset: Se utiliza la cámara para capturar múltiples imágenes de rostros, que se guardan en carpetas específicas según la emoción. Esto es necesario para crear un conjunto de datos que se utilizará para el entrenamiento del modelo.

Entrenamiento del Modelo: Las imágenes del dataset se cargan y se etiquetan. Luego, se utiliza el algoritmo FisherFace para entrenar un modelo de reconocimiento de emociones. El modelo entrenado se guarda en un archivo XML.

Detección en Tiempo Real: El modelo entrenado se carga y se utiliza para detectar y reconocer rostros y emociones en tiempo real a través de la cámara. Los resultados de la predicción se muestran en la pantalla, indicando si el rostro es conocido o desconocido y etiquetando la emoción detectada.

NOTA PARA PODER EJECUTAR EL PRIMER CODIGO DEBES TENER YA CREADAS LAS CARPETAS DONDE SE VA A HACER TU DATASET

## Creación del Dataset

El siguiente código enciende la cámara y captura múltiples fotografías de rostros, que luego se guardan en una carpeta específica. Este proceso es esencial para crear un dataset de imágenes que se utilizará para entrenar un modelo de reconocimiento de emociones.

```python
import numpy as np 
import cv2 as cv

# Cargar el clasificador de Haar para detección de rostros
rostro = cv.CascadeClassifier('C:\\Users\\Rodrigo\\haarcascade_frontalface_alt.xml')

cap = cv.VideoCapture(0)
i = 0
while True:
    ret, frame = cap.read()
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    rostros = rostro.detectMultiScale(gray, 1.3, 5)
    for(x, y, w, h) in rostros:
        frame2 = frame[y:y+h, x:x+w]
        frame2 = cv.resize(frame2, (100,100), interpolation=cv.INTER_AREA)
        cv.imwrite('C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\emociones\\sorprendido\\sorprendido'+str(i)+'.png', frame2)
        
    cv.imshow('rostros', frame)
    i = i + 1
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()

```

# Entrenamiento del Modelo

Este código crea un modelo de reconocimiento de emociones utilizando el algoritmo FisherFace. El modelo se entrena con las imágenes del dataset creado anteriormente y luego se guarda en un archivo XML.

```python
import cv2 as cv 
import numpy as np 
import os

dataSet = 'C:\\Users\\Rodrigo\\Desktop\\InteligenciaArtificial\\emociones'
faces = os.listdir(dataSet)
print(faces)

labels = []
facesData = []
label = 0 
for face in faces:
    facePath = dataSet+'\\'+face
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(facePath+'\\'+faceName, 0))
    label = label + 1
print(np.count_nonzero(np.array(labels) == 0)) 

faceRecognizer = cv.face.FisherFaceRecognizer_create()
faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write('emociones2Eigenface.xml')
```

# Detección en Tiempo Real
El siguiente código abre la cámara y utiliza el modelo entrenado para reconocer rostros y emociones en tiempo real. Dependiendo de los valores de predicción, se determina si el rostro es conocido o desconocido, y se muestra la etiqueta correspondiente en la pantalla.

```python
import cv2 as cv
import os

faceRecognizer = cv.face.FisherFaceRecognizer_create()
faceRecognizer.read('emociones2Eigenface.xml')

cap = cv.VideoCapture(0)
rostro = cv.CascadeClassifier('haarcascade_frontalface_alt.xml')
while True:
    ret, frame = cap.read()
    if ret == False: break
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    cpGray = gray.copy()
    rostros = rostro.detectMultiScale(gray, 1.3, 3)
    for(x, y, w, h) in rostros:
        frame2 = cpGray[y:y+h, x:x+w]
        frame2 = cv.resize(frame2, (100, 100), interpolation=cv.INTER_CUBIC)
        result = faceRecognizer.predict(frame2)
        cv.putText(frame, '{}'.format(result), (x, y-20), 1, 3.3, (0, 0, 0), 1, cv.LINE_AA)
        if result[1] < 400:
            cv.putText(frame, '{}'.format(faces[result[0]]), (x, y-25), 2, 1.1, (0, 255, 0), 1, cv.LINE_AA)
            cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        else:
            cv.putText(frame, 'Desconocido', (x, y-20), 2, 0.8, (0, 0, 255), 1, cv.LINE_AA)
            cv.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
    cv.imshow('frame', frame)
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()
```