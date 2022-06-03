import * as THREE from '../libs/three.module.js'
//import * as KeyCode from '../libs/keycode.esm.js'

class BarraFuerza extends THREE.Object3D {
  constructor() {
    super();
  
    this.barraActiva = true; //Si esta activa se podrá interactuar con la barra durante el juego
    this.potencia = 0.0; //Fuerza con la que será lanzada la bola
    this.condicionProcentaje = 8; //Con porcentaje 8, la barra llegará hasta el 100% de su altura

    this.porcentaje = 0.0; //Porcentaje que llevará en cada momento
    this.sube = true; //Si debe subir, si esta a false bajará

    //Construcción de la barra transparente
    var barraM = new THREE.MeshPhongMaterial({opacity:0.5, transparent:true, color:0x808080});
    var barraG = new THREE.BoxBufferGeometry(1,8.25,0.5);
    this.barra = new THREE.Mesh(barraG, barraM);
    this.barra.position.y=4;
    
    //Construcción de la barra interna a la transparente que determina la fuerza
    var fuerzaM = new THREE.MeshPhongMaterial({color: 0xff0000});
    var fuerzaG = new THREE.BoxBufferGeometry(0.8, 0.1, 0.3);
    fuerzaG.translate(0,0.05,0);
    this.fuerza = new THREE.Mesh(fuerzaG, fuerzaM);
    
    //La barra completa
    this.add(this.fuerza);
    this.add(this.barra);    
  }

  //Función para parar la barra (se llamará desde el juego al pulsar la tecla espacio) y obtener la potencia lograda
  pararBarra() {
    if (this.barraActiva)
      this.barraActiva = false;
    else
      this.barraActiva = true;

    return this.potencia;
  }

  //Si estamos en la arena la barra solo podra llegar a la mitad de altura
  barraArena(arena) {
    if (arena){
      this.condicionProcentaje = 4;
    }else{
      this.condicionProcentaje = 8;
    }
  }

  update () {
    if (this.barraActiva) { //Si la barra está operativa
      if(this.sube){ //Y ademas está subiendo
        this.fuerza.scale.y+=5;  //
        this.potencia+=6;        // Aumenta la potencia y el porcentaje que lleva subido en la barra
        this.porcentaje += 0.5;  //

        if (this.porcentaje>=this.condicionProcentaje) // Si llegamos al máximo establecido será hora de bajar
            this.sube  = false;
      }else{ //Si estamos bajando
          this.fuerza.scale.y-=5; //
          this.potencia-=6;       // Disminuye la potencia y el porcentaje que lleva subido en la barra
          this.porcentaje -= 0.5; // 

          if (this.porcentaje<=0) // Si llegamos al mínimo establecido será hora de subir
              this.sube  = true;
      }
    }
  }
}

export { BarraFuerza };
