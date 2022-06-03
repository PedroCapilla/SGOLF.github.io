import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Palo extends THREE.Object3D {
  constructor() {
    super();

    //Materiales y Texturas metálicas
    const material = new THREE.MeshMatcapMaterial();    
    const matcapTexture = new THREE.TextureLoader().load('../imgs/matcap-green-yellow-pink.png');
    material.matcap = matcapTexture;

    //Creación de la parte alargada del palo de Golf
    var paloG = new THREE.CylinderBufferGeometry(0.2,0.2,5,100);
    this.palo= new THREE.Mesh(paloG, material);
    this.palo.rotateX(-Math.PI/6);

    //Creación de la parte baja del palo de Golf y de un cubo auxiliar para hacer substract a la parte de abajo
    var esferaG = new THREE.SphereBufferGeometry(1);
    var cuboDG = new THREE.BoxBufferGeometry(2.5,2.5,2.5);
    esferaG.scale(1,0.5,1);

    this.esfera = new THREE.Mesh(esferaG, material);
    this.cuboD = new THREE.Mesh(cuboDG, material);
    this.cuboD.position.set(-1,0,0);

    //Le realizamos el substract mencionado
    var csg2 = new CSG();
    csg2.union([this.esfera]);
    csg2.subtract([this.cuboD]);
    this.parteAbajo = csg2.toMesh();

    this.parteAbajo.position.set(-0.5,-2.4,1.8);

    //Creación de una caja englobante para colapsar con más precisión
    this.cajaEnglobante = new THREE.Mesh(new THREE.BoxBufferGeometry(2.7,5.7,4.7), new THREE.MeshNormalMaterial({opacity: 0.35, transparent: true}));
    this.cajaEnglobante.position.z = 0.5;
    this.cajaEnglobante.position.y = -0.6;

    //Jerarquizar todo lo creado en un únco objeto palo de Golf
    this.paloGolf = new THREE.Object3D();
    this.paloGolf.add(this.parteAbajo, this.palo, this.cajaEnglobante);
    this.paloGolf.position.y = 2.5;

    //Función para indicar a todos los hijos que derivan de la jerarquía que deben proyectar y recibir sombras
    this.paloGolf.traverse(function(subMesh) {
      if (subMesh.isMesh) {
        subMesh.castShadow = true;
      }
    });
    //Las cajas no deben proyectar sombra
    this.cajaEnglobante.castShadow = false;
    this.cajaEnglobante.visible = false;

    this.add(this.paloGolf);
  }

  update () {
    this.paloGolf.rotation.y-=0.05;
  }
}

export { Palo };


