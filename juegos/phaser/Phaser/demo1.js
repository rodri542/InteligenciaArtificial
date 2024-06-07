var anchoPantalla = 500;
var altoPantalla = 500;
var avatar;
var fondoJuego;

var proyectil,
  proyectilActivo = false;

var saltoTecla;
var menuPausa;

var velocidadProyectil;
var desplazamientoProyectil;

var estadoEnAire;
var estadoEnSuelo;
var cuadranteAvatar; // Cuadrante donde se encuentra el avatar

// Variables para la red neuronal y su entrenamiento
var redPrincipal,
  entrenamientoPrincipal, // Entrenador de la red neuronal principal
  salidaPrincipal, // Salida de la red neuronal principal
  datosEntrenamientoPrincipal = [];

var modoAutomatico = false,
  entrenamientoCompletado = false;

// Variables para el estado del juego y proyectiles adicionales
let estadoInicial = 0,
  estadoDerecha = 0,
  estadoNulo = 1, // Estado nulo
  estadoNuloX = 1, // Estado nulo en x
  estadoNuloY = 1; // Estado nulo en y

let teclaDerecha,
  teclaEnter,
  teclaIzquierda;
let distanciaEuclidiana; // Distancia euclidiana entre el proyectil y el avatar

var juego = new Phaser.Game(anchoPantalla, altoPantalla, Phaser.CANVAS, "", {
  preload: cargarRecursos,
  create: inicializarJuego,
  update: actualizarJuego,
  render: renderizarJuego,
});

function cargarRecursos() {
  juego.load.image("fondoJuego", "assets/game/descarga.jpg");
  juego.load.spritesheet("avatar", "assets/sprites/altair.png", 32, 48);
  juego.load.image("menuPausa", "assets/game/menu.png");
  juego.load.image("proyectil", "assets/sprites/bola.png");
}

function inicializarJuego() {
  juego.physics.startSystem(Phaser.Physics.ARCADE);

  juego.time.desiredFps = 30;

  fondoJuego = juego.add.tileSprite(0, 0, anchoPantalla, altoPantalla, "fondoJuego");
  proyectil = juego.add.sprite(anchoPantalla - 100, altoPantalla, "proyectil");
  avatar = juego.add.sprite(anchoPantalla / 2, altoPantalla / 2, "avatar");

  juego.physics.enable(avatar);
  avatar.body.collideWorldBounds = true;
  var animacionCorrer = avatar.animations.add("correr", [8, 9, 10, 11]);
  avatar.animations.play("correr", 10, true);

  juego.physics.enable(proyectil);
  proyectil.body.collideWorldBounds = true;
  proyectil.body.bounce.set(1);

  etiquetaPausa = juego.add.text(anchoPantalla - 100, 20, "Pausa", {
    font: "20px Arial",
    fill: "#fff",
  });

  etiquetaPausa.inputEnabled = true;
  etiquetaPausa.events.onInputUp.add(pausarJuego, self);
  juego.input.onDown.add(mostrarMenuPausa, self);

  saltoTecla = juego.input.keyboard.addKey(Phaser.Keyboard.UP);

  teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  teclaAbajo = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);

  teclaEnter = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // Inicializa la red neuronal con 2 entradas, 6 neuronas en dos capas ocultas y 4 salidas
  redPrincipal = new synaptic.Architect.Perceptron(2, 6, 6, 4);
  entrenamientoPrincipal = new synaptic.Trainer(redPrincipal);
}

function entrenarRedNeuronal() {
  entrenamientoPrincipal.train(datosEntrenamientoPrincipal, {
    rate: 0.0003, // Tasa de aprendizaje
    iterations: 10000, // Número de iteraciones
    shuffle: true, // Barajar los datos en cada iteración
  });
}

// Función para obtener la salida de la red neuronal
function procesarEntrenamiento(entrada) {
  console.log("Entrada 1 ", entrada);

  salidaPrincipal = redPrincipal.activate(entrada); // Activa la red neuronal con los parámetros de entrada

  var enAire = Math.round(salidaPrincipal[0] * 100); // Calcula el valor de aire a partir de la salida de la red neuronal
  var enSuelo = Math.round(salidaPrincipal[1] * 100); // Calcula el valor de piso a partir de la salida de la red neuronal

  console.log("Valor distancia eu" + enAire + " valor cuadrante " + enSuelo); // Imprime los valores de aire y piso
  return salidaPrincipal; // Devuelve la salida de la red neuronal
}

function pausarJuego() {
  juego.paused = true;
  menuPausa = juego.add.sprite(anchoPantalla / 2, altoPantalla / 2, "menuPausa");
  menuPausa.anchor.setTo(0.5, 0.5);
}

function mostrarMenuPausa(event) {
  if (juego.paused) {
    var menu_x1 = anchoPantalla / 2 - 270 / 2,
      menu_x2 = anchoPantalla / 2 + 270 / 2,
      menu_y1 = altoPantalla / 2 - 180 / 2,
      menu_y2 = altoPantalla / 2 + 180 / 2;

    var mouse_x = event.x,
      mouse_y = event.y;

    if (
      mouse_x > menu_x1 &&
      mouse_x < menu_x2 &&
      mouse_y > menu_y1 &&
      mouse_y < menu_y2
    ) {
      if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 &&
        mouse_y <= menu_y1 + 90
      ) {
        entrenamientoCompletado = false; // Reinicia el estado de entrenamiento
        datosEntrenamientoPrincipal = []; // Vacía los datos de entrenamiento
        modoAutomatico = false; // Desactiva el modo automático
      } else if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 + 90 &&
        mouse_y <= menu_y2
      ) {
        if (!entrenamientoCompletado) {
          // Si el entrenamiento no está completo
          console.log(
            "Entrenamiento " + datosEntrenamientoPrincipal.length + " valores"
          );
          entrenarRedNeuronal(); // Entrena la red neuronal
          entrenamientoCompletado = true; // Indica que el entrenamiento está completo
          console.log("entrenado");
        }
        avatar.position.x = anchoPantalla / 2; // Reposiciona el jugador en el centro
        avatar.position.y = altoPantalla / 2;
        modoAutomatico = true; // Activa el modo automático
      }

      menuPausa.destroy();
      reiniciarVariables();
      juego.paused = false;
    }
  }
}

function reiniciarVariables() {
  avatar.body.velocity.x = 0;
  avatar.body.velocity.y = 0;

  proyectil.body.velocity.x = 0;
  proyectil.position.x = anchoPantalla - 100;

  proyectilActivo = false;
}

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

function actualizarJuego() {
  juego.physics.arcade.collide(proyectil, avatar, colisionProyectil, null, this);

  // Cálculo de la distancia euclidiana entre la proyectil y el jugador
  distanciaEuclidiana =
    Math.floor(
      Math.sqrt(
        Math.abs(Math.pow(proyectil.position.x - avatar.position.x, 2)) -
          Math.abs(Math.pow(proyectil.position.y - avatar.position.y, 2))
      )
    ) ||
    Math.floor(
      Math.sqrt(
        Math.abs(
          Math.abs(Math.pow(proyectil.position.x - avatar.position.x, 2)) -
            Math.abs(Math.pow(proyectil.position.y - avatar.position.y, 2))
        )
      )
    );

  let centroX = anchoPantalla / 2; // Coordenada x del centro
  let centroY = altoPantalla / 2; // Coordenada y del centro

  // Determinar el cuadrante en el que se encuentra el jugador
  if (avatar.position.y < centroY && avatar.position.x > centroX) {
    cuadranteAvatar = 1; // Cuadrante superior derecho
    estadoEnSuelo = 0; // Jugador no está en el suelo
    estadoEnAire = 1; // Jugador está en el aire
    estadoDerecha = 1; // Jugador está a la derecha del centro
    estadoInicial = 0; // Jugador no está en la posición original
  }
  if (proyectil.position.y < centroY && proyectil.position.x < centroX) {
    cuadranteAvatar = 2; // Cuadrante superior izquierdo
    estadoEnSuelo = 0; // Jugador no está en el suelo
    estadoEnAire = 1; // Jugador está en el aire
    estadoDerecha = 0; // Jugador está a la izquierda del centro
    estadoInicial = 1; // Jugador está en la posición original
  }
  if (proyectil.position.y > centroY && proyectil.position.x > centroX) {
    cuadranteAvatar = 3; // Cuadrante inferior derecho
    estadoEnSuelo = 1; // Jugador está en el suelo
    estadoEnAire = 0; // Jugador no está en el aire
    estadoDerecha = 1; // Jugador está a la derecha del centro
    estadoInicial = 0; // Jugador no está en la posición original
  }
  if (proyectil.position.y > centroY && proyectil.position.x < centroX) {
    cuadranteAvatar = 4; // Cuadrante inferior izquierdo
    estadoEnSuelo = 1; // Jugador está en el suelo
    estadoEnAire = 0; // Jugador no está en el aire
    estadoDerecha = 0; // Jugador está a la izquierda del centro
    estadoInicial = 1; // Jugador está en la posición original
  }

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

  if (proyectilActivo == false) {
    dispararProyectil();
  }

  // Recolectar datos de entrenamiento mientras se juega en modo manual
  if (modoAutomatico == false) {
    datosEntrenamientoPrincipal.push({
      input: [distanciaEuclidiana, cuadranteAvatar],
      output: [estadoEnAire, estadoEnSuelo, estadoInicial, estadoDerecha],
    });
  }
}

function dispararProyectil() {
  velocidadProyectil = velocidadAleatoria(400, 600);
  proyectil.body.velocity.y = velocidadAleatoria(400, 600);
  proyectil.body.velocity.x = velocidadProyectil;
  proyectilActivo = true;
}

function colisionProyectil() {
  pausarJuego();
}

function velocidadAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderizarJuego() {}
