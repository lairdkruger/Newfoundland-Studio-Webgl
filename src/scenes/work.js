/*
Work Scene
Handles set up and behaviour
*/
import * as THREE from 'three'

// objects
import Wolf from '../objects/Wolf'
import Skybox from '../objects/Skybox'

// lighting etc
import { addWorkLighting } from '../objects/lighting/WorkLighting'

// postprocessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

export default class WorkScene {
    constructor(webgl) {
        this.webgl = webgl

        this.sceneKey = 'workScene'

        // create a new scene
        this.webgl.scenes[this.sceneKey] = new THREE.Scene()

        // quicker to type
        this.scene = this.webgl.scenes[this.sceneKey]

        this.initScene()

        this.webgl.scenesParams[this.sceneKey] = this

        this.initScene()
    }

    initScene() {
        this.setCamera()
        addWorkLighting(this.scene)

        // objects
        this.workWolf = new Wolf(this.webgl, {
            scene: 'work',
            skyIndex: '8',
        })

        this.scene.add(this.workWolf)

        this.workSkybox = new Skybox(this.webgl, {
            scene: 'work',
            skyIndex: '12',
            noSun: false,
        })
        this.scene.add(this.workSkybox)
    }

    setCamera() {
        if (this.webgl.orbitControls) {
            this.webgl.orbitControls.position = [
                -0.2078281158005838,
                0.017467252995429144,
                -0.28874058085994647,
            ]
            this.webgl.orbitControls.distance = 0.5
            this.webgl.orbitControls.target = [0.2, 0, 0]
        } else {
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
        }
    }

    postprocessing() {
        // postprocessing
        this.webgl.composer = new EffectComposer(this.webgl.renderer)
    }
}
