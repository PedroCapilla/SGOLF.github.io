import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { CSG } from '../libs/CSG-v2.js'
 
class Pajaro extends THREE.Object3D {
  constructor(aux) {
    super();

    //Momento de la escena para la animación de las alas y la cabeza del pájaro
    this.escena = 0;

    //Texturas y Materiales para el pájaro
    var texturaPajaro = new THREE.TextureLoader().load('../imgs/texturaPajaro.jpeg');
    var materialPajaro = new THREE.MeshStandardMaterial ({map: texturaPajaro});
    var materialPicoPata = new THREE.MeshStandardMaterial({color: 0xffaa00});
    var materialOjo = new THREE.MeshStandardMaterial({color: 0x000000});

    // ------------------------------------ Cabeza ----------------------------------------------

    //Creación de la esfera de la cabeza
    var cabezaGeom = new THREE.SphereGeometry(1,20,20);
    this.cabeza = new THREE.Mesh(cabezaGeom, materialPajaro);

    //Creación del pelo en forma de tres pinchos/conos funky para dar estilo al pájaro
    var cono = new THREE.ConeGeometry(0.2,0.7,20);
    this.cono1 = new THREE.Mesh(cono, materialPajaro);
    this.cono1.rotation.x = Math.PI/9;
    this.cono1.position.z = 0.3;
    this.cono1.position.y = 1.1;

    this.cono2 = new THREE.Mesh(cono, materialPajaro);
    this.cono2.position.y = 1.1;

    this.cono3 = new THREE.Mesh(cono, materialPajaro);
    this.cono3.rotation.x = -Math.PI/9;
    this.cono3.position.z = -0.3;
    this.cono3.position.y = 1.1;

    //Creación del pico
    var picoGeom = new THREE.ConeGeometry(0.2,0.5,20);
    this.pico = new THREE.Mesh(picoGeom, materialPicoPata);
    this.pico.rotation.x = Math.PI/2;
    this.pico.position.z = 1.2;

    //Creación de los ojos
    var ojosGeom = new THREE.SphereGeometry(0.18, 20, 20);
    this.OjoIzq = new THREE.Mesh(ojosGeom, materialOjo);
    this.OjoDer = new THREE.Mesh(ojosGeom, materialOjo);
    //Posicionarlos
    this.OjoIzq.position.x = 0.3;
    this.OjoIzq.position.z = 0.7;
    this.OjoIzq.position.y = 0.6;

    this.OjoDer.position.x = -0.3;
    this.OjoDer.position.z = 0.7;
    this.OjoDer.position.y = 0.6;

    //Jerarquizar toda la cabeza y posicionarla
    this.cabeza.add(this.pico, this.OjoDer, this.OjoIzq, this.cono1, this.cono2, this.cono3);
    this.cabeza.position.z = 1.5;
    this.cabeza.position.y = 1;

    // ------------------------------------ Cuerpo ----------------------------------------------

    //Creación de la esfera del cuerpo
    var cuerpoGeom = new THREE.SphereGeometry(1.5,20,20);
    cuerpoGeom.scale(0.8,0.8,1.2);
    cuerpoGeom.rotateX(-Math.PI/7);
    this.cuerpo = new THREE.Mesh(cuerpoGeom, materialPajaro);

    //Creación de las alas
    var alaGeom = new THREE.SphereGeometry(1.2,20,20);
    alaGeom.scale(1.4,0.1,0.65);
    alaGeom.translate(2,0.3,0);

    this.alaIzq = new THREE.Mesh(alaGeom, materialPajaro);
    this.alaIzq.rotation.x = -Math.PI/8;
    this.alaIzq.position.y = -0.2;

    this.alaDer = new THREE.Mesh(alaGeom, materialPajaro);
    this.alaDer.rotation.y = Math.PI;
    this.alaDer.rotation.x = -Math.PI/8;
    this.alaDer.position.y = -0.2;

    //Creación de las patas
    var pataGeom = new THREE.CylinderGeometry(0.08,0.08,0.7,20);
    this.pataAux = new THREE.Mesh(pataGeom, materialPicoPata);
    //Dedos de las patas
    var deoGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 10);
    deoGeom.rotateX(Math.PI/2);
    deoGeom.translate(0,-0.35,0.125);
    this.deo1 = new THREE.Mesh(deoGeom, materialPicoPata);
    this.deo1.rotation.y = -(Math.PI/4);
    this.deo2 = new THREE.Mesh(deoGeom, materialPicoPata);
    this.deo3 = new THREE.Mesh(deoGeom, materialPicoPata);
    this.deo3.rotation.y = (Math.PI/4);

    //Unión de las patas con los dedos
    var csg = new CSG();
    csg.union([this.pataAux, this.deo1, this.deo2, this.deo3]);
    this.pataIzq = csg.toMesh();
    this.pataIzq.position.y = -1.5;
    this.pataIzq.position.x = -0.4;
    this.pataIzq.position.z = -0.6;

    var csg = new CSG();
    csg.union([this.pataAux, this.deo1, this.deo2, this.deo3]);
    this.pataDer = csg.toMesh();
    this.pataDer.position.y = -1.5;
    this.pataDer.position.x = 0.4;
    this.pataDer.position.z = -0.6;

    //Jerarquizar todo el cuerpo
    this.cuerpo.add(this.alaIzq, this.alaDer, this.pataIzq, this.pataDer);

    // ------------------------------------ Cola ----------------------------------------------

    var colaGeom = new THREE.CylinderGeometry(0.5,0.2,2,20);
    colaGeom.scale(1,1,0.2);
    colaGeom.rotateX(-Math.PI/2);
    colaGeom.translate(0,0,-1);

    this.cola = new THREE.Mesh(colaGeom, materialPajaro);
    this.cola.rotation.x = Math.PI/10;
    this.cola.position.y = -0.6;
    this.cola.position.z = -1.5;

    // ------------------------------------ Pájaro ----------------------------------------------

    //Jerarquizar todas las jerarquías (cabeza, cuerpo y cola) anteriores
    this.pajaro = new THREE.Object3D();
    this.pajaro.add(this.cabeza, this.cuerpo, this.cola);

    //Función para indicar a todos los hijos que derivan de la jerarquía que deben proyectar y recibir sombras
    this.pajaro.traverse(function(subMesh) {
      if (subMesh.isMesh) {
        subMesh.castShadow = true;
      }
    });
    
    this.add(this.pajaro);

    //Empezar el movimiento del pájaro siguiendo una línea
    this.movimiento(aux);
  }

  movimiento(indice) { 
    //Según un índice estblezco distintos caminos para que no todos los pájaros sigan el mismo. Además con distintas velocidades
    if (indice == 0){
      var spline = new THREE.CatmullRomCurve3 ( [
        new THREE.Vector3(50, 35, 250), 
        new THREE.Vector3(50, 30, -250),
        new THREE.Vector3(-50, 40, -250), 
        new THREE.Vector3(-50, 20, 250), 
        new THREE.Vector3(50, 35, 250)
      ] );
      var tiempoQueTarda = 5500;
    }else if (indice == 1) {
      var spline = new THREE.CatmullRomCurve3 ( [
        new THREE.Vector3(0, 40, 0), 
        new THREE.Vector3(50, 20, -100),
        new THREE.Vector3(0, 15, -250), 
        new THREE.Vector3(-50, 33, -100),
        new THREE.Vector3(50, 45, 100),
        new THREE.Vector3(0, 30, 250), 
        new THREE.Vector3(-50, 35, 100),
        new THREE.Vector3(0, 40, 0)
      ] );
      var tiempoQueTarda = 4000;
    }else if (indice==2){
      var spline = new THREE.CatmullRomCurve3 ( [
        new THREE.Vector3(0, 30, 0), 
        new THREE.Vector3(-50, 35, 100),
        new THREE.Vector3(0, 40, 250), 
        new THREE.Vector3(50, 45, 100),
        new THREE.Vector3(0, 30, 0), 
        new THREE.Vector3(-50, 25, -100),
        new THREE.Vector3(0, 35, -250), 
        new THREE.Vector3(50, 30, -100),
        new THREE.Vector3(0, 30, 0)
      ] );
      var tiempoQueTarda = 7000;
    }else if(indice == 3){
      var spline = new THREE.CatmullRomCurve3 ( [
        new THREE.Vector3(10, 30, 10), 
        new THREE.Vector3(-60, 50, 110), 
        new THREE.Vector3(20, 60, 270), 
        new THREE.Vector3(170, 65, 120),
        new THREE.Vector3(120, 50, 20), 
        new THREE.Vector3(-170, 55, -120),
        new THREE.Vector3(120, 55, -270), 
        new THREE.Vector3(70, 50, -120),
        new THREE.Vector3(20, 50, 20),
        new THREE.Vector3(10, 30, 10)
      ] );
      var tiempoQueTarda = 10000;
    }

    // ------------------------------------ Movimiento ----------------------------------------------

    //Primera parte
    var origen1 = {p: 0};
    var dest1 = {p: 0.5};

    var bucle_rapido = new TWEEN.Tween(origen1).to(dest1, tiempoQueTarda).onUpdate(()=>{
        var pos = spline.getPointAt(origen1.p);
        this.pajaro.position.copy(pos);
        var tangente = spline.getTangentAt(origen1.p);
        pos.add(tangente);

        this.pajaro.lookAt(pos);
    });

    //Segunda parte

    var origen2 = {p: 0.5};
    var dest2 = {p: 1};

    var bucle_lento = new TWEEN.Tween(origen2).to(dest2, tiempoQueTarda).onUpdate(()=>{
        var pos = spline.getPointAt(origen2.p);
        this.pajaro.position.copy(pos);
        var tangente = spline.getTangentAt(origen2.p);
        pos.add(tangente);

        this.pajaro.lookAt(pos);
    }).onComplete(()=>{bucle_rapido.start();}); //Al completarse que se repita en bucle

    //Concatenar las dos partes
    bucle_rapido.chain(bucle_lento);

    //Empezar
    bucle_rapido.start();
  }
  
  update () {
    if (this.escena < 8){ // Si llevamos menos de 8 escenas en la animación subimos alas y cabeza
      this.cabeza.position.y += 0.01;
      this.alaIzq.rotation.z += 0.1;
      this.alaDer.rotation.z += 0.1;
    }else { // Si llevamos mas de 8 escenas en la animación bajamos alas y cabeza
      this.cabeza.position.y -= 0.01;
      this.alaIzq.rotation.z -= 0.1;
      this.alaDer.rotation.z -= 0.1;
    }

    //Al llegar a la última escena de la animación, reiniciamos
    if (this.escena >= 15)
      this.escena = 0;
    else  
      this.escena += 1; //Vamos actualizando escenas
    
    TWEEN.update();
  }
}

export { Pajaro };
