import * as THREE from 'three'; // importar todos sob o nome THREE

/* Canvas */
export const width = 800;
export const height = 600;

/* Camera Positions */
export const initialPosition = new THREE.Vector3(2,2,1);
export const lookAtPosition = new THREE.Vector3(-0.3, 0, -0.7);


/* Controls Config */
export const angle = 2.1;
export const maxDistance = 6;
export const minDistance = 2.6;

/* Outline */
export const edgeStrength = 4;
export const outlineColor = 0xffffff;

/* Views */
export const frontPosition = new THREE.Vector3(-0.3,1.8,2.5);
export const leftPosition = new THREE.Vector3(-2.6,1.0,-0.7);
export const rightPosition = new THREE.Vector3(2.4,1.0,-0.7);

/* Lights */
export const defaultIntensity = 15;

export const candeeiroPosition = new THREE.Vector3(-3.3, 1.57, 1.51);
export const candeeiroLightPosition = new THREE.Vector3(0.06, 32, 32);
export const candeeiroColor = "#F2E459";
export const candeeiroLightColor = "yellow";

/* Materials */
export const defaultColor = "#ffffff";