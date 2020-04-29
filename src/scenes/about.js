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
import { addBloomPass } from '../objects/post/BloomPass'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

// lighting etc
import { addTopLighting } from '../objects/lighting/TopLighting'

class AboutScene {
    constructor(webgl) {
        this.webgl = webgl

        this.sceneKey = 'aboutScene'

        // create a new scene
        this.webgl.scenes[this.sceneKey] = new THREE.Scene()

        // quicker to type
        this.scene = this.webgl.scenes[this.sceneKey]

        this.initScene()

        this.webgl.scenesParams[this.sceneKey] = this
    }

    initScene() {
        this.setCamera()
        addTopLighting(this.scene)

        // objects
        this.aboutWolf = new Wolf(this.webgl, {
            scene: 'about',
            skyIndex: '10',
        })

        this.scene.add(this.aboutWolf)

        this.aboutSkybox = new Skybox(this.webgl, {
            scene: 'about',
            skyIndex: '10',
            noSun: false,
        })

        this.scene.add(this.aboutSkybox)
    }

    setCamera() {
        if (this.webgl.orbitControls) {
            this.webgl.orbitControls.position = [
                0.37272409090935477,
                -0.032702695716682634,
                0.4033570652813696,
            ]
            this.webgl.orbitControls.distance = 0.5
            this.webgl.orbitControls.target = [0.2, 0, 0]
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
        this.webgl.composer = new EffectComposer(this.webgl.renderer)

        addBloomPass(this.webgl, this.scene, {
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            strength: 2.0,
            radius: 1.0,
            threshold: 0.7,
        })
    }
}

export default new AboutScene(webgl)
