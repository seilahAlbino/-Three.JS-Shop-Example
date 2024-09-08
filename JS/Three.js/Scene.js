import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import * as constants from '../constants.js';

const scene = new THREE.Scene()
const meuCanvas = document.getElementById( 'meuCanvas')
const renderer = new THREE.WebGLRenderer({canvas: meuCanvas})

renderer.shadowMap.enabled = true

const carregador = new GLTFLoader()
const misturador = new THREE.AnimationMixer(scene)

let object;

let objetos = {
    gavetas: [],
    estrutura: []
}

let todos = [];
let animations = []

let iniciou = false;
carregador.load(
    'blender/SGI.glb',
    function ( gltf ) {
    
    scene.add( gltf.scene )

    scene.traverse( function (currentObject) {
        if(currentObject.isMesh){
            currentObject.castShadow = true;
            currentObject.receiveShadow = true;
        }

        switch(currentObject.name){
            case "Base_cama_pequena":
            case "Base_pequena_grande_":
            case "Encosto":
            case "Movel_TV":
            case "TVWall":
                objetos.estrutura.push(currentObject); 
                break;
            case "Gaveta1Pequena": 
            case "Gaveta2Pequena_": 
            case "GavetaGrande":
                objetos.gavetas.push(currentObject);
                break;
        }

        if(currentObject.name == "Desk_Handle_04"){
            addScripts();
            let clipe = THREE.AnimationClip.findByName( gltf.animations, 'TVAction' )
            animations.push({isPlaying: false, animation: misturador.clipAction(clipe)})
            clipe = THREE.AnimationClip.findByName( gltf.animations, 'TVWallAction' )
            animations.push({isPlaying: false, animation: misturador.clipAction(clipe)})
            clipe = THREE.AnimationClip.findByName( gltf.animations, 'MantaAction' )
            animations.push({isPlaying: false, animation: misturador.clipAction(clipe)})
            clipe = THREE.AnimationClip.findByName( gltf.animations, 'Gaveta1PequenaAction' )
            animations.push({isPlaying: false, animation: misturador.clipAction(clipe)})
            clipe = THREE.AnimationClip.findByName( gltf.animations, 'Gaveta2Pequena Action' )
            animations.push({isPlaying: false, animation: misturador.clipAction(clipe)})
            clipe = THREE.AnimationClip.findByName( gltf.animations, 'GavetaGrandeAction' )
            animations.push({isPlaying: false, animation: misturador.clipAction(clipe)})

            iniciou = true;
            todos = todos.concat(objetos.gavetas, objetos.estrutura);

            animations[2].animation.clampWhenFinished = true;
            animations[2].animation.setLoop(THREE.LoopOnce);
            animations[2].animation.play()
        }
    });

    setTimeout(() => {
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 1000);
    }
)

/*                     Add Scripts                     */
function addScripts(){
    const script1 = document.createElement('script');
    script1.type = 'module'; 
    script1.src = 'JS/Three.js/Color.js';
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.type = 'module'; 
    script2.src = 'JS/Three.js/Material.js';
    document.head.appendChild(script2);
    const script3 = document.createElement('script');
    script3.type = 'module'; 
    script3.src = 'JS/Three.js/Views.js';
    document.head.appendChild(script3);
    const script4 = document.createElement('script');
    script4.type = 'module';
    script4.src = 'JS/Three.js/Light.js';
    document.head.appendChild(script4);

}

/*                     Camera                     */
let camera = new THREE.PerspectiveCamera( 70, constants.width / constants.height, 0.1, 500 )

camera.position.x = constants.initialPosition.x;
camera.position.y = constants.initialPosition.y;
camera.position.z = constants.initialPosition.z;
camera.lookAt( constants.lookAtPosition.x, constants.lookAtPosition.y, constants.lookAtPosition.z )

let controlos = new OrbitControls( camera, renderer.domElement )

controlos.maxPolarAngle = Math.PI / constants.angle;
controlos.maxDistance = constants.maxDistance;
controlos.minDistance = constants.minDistance;

controlos.enablePan = false;
/*                     Camera                     */

const renderPass = new RenderPass(scene, camera);

const outlinePassHover = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePassHover.visibleEdgeColor.set(constants.outlineColor); 
outlinePassHover.edgeStrength = constants.edgeStrength;

const outlinePassSelected = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePassSelected.visibleEdgeColor.set(constants.outlineColor); 
outlinePassSelected.edgeStrength = constants.edgeStrength; 

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(outlinePassHover);
composer.addPass(outlinePassSelected);


const raycaster = new THREE.Raycaster();
let objetoAtual;
let corDoObjeto;

function handleHover(event) {
    if(!iniciou) return;

    const canvasBounds = meuCanvas.getBoundingClientRect();

    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    const mouseVector = new THREE.Vector2(mouseX, mouseY);
    
    raycaster.setFromCamera(mouseVector, camera);

    const intersects = raycaster.intersectObjects(todos);

    if (intersects.length > 0) {
        if(objetoAtual === intersects[0].object){
            return;
        }
                
        objetoAtual = intersects[0].object;
        corDoObjeto = new THREE.Color().copy(objetoAtual.material.color);

        outlinePassHover.selectedObjects = [objetoAtual];
    }else{
        if(objetoAtual == null){
            return;
        }

        if(objetoAtual === object){
            return;
        }

        outlinePassHover.selectedObjects = []
        objetoAtual = null;
    }
  }

  const colorSelect = document.getElementById("productColor");
  const materialSelect = document.getElementById("materialSelect");
  let corDoObjetoSelecionado;

  function handleClick(event) {
    if(!iniciou) return;

    const canvasBounds = meuCanvas.getBoundingClientRect();

    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    const mouseVector = new THREE.Vector2(mouseX, mouseY);
    
    raycaster.setFromCamera(mouseVector, camera);

    const intersects = raycaster.intersectObjects(todos);

    if (intersects.length > 0) {    
        if(object === intersects[0].object){
            return;
        }

        if(object != null){
            object.material.color = corDoObjetoSelecionado;
        }
        
        object = intersects[0].object;

        corDoObjetoSelecionado = new THREE.Color().copy(corDoObjeto);
        colorSelect.value = '#' + corDoObjetoSelecionado.getHexString()
        materialSelect.value = object.material.userData.name;

        outlinePassSelected.selectedObjects = [object]
    }else {
        if (object != null) {
            outlinePassSelected.selectedObjects = []
            object = null;
        }
    }
  }
  
  meuCanvas.addEventListener('mousemove', handleHover);
  meuCanvas.addEventListener('click', handleClick);

/* ANIMACOES */
function handleAnimation(...animation){
    animation.forEach(anim => {
        if(!anim.isPlaying){
            anim.isPlaying = true;
            anim.animation.paused = false;
            anim.animation.timeScale = 1;
            anim.animation.clampWhenFinished = true;
            anim.animation.setLoop(THREE.LoopOnce);
            anim.animation.play();
        }else{
            anim.isPlaying = false;
            anim.animation.timeScale = -1;
            anim.animation.paused = false;
            anim.animation.clampWhenFinished = true;
            anim.animation.setLoop(THREE.LoopOnce);
            anim.animation.play();
        }
    });
}

let tvButton = document.getElementById("TVAction");
tvButton.addEventListener("click", function () {
    handleAnimation(animations[0], animations[1]);
});

let drawerButton = document.getElementById("DRAWERAction");
drawerButton.addEventListener("click", function () {
    handleAnimation(animations[5]);
});

let drawerLeftButton = document.getElementById("DRAWERLEFTAction");
drawerLeftButton.addEventListener("click", function () {
    handleAnimation(animations[4]);
});

let drawerRightButton = document.getElementById("DRAWERRIGHTAction");
drawerRightButton.addEventListener("click", function () {
    handleAnimation(animations[3]);
});
/* ANIMACOES */

renderer.setSize( constants.width, constants.height )

let delta = 0;
const relogio = new THREE.Clock()
const latencia_minima = 1/60

const pixelRatio = window.devicePixelRatio;

composer.setSize(constants.width * pixelRatio, constants.height * pixelRatio);

function animar() {
    requestAnimationFrame( animar )

    delta += relogio.getDelta()

    if (delta < latencia_minima)
        return;

    misturador.update(Math.floor(delta / latencia_minima)* latencia_minima)
    renderer.render(scene, camera)
    composer.render();
    delta = delta % latencia_minima

}
animar()

const getObject = () => {
    return new Promise((resolve, reject) => {
        if(object){
            resolve(object);
        }
    });
};

export { getObject }
export { scene, camera, controlos, objetos, corDoObjeto, objetoAtual, corDoObjetoSelecionado};