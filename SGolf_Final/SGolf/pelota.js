import * as THREE from '../libs/three.module.js'

class Pelota extends THREE.Object3D {
  constructor() {
    super();

    //Material y Texturas de la bola
    var texture = new THREE.TextureLoader().load('../imgs/bola.png');
    var material = new THREE.MeshStandardMaterial ({map: texture});
    var bolaG = new THREE.SphereBufferGeometry(0.5,50,50);

    //Mesh + Proyección de Sombra
    this.bola = new THREE.Mesh(bolaG, material);
    this.bola.castShadow = true;

    this.add(this.bola);    
  }

  //Función para que la pelota ruede cuando sea lanzada. Como se llama en un movimiento de tween, cada vez
  // se pasará con menos velocidad para ser más fiel a la realidad
  rodar(velocidad) {
    var trueVelocidad = (1 - velocidad)/10;
    this.bola.rotation.z -= trueVelocidad;
  }
}

export { Pelota };


