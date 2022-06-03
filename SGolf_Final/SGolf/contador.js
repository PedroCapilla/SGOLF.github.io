import * as THREE from '../../libs/three.module.js'

class Contador extends THREE.Object3D {
    constructor() {
		super();

		//Cómo nos costaba bastante mostrar texto en la escena, tras mucho buscar en internet y realizar intentos fallidos con 
		// bibliotecas específicas, decidimos quedarnos con un método de una página en ingles. No lo entendemos pero es lo último 
		// que hacemos en la práctica y cómo sólo es para mostrar texto... Hemos decidido adaptarlo a nuestra práctica
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');

		//Contador y el texto que lo muestra
		this.contador = 0;
		var textoAuxiliar = 'Golpes: ' + this.contador;
		this.textContador = this.addText(textoAuxiliar, 25);

		this.add(this.textContador)
    }

	actualizaContador(golpes) {
		this.contador += golpes;
		var textoAuxiliar = 'Golpes: ' + this.contador + '\nPulse "C" para cambiar modo de cámara. \nPulsa "P" para modo ayuda';
		this.remove(this.textContador); //Borro el texto actual
		this.textContador = this.addText(textoAuxiliar, 25); //Creo el nuevo texto actualizado
		this.add(this.textContador);  //Añado el nuevo texto
	}

	//Función para mostrar un mensaje de victoria con el número de golpes que hemos necesitado
	ganar() {
		var textoAuxiliar = 'GANASTE CON : ' + this.contador;
		this.remove(this.textContador);
		this.textContador = this.addText(textoAuxiliar, 25);
		this.add(this.textContador);
	}

	//Función de apoyo para addText
	roundUp(numToRound, multiple) {
		var value = multiple;
		while(value < numToRound) {
			value = value * multiple;
		}
		return value;
	}

	//Función para generar el texto
	addText(text, fontSize) {
		// 2d duty
		this.context.font = fontSize + "px Arial";

		var metrics = this.context.measureText(text);

		var textWidth = this.roundUp(metrics.width+20.0, 2);
		var textHeight = this.roundUp(fontSize+10.0, 2);
			
		this.canvas.width = textWidth;
		this.canvas.height = textHeight;

		this.context.font = "bold " + fontSize + "px Arial";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.context.fillStyle = "#ff0000";
		this.context.fillText(text, textWidth / 2, textHeight / 2);

		var texture = new THREE.Texture(this.canvas);
		texture.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide
			//color: 0xffffff,
			//useScreenCoordinates: false
		});

		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(textWidth/60, textHeight/60, 10, 10), material);
			
		mesh.position.y = 5;
		mesh.position.z = 5;
		mesh.position.x = 0;

		return mesh;
	}
}

export { Contador };