/*
Contact Scene
Handles set up and behaviour

Singleton: 
    is created on first import
    can be referenced in other modules via import
*/

import * as THREE from 'three'

// global webgl singleton
import webgl from '../lib/webgl'

// postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { addBloomPass } from '../objects/post/BloomPass'
import { addGrainPassLite } from '../objects/post/GrainPassLite'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

// lighting
import { addBackLighting } from '../objects/lighting/BackLighting'

class ContactScene {
    constructor() {
        this.sceneKey = 'contactScene'

        // create a new scene
        webgl.scenes[this.sceneKey] = new THREE.Scene()

        // quicker to type
        this.scene = webgl.scenes[this.sceneKey]

        this.initScene()

        webgl.scenesParams[this.sceneKey] = this
    }

    initScene() {
        this.setCamera()
        addBackLighting(this.scene)

        // 7 12 16
        this.sky = '16'

        // objects
        this.contactWolf = new Wolf(webgl, {
            scene: 'contact',
            skyIndex: this.sky,
            noSun: false,
        })

        this.scene.add(this.contactWolf)

        this.contactSkybox = new Skybox(webgl, {
            scene: 'contact',
            skyIndex: this.sky,
        })

        this.scene.add(this.contactSkybox)
    }

    setCamera() {
        if (webgl.orbitControls) {
            webgl.orbitControls.position = [
                1.1770132413546304,
                0.657532091665101,
                0.04683957130027806,
            ]
            webgl.orbitControls.distance = 1.240000000000002
            webgl.orbitControls.target = [0, -0.2, 0]
        } else {
            this.cameraPosition = {
                x: 0.2,
                y: -0.2,
                z: -0.2,
            }

            this.cameraTarget = {
                x: 0.0,
                y: -0.5,
                z: 0.05,
            }
        }
    }

    postprocessing() {
        // postprocessing
        webgl.composer = new EffectComposer(webgl.renderer)
        addBloomPass(webgl, this.scene, {
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            strength: 1.2,
            radius: 0.5,
            threshold: 0.7,
        })

        addGrainPassLite(webgl, {})
    }
}

export default new ContactScene()
