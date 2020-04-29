/*
Landing Scene
Handles set up and behaviour

Singleton: 
    is created on first import
    can be referenced in other modules via import
*/

import * as THREE from 'three'
import webgl from '../lib/webgl'

// postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { addBloomPass } from '../objects/post/BloomPass'
import { addRGBPass } from '../objects/post/RGBPass'
import { addGrainPassLite } from '../objects/post/GrainPassLite'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

// lighting
import { addBackLighting } from '../objects/lighting/BackLighting'

class LandingScene {
    constructor(webgl) {
        this.webgl = webgl

        this.sceneKey = 'landingScene'

        // create a new scene
        this.webgl.scenes[this.sceneKey] = new THREE.Scene()

        // quicker to type
        this.scene = this.webgl.scenes[this.sceneKey]

        this.initScene()

        this.webgl.scenesParams[this.sceneKey] = this
    }

    initScene() {
        this.setCamera()
        addBackLighting(this.scene)

        // objects
        this.landingWolf = new Wolf(this.webgl, {
            scene: 'landing',
            skyIndex: '3',
            noSun: true,
        })

        this.scene.add(this.landingWolf)

        this.landingSkybox = new Skybox(this.webgl, {
            scene: 'landing',
            skyIndex: '3',
        })

        this.scene.add(this.landingSkybox)
    }

    setCamera() {
        if (this.webgl.orbitControls) {
            this.webgl.orbitControls.position = [
                1.1770132413546304,
                0.657532091665101,
                0.04683957130027806,
            ]
            this.webgl.orbitControls.distance = 1.240000000000002
            this.webgl.orbitControls.target = [0, -0.2, 0]
        } else {
            this.cameraPosition = {
                x: 1.1,
                y: 0.55,
                z: 0.02,
            }

            this.cameraTarget = {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            }
        }
    }

    postprocessing() {
        // postprocessing
        this.webgl.composer = new EffectComposer(this.webgl.renderer)
        addBloomPass(this.webgl, this.scene, {
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            strength: 0.8,
            radius: 0.5,
            threshold: 0.7,
        })

        addRGBPass(this.webgl, {
            amount: 0.002,
            angle: 0.0,
        })

        addGrainPassLite(this.webgl, {})
    }
}

export default new LandingScene(webgl)
