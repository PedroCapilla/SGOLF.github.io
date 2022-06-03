import * as THREE from '../libs/three.module.js'

class Arbol extends THREE.Object3D {
  constructor() {
    super();

    //Textura
    var texture = new THREE.TextureLoader().load('../imgs/arbolss.jpg');
    //Material
    var material = new THREE.MeshStandardMaterial ({map: texture});

    //Geometria copas (hojas)
    var copaGeom = new THREE.CylinderBufferGeometry(1,5,5,1000);
    var copaGeom2 = new THREE.CylinderBufferGeometry(0,5,5,1000);

    //Meshes copas
    var copa1 = new THREE.Mesh(copaGeom, material);
    copa1.position.y=2.5;

    var copa2 = new THREE.Mesh(copaGeom, material);
    copa2.scale.set(0.75,0.75,0.75);
    copa2.position.y=6;

    var copa3 = new THREE.Mesh(copaGeom2, material);
    copa3.scale.set(0.5,0.5,0.5);
    copa3.position.y=8.75;

    //Geometria troncos
    var troncoT = new THREE.TextureLoader().load('../imgs/tronco.jpg');
    var troncoM = new THREE.MeshStandardMaterial({map: troncoT});
    var troncoG = new THREE.CylinderBufferGeometry(1,1,3,100);

    //Mesh Tronco
    this.tronco = new THREE.Mesh(troncoG, troncoM);
    this.tronco.position.y = -1;

    //Jerarquizar las copas como una única que contenga las tres
    this.copa = new THREE.Object3D();
    this.copa.add(copa1, copa2, copa3);
    
    //Jerarquizar todo como un árbol
    this.arbol = new THREE.Object3D();
    this.arbol.add(this.copa, this.tronco);
    this.arbol.position.y = 1.5;

    //Función para indicar a todos los hijos que derivan de la jerarquía que deben proyectar y recibir sombras
    this.arbol.traverse(function(subMesh) {
      if (subMesh.isMesh) {
        subMesh.castShadow = true;
        subMesh.receiveShadow = true;
      }
    });

    //El arbol completo
    this.add(this.arbol);
  }
}

export { Arbol };


