import * as THREE from 'three'

export function addTopLighting(scene) {
    var topLight = new THREE.DirectionalLight(0xffffff, 1.0)
    topLight.position.set(-1, 1, -1)
    scene.add(topLight)
}
