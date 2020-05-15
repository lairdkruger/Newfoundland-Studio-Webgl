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
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { addTVPass } from '../objects/post/TVPass'
import { addGrainPassLite } from '../objects/post/GrainPassLite'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

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
            skyIndex: '15',
        })

        this.scene.add(this.aboutWolf)
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
        // essential basic render (required in all scenes)
        webgl.composer = new EffectComposer(webgl.renderer)
        var renderPass = new RenderPass(this.scene, webgl.camera)
        webgl.composer.addPass(renderPass)

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
