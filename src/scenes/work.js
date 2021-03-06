/*
Work Scene
Handles set up and behaviour

Singleton: 
    is created on first import
    can be referenced in other modules via import
*/

import * as THREE from 'three'
import webgl from '../lib/webgl'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

// lighting etc
import { addWorkLighting } from '../objects/lighting/WorkLighting'

// postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { addBloomPass } from '../objects/post/BloomPass'
import { addGrainPassLite } from '../objects/post/GrainPassLite'

class WorkScene {
    constructor() {
        this.sceneKey = 'workScene'

        // create a new scene
        webgl.scenes[this.sceneKey] = new THREE.Scene()

        // quicker to type
        this.scene = webgl.scenes[this.sceneKey]

        this.initScene()

        webgl.scenesParams[this.sceneKey] = this
    }

    initScene() {
        this.setCamera()
        addWorkLighting(this.scene)

        // objects
        // 10, 6, 17 16
        this.workWolf = new Wolf(webgl, {
            scene: 'work',
        })

        this.scene.add(this.workWolf)

        this.workSkybox = new Skybox(webgl, {
            scene: 'work',
        })
        this.scene.add(this.workSkybox)
    }

    setCamera() {
        if (webgl.orbitControls) {
            webgl.orbitControls.position = [
                -0.2078281158005838,
                0.017467252995429144,
                -0.28874058085994647,
            ]
            webgl.orbitControls.distance = 0.5
            webgl.orbitControls.target = [0.2, 0, 0]
        } else {
            if (window.innerWidth > 480) {
                this.cameraPosition = {
                    x: -0.2,
                    y: 0.2,
                    z: -0.2,
                }

                this.cameraTarget = {
                    x: 0.2,
                    y: 0.02,
                    z: -0.05,
                }
            } else {
                // mobile
                this.cameraPosition = {
                    x: -0.65,
                    y: 0.3,
                    z: -0.4,
                }

                this.cameraTarget = {
                    x: 0.2,
                    y: 0.02,
                    z: -0.05,
                }
            }
        }
    }

    postprocessing() {
        // postprocessing
        // essential basic render (required in all scenes)
        webgl.composer = new EffectComposer(webgl.renderer)
        var renderPass = new RenderPass(this.scene, webgl.camera)
        webgl.composer.addPass(renderPass)

        addBloomPass(webgl, this.scene, {
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            strength: 0.8,
            radius: 0.5,
            threshold: 0.7,
        })

        addGrainPassLite(webgl, {})
    }
}

export default new WorkScene()
