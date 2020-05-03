/*
About Scene
Handles set up and behaviour

Singleton: 
    is created on first import
    can be referenced in other modules via import
*/

import * as THREE from 'three'
import webgl from '../lib/webgl'

// postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { addTVPass } from '../objects/post/TVPass'
import { addGrainPassLite } from '../objects/post/GrainPassLite'

import { addBloomPass } from '../objects/post/BloomPass'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'
import Background from '../objects/Background'

// lighting etc
import { addTopLighting } from '../objects/lighting/TopLighting'

class AboutScene {
    constructor() {
        this.sceneKey = 'aboutScene'

        // create a new scene
        webgl.scenes[this.sceneKey] = new THREE.Scene()

        // quicker to type
        this.scene = webgl.scenes[this.sceneKey]

        this.initScene()

        webgl.scenesParams[this.sceneKey] = this
    }

    initScene() {
        this.setCamera()
        addTopLighting(this.scene)

        // objects
        this.aboutWolf = new Wolf(webgl, {
            scene: 'about',
            skyIndex: '13',
        })

        this.scene.add(this.aboutWolf)

        // this.aboutBackground = new Background(webgl, {
        //     scene: 'about',
        // })

        // this.scene.add(this.aboutBackground)
    }

    setCamera() {
        if (webgl.orbitControls) {
            webgl.orbitControls.position = [
                0.37272409090935477,
                -0.032702695716682634,
                0.4033570652813696,
            ]
            webgl.orbitControls.distance = 0.5
            webgl.orbitControls.target = [0.2, 0, 0]
        } else {
            this.cameraPosition = {
                x: 0.4,
                y: 0.0,
                z: 0.4,
            }

            this.cameraTarget = {
                x: 0.0,
                y: 0.0,
                z: -0.4,
            }
        }
    }

    postprocessing() {
        // postprocessing
        webgl.composer = new EffectComposer(webgl.renderer)

        addBloomPass(webgl, this.scene, {
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            strength: 0.0,
            radius: 0.5,
            threshold: 0.7,
        })

        addTVPass(webgl, {
            distortion: 0.8,
            distortion2: 1.0,
            speed: 0.5,
            rollSpeed: 0.0,
        })

        addGrainPassLite(webgl, {})
    }
}

export default new AboutScene()
