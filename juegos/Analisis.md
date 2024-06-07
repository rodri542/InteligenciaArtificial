## Analisis del juego de la balita

Estas son las posibilidades de movimiento de la bala
Son tres balas una viene en horizontal, otra en vertical y otra viene en diagonal, todas en tiempos y velocidades aleatorios
 # Etiquetas
 0-No hacer nada
 1-Saltar
 2-Moverse a la derecha
 3-Moverte para regresar a la Izquierda 
 # casos:

Solo viene la bala horizontal, el movimiento mas optimo es solamente saltar 1
Solo viene la bala vertical, el movimiento mas optimo es solamente avanzar 2
Solo viene la bala en diagonal, el movimiento mas óptimo es solamente  avanzar 2

Viene la bala diagonal y la vertical, avanzar 2
Viene la bala diagonal y la horizontal, avanzar y saltar 2,1
viene la bala horizontal y la diagonal, avanzar y saltar 1,2
Viene la bala vertical y la horizontal, avanzar y saltar 1,2
Viene la bala horizontal y la vertical, saltar y avanzar 2,1
Viene la bala Diagonal y vertical, solo avanza 2
Viene la bala vertical y Diagonal, solo avanza 2

## Juegos

##  Juego uno (JUEGO DE LAS TRES BALAS)

En el juego uno se debe hacer que se disparen 3 balas a las que el monito debe aprender a esquivar, el codigo usado para esto fue el codigo de demo1.js 
utiliza redes neuronales 

```js 

function cargar() {
  juego.load.image("fondo", "assets/game/image2.jpg");
  juego.load.spritesheet("mono", "assets/sprites/altair.png", 32, 48);
  juego.load.image("ovni", "assets/game/ufo.png");
  juego.load.image("proyectil", "assets/sprites/purple_ball.png");
  juego.load.image("menu", "assets/game/menu.png");

  // segunda proyectil
  juego.load.image("ovni2", "assets/game/ufo.png");
  juego.load.image("proyectil2", "assets/sprites/purple_ball.png");

  // tercer proyectil
  juego.load.image("ovni3", "assets/game/ufo.png");
  juego.load.image("proyectil3", "assets/sprites/purple_ball.png");
}
```
Esta función carga las imágenes y sprites necesarios para el juego.

```js
function crear() {
  juego.physics.startSystem(Phaser.Physics.ARCADE);
  juego.physics.arcade.gravity.y = 800;
  juego.time.desiredFps = 30;

  imagenFondo = juego.add.tileSprite(0, 0, ancho, alto, "fondo");
  ovni = juego.add.sprite(ancho - 100, alto - 70, "ovni");
  proyectil = juego.add.sprite(ancho - 100, alto, "proyectil");
  jugadorPrincipal = juego.add.sprite(25, alto, "mono");

  juego.physics.enable(jugadorPrincipal);
  jugadorPrincipal.body.collideWorldBounds = true;

  juego.physics.enable(proyectil);
  proyectil.body.collideWorldBounds = true;

  // proyectil y ovni 2
  ovni2 = juego.add.sprite(0, 0, "ovni2");
  proyectil2 = juego.add.sprite(0, 0, "proyectil2");
  juego.physics.enable(proyectil2);

  // proyectil y ovni 3
  ovni3 = juego.add.sprite(ancho - 100, 0, "ovni3");
  proyectil3 = juego.add.sprite(ancho - 75, 0, "proyectil3");
  juego.physics.enable(proyectil3);

  pausaLabel = juego.add.text(ancho - 100, 20, "Pausa", { font: "20px Arial", fill: "#fff" });
  pausaLabel.inputEnabled = true;
  pausaLabel.events.onInputUp.add(pausa, self);
  juego.input.onDown.add(mostrarPausa, self);

  salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.X);
  teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.Z);
  teclaEnter = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  redNeuronal = new synaptic.Architect.Perceptron(2, 6, 6, 2);
  entrenamientoNN = new synaptic.Trainer(redNeuronal);

  redNeuronal2 = new synaptic.Architect.Perceptron(4, 6, 6, 6, 2);
  entrenamientoNN2 = new synaptic.Trainer(redNeuronal2);
}
```

Aqui se configura el juego, habilita la física y establece las propiedades iniciales de los objetos del juego, el uuego utiliza dos redes neuronales, una para moverse de derecha a izquierda, y otra para moverse de arriba a abajo, osea saltar, 

NOTA EL JUEGO USA CADA EPOCA DE 10000 ITERACIONES 

```js

function actualizar() {
  imagenFondo.tilePosition.x -= 1;

  juego.physics.arcade.collide(proyectil, jugadorPrincipal, colisionProyectil, null, this);
  juego.physics.arcade.collide(proyectil2, jugadorPrincipal, colisionProyectil, null, this);
  juego.physics.arcade.collide(proyectil3, jugadorPrincipal, colisionProyectil, null, this);

  estadoSuelo = 1;
  estadoAire = 0;

  if (!jugadorPrincipal.body.onFloor()) {
    estadoSuelo = 0;
    estadoAire = 1;
  }
  desplazamientoProyectil = Math.floor(jugadorPrincipal.position.x - proyectil.position.x);
  desplazamientoProyectil2 = Math.floor(jugadorPrincipal.position.y - proyectil2.position.y);
  distanciaEuclidiana2 = Math.floor(Math.sqrt(Math.pow(proyectil2.position.x - jugadorPrincipal.position.x, 2) - Math.pow(proyectil2.position.y - jugadorPrincipal.position.y, 2)));
  distanciaEuclidiana = Math.floor(Math.sqrt(Math.pow(proyectil3.position.x - jugadorPrincipal.position.x, 2) - Math.pow(proyectil3.position.y - jugadorPrincipal.position.y, 2)));

  if (modoAutomatico == false && salto.isDown && jugadorPrincipal.body.onFloor()) {
    saltar();
  }
  if (modoAutomatico == false && teclaDerecha.isDown && jugadorPrincipal.body.onFloor()) {
    avanzar();
  }
  if (modoAutomatico == false && teclaIzquierda.isDown && jugadorPrincipal.body.onFloor()) {
    regresar();
  }
  if (modoAutomatico == true && (proyectil.position.x > 0 || proyectil2.position.y < alto) && jugadorPrincipal.body.onFloor()) {
    if (procesarDatosEntrenamiento([desplazamientoProyectil, velocidadProyectil])) {
      saltar();
    }
    if (procesarDatosEntrenamiento2([distanciaEuclidiana2, direccion ? 1 : 0, distanciaEuclidiana, velocidadProyectil3x]) != 0) {
      if (procesarDatosEntrenamiento2([distanciaEuclidiana2, direccion ? 1 : 0, distanciaEuclidiana, velocidadProyectil3x])) {
        avanzar();
      } else {
        regresar();
      }
    }
  }

  if (proyectilDisparado == false) {
    disparar();
  }
  if (proyectil2Disparado == false) {
    disparar2();
  }
  if (proyectil3Disparado == false) {
    disparar3();
  }

  if (proyectil.position.x <= 0) {
    reiniciarVariables();
  }
  if (proyectil2.position.y > alto) {
    reiniciarVariables2();
  }
  if (proyectil3.position.y > alto || proyectil3.position.x <= 0) {
    reiniciarVariables3();
  }

  if (modoAutomatico == false && (proyectil.position.x > 0 || proyectil2.position.y < alto || proyectil3.position.x > 0 || proyectil3.position.y < alto)) {
    datosEntrenamientoNN.push({ input: [desplazamientoProyectil, velocidadProyectil], output: [estadoAire, estadoSuelo] });
    datosEntrenamientoNN2.push({ input: [distanciaEuclidiana2, direccion ? 1 : 0, distanciaEuclidiana, velocidadProyectil3x], output: [estadoDerecha, estadoInicial] });
  }
}

```
cada frame se manda llamar a esta parte del codigo que actualiza todo lo que se ve, o se renderiza, aqui lo que hace es ir almacenando los datos que se ingresan en juego manuel para usarse como dataset al momento de cambiar al modo automatico, lo que hace es disparar las balas renderizarlas calcular la distancia euclidiana la velocidad de las balas la bala y los proyectiles de cada cosa lo manda a almacenar y procesarlos, si esta en modo automatico ya los envia a la funcion procesarDatosEntrenamiento en donde determina en base a lo que devuelva la red neuronal, si saltar avanzar regresar, todo, asi funciona 

```js
function procesarDatosEntrenamiento(entrada) {
  salidaNN = redNeuronal.activate(entrada);
  var aire = Math.round(salidaNN[0] * 100);
  var piso = Math.round(salidaNN[1] * 100);
  return salidaNN[0] >= salidaNN[1];
}

function procesarDatosEntrenamiento2(entrada) {
  salidaNN2 = redNeuronal2.activate(entrada);
  var aire = Math.round(salidaNN2[0] * 100);
  var piso = Math.round(salidaNN2[1] * 100);
  return salidaNN2[0] > salidaNN2[1] ? true : salidaNN2[0] == salidaNN2[1] ? 0 : false;
}
```

Estas funciones procesan los datos de entrenamiento y determinan que va a hacer el personaje , cuando los procesan las salidas se regresan en forma de porcentajes de lo que el entrenamiento determino que era mejor por hacer es como su confianza, devuelve true si deberia saltar o false si no deberia haer nada, de igual manera con la segunda.

La segunda determina si es a la derecha devuelve true, si es a la izquierda devuelve flase, si no deberia moverse es un 0

### Entrenamiento de Redes Neuronales

```javascript
function entrenarRedNeuronal() {
  entrenamientoNN.train(datosEntrenamientoNN, {
    rate: 0.0003,
    iterations: 10000,
    shuffle: true,
  });
}

const entrenarRedNeuronal2 = () => {
  entrenamientoNN2.train(datosEntrenamientoNN2, {
    rate: 0.0003,
    iterations: 10000,
    shuffle: true,
  });
};

```
aqui entrena las redes cuenta las iteraciones y el ratio 


### JUEGO 2 (ESQUIVAR LA PELOTA QUE VA REBOTANDO)

El segundo juego tiene un funcionamiento parecido, el objetivo es con el personaje ir esquivando una bala que va rebotando por todo el mapa, las primeras partes son iguales al anterior se definen los parametros y se cargan los datos que se van a usar, a diferencia del anterior este solamente utiliza una sola red neuronal, la parte del entrenamiento si deberia ser parecida, aqui se hace de esta manera, las iteraciones o las epocas son iguales 10000 iteraciones, 

```js
function procesarEntrenamiento(entrada) {
  salidaPrincipal = redPrincipal.activate(entrada); // Activa la red neuronal con los parámetros de entrada

  var enAire = Math.round(salidaPrincipal[0] * 100); // Calcula el valor de aire a partir de la salida de la red neuronal
  var enSuelo = Math.round(salidaPrincipal[1] * 100); // Calcula el valor de piso a partir de la salida de la red neuronal

  return salidaPrincipal; // Devuelve la salida de la red neuronal
}
```

esta es la red que devuelve los valores cuando usa el activate lo que determina mas probable por hacer, esta se utiliza para ambos movimientos tanto arriba y abajo como izquierda derecha, 

```js

  // Manejar los controles de salto, bajar, avanzar y regresar en modo manual
  if (modoAutomatico == false && saltoTecla.isDown) {
    saltar(); // Llama a la función saltar si la tecla de salto está presionada
    estadoNulo = 0; // Resetear el estado nulo
    estadoNuloY = 0; // Resetear el estado nulo en y
  }

  if (modoAutomatico == false && teclaAbajo.isDown) {
    descender(); // Llama a la función bajar si la tecla de abajo está presionada
    estadoNulo = 0; // Resetear el estado nulo
    estadoNuloY = 0; // Resetear el estado nulo en y
  }

  if (modoAutomatico == false && teclaDerecha.isDown) {
    moverDerecha(); // Llama a la función avanzar si la tecla de derecha está presionada
    estadoNulo = 0; // Resetear el estado nulo
    estadoNuloX = 0; // Resetear el estado nulo en x
  }

  if (modoAutomatico == false && teclaIzquierda.isDown) {
    moverIzquierda(); // Llama a la función regresar si la tecla de izquierda está presionada
    estadoNulo = 0; // Resetear el estado nulo
    estadoNuloX = 0; // Resetear el estado nulo en x
  }
  ```
  funciones de movimiento estas se encargan dependiendo si el modo automatico esta desactivado y la tecla se aprieta mueve el muñeco en cada una de las direcciones 

  ```js

  function saltar() {
  if (modoAutomatico)
    if (avatar.position.y <= altoPantalla / 4) return; // Si está en modo automático y el jugador está demasiado alto, no saltar
  avatar.position.y -= 15; // Disminuye la posición y del jugador (simulando un salto)
}

// Función para hacer bajar al jugador
function descender() {
  if (modoAutomatico)
    if (avatar.position.y >= altoPantalla * (3 / 4)) return; // Si está en modo automático y el jugador está demasiado bajo, no bajar
  avatar.position.y += 15; // Aumenta la posición y del jugador (simulando una bajada)
}

// Función para mover al jugador hacia la derecha
const moverDerecha = () => {
  if (modoAutomatico)
    if (avatar.position.x >= anchoPantalla * (4 / 5)) return; // Si está en modo automático y el jugador está demasiado a la derecha, no avanzar
  if (avatar.position.x >= anchoPantalla) return; // Si el jugador está en el borde derecho, no avanzar
  avatar.position.x += 15; // Aumenta la posición x del jugador (simulando un movimiento a la derecha)
};

// Función para mover al jugador hacia la izquierda
const moverIzquierda = () => {
  if (modoAutomatico)
    if (avatar.position.x <= anchoPantalla / 4) return; // Si está en modo automático y el jugador está demasiado a la izquierda, no regresar
  if (avatar.position.x < 15) return; // Si el jugador está en el borde izquierdo, no regresar
  avatar.position.x -= 15; // Disminuye la posición x del jugador (simulando un movimiento a la izquierda)
};

```
ahora este es el movimiento cuando ya esta en modo automatico se encarga de disminuir la posicion del persona y evita que se vaya hasta las esquinas del mapa 


```js
  // Modo automático para mover el jugador basado en la red neuronal
  if (modoAutomatico) {
    if (estadoNulo == 0) {
      // Si el estado nulo es 0
      if (estadoNuloY != 1) {
        // Si el estado nulo en y no es 1
        if (
          procesarEntrenamiento([distanciaEuclidiana, cuadranteAvatar])[0] >=
          procesarEntrenamiento([distanciaEuclidiana, cuadranteAvatar])[1]
        ) {
          saltar(); // Salta si el primer valor de la salida de la red neuronal es mayor o igual al segundo
        } else {
          descender(); // Baja si no
        }
      }

      if (estadoNuloX == 0) {
        // Si el estado nulo en x es 0
        if (
          procesarEntrenamiento([distanciaEuclidiana, cuadranteAvatar])[2] >=
          procesarEntrenamiento([distanciaEuclidiana, cuadranteAvatar])[3]
        ) {
          moverIzquierda(); // Regresa si el tercer valor de la salida de la red neuronal es mayor o igual al cuarto
        } else {
          moverDerecha(); // Avanza si no
        }
      }
    }
  }

```

Por ultimo esta parte es la que determina en base a las salidas si es mas probable que se mueve arriba o abajo y a los lados, y en que direccion dependiendo de que porcentaje sea mayor, esto se mide por cuadrantes en el que esté y por la distancia euclidiana que exista, por ultimo si estado nulo es 0 pues no puede hacer nada por que no tiene permitido moverse en esa direccion. 










