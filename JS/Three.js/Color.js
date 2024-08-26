import * as THREE from 'three';
import { getObject, corDoObjetoSelecionado, corDoObjeto, objetoAtual } from './Scene.js';

const colorSelect = document.getElementById("productColor");
let colorMaterial;

colorSelect.addEventListener("input", () => {
    applyColorToObject(colorSelect.value)
})

async function applyColorToObject(color){
    getObject().then(object => {
        object.material.color = new THREE.Color(color)
        colorMaterial = color;
        corDoObjetoSelecionado.set(color);
        if(object == objetoAtual){
            corDoObjeto.set(color);
        }
    })
}

export { applyColorToObject }
export { colorMaterial }