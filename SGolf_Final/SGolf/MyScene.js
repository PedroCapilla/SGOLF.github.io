// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { FlyControls } from '../libs/FlyControls.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import * as KeyCode from '../libs/keycode.esm.js'

// Clases de mi proyecto
import { Pajaro } from './pajaro.js'
import { Arbol } from './arbol.js'
import { Pelota } from './pelota.js'
import { BarraFuerza } from './barraFuerza.js'
import { Bandera } from './bandera.js'
import { Palo } from './palo.js'
import { Trofeo } from './trofeo.js'
import { Contador } from './contador.js'

// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();

    this.CamaraSeguimientoON = true; //Varibale para comprobar si la cámara que sigue la pelota es la actual
    this.sePuedePulsarBarra = true; //Variable que si está a false hará que no podamos interactuar con la bola mientras está en un movimiento de golpe
    this.ultimaPos = new THREE.Vector3(260,-0.5,-250); //Variable donde guardamos la última posición dónde acabaró la bola tras un golpe
    this.ayuda = false; //Si se aactiva podremos ver la línea que sigue la bola y las cjas englobantes de algunos objetos de la escena

    //Audios
    this.audioGolpeBola = document.getElementById("audioGolpeBola");
    this.audioAgua = document.getElementById("audioAgua");
    this.audioChoqueArbol = document.getElementById("audioChoqueArbol");
    this.audioTrophy = document.getElementById("audioTrophy");
    this.audioFinal = document.getElementById("audioFinal");
    this.audioHoyo = document.getElementById("audioHoyo");
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para reproducir las texturas de vídeo
    this.gui = this.createGUI();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights();
    
    // Tendremos una cámara con un control de avión
    this.createCamera();
    
    // Campo césped y búnkers de arena 
    this.createGround();
    this.createbunker();

    //Paredes y Techo
    this.createSkyWall();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (5);
    this.axis.visible = false;
    this.add (this.axis);
    
    //--------------------------------- Colocar pájaros en la escena ---------------------------------
    //el argumento del constructor es para que tenga una distinta trayectoria
    this.pajarillo = new Pajaro(0);
    this.pajarillo2 = new Pajaro(1);
    this.pajarillo3 = new Pajaro(2);
    this.pajarillo4 = new Pajaro(3);
    this.add (this.pajarillo, this.pajarillo2, this.pajarillo3, this.pajarillo4);


    //--------------------------------- Colocar árboles en la escena ---------------------------------
    var arrayArbolZ1=[];
    var arrayArbolZ2 = [];
    var arrayArbolZ3 = [];
    var arrayArbolZ4 = [];
    var arrayArbolZ5 = [];

    //------------------- Zona 1 arboles ---------------------
    for(var i = 0; i<40; i++){
      arrayArbolZ1[i]=new Arbol();
      arrayArbolZ1[i].position.x = i/2-125;
      arrayArbolZ1[i].position.z = (-100*Math.sin(i))+ 230;
      arrayArbolZ1[i].position.y -= 0.5;
      this.add(arrayArbolZ1[i]);
    }


    //------------------- Zona 2 arboles ---------------------

    for(var i = 0; i<100; i++){
      arrayArbolZ2[i]=new Arbol();
      arrayArbolZ2[i].position.z = (-50*Math.sin(i))+290;
      arrayArbolZ2[i].position.x = (i*4)-100;
      arrayArbolZ2[i].position.y -= 0.5;   
      this.add(arrayArbolZ2[i]);
    }

    //------------------- Zona 3 arboles ---------------------

    for(var i = 0; i<80; i++){
      arrayArbolZ3[i]=new Arbol();
      arrayArbolZ3[i].position.z = (-50*Math.sin(i))+190;
      arrayArbolZ3[i].position.x = (i)+220;
      arrayArbolZ3[i].position.y -= 0.5;   
      this.add(arrayArbolZ3[i]);
    }

    //------------------- Zona 4 arboles ---------------------

    for(var i = 0; i<80; i++){
      arrayArbolZ4[i]=new Arbol();
      arrayArbolZ4[i].position.x = i/3+310;
      arrayArbolZ4[i].position.z = (-320*Math.sin(i))+ 10;
      arrayArbolZ4[i].position.y -= 0.5;
      this.add(arrayArbolZ4[i]);
    }

     //------------------------- Zona 5 arboles -------------------

     for(var i = 0; i<176; i++){
      arrayArbolZ5[i]=new Arbol();
      arrayArbolZ5[i].position.x = (i*3)-320;
      arrayArbolZ5[i].position.z = (-70*Math.sin(i))-250;
      arrayArbolZ5[i].position.y -= 0.5;
      this.add(arrayArbolZ5[i]);
    }
    //Definir un array para todos los árboles
    this.arrayArboles = arrayArbolZ1.concat(arrayArbolZ2).concat(arrayArbolZ3).concat(arrayArbolZ4).concat(arrayArbolZ5);

    //------------------- Zona Campo arboles ---------------------

    this.arbolCampo1 = new Arbol();
    this.arbolCampo1.position.x = 250;
    this.arbolCampo1.position.y -= 0.5;
    this.arbolCampo1.position.z = -140;
    this.add(this.arbolCampo1);
    this.arrayArboles.push(this.arbolCampo1);

    this.arbolCampo2 = new Arbol();
    this.arbolCampo2.position.x = 234;
    this.arbolCampo2.position.y -= 0.5;
    this.arbolCampo2.position.z = -41;
    this.add(this.arbolCampo2);
    this.arrayArboles.push(this.arbolCampo2);

    this.arbolCampo3 = new Arbol();
    this.arbolCampo3.position.x = 196;
    this.arbolCampo3.position.y -= 0.5;
    this.arbolCampo3.position.z = 50;
    this.add(this.arbolCampo3);
    this.arrayArboles.push(this.arbolCampo3);

    this.arbolCampo4 = new Arbol();
    this.arbolCampo4.position.x = 53;
    this.arbolCampo4.position.y -= 0.5;
    this.arbolCampo4.position.z = 40;
    this.add(this.arbolCampo4);
    this.arrayArboles.push(this.arbolCampo4);

    this.arbolCampo5 = new Arbol();
    this.arbolCampo5.position.x = -66;
    this.arbolCampo5.position.y -= 0.5;
    this.arbolCampo5.position.z = 43;
    this.add(this.arbolCampo5);
    this.arrayArboles.push(this.arbolCampo5);

    this.arbolCampo6 = new Arbol();
    this.arbolCampo6.position.x = -196;
    this.arbolCampo6.position.y -= 0.5;
    this.arbolCampo6.position.z = 190;
    this.add(this.arbolCampo6);
    this.arrayArboles.push(this.arbolCampo6);

    this.arbolCampo7 = new Arbol();
    this.arbolCampo7.position.x = -139;
    this.arbolCampo7.position.y -= 0.5;
    this.arbolCampo7.position.z = 83;
    this.add(this.arbolCampo7);
    this.arrayArboles.push(this.arbolCampo7);

    //--------------------------------- Colocar la pelota en la escena ---------------------------------
    this.pelota = new Pelota();
    this.pelota.position.x = 260;
    this.pelota.position.z = -250;
    this.pelota.position.y = -0.54;
    this.pelota.rotation.y=3*Math.PI/2;
    //Creamos la cámara que cuelgue de la pelota ya creada
    this.createCameraSeguimiento();
    this.add(this.pelota);

    //--------------------------------- Colocar bandera en la escena ---------------------------------
    this.bandera = new Bandera();
    this.add(this.bandera);

    //--------------------------------- Colocar elementos bonus en la escena ---------------------------------
    this.palillo = new Palo();
    this.palillo.position.set(55.75,0,-3),
    this.add(this.palillo);
    this.palillo2 = new Palo();
    this.palillo2.position.set(-42.2,0,20),
    this.add(this.palillo2);
    this.palillo3 = new Palo();
    this.palillo3.position.set(-182.75,0,160),
    this.add(this.palillo3);
    this.arrayPalos = [this.palillo.cajaEnglobante, this.palillo2.cajaEnglobante, this.palillo3.cajaEnglobante];

    this.trophy = new Trofeo();
    this.trophy.position.set(175.8, 22.6, -84.2);
    //this.trophy.position.set(260, 0, -243);
    this.add(this.trophy);
    
    this.trophy2 = new Trofeo();
    this.trophy2.position.set(-77.5, 27.3, 176);
    this.add(this.trophy2);
    this.arrayTrofeos = [this.trophy.cajaEnglobante, this.trophy2.cajaEnglobante];
  }
  
  /* initStats() {
  
    var stats = new Stats();
    
    stats.setMode(1); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }  */

  //============================================= Cámaras =============================================
  
  //Cámara de vuelo libre
  createCamera () {
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(100,100,100); 
    this.camera.lookAt (0, 0, 0);

    // Se crea el control de vuelo
    this.flyControls = new FlyControls (this.camera, this.renderer.domElement); this . flyControls .movementSpeed = 45;
    this.flyControls.rollSpeed = Math.PI/12;
    this.flyControls.autoForward = false;
  }

  
  createCameraSeguimiento () {
    this.camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.barra = new BarraFuerza();
    this.contadorTexto = new Contador();

    this.pelota.add(this.camera2);
    this.camera2.add(this.barra);
    this.camera2.add(this.contadorTexto);

    this.barra.position.set(-8, -4.5, -14);
    this.barra.visible = true;

    this.contadorTexto.position.set(-9, 0.4, -20);
    this.barra.contadorTexto = true;

    // También se indica dónde se coloca
    this.camera2.position.set(-15, 5, 0);

    // Y hacia dónde mira
    var look = new THREE.Vector3(this.pelota.position.x,4,this.pelota.position.z);
    this.camera2.lookAt(look);
  }

  //============================================= Escenario =============================================
  
  createGround () {
    //-------------------- Creacion calle ---------------------
    var groundTexture = new THREE.TextureLoader().load('../imgs/cesped3.jpeg');
    var groundMaterial = new THREE.MeshPhongMaterial ({map: groundTexture});
    groundMaterial.map.wrapS = THREE.MirroredRepeatWrapping;
    groundMaterial.map.wrapT = THREE.MirroredRepeatWrapping;
    groundMaterial.map.repeat.set(50,50);


    var groundG1 = new THREE.BoxGeometry (200,0.1,400);
    var ground1 = new THREE.Mesh (groundG1, groundMaterial);
    ground1.position.set(-230,-1,125);
    ground1.receiveShadow = true;
    this.add (ground1);


    var groundG2 = new THREE.BoxGeometry(350,0.1,200);
    var ground2 = new THREE.Mesh(groundG2, groundMaterial);
    ground2.position.set(40,-1,25);
    ground2.receiveShadow = true;
    this.add (ground2);

    var groundG3 = new THREE.BoxGeometry(100,0.1,400);
    var ground3 = new THREE.Mesh(groundG3, groundMaterial);
    ground3.position.set(260,-1,-75);
    ground3.receiveShadow = true;
    this.add(ground3);

    //--------------------- Creacion agua ---------------------  
    var geometryWater = new THREE.BoxGeometry (300,0.1,100);

    this.video = document.createElement( 'video' ) ;
    this.video.crossOrigin = 'anonymous' ;
    this.video.preload = ' ' ;
    this.video.loop = 'true' ;
    this.video .src = '../imgs/agua.mp4';
    this.video.load() ;
    var textureAgua = new THREE.VideoTexture (this.video) ;
    textureAgua.minFilter = THREE.LinearFilter;
    textureAgua.magFilter = THREE.LinearFilter;
    textureAgua.format = THREE.RGBFormat;

    var materialWater = new THREE.MeshPhongMaterial ({map: textureAgua, side: THREE.FrontSide, toneMapped: false});

    this.water = new THREE.Mesh (geometryWater, materialWater);
    this.water2 = new THREE.Mesh (geometryWater, materialWater);
        
    this.water.position.y = -0.96;
    this.water.position.x = 60;
    this.water.position.z = 190;
    this.water2.position.y = -0.96;
    this.water2.position.x = 55;
    this.water2.position.z = -130;

    this.water.receiveShadow = true;
    this.water2.receiveShadow = true;
    this.add (this.water);
    this.add (this.water2);
    this.arrayAgua = [this.water, this.water2];

    //--------------------- Creacion zona green ---------------------
    var geometryGreen = new THREE.CylinderBufferGeometry(40,40,0.3,150);

    geometryGreen.translate(-240,-0.94,250)
    
    var greenT = new THREE.TextureLoader().load('../imgs/cesped2.jpeg');
    var materialT = new THREE.MeshPhongMaterial({map: greenT});
    materialT.map.wrapS = THREE.MirroredRepeatWrapping;
    materialT.map.wrapT = THREE.MirroredRepeatWrapping;
    materialT.map.repeat.set(25,25);
   
    var green = new THREE.Mesh(geometryGreen, materialT);
    green.receiveShadow = true;

    this.add(green);
  }

  //--------------------- Creacion zonas de arena ---------------------
  createbunker(){
    var arenaTexture = new THREE.TextureLoader().load('../imgs/arena.jpg');
    var arenaMaterial = new THREE.MeshPhongMaterial ({map: arenaTexture});
    arenaMaterial.map.wrapS = THREE.MirroredRepeatWrapping;
    arenaMaterial.map.wrapT = THREE.MirroredRepeatWrapping;

    var arena1G = new THREE.CylinderBufferGeometry(40,40,0.3,30);
    this.arena1 = new THREE.Mesh(arena1G, arenaMaterial);
    this.arena1.receiveShadow = true;
    this.add(this.arena1);
    this.arena1.scale.x = 0.8;
    this.arena1.scale.z = 1.2;
    this.arena1.position.set(-165,-0.94,230);
    
    var arena2G = new THREE.CylinderBufferGeometry(30,30,0.3,30);
    this.arena2 = new THREE.Mesh(arena2G, arenaMaterial);
    this.arena2.receiveShadow = true;
    this.add(this.arena2);
    this.arena2.scale.x = 2.5;
    this.arena2.scale.z = 0.8;
    this.arena2.position.set(-230,-0.94,160);

    var arena3G = new THREE.CylinderBufferGeometry(50,50,0.3,30);
    this.arena3 = new THREE.Mesh(arena3G, arenaMaterial);
    this.arena3.receiveShadow = true;
    this.add(this.arena3);
    this.arena3.scale.x = 3.0;
    this.arena3.scale.z = 0.7;
    this.arena3.position.set(30,-0.94,-30);

    var arena4G = new THREE.CylinderBufferGeometry(50,50,0.3,30);
    this.arena4 = new THREE.Mesh(arena4G, arenaMaterial);
    this.arena4.receiveShadow = true;
    this.add(this.arena4);
    this.arena4.scale.x = 2;
    this.arena4.scale.z = 0.9;
    this.arena4.position.set(-210,-0.94,-130);

    this.arrayArena = [this.arena1, this.arena2, this.arena3, this.arena4];
  }

  //--------------------- Creacion cielo y paredes ---------------------
  createSkyWall () {
    //Materiales y Texturas del cubo que delimitará el mapa. Se borrará al paredExt la paredInt para que dentró sea hueco y juguemos
    var paredT = new THREE.TextureLoader().load('../imgs/cielopared.jpeg');
    var paredM = new THREE.MeshPhongMaterial ({map: paredT});
    var paredGExt = new THREE.BoxBufferGeometry(706,700,706);
    var paredGInt = new THREE.BoxBufferGeometry(699,705,699);

    //Materiales y Texturas del cielo/techo
    var cieloArribaT = new THREE.TextureLoader().load('../imgs/nubes.jpeg');
    var cieloArribaM = new THREE.MeshPhongMaterial ({map: cieloArribaT});
    var cieloArribaG = new THREE.BoxBufferGeometry(699,2,699);

    //Materiales y Texturas del cesped verde oscuro fuera del campo
    var parteAbajoT = new THREE.TextureLoader().load('../imgs/cesped2.jpeg');
    var parteAbajoM = new THREE.MeshPhongMaterial ({map: parteAbajoT});
    //Que se repita la imagen para más definición
    parteAbajoM.map.wrapS = THREE.MirroredRepeatWrapping;
    parteAbajoM.map.wrapT = THREE.MirroredRepeatWrapping;
    parteAbajoM.map.repeat.set(50,50);
    var parteAbajoG = new THREE.BoxBufferGeometry(699,99,699);

    //Colocamos los cubos para el correcto borrado
    paredGExt.translate(0,99,0);
    paredGInt.translate(0,100, 0);
    cieloArribaG.translate(0,400,0)
    parteAbajoG.translate(0, -50.65, 0);

    //Creación de los Meshes
    this.paredMeshExt = new THREE.Mesh(paredGExt, paredM);
    this.paredMeshInt = new THREE.Mesh(paredGInt, paredM);
    this.cieloMeshArriba = new THREE.Mesh(cieloArribaG, cieloArribaM);
    this.parteAbajo = new THREE.Mesh(parteAbajoG, parteAbajoM);
    //Ademas la zona de cesped de fuera tambieén puede recibiar proyecciones de sombras
    this.parteAbajo.receiveShadow = true;

    //Borrado para el Cubo Hueco y Añadir el techo
    var csg = new CSG();
    csg.union([this.paredMeshExt]);
    csg.subtract([this.paredMeshInt]);
    this.cielo = csg.toMesh();

    //Mapa cúbico al completo
    this.add(this.cielo, this.cieloMeshArriba, this.parteAbajo);
  }
  
  //============================================= Interfaz GUI =============================================
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity : 0.7,
      axisOnOff : false,
      playVideo : () => {
        this.video.play();
      }
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Ajustes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );

    folder.add(this.guiControls, 'playVideo').name('Play');
    
    return gui;
  }
  
  //============================================= Luces =============================================
  createLights () {
    //Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xfffff0, 0.4 ); 
    this.add(this.hemiLight);

    var materialSol = new THREE.MeshToonMaterial({color: 0xfff76b});
    var solG = new THREE.SphereBufferGeometry(20,40,40);
    materialSol.shininess = 120;
    var sol = new THREE.Mesh(solG, materialSol);
    sol.position.set( -50, 280, 0 );
    this.add(sol);

    //Se crea una luz punto que va a ser la luz principal de la escena que simulará un sol. 
    // proyecta haces de luz en todas las direcciones, saliendo del dado punto
    let light = new THREE.PointLight(0xffffff, 1);
    //Indicamos posición y características de la luz
    light.position.set( -50, 280, 0 );
    light.distance = 1000;
    light.decay = 1.4;
    light.castShadow = true; //Que permita proyectar sombras
    light.shadow.bias = 0;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;

    this.add( light );
  }

  setLightIntensity (valor) {
    this.hemiLight.intensity = valor;
  }
  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  //Renderizador
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    return renderer;  
  }
  
  //Devuelve la cámara actual
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    if (this.CamaraSeguimientoON)
      return this.camera2;
    else 
      return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera2.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera2.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }


  //============================================= Movimiento / Animación =============================================
  crearGolpe(x,y,z, fuerza){
    //Apunte: la fuerza maxima es 96

    //Variables auxiliares
    var tiempo = 2000; //Tiempo que tarda en hacer el movimiento tras el golpe
    var toca = false; //Varibale para que no detecte varias colisiones con el mismo objeto debido a la velocidad de los frames
    var tocaBonus = false; //Varibale con función similar a la variable anterior pero para los elementos bonus, que siguen el movimiento tras tocarlos
    this.sePuedePulsarBarra = false; //Al hacer un golpe la barra queda inactiva

    //Establecemos distintos tiempos según la fuerza obtenida para ser más fidedignos con la realidad
    if (fuerza<24) tiempo = 1000;
    else if (fuerza>=28 && fuerza <= 72) tiempo = 1300;

    //Creación de distintos caminos/trayectorias según la fuerza (para ver si da o no varios botes la pelota)
    if(fuerza<=24){
      var linea = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,y,0),
        new THREE.Vector3((5*fuerza)/6,y,0),

      ]);
    }else if (fuerza >24 && fuerza <=48){
      var linea = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,y,0),
        new THREE.Vector3((2*fuerza)/6,y+(2*fuerza)/6,0),
        new THREE.Vector3((4*fuerza)/6,y+(4*fuerza)/6,0),
        new THREE.Vector3((6*fuerza)/6,y+(2*fuerza)/6,0),
        new THREE.Vector3((8*fuerza)/6,y+1,0),

        new THREE.Vector3((11*fuerza)/6,y,0),
      ]);
    }else if(fuerza>48 && fuerza <=72){
      var linea = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,y,0),
        new THREE.Vector3((2*fuerza)/6,y+(2*fuerza)/6,0),
        new THREE.Vector3((4*fuerza)/6,y+(4*fuerza)/6,0),
        new THREE.Vector3((6*fuerza)/6,y+(2*fuerza)/6,0),
        new THREE.Vector3((8*fuerza)/6,y+1,0),
  
        new THREE.Vector3((9*fuerza)/6,y+(2*fuerza)/12,0),
        new THREE.Vector3((10*fuerza)/6,y+(4*fuerza)/12,0),
        new THREE.Vector3((11*fuerza)/6,y+(2*fuerza)/12,0),     
        new THREE.Vector3((12*fuerza)/6,y+2,0),
 
        new THREE.Vector3((15*fuerza)/6,y,0),
      ]);
    }else if(fuerza>72 && fuerza<=96){
      var linea = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,y,0),
        new THREE.Vector3((2*fuerza)/6,y+(2*fuerza)/6,0),
        new THREE.Vector3((4*fuerza)/6,y+(4*fuerza)/6,0),
        new THREE.Vector3((6*fuerza)/6,y+(2*fuerza)/6,0),
        new THREE.Vector3((8*fuerza)/6,y,0),

        new THREE.Vector3((9*fuerza)/6,y+(2*fuerza)/12,0),
        new THREE.Vector3((10*fuerza)/6,y+(4*fuerza)/12,0),
        new THREE.Vector3((11*fuerza)/6,y+(2*fuerza)/12,0),     
        new THREE.Vector3((12*fuerza)/6,y+1,0),

        new THREE.Vector3((12.5*fuerza)/6,y+(2*fuerza)/24,0),
        new THREE.Vector3((13*fuerza)/6,y+(4*fuerza)/24,0),
        new THREE.Vector3((13.5*fuerza)/6,y+(2*fuerza)/24,0),     
        new THREE.Vector3((14*fuerza)/6,y+2,0),

        new THREE.Vector3((17*fuerza)/6,y,0),
      ]);
    }

    //Giramos el path según lo que se haya girado la cámara o la pelota y lo colocamos en donde esté la pelota
    var ejeDeGiro = new THREE.Vector3 (0,1,0);
    linea.points.forEach((p) => {
      p.applyAxisAngle(ejeDeGiro, this.pelota.rotation.y);
      p.x += x;
      p.z += z;
    });
  
    //Si está activada la ayuda podremos ver el path que debería seguir la pelota 
    if (this.ayuda){
      var geometryLine = new THREE.BufferGeometry();
      geometryLine.setFromPoints(linea.getPoints(80));

      var material = new THREE.LineBasicMaterial({color:0xff0000, linewidth:2});
      var lineaVisible = new THREE.Line(geometryLine, material);
      this.add(lineaVisible);
    }


    //Movimiento
    var origen1 = {p: 0};
    var dest1 = {p: 1};

    var mov = new TWEEN.Tween(origen1).to(dest1, tiempo).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=>{
        var pos = linea.getPointAt(origen1.p);
        this.pelota.position.copy(pos);
        var tangente = linea.getTangentAt(origen1.p);
        pos.add(tangente);
        if (!toca){ //Si no ha tocado elementos, que detecte colisiones
          var tocado = this.colisiones(this.pelota.position, tangente); //se le pasa la tangente que sigue la pelota en el path como vector direecional

          //Si toca un elemento bonus:
          if ((tocado == 1 || tocado == 2) && !tocaBonus) {
            //Para que pueda seguir viendo se si va a chocar con un arbol o agua
            tocaBonus = true;
            this.audioTrophy.play();
            this.contadorTexto.actualizaContador(-tocado); //Si es palo restara 1 golpe, si es trofeo tocado será 2 y restará 2 golpes

          //Si toca un árbol:
          }else if (tocado == 3) {
            toca = true;
            mov.stop();
            this.trasColisionArbol();
            this.audioChoqueArbol.play();
            this.golpeCompletado();

          //Si toca agua
          }else if (tocado == 4) {
            toca = true;
            this.audioAgua.play();
            toca = true;
            mov.stop();
            alert("Has tocado agua.\nPenalización de 2 golpes.\nVuelves a la ultima posición guardada.");
            this.contadorTexto.actualizaContador(2);   //No llamamos a golpe completado como en los otros, porque golpe completado nos actualiza la posición
            this.pelota.position.x = this.ultimaPos.x; // guardada la pelota tras el golpe, pero ahora queremos que la pelota nos vuela a la posición
            this.pelota.position.y = this.ultimaPos.y; // del último golpe dado
            this.pelota.position.z = this.ultimaPos.z;
            this.barra.barraActiva = true;
            this.sePuedePulsarBarra = true;

          //Si toca pared límite
          }else if (tocado == 5) {
            toca = true;
            mov.stop();
            alert("Pelota fuera de los límites.\nPenalización de 2 golpes.\nVuelves a la ultima posición guardada.");
            this.contadorTexto.actualizaContador(2);   //No llamamos a golpe completado como en los otros, porque golpe completado nos actualiza la posición
            this.pelota.position.x = this.ultimaPos.x; // guardada la pelota tras el golpe, pero ahora queremos que la pelota nos vuela a la posición
            this.pelota.position.y = this.ultimaPos.y; // del último golpe dado
            this.pelota.position.z = this.ultimaPos.z;
            this.barra.barraActiva = true;
            this.sePuedePulsarBarra = true;

          //Si toca la bandera
          }else if (tocado == 6) {
            toca = true;
            mov.stop();
            this.contadorTexto.actualizaContador(1);
            this.trasTocarBanderin();
          }
        }
        //Que además la pelora gire sobre si misma durante el movimiento
        this.pelota.rodar(origen1.p);
    });

    mov.start();
    mov.onComplete(()=>{
      this.golpeCompletado();
    });
  }

  //Función para volver a activar la barra, que se pueda volver a pulsar y que guarde la posición de la pelota
  golpeCompletado() {
    this.contadorTexto.actualizaContador(1);
    this.barra.barraActiva = true;
    this.sePuedePulsarBarra = true;
    this.ultimaPos.x = this.pelota.position.x;
    this.ultimaPos.y = this.pelota.position.y;
    this.ultimaPos.z = this.pelota.position.z;
    this.colisionArena(this.pelota.position); //Además comprobamos si estamos en un búnker de arena al terminar el golpe
  }

  //Simular que la pelota cae hacia abajo si tocó el árbol a cierta altura
  trasColisionArbol() {
    while (this.pelota.position.y > -0.54) {
      this.pelota.position.y -= 0.01;
    }
  }

  //Dejar caer la pelota y mostar audios y mensajes de victoria
  trasTocarBanderin() {
    for (var i = 0; i < 24; i++) {
      this.pelota.position.y -= 0.1;
    }

    this.audioHoyo.play();
    alert("GANASTE");
    this.audioFinal.play();
    this.contadorTexto.ganar();
  }


  //============================================= Colisiones =============================================
  colisiones(posicionPelota, vectorDireccionPelota){
    //Para colisiones con objetos
    var raycaster = new THREE.Raycaster(posicionPelota, vectorDireccionPelota, 0, 1.5);
    //Para comprobar si estamos encima de algo (agua o bandera)
    var raycaster2 = new THREE.Raycaster(posicionPelota, new THREE.Vector3(0,-1,0), 0, 1.8);

    //Para colisiones con la pared, la cual requiere un mayor vector por las amplias direcciones y que solo
    // compruebe con 'x' 'z', no es necesaria la 'y'
    var direccionRecta = new THREE.Vector3(Math.cos(this.pelota.rotation.y),0,-Math.sin(this.pelota.rotation.y));
    var raycasterPared = new THREE.Raycaster(posicionPelota, direccionRecta, 0, 4.5);

    //Arrays de las intersecciones
    var intersectsArboles = raycaster.intersectObjects(this.arrayArboles)
    var intersectsAgua = raycaster2.intersectObjects(this.arrayAgua);
    var intersectsParedes = raycasterPared.intersectObject(this.cielo);
    var intersectsTrofeo = raycaster.intersectObjects(this.arrayTrofeos);
    var intersectsPalo = raycaster.intersectObjects(this.arrayPalos);
    var intersectsBanderin = raycaster2.intersectObject(this.bandera.cajaEnglobante);

    if (intersectsPalo.length > 0) {
      this.remove(intersectsPalo[0].object.parent.parent);
      return 1;
    }

    if (intersectsTrofeo.length > 0) {
      this.remove(intersectsTrofeo[0].object.parent.parent);
      return 2;
    }

    if (intersectsArboles.length > 0) {
      return 3;
    }

    if (intersectsAgua.length > 0) {
      return 4;
    }

    if (intersectsParedes.length > 0) {
      return 5;
    }

    if (intersectsBanderin.length > 0) {
      return 6;
    }
    
    return 0;
  }

  colisionArena(posicionPelota) {
    //Para comprobar si estamos encima de la arena 
    var raycaster = new THREE.Raycaster(posicionPelota, new THREE.Vector3(0,-1,0), 0, 1.5);
    var intersectsArena = raycaster.intersectObjects(this.arrayArena);

    if (intersectsArena.length > 0) {
      this.barra.barraArena(true); //Si hubo colisiones, el movimiento de la  barra cambiará de forma que nos cueste más salir
    }else {
      this.barra.barraArena(false);
    }
  }


  //============================================= Eventos de teclado =============================================
  onKeyDown(event) {
    var tecla = event.which;

    //Si se pulsa la tecla espaciadora y la barra esta operativa, para la barra y crea el golpe
    if (String.fromCharCode(tecla) == " "){
      if (this.sePuedePulsarBarra){ 
        var fuerza = this.barra.pararBarra();
        this.audioGolpeBola.play();
        this.crearGolpe(this.pelota.position.x, this.pelota.position.y, this.pelota.position.z, fuerza);
      }

    //Si se pulsa la tecla 'c' cambia de cámara y en caso de cambiar a la camara libre, la recoloca y apunta a la pelota
    }else if (String.fromCharCode(tecla) == "C"){
      if (this.CamaraSeguimientoON) { 
        this.CamaraSeguimientoON = false;
        this.barra.visible = false; // Mientras estemos en esta cámara, no veremos la barra y el contador
        this.contadorTexto.visible = false;
        this.camera.position.z = this.pelota.position.z - 60;
        this.camera.position.y = this.pelota.position.y + 30;
        this.camera.position.x = this.pelota.position.x;
        this.camera.lookAt(new THREE.Vector3(this.pelota.position.x, 4, this.pelota.position.z));

      }else {
        this.CamaraSeguimientoON = true;
        this.barra.visible = true;
        this.contadorTexto.visible = true;
      }

    //Si pulsamos las flechas girará la pelota y por ende, la cámara
    }else if (tecla == KeyCode.KEY_LEFT) {
      this.pelota.rotation.y += Math.PI/40;
    }else if (tecla == KeyCode.KEY_RIGHT) {
      this.pelota.rotation.y -= Math.PI/40;

    //Si pulsamos la tecla 'p' pasaremos a modo auxiliar, que muestra cajas englobantes y dibujará en los 
    // siguientes golpes el path que sigue la pelota
    }else if (String.fromCharCode(tecla) == "P") {
      if (this.ayuda) {
        this.ayuda = false;
        for (var i = 0; i < this.arrayPalos.length; i++) {
          this.arrayPalos[i].visible = false;
        }
        for (var i = 0; i < this.arrayTrofeos.length; i++) {
          this.arrayTrofeos[i].visible = false;
        }
        this.bandera.cajaEnglobante.visible = false;
      }else {
        this.ayuda = true;
        for (var i = 0; i < this.arrayPalos.length; i++) {
          this.arrayPalos[i].visible = true;
        }
        for (var i = 0; i < this.arrayTrofeos.length; i++) {
          this.arrayTrofeos[i].visible = true;
        }
        this.bandera.cajaEnglobante.visible = true;
      }
    }
  }

  update () {
    /*if (this.stats) this.stats.update();*/
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Los controles de la cámara libre de vuelo
    var delta = this.clock.getDelta(); 
    this.flyControls.update(delta);

    // Se actualiza el resto de los modelos
    this.pajarillo.update();
    this.pajarillo2.update();
    this.pajarillo3.update();
    this.pajarillo4.update();

    this.barra.update();

    this.palillo.update();
    this.palillo2.update();
    this.palillo3.update();
    this.trophy.update();
    this.trophy2.update();

    TWEEN.update();
   
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update());
  }
}

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  window.addEventListener ("keydown", (event) => scene.onKeyDown(event));
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
