import * as THREE from '../libs/three.module.js'

class Bandera extends THREE.Object3D {
  constructor() {
    super();

    //Construcción del banderín de arriba de la bandera
    var banderinT = new THREE.TextureLoader().load('../imgs/bandera.jpg');
    var banderinM = new THREE.MeshPhongMaterial ({map: banderinT});
    var banderinG = new THREE.BoxBufferGeometry(3,2,0.2);
    this.banderin = new THREE.Mesh(banderinG, banderinM);
    this.banderin.position.y=6;
    this.banderin.position.x=1.7;

    //Construcción del palo de la bandera
    var paloT = new THREE.TextureLoader().load('../imgs/metal.jpg');
    var paloM = new THREE.MeshPhongMaterial ({map: paloT});
    var paloG = new THREE.CylinderBufferGeometry(0.2,0.2,8,20);
    this.palo = new THREE.Mesh(paloG, paloM);
    this.palo.position.y=3;
   
    //Creación de un cilindro englobante para colapsar con más precisión
    this.cajaEnglobante = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.8,0.8,1.8,20), new THREE.MeshNormalMaterial({opacity: 0.35, transparent: true}));
    //Se crea debajo de la bandera porque la colisión estará apuntando hacia abajo (vector 0, -1, 0)
    this.cajaEnglobante.position.y = -2.5;


    this.bandera = new THREE.Object3D();
    this.bandera.add(this.banderin, this.palo, this.cajaEnglobante);

    this.bandera.position.x = -228;
    this.bandera.position.z = 260.3;

    //Función para indicar a todos los hijos que derivan de la jerarquía que deben proyectar y recibir sombras
    this.bandera.traverse(function(subMesh) {
      if (subMesh.isMesh) {
        subMesh.castShadow = true;
      }
    });
    //Las cajas no deben proyectar sombra
    this.cajaEnglobante.castShadow = false;
    this.cajaEnglobante.visible = false;

    //La bandera completa
    this.add(this.bandera);
  }
}

export { Bandera };


