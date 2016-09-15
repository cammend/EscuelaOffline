/* Los objetos así como los arrays son pasados a las funciones por referencia.
   Esto es, que el cambio interno q se haga a las variables, se verá reflejado fuera de la función.
   Solo los tipos de datos primitivo y strings son pasados por valor.
*/
//genera un número entero aleatorio entre a y b
function aleat(a,b){
  return Math.round( Math.random() * (b-a) ) + a;
}
//desordena un vector y lo devuelve
function randVector(v){
  var aux = 0, rand = 0;
  for(var i=0; i<v.length; i++){
    aux = v[i];
    rand = aleat(0,v.length-1);
    v[i] = v[rand];
    v[rand] = aux;
  }
  return v;
}
//desordena una matriz de exactamente MxN, y lo retorna
function randMatrix(m){
  var aux = 0;
  var tM = m.length; var tN = 0;
  var alM = 0, alN = 0;
  for(var i=0; i<tM; i++){
    tN = m[i].length;
    for(var j=0; j<tN; j++){
      alM = aleat(0,tM-1); 
      alN = aleat(0,tN-1);
      aux = m[i][j];
      m[i][j] = m[alM][alN];
      m[alM][alN] = aux;
    }
  }
  return m
}
//imprime un array o matriz por consola
function printArray(arr, id=0){
  if( arr instanceof Array ){
    for(var i=0; i<arr.length; i++){
      if( arr[i] instanceof Array )
        printArray(arr[i], id+1);
    }
    console.log(arr);
  }else{
    console.log("La variable no es de tipo Array");
  }
}
//se le pasa un vector y lo llena del 1 hasta length
function fillVector(v){
  for(var i=0; i<v.length; i++)
    v[i] = i+1;
  return v;
}
//regresa un nuevo vector de tamaño 'length' lleno del 1 a length
function newFillVector(length){
  var v = new Array(length);
  return fillVector(v);
}
//se le pasa una matriz y la llena desde 1 hasta nxm
function fillMatrix(m){
  var n = 1;
  for(var i=0; i<m.length; i++){
    for(var j=0; j<m[i].length; j++)
      m[i][j] = n++;
  }
  return m;
}
//retorna una matriz de nXm, vacía.
function newMatrix(m,n){
  var mz = new Array(m);
  for(var i=0; i<m; i++)
    mz[i] = new Array(n);
  return mz;
}
//retorna una matriz de nXm, llena del 1 hasta nxm
function newFillMatrix(m,n){
  return fillMatrix( newMatrix(m,n) );
}

//reloj donde se guarda el tiempo transcurrido
function Reloj(){
  this.seg = 0; this.min = 0; this.hour = 0; this.dec = 0;
  this.getVal = function(){
    this.dec++;
    if(this.dec>9){
      this.dec = 0; this.seg++;
      if(this.seg>59){
        this.seg = 0; this.min++;
        if(this.min>59){
          this.min = 0; this.hour++;
        }
      }
    }
    return this.min+':'+this.seg+':'+this.dec;
  };
  this.getVal2 = function(){
    return this.min+':'+this.seg+':'+this.dec;
  }
  this.restablecer = function(){ //restablece todo a 0, pero no para el crono
    this.seg = 0; this.min = 0; this.hour = 0; this.dec = 0;
  }
}
//un cronómetro; idDisplay = nombre del objeto donde se muestra el tiempo,
function Cronometro(idDisplay){
  display = document.getElementById(idDisplay);
  reloj = new Reloj();
  this.intervalo = 100;
  display.textContent = '00:00:00';
  this.crono = 0;
  this.activo = false;
  
  this.detener = function(){//detiene el crono, pero guarda el estado
    window.clearInterval(this.crono);
    this.activo = false;
  };
  this.iniciar = function(){//inicia el cronómetro, solo se debe llamar una vez!
    this.detener();
    this.crono = window.setInterval(function(){
      setDisplay();
    },this.intervalo);
    this.activo = true;
  };
  this.reiniciar = function(){//reinicia todo a 0, y vuelve a comenzar
    reloj.restablecer();
    this.detener();
    this.iniciar();
  }
  this.pausar = function(){//detiene el crono, pero se guarda el estado
    this.detener();
  };
  this.sumarSeg = function(seg){
    for(var i=1; i<=seg; i++){
      this.crono = window.setTimeout(function(){
        setDisplay();
      },1000);
    }
  };
  this.kill = function(){
    reloj = null;
    display = null;
  }
}

var reloj;
var display;
//escribe el tiempo en una caja
function setDisplay(){
  display.textContent = reloj.getVal();
}
function setDisplay2(){
  display.textContent = reloj.getVal2();
}