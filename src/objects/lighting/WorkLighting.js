import * as THREE from 'three'

export function addWorkLighting(scene) {
    const workLight = new THREE.DirectionalLight(0xffffff, 1.0)
    workLight.position.set(1, 1, 1)
    scene.add(workLight)
}
