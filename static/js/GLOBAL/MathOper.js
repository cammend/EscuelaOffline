//clase Trivia, esta clase debe tener obligatoriamente las siguientes variables:
//op1, op2, op3, r, pregunta  #estas son llamadas desde la clase Juego.
//el param (oper) puede ser: "+", "-", "*", "/", "+-", "*/", "all"
function aleatoria(dif){
  return Math.round( (Math.random() * (2+dif)) + dif ); //primer operando
}

TriviaMate = function(){
  this.op1 = 0; this.op2 = 0; this.op3 = 0; this.r = 0;
  this.pregunta = '';
}
// ejemplo de llamada a la función : init('*', 5);
TriviaMate.prototype.init = function(oper, dif){ //dif = dificultad (1-10), oper = operación matemática
  var oper1 = aleatoria(dif); //primer operando
  var oper2 = aleatoria(dif); //segundo operando
  var oper3 = aleatoria(dif);
  var oper4 = aleatoria(dif);
  var r = 0;
  if (oper == "+"){ //para sumas
    r = oper1 + oper2;
    this.pregunta = oper1 + ' + ' + oper2;
  }else if(oper == "-"){ //para restas
    r = oper1 - oper2;
    this.pregunta = oper1 + ' - ' + oper2;
  }else if(oper == "*"){ //para multiplicaciones
    r = oper1 * oper2;
    this.pregunta = oper1 + ' * ' + oper2;
  }else if(oper == "/"){ //para divisiones
    r = oper1 / oper2;
    this.pregunta = oper1 + ' / ' + oper2;
  }else if(oper == "+-"){
    if( this.randTrue() ){
      r = oper1 + oper2 - oper3;
      this.pregunta = oper1 + ' + ' + oper2 + ' - ' + oper3;
    }else{
      r = oper1 - oper2 + oper3;
      this.pregunta = oper1 + ' - ' + oper2 + ' + ' + oper3;
    }
  }else if(oper == "*/"){
    if( this.randTrue() ){
      oper3 = this.numeroPar(oper3);
      r = (oper1 * oper2) / oper3;
      this.pregunta = '('+oper1 + ' * ' + oper2 + ') / ' + oper3;
    }else{
      oper1 = this.numeroPar(oper1);
      oper2 = this.numeroPar(oper2);
      if (oper1 < oper2){ //asegura una división con respuesta un número entero
        var aux = oper1; oper1 = oper2; oper2 = aux;
      }
      r = (oper1 / oper2) * oper3;
      this.pregunta = '('+oper1 + ' / ' + oper2 + ') * ' + oper3;
    }
  }else if(oper == "all"){
    if( this.randTrue() ){
      r = oper1 - oper2 + oper3 * oper4;
      this.pregunta = '('+oper1 + ' - ' + oper2 + ') + ' + oper3 + ' * ' + oper4;
    }else{
      if (oper3 < oper4){ //asegura una división con respuesta un número entero
        var aux = oper3; oper3 = oper4; oper4 = aux;
      }
      oper3 = this.numeroPar(oper3);
      oper4 = this.numeroPar(oper4);
      oper4 = this.minimizarNumero(oper4, 10, 8);
      r = oper1 + oper2 - oper3 / oper4;
      this.pregunta = '('+oper1 + ' + ' + oper2 + ') - ' + oper3 + ' / ' + oper4;
    }
  }
  this.r = r;
  var op = [r,r,r];
  op[0]= r; op[1] = r; op[2] = r;
  var salir = false;
  while(!salir){ //while para elegir un numero aleatorio para mostrar como respuesta
      if(op[0] === r){
        if( !this.randTrue() )
          op[0] = op[0] - Math.round(Math.random()*5+1);
        else
          op[0] = op[0] + Math.round(Math.random()*5+1);
      }else{ salir = true; }
  }
  salir = false;
  while(!salir){ //while para elegir un numero aleatorio para mostrar como respuesta
      if(op[1] === r){
        if( !this.randTrue() )
          op[1] = op[1] + Math.round(Math.random()*3+1);
        else
          op[1] = op[1] - Math.round(Math.random()*3+1);
      }else{ salir = true; }
  }
  for(var i=0; i<3; i++){ //'barajamos' las 3 opciones de respuesta aleatoriamente
      var aux;
      var aleat = Math.round(Math.random()*2);
      aux = op[aleat];
      op[aleat] = op[i];
      op[i] = aux;
  }
  this.op1 = op[0]; this.op2 = op[1]; this.op3 = op[2]; //seteamos las variables 'op#'
}
TriviaMate.prototype.randTrue = function(){ //solo devuelve true o false aleatoriamente
  var aux = Math.round(Math.random()*2);
  if (aux == 0) return true;
  return false;
}
TriviaMate.prototype.numeroPar = function(num){
  var res = num % 2;
  if (res > 0) return num+1;
  return num;
}
//num = el número a minimizar, 
//numMayor = se minimiza (num) si es mayor a este número,
//numMin = el número q quiero restarle a (num)
TriviaMate.prototype.minimizarNumero = function(num, numMayor, numMin){
  if( num > numMayor )
    return num - numMin;
  return num;
}