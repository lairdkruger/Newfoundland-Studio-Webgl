import * as THREE from 'three'

export function addBackLighting(scene) {
    var backLight = new THREE.DirectionalLight(0xffffff, 1.0)
    backLight.position.set(-1, 0.0, -1)
    scene.add(backLight)
}
