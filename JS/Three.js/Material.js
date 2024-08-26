import * as THREE from 'three';
import { getObject, objetos } from './Scene.js';
import { applyColorToObject } from './Color.js';

import * as constants from '../constants.js';

const materials = {
    Knotty: { name: "Madeira 1", material: null, path: "/wood/knotty" },
    Streaky: { name: "Madeira 2", material: null, path: "/wood/streaky" },
    Cheap: { name: "Madeira 3", material: null, path: "/wood/cheap" },
    Charcoal: { name: "Madeira 4", material: null, path: "/wood/charcoal" },
    Bamboo: { name: "Madeira 5", material: null, path: "/wood/bamboo" },
    Futuristic: { name: "Metal 1", material: null, path: "/metal/futuristic" },
    Filthy: { name: "Metal 2", material: null, path: "/metal/filthy" },
    Siding: { name: "Metal 3", material: null, path: "/metal/siding" },
}

const materialSelect = document.getElementById("materialSelect");

function initIcons(){ 
    const normalScale = new THREE.Vector2(2,2);

    for (const [key, value] of Object.entries(materials)) {
       
       const path = `./materials/${value.path}`;
       const option = document.createElement('option');
       
       option.value = key;
       option.text = materials[key].name;
       if(materialSelect.childElementCount == 0){
        option.selected = true;
       }
       materialSelect.appendChild(option);

       materials[key].material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(path+'/albedo.png'),
        normalMap: new THREE.TextureLoader().load(path+'/normalmap.png'),
        normalScale: normalScale,
    });

    materials[key].material.userData  = {name: key};
    }
    
    for(const estrutura of objetos.estrutura){
        estrutura.material = materials.Bamboo.material.clone();
    }

    for(const gaveta of objetos.gavetas){
        gaveta.material = materials.Knotty.material.clone();
    }
};

const colorSelect = document.getElementById("productColor");

materialSelect.addEventListener('change', function() {
    applyMaterialToObject(materials[materialSelect.value], colorSelect.value)
})

async function applyMaterialToObject(material, color){
    getObject().then(object => {
        object.material = material.material.clone();
        applyColorToObject(color);
    })
}

initIcons()

/* RESET */
const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", () => {
    $('#resetConfirmationModal').modal('show');
});

const confirmResetButton = document.getElementById("confirmResetButton");

confirmResetButton.addEventListener("click", () => {
    for(const estrutura of objetos.estrutura){
        estrutura.material = materials.Bamboo.material.clone();
        estrutura.material.color = new THREE.Color(constants.defaultColor)
    }

    for(const gaveta of objetos.gavetas){
        gaveta.material = materials.Knotty.material.clone();
        gaveta.material.color = new THREE.Color(constants.defaultColor)
    }
    
    $('#resetConfirmationModal').modal('hide');
});