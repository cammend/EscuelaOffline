void setup(){
  size(600,400);
  background(125);
  fill(255);
  noLoop();
  PFont fontA = loadFont("courier");
  textFont(fontA, 14);  
}

function Juego(anchoCanvas, altoCanvas){
  this.ancho = anchoCanvas; this.alto = altoCanvas;
  this.left = 46; this.top = 100; //margen izquierdo y de arriba
  this.rAlto = 50; this.rAncho = 300; //alto y ancho de cada caja de respuesta
  this.l1 = 0; this.l2 = 0; this.l3 = 0; //coord izq de cada caja
  this.t1 = 0; this.t2 = 0; this.t3 = 0; //coord top de cada caja
  this.op1 = 0; this.op2 = 0; this.op3 = 0; this.r = 0;
  this.pregunta = ''; this.elec = 0;
  this.trivia = null;   
}
Juego.prototype.init = function(trivia){
  var izq = Math.round(this.ancho/2) - Math.round(this.rAncho/2);
  this.l1 = izq; this.l2 = izq; this.l3 = izq; //coord izq de cada caja (es la misma eje x)
  this.t3 = this.alto-100;
  this.t2 = this.t3-this.rAlto-20;
  this.t1 = this.t2-this.rAlto-20;
  this.trivia = trivia;
  this.op1 = trivia.op1; this.op2 = trivia.op2; this.op3 = trivia.op3; this.r = trivia.r;
  this.pregunta = trivia.pregunta;
  this.mostrarPregunta(this.pregunta);
  this.mostrarOpciones();
}
Juego.prototype.mostrarPregunta = function(texto){ //escribe la pregunta o trivia, por ejemplo "5 * 3 ="
  this.limpiar(0,0,600,150);
  textSize(38);
  fill(255);
  text("Resuelve la operación:", this.left, this.top-40);
  fill(220,200,240);
  text(texto + " = ?", this.left-10, this.top);
}
Juego.prototype.dibujarOpcion = function(texto, x, y, cL, cC){ //cL = color de letra ;; cC = color de caja (0-255)
  textSize(48);
  fill(cC);
  rect(x,y,this.rAncho,this.rAlto);
  fill(cL);
  text(texto,x+20,y+40);
}
Juego.prototype.mostrarOpciones= function(){ //funcion q se llama al iniciar el juego y muestra las 3 posibles respuestas
  this.dibujarOpcion(this.op1,this.l1,this.t1,0,190); //caja1
  this.dibujarOpcion(this.op2,this.l2,this.t2,0,190); //caja2
  this.dibujarOpcion(this.op3,this.l3,this.t3,0,190); //caja3
}
Juego.prototype.limpiar = function(x,y,ancho,alto){
  fill(125); //es el color de relleno
  stroke(125); //es el color de contorno
  rect(x,y,ancho,alto); //dibujamos un rectangulo, para "limpiar" pantalla
}
Juego.prototype.mostrarOK = function(ok, tiempo){
  this.limpiar(0,160,600,240);
  fill(100); //es el color de relleno
  stroke(10); //es el color de contorno
  rect(100, 200, this.ancho-200, this.alto-300);
  fill(250);
  textSize(48);
  if (ok){
    text("Muy Bien", 200, 250);
    textSize(20);
    text("La respuesta es: "+ this.r, 200, 280);
  }else{
    text("Erraste", 210, 250);
    textSize(20);
    text("La respuesta era: "+ this.r, 200, 280);
  }
  mouseMovedActive = false;
  nuevaPregunta(tiempo);
}
Juego.prototype.check = function(r,op){ //comprueba valor elegido (segun clic) con el valor de respuesta (r)
  if(r == op){ //si 'r' es igual a la opcion 'op' elegida al dar clic sobre alguna caja
      this.mostrarOK(true, 2000);
      noTrivias++;
  }else{
      this.mostrarOK(false, 2000);
      noErrores++;
  }
}
Juego.prototype.mouseClicked = function(x,y){ //al hacer clic sobre cualquier caja, se selecciona la respuesta y se evalua
  if( mouseMovedActive ){
    var noCaja = this.comprobarClickCaja(x,y);
    if (noCaja == 1){
        this.check(this.r, this.op1);
    }else if (noCaja == 2){
        this.check(this.r, this.op2);
    }else if (noCaja == 3){
        this.check(this.r, this.op3);
    }
  }
}
Juego.prototype.mouseOverBox = function(x,y){ //hace la animación de resaltar la caja
  var noCaja = this.comprobarClickCaja(x,y);
  if (noCaja == 1){
      this.dibujarOpcion(this.op1,this.l1,this.t1,0,230); //resalta la caja
  }else{
      this.dibujarOpcion(this.op1,this.l1,this.t1,0,190); //regresa al estado inicial
  }
  if (noCaja == 2){
      this.dibujarOpcion(this.op2,this.l2,this.t2,0,230);
  }else{
      this.dibujarOpcion(this.op2,this.l2,this.t2,0,190);
  }
  if (noCaja == 3){
      this.dibujarOpcion(this.op3,this.l3,this.t3,0,230);
  }else{
      this.dibujarOpcion(this.op3,this.l3,this.t3,0,190);
  }
}
Juego.prototype.comprobarClickCaja = function(x,y){ //devuelve 1 si se dio click en la caja1, 2 si se dio click en la caja2, 3 si se dio ...
  if (x > this.l1 & x < this.l1+this.rAncho & y > this.t1 & y < this.t1+this.rAlto){
      return 1;
  }
  if (x > this.l2 & x < this.l2+this.rAncho & y > this.t2 & y < this.t2+this.rAlto){
      return 2;
  }
  if (x > this.l3 & x < this.l3+this.rAncho & y > this.t3 & y < this.t3+this.rAlto){
      return 3;
  }
}

var mouseMovedActive = false;
var juego = new Juego(600,400); //se crea el juego
var trivia = new TriviaMate(); //se crea la trivia
var nivel = null;

mouseMoved = function(){ //se pone en 'escucha' el evento de mover el ratón
  if( mouseMovedActive )
    juego.mouseOverBox(mouseX, mouseY); //y cuando el ratón se mueva, se llama ésta función
}
mouseClicked = function(){ //se pone en 'escucha' el evento de clic
  juego.mouseClicked(mouseX, mouseY); //y cuando se de clic, se llama a ésta función
}

function nuevaPregunta(tiempo){
  window.setTimeout(function(){
    juego.limpiar(0,160,600,240);
    redraw();
    mouseMovedActive = true;
  },tiempo);
}

function selectNivel(){
  if( nivel == 0 ){
    trivia.init("+", 10);
  }else if( nivel == 1 ){
    trivia.init("+-", 6);
  }else if( nivel == 2 ){
    trivia.init("*/", 5);  
  }else if( nivel == 3 ){
    trivia.init("*/", 10);  
  }else if( nivel == 4 ){
    trivia.init("all", 10);
  }
}

var recursion = window.setInterval(function(){
  redraw();
}, 500);

var una = true;
var setnew = 0;
function lisenNew(){
  if( una ){
    console.log("lisen");
    setnew = window.setInterval(function(){
      if( !jugando & !terminado ){
        noTrivias = 0;
        noErrores = 0;
        nivel = null;
        window.clearInterval(setnew);
        una = true;
        jugando = true;
        matarcrono();
        redraw();
        console.log("ok");
      }
    }, 500);
    una = false;
  }
}

var noTrivias = 0;
var noTotal = 10;
var noErrores = 0;
var $errores = $("#errores");
var $numero  = $("#numero");
var $canvas = $("#canvasjuego");
var cronometro = new Cronometro("tiempo");
var terminado = false;
var punteo = 0;

var cronoactive = true;
function inicrono(){
  if( cronoactive ){
    cronometro.iniciar();
    cronoactive = false;
  }
}
function matarcrono(){
  cronometro.detener();
  cronometro.kill();
  cronometro = new Cronometro("tiempo");
  cronoactive = true;
}
function sumarErrores(){
  cronometro.intervalo = 30; //para hacer q pase rápido el tiempo
  cronometro.iniciar(); //lo iniciamos para q muestre el tiempo
  //detiene la sumatoria del tiempo por errores
  window.setTimeout(function(){
    cronometro.detener(); //lo detenemos
    cronometro.kill(); //lo destruimos
  },noErrores*200);
}
function comprobar(){
  if( noTrivias == noTotal ){
    $canvas.hide(500);
    terminado = true;
    jugando = false;
    cronometro.detener();
    alert("Has Terminado");
    sumarErrores();
    punteo = $("#tiempo").text();
    guardarPunteo(noErrores*250, punteo, "nivel", null);
  }
}
//función principal que dibuja en el canvas
draw = function(){
  if( jugando ){
    comprobar();
    if (!nivel)
      nivel = $("#nivel").val();
    selectNivel();
    mouseMovedActive = true;
    window.clearInterval(recursion);
    juego.init(trivia); //se le pasa al juego una trivia
    $errores.text("Errores: "+noErrores);
    $numero.text("No: "+noTrivias);
    inicrono();
    lisenNew();
  }
}