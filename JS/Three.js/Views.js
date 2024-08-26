import { camera, controlos } from './Scene.js';

import * as constants from '../constants.js';

const frontView = document.getElementById("frontView");
frontView.addEventListener("click", function(){
    placeCamera(constants.frontPosition.x, constants.frontPosition.y, constants.frontPosition.z);
});

const leftView = document.getElementById("leftView");
leftView.addEventListener("click", function(){
    placeCamera(constants.leftPosition.x, constants.leftPosition.y, constants.leftPosition.z);
    
});

const rightView = document.getElementById("rightView");
rightView.addEventListener("click", function(){
    placeCamera(constants.rightPosition.x, constants.rightPosition.y, constants.rightPosition.z);
});

const home = document.getElementById("home");
home.addEventListener("click", function(){
    placeCamera(constants.initialPosition.x,constants.initialPosition.y,constants.initialPosition.z)
});

function placeCamera(x,y,z){
    camera.position.x = x
    camera.position.y = y
    camera.position.z = z
    camera.lookAt(constants.lookAtPosition.x,constants.lookAtPosition.y,constants.lookAtPosition.z)
    controlos.target.set(constants.lookAtPosition.x,constants.lookAtPosition.y,constants.lookAtPosition.z);
    controlos.update(x,y,z)
}