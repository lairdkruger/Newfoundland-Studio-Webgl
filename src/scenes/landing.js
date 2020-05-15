/*
Landing Scene
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
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { addBloomPass } from '../objects/post/BloomPass'
import { addGrainPassLite } from '../objects/post/GrainPassLite'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

// lighting
import { addBackLighting } from '../objects/lighting/BackLighting'

class LandingScene {
    constructor() {
        this.sceneKey = 'landingScene'

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

        // objects
        this.landingWolf = new Wolf(webgl, {
            scene: 'landing',
            noSun: true,
        })

        this.scene.add(this.landingWolf)

        this.landingSkybox = new Skybox(webgl, {
            scene: 'landing',
        })

        this.scene.add(this.landingSkybox)
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
        // essential basic render (required in all scenes)
        webgl.composer = new EffectComposer(webgl.renderer)
        var renderPass = new RenderPass(this.scene, webgl.camera)
        webgl.composer.addPass(renderPass)

        addBloomPass(webgl, this.scene, {
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            strength: 1.2,
            radius: 0.5,
            threshold: 0.7,
        })

        addGrainPassLite(webgl, {})
    }
}

export default new LandingScene()
