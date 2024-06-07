var ancho = 800;
var alto = 400;
var jugadorPrincipal;
var imagenFondo;

var proyectil,
  proyectilDisparado = false,
  ovni;

var salto;
var menuJuego;

var velocidadProyectil;
var desplazamientoProyectil;

var estadoAire;
var estadoSuelo;

var redNeuronal,
  entrenamientoNN,
  salidaNN,
  datosEntrenamientoNN = [];
var modoAutomatico = false,
  entrenamientoCompleto = false;

// Nuevas variables
var redNeuronal2,
  entrenamientoNN2,
  salidaNN2,
  datosEntrenamientoNN2 = [];

// estados
let estadoInicial = 0,
  estadoDerecha = 0;
let estadoInicial2 = 0,
  estadoDerecha2 = 0;
let velocidadProyectil2, desplazamientoProyectil2, proyectil2, ovni2;
let proyectil2Disparado = false;

let velocidadProyectil3x, velocidadProyectil3y, desplazamientoProyectil3, proyectil3, ovni3;
let proyectil3Disparado = false;

let teclaDerecha, teclaEnter, teclaIzquierda;
let direccion = false;
let distanciaEuclidiana, distanciaEuclidiana2;

var juego = new Phaser.Game(ancho, alto, Phaser.CANVAS, "", {
  preload: cargar,
  create: crear,
  update: actualizar,
  render: renderizar,
});

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

  pausaLabel = juego.add.text(ancho - 100, 20, "Pausa", {
    font: "20px Arial",
    fill: "#fff",
  });
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

function procesarDatosEntrenamiento(entrada) {
  console.log("Entrada 1 ", entrada);

  salidaNN = redNeuronal.activate(entrada);

  var aire = Math.round(salidaNN[0] * 100);
  var piso = Math.round(salidaNN[1] * 100);

  console.log("salto " + aire + " piso " + piso);
  return salidaNN[0] >= salidaNN[1];
}

function procesarDatosEntrenamiento2(entrada) {
  console.log("Entrada 2 ", entrada);

  salidaNN2 = redNeuronal2.activate(entrada);

  var aire = Math.round(salidaNN2[0] * 100);
  var piso = Math.round(salidaNN2[1] * 100);

  console.log("der" + aire + " izq " + piso);
  return salidaNN2[0] > salidaNN2[1]
    ? true
    : salidaNN2[0] == salidaNN2[1]
    ? 0
    : false;
}

function pausa() {
  juego.paused = true;
  menuJuego = juego.add.sprite(ancho / 2, alto / 2, "menu");
  menuJuego.anchor.setTo(0.5, 0.5);
}

function mostrarPausa(event) {
  if (juego.paused) {
    var menu_x1 = ancho / 2 - 270 / 2,
      menu_x2 = ancho / 2 + 270 / 2,
      menu_y1 = alto / 2 - 180 / 2,
      menu_y2 = alto / 2 + 180 / 2;

    var mouse_x = event.x,
      mouse_y = event.y;
    // volver a iniciar
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
        entrenamientoCompleto = false;
        datosEntrenamientoNN = [];
        datosEntrenamientoNN2 = [];
        datosEntrenamientoNN3 = [];
        modoAutomatico = false;
      } else if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 + 90 &&
        mouse_y <= menu_y2
      ) {
        if (!entrenamientoCompleto) {
          console.log(
            "Entrenamiento " + datosEntrenamientoNN.length + " valores"
          );
          entrenarRedNeuronal();
          entrenarRedNeuronal2();
          entrenamientoCompleto = true;
          console.log("entrenado");
        }
        jugadorPrincipal.position.x = 15;
        modoAutomatico = true;
      }

      menuJuego.destroy();
      reiniciarVariables();
      reiniciarVariables2();
      juego.paused = false;
    }
  }
}

function reiniciarVariables() {
  jugadorPrincipal.body.velocity.x = 0;
  jugadorPrincipal.body.velocity.y = 0;
  proyectil.body.velocity.x = 0;
  proyectil.position.x = ancho - 100;
  proyectilDisparado = false;
}

const reiniciarVariables2 = () => {
  // proyectil2
  proyectil2.body.velocity.x = 0;
  proyectil2.position.y = 30;
  proyectil2Disparado = false;
};

const reiniciarVariables3 = () => {
  // proyectil3
  proyectil3.body.velocity.x = 0;
  proyectil3.body.velocity.y = 0;
  proyectil3.position.y = 30;
  proyectil3.position.x = ancho - 75;
  proyectil3Disparado = false;
};

function saltar() {
  jugadorPrincipal.body.velocity.y = -270;
}

const avanzar = () => {
  estadoInicial = 0;
  estadoDerecha = 1;
  if (jugadorPrincipal.position.x >= ancho / 3) return;
  jugadorPrincipal.position.x += 3;
};

const regresar = () => {
  estadoInicial = 1;
  estadoDerecha = 0;

  if (jugadorPrincipal.position.x < 15) return;
  jugadorPrincipal.position.x -= 3;
};

function actualizar() {
  imagenFondo.tilePosition.x -= 1;

  juego.physics.arcade.collide(proyectil, jugadorPrincipal, colisionProyectil, null, this);
  // colisión con proyectil2
  juego.physics.arcade.collide(proyectil2, jugadorPrincipal, colisionProyectil, null, this);
  // colisión con proyectil3
  juego.physics.arcade.collide(proyectil3, jugadorPrincipal, colisionProyectil, null, this);

  estadoSuelo = 1;
  estadoAire = 0;

  if (!jugadorPrincipal.body.onFloor()) {
    estadoSuelo = 0;
    estadoAire = 1;
  }
  desplazamientoProyectil = Math.floor(jugadorPrincipal.position.x - proyectil.position.x);
  // desplazamiento de proyectil 2
  desplazamientoProyectil2 = Math.floor(jugadorPrincipal.position.y - proyectil2.position.y);
  // distancia euclidiana proyectil2
  distanciaEuclidiana2 =
    Math.floor(
      Math.sqrt(
        Math.abs(Math.pow(proyectil2.position.x - jugadorPrincipal.position.x, 2)) -
          Math.abs(Math.pow(proyectil2.position.y - jugadorPrincipal.position.y, 2))
      )
    ) ||
    Math.floor(
      Math.sqrt(
        Math.abs(
          Math.abs(Math.pow(proyectil2.position.x - jugadorPrincipal.position.x, 2)) -
            Math.abs(Math.pow(proyectil2.position.y - jugadorPrincipal.position.y, 2))
        )
      )
    );
  // distancia euclidiana proyectil3
  distanciaEuclidiana =
    Math.floor(
      Math.sqrt(
        Math.abs(Math.pow(proyectil3.position.x - jugadorPrincipal.position.x, 2)) -
          Math.abs(Math.pow(proyectil3.position.y - jugadorPrincipal.position.y, 2))
      )
    ) ||
    Math.floor(
      Math.sqrt(
        Math.abs(
          Math.abs(Math.pow(proyectil3.position.x - jugadorPrincipal.position.x, 2)) -
            Math.abs(Math.pow(proyectil3.position.y - jugadorPrincipal.position.y, 2))
        )
      )
    );
  // saltar
  if (modoAutomatico == false && salto.isDown && jugadorPrincipal.body.onFloor()) {
    saltar();
  }
  // desplazar a derecha
  if (modoAutomatico == false && teclaDerecha.isDown && jugadorPrincipal.body.onFloor()) {
    avanzar();
  }
  // desplazar a izquierda
  if (modoAutomatico == false && teclaIzquierda.isDown && jugadorPrincipal.body.onFloor()) {
    regresar();
  }
  // Modo automático, hay una proyectil y el jugador está en la superficie
  if (
    modoAutomatico == true &&
    (proyectil.position.x > 0 || proyectil2.position.y < alto) &&
    jugadorPrincipal.body.onFloor()
  ) {
    // saltar si el modelo lo indica
    if (procesarDatosEntrenamiento([desplazamientoProyectil, velocidadProyectil])) {
      saltar();
    }
    // desplazarse a la derecha si el modelo lo indica
    if (
      procesarDatosEntrenamiento2([
        distanciaEuclidiana2,
        direccion ? 1 : 0,
        distanciaEuclidiana,
        velocidadProyectil3x,
      ]) != 0
    ) {
      if (
        procesarDatosEntrenamiento2([
          distanciaEuclidiana2,
          direccion ? 1 : 0,
          distanciaEuclidiana,
          velocidadProyectil3x,
        ])
      )
        avanzar();
      else regresar();
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

  if (
    modoAutomatico == false &&
    (proyectil.position.x > 0 ||
      proyectil2.position.y < alto ||
      proyectil3.position.x > 0 ||
      proyectil3.position.y < alto)
  ) {
    datosEntrenamientoNN.push({
      input: [desplazamientoProyectil, velocidadProyectil],
      output: [estadoAire, estadoSuelo],
    });

    datosEntrenamientoNN2.push({
      input: [
        distanciaEuclidiana2,
        direccion ? 1 : 0,
        distanciaEuclidiana,
        velocidadProyectil3x,
      ],
      output: [estadoDerecha, estadoInicial],
    });
  }
}

function disparar() {
  velocidadProyectil = -1 * velocidadAleatoria(400, 600);
  proyectil.body.velocity.y = 0;
  proyectil.body.velocity.x = velocidadProyectil;
  proyectilDisparado = true;
}

const disparar2 = () => {
  velocidadProyectil2 = velocidadAleatoria(5, 10);
  // proyectil2
  proyectil2.body.velocity.y = velocidadProyectil2;
  proyectil2.body.velocity.x = 0;
  proyectil2Disparado = true;
};

const disparar3 = () => {
  velocidadProyectil3x = -1 * velocidadAleatoria(300, 800);
  velocidadProyectil3y = velocidadAleatoria(5, 10);
  // proyectil3
  proyectil3.body.velocity.y = velocidadProyectil3y;
  proyectil3.body.velocity.x = velocidadProyectil3x;
  proyectil3Disparado = true;
};

function colisionProyectil() {
  pausa();
}

function velocidadAleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderizar() {}
