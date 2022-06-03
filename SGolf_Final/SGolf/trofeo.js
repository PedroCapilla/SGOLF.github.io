import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Trofeo extends THREE.Object3D {
    constructor() {
        super();

        //Materiales y Texturas metálicas
        const material = new THREE.MeshMatcapMaterial();
        const matcapTexture = new THREE.TextureLoader().load('../imgs/matcap-green-yellow-pink.png');
        material.matcap = matcapTexture;

        //Creación de las geometrías de los anillos del trofeo y la copa con su parte de borrado para dejarla hueca
        var copaGE = new THREE.CylinderBufferGeometry(2, 1, 4, 100);
        var copaGI = new THREE.CylinderBufferGeometry(1.9, 0.9,3.5, 100);
        var toroGD = new THREE. TorusGeometry (0.7,0.4,24,24) ;
        var toroGI = new THREE. TorusGeometry (0.7,-0.4,24,24) ;

        //Meshes de los anillos del trofeo y la copa con su parte de borrado para dejarla hueca
        this.copaE = new THREE.Mesh(copaGE, material);
        this.copaI = new THREE.Mesh(copaGI, material);
        this.toroD = new THREE.Mesh(toroGD, material);
        this.toroI = new THREE.Mesh(toroGI, material);

        //Colocarlos debidamente
        this.toroD.position.set(1.5,0.4,0);
        this.toroI.position.set(-1.5,0.4,0);
        this.copaI.position.set(0,1.5,0);

        //Creación del palo que sostiene la copa
        this.paloBaseG = new THREE.CylinderBufferGeometry(0.3,0.3,1,100);
        this.paloBase = new THREE.Mesh(this.paloBaseG,material);
        this.paloBase.position.set(0,0.5,0);

        //Creación de la base para el trofeo
        this.baseG = new THREE.CylinderBufferGeometry(0.1,1,1,100);
        this.base = new THREE.Mesh(this.baseG, material);
        this.base.position.set(0,0.2,0);

        //Realizamos el substract de la copaI a la copaE del trofeo
        var csg = new CSG();
        csg.union([this.copaE, this.toroD, this.toroI]);
        csg.subtract([this.copaI]);
        this.copa = csg.toMesh();

        this.copa.position.y+=3;

        //Creación de una caja englobante para colapsar con más precisión
        this.cajaEnglobante = new THREE.Mesh(new THREE.BoxBufferGeometry(8,8,7), new THREE.MeshNormalMaterial({opacity: 0.35, transparent: true}));
        this.cajaEnglobante.position.y = 2.4;

        //Jerarquizar todo lo creado en un únco objeto trofeo
        this.trofeo = new THREE.Object3D();
        this.trofeo.add(this.base, this.paloBase, this.copa, this.cajaEnglobante);

        //Función para indicar a todos los hijos que derivan de la jerarquía que deben proyectar y recibir sombras
        this.trofeo.traverse(function(subMesh) {
            if (subMesh.isMesh) {
              subMesh.castShadow = true;
            }
        });
        //Las cajas no deben proyectar sombra
        this.cajaEnglobante.castShadow = false;
        this.cajaEnglobante.visible = false;
        
        this.add(this.trofeo);

    }

    update() {
        this.trofeo.rotation.y += 0.05;
    }
}

export { Trofeo };


