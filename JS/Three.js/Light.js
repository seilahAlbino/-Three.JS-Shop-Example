import * as THREE from 'three';
import { scene } from './Scene.js';

import * as constants from '../constants.js';

let lights = [];

InitLights(constants.defaultIntensity, true, 
    new THREE.Vector3(0,3,2));

/* CANDEEIRO */
const pos = constants.candeeiroPosition;

var geometry = new THREE.SphereGeometry(0.06, 32, 32);
var material = new THREE.MeshBasicMaterial();
var sphere = new THREE.Mesh(geometry, material);

sphere.material.color = new THREE.Color(constants.candeeiroColor)
sphere.position.set(constants.candeeiroPosition.x,constants.candeeiroPosition.y,constants.candeeiroPosition.z);
scene.add(sphere);


let light1 = new THREE.SpotLight(constants.candeeiroLightColor, 3.0, 25.0, Math.PI / 7.0, 0.5, 1.0);
light1.position.set(pos.x,pos.y,pos.z);
light1.castShadow = true;
light1.target.position.set(pos.x, -1, pos.z)
scene.add(light1);

const helper = new THREE.SpotLightHelper( light1, 5 );
/* CANDEEIRO */


const ambientLight = new THREE.AmbientLight("white",2); 
scene.add(ambientLight);

function InitLights(intensity, castShadow, ...lightPosition){
    lightPosition.forEach(singlePos => {
        let light = new THREE.PointLight("white");

        light.position.set(singlePos.x, singlePos.y, singlePos.z);
        light.intensity = intensity;
        light.castShadow = castShadow;

        scene.add(light);
        lights.push(light);
    });
}

function UpdateLightIntensity(intensity){
    lights.forEach(light => {
        light.intensity = intensity;
    })
}