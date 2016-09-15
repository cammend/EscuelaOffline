/*noT = el número de tarjetas, debe de ser un número par
vAsoc = un vector con 'strings', q sea texto a mostrar o nombres de imágenes (ej. cuadro.png)
 el tamaño del vector (vAsoc) debe ser igual o mayor al número de cartas.
     m = | 1 | 2 | 3 |  "Este es la matriz ordenada, entonces se asocian los valores con los de vAsoc
         | 4 | 5 | 6 |  "cuando se desordene, la asociación se debe mantener (ej [1,4] corresponden a vAsoc[0])
           |   |   |
 vAsoc = | 0 | 1 | 2 |  "Los valores 'string' se corresponden con los valores en la matriz*/

function Memory(noT, vAsoc) {
  this.vAsoc = vAsoc;
  this.nuevoNoTarjetas(noT);
}
//comprueba 2 valores, si se corresponden como dos tarjetas iguales devuelve true, else false.
Memory.prototype.comprobar = function(a,b){
  for(var j=0; j<this.noT/2; j++){
    if(this.m[0][j] == 0) continue; //si ya se encontró, la matriz está en 0, por lo cual solo cont. buscando.
    if(a==this.m[0][j] | a==this.m[1][j]){
      if(b==this.m[0][j] | b==this.m[1][j]){
        this.m[0][j] = 0; this.m[1][j] = 0; //si coinciden, se setean a 0
        this.encontradas++;
        if( this.encontradas == this.noT/2 ) this.OK = true;
        return true;
      }
      this.err++;
      return false;
    }
  }
};
//devuelve la cadena asociada a una pareja de tarjetas (en este caso con una de las dos como argumento); return vAsoc[x]
Memory.prototype.getValStr = function(index){
  for(var i=0; i<this.half; i++){
    if(index == this.m[0][i] | index == this.m[1][i]){
      return this.vAsoc[i];
    }
  }
}
//resetea los valores, desordena la matriz y el vector y inicializa sus variables
Memory.prototype.desordenar = function(){
  this.err = 0; //número de errores
  this.OK = false; //se pone a true cuando se encuentran todas las parejas
  this.encontradas = 0;
  randVector(this.vAsoc); //el vector de asociación se desordena
  fillMatrix(this.m); //llenamos de nuevo la matriz de 1 hasta N
  randMatrix(this.m); //desordenando la matriz
}
//actualizar el no de tarjetas
Memory.prototype.nuevoNoTarjetas = function(num){
  if( this.vAsoc.length < num/2 ){
    alert("ERROR: el número de elementos en 'vAsoc' no es >= "+num/2);
    return;
  }
  this.noT = num;
  this.half = num/2;
  this.m = newFillMatrix(2,num/2);
}

//función q contiene las reglas del juego
function Manager(memory, funcionEjec){
  this.memory = memory;
  this.reset();
  this.funcionEjecutora = funcionEjec; //esta función es la q se ejecuta cuando se pasa el 2do valor a la función setValor
}
//resetea las variables del Manager y vuelve a desordenar el Memory
Manager.prototype.reset = function(){
  this.val1 = -1; //solo es necesario guardar el primer valor
  this.esPareja = false; //se pone a true si al enviar el 2do valor coinciden como parejas
  this.memory.desordenar();
}
//función donde se le pasan valores de tarjetas de 1 en 1
Manager.prototype.setValor = function(val){
  if(this.val1 == -1){ //esto quiere decir q es el primer 'click'
    this.val1 = val;
  }else{ //esto quiere decir q es el segundo 'click'
    this.esPareja = this.memory.comprobar(this.val1, val);
    this.val1 = -1;
    this.funcionEjecutora();
  }
}

var memory = null; //la memoria o modelo
var manager = null; //el controlador
var fondoImg = null; //un path + imagen.png
var preImg = null; //un path hacia las imágenes de cada tarjeta
var dinamico = false; //si es true, elimina las cartas, si es false, desactiva las cartas
var $tablero = null; //el div contenedor de todos las tarjetas (divs)
var $opciones = null; //el div contenedor de las opciones de juego (dificultad) (modo)
var $mensaje = null; //el div contenedor de mensajes de nuevo juego o información
var $errores = null; //el div q muestra el no de errores
var $tiempo = null; //el div q muestra el cronómetro
var $cartaSelect1 = null; //primera carta q ha sido seleccionada
var $cartaSelect2 = null; //segunda carta q ha sido seleccionada
var forceReset = false; //variable q impide q se cree un nuevo juego sin confirmación
var allDisable = false; //variable q desactiva la ejecución del evento clic de todas las cartas
var crono = null; //un cronometro
var not = null; //se setea si es pasado como argumento (noTarjetas) y no se puede elegir por dificultad
var numeroTarjetas = -1;

function crearNuevoJuego(idTablero, vString, preImage, fondoImage, noTarjetas){
  Inicializar(idTablero);
  not = noTarjetas;
  preImg = preImage; fondoImg = fondoImage;
  memory = new Memory(getNoTarjetas(), vString);
  manager = new Manager(memory, funcionPrincipal);
  manager.reset(); //inicializa todo
  memory.OK = true; //para poder iniciar un nuevo juego
}
//funcion q se llama al darle click a el boton de Nuevo Juego
function newGame(){
  if( memory.OK ){
    memory.nuevoNoTarjetas( getNoTarjetas() );
    manager.reset(); //inicializa todo
    $tablero.children().detach(); //eliminamos todas las cartas del tablero
    dibujarTodasLasTarjetas();
    crono = new Cronometro("time");
    crono.iniciar();
    setearModo(); //setea la var dinamico según lista desplegable
  }else{
    mostrarConfirmación();
  }
}
//function q inicia un juego, con otro en curso
function reiniciarJuego(){
  memory.OK = true;
  $("#btnConfirm").remove();
  $mensaje.hide();
  $opciones.show(500);
  $errores.text("0");
  newGame();
}
//obtener el noTarjetas por nivel de dificultad
function getNoTarjetas(){
  if(not != null) return not;
  var dific = $("#dif").val();
  if( dific == "1" )
    return 16;
  else if( dific == "2" )
    return 32;
  else
    return 48;
}
//obtener si es dinamico por la lista desplegable
function setearModo(){
  var modo = $("#mode").val();
  if( modo == "1" )
    dinamico = false;
  else
    dinamico = true;
}
//función q se ejecutará cuando el manager la llame
function funcionPrincipal(){
  allDisable = true; //desactivamos los eventos click
  if( manager.esPareja ){ //si las dos cartas coinciden
    if( dinamico )
      eliminarCartas();
    else
      desactivarCartas();
    if( memory.OK )
      hasGanado();
  }else{
    ocultarCartas();
    window.setTimeout(function(){ $errores.text(memory.err); },700);
  }
}
//crea un efecto de sumar tiempo por número de errores
function sumarErrores(){
  crono.intervalo = 30; //para hacer q pase rápido el tiempo
  crono.iniciar(); //lo iniciamos para q muestre el tiempo
  $tiempo.css("background","skyblue");
  window.setTimeout(function(){
    crono.detener(); //lo detenemos
    crono.kill(); //lo destruimos
  },memory.err*200);
}
//se llama esta función cuando se gana el juego
function hasGanado(){
  crono.detener();
  window.setTimeout(function(){
    alert("Has ganado");
    sumarErrores();
  },2000);
}
//confirmación de nuevo juego
function mostrarConfirmación(){
  crono.detener();
  crono.kill();
  $opciones.hide();
  $mensaje.children("p").text("Hay una partida en curso!").append("<button id='btnConfirm' onclick='reiniciarJuego()'>Continuar</button>");
  $mensaje.show(500);
}
//añade el evento click a todas las tarjetas
function agregarEventosClick(){
  $tablero.children("div").on("click", function(){
    eventoClick( $(this) );
  });
}
//se ejecuta cuando se le dá click a una tarjeta
function eventoClick($tarjeta){
  if( $cartaSelect1 != null ){
    if( $cartaSelect1.attr("id") == $tarjeta.attr("id") | allDisable ) //si se volvió a dar click sobre la misma tarjeta
      return;
  }
  var noTarjeta = getId( $tarjeta.attr("id") );
  seleccionarUnaTarjeta($tarjeta);
  //alert($cartaSelect1.attr("id")+" == "+$tarjeta.attr("id"));
  manager.setValor(noTarjeta); //hace las comprobaciones y llama a la funcionEjecutora
}
//esta función dibuja todas las tarjetas en el tablero (boca abajo)
function dibujarTodasLasTarjetas(){
  var noT = manager.memory.noT; //obtengo el número de tarjetas
  //creando todas las tarjetas (divs)
  for(var i=1; i<=noT; i++){
    var divOpen = "<div class='mTarjeta' id='m"+i+"'>";
    var divClose = "</div>";
    if(this.fondoImg == null){
      $tablero.append(divOpen+divClose);
    }else{
      $tablero.append(divOpen+"<img src='"+this.fondoImg+"'></img>"+divClose);
    }
  }
  agregarEventosClick();
}
//obtiene el id de una imágen, pasandole el no de id del div q la contiene y el nombre de la imagen
function getIdForImage(nombreImg, idTarjeta){
  return nombreImg.replace(".","")+idTarjeta;
}
//obtiene el no de id correspondiente a un nombre de id de una carta
function getId(idTarjeta){
  return parseInt( $('#'+idTarjeta).attr("id").replace("m","") );
}
//crea el 'efecto' de seleccionar una tarjeta, en este caso voltear o bien mostrar la imagen correspondiente
function seleccionarUnaTarjeta($tarjeta){
  var idTag = $tarjeta.attr("id"); //el atributo id de la carta
  var cadena = manager.memory.getValStr( getId(idTag) ); //se le pasa el no del id
  if( preImg == null ){ //si es q solo se va a mostrar texto y no imágenes
    $tarjeta.append("<div style='display:none;' class='pString'>"+cadena+"</div>");
    $tarjeta.children().toggle(500);
  }else{ //se mostraran imágenes para las tarjetas
    var cad = getIdForImage(cadena, idTag);
    $tarjeta.append("<img style='display:none;' class='iString' id='"+cad+"' src='"+preImg+cadena+"'></div>");
    $tarjeta.children().toggle(500);
  }
  //guardamos en la caché la tarjeta seleccionada
  if ($cartaSelect1 == null)
    $cartaSelect1 = $tarjeta;
  else
    $cartaSelect2 = $tarjeta;
}
//quita el evento click de las dos cartas seleccionadas
function quitarEventoClick(){
  $cartaSelect1.off("click");
  $cartaSelect2.off("click");
}
//desaparece el texto o imagen mostrados en las cartas seleccionadas
function ocultarCartas(){
  window.setTimeout(function(){
    $cartaSelect1.children().hide(400).detach();
    $cartaSelect2.children().hide(400).detach();
    $cartaSelect1 = null; $cartaSelect2 = null;
    allDisable = false; //se activan todos los eventos click
  },1000);
}
//crea el 'efecto' de desactivar las cartas seleccionadas
function desactivarCartas(){
  quitarEventoClick(); //quita el evento click de las dos cartas
  $cartaSelect1.animate({opacity:0.5});
  $cartaSelect2.animate({opacity:0.5});
  $cartaSelect1 = null; $cartaSelect2 = null;
  window.setTimeout(function(){
    allDisable = false;
  },500);
}
//eliminar las cartas seleccionadas
function eliminarCartas(){
  window.setTimeout(function(){
    $cartaSelect1.hide(300);
    $cartaSelect2.hide(300);
    $cartaSelect1 = null; $cartaSelect2 = null;
    allDisable = false;
  },1000);
}
//crea todos los componentes necesarios para el juego
function Inicializar(idMemory){
  $("#"+idMemory).append("<div id='control'></div>").append("<div id='mem001'></div>");
  $control = $("#control").append("<div id='time'>00:00:00</div>").append("<div class='data' id='data'></div>").append("<div id='msg' class='data' style='display:none;'><p id='pmsg'></p></div>").append("<div id='nuevo'></div>");
  $time = $("#time");
  $data = $("#data");
  $nuevo = $("#nuevo");
  $nuevo.append("<button onclick='newGame();'>Nuevo Juego</button>");
  $data.append("<div class='datos'><p>Dificultad:</p><select id='dif'></select></div>");
  var diff = $("#dif");
  diff.append("<option value='1'>Fácil</option>");
  diff.append("<option value='2'>Moderado</option>");
  diff.append("<option value='3'>Difícil</option>");
  $data.append("<div class='datos'><p>Modo:</p><select id='mode'></select></div>");
  $data.append("<div class='datos'><p>No Errores:</p><div id='iderr'>0</div></div>");
  var mode = $("#mode");
  mode.append("<option value='1'>Estático</option>");
  mode.append("<option value='2'>Dinámico</option>");
  $tablero = $("#mem001");
  $opciones = $data;
  $tiempo = $time;
  $mensaje = $("#msg");
  $errores = $("#iderr");
}