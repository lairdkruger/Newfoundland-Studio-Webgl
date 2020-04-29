// GSAP Library
import { TimelineMax } from 'gsap'

// Webgl Transitions
import webgl from '../lib/webgl'
import { sceneTransition } from './WebGLTransition'

// Scenes
import landingScene from '../scenes/landing'
import aboutScene from '../scenes/about'
import workScene from '../scenes/work'

const charming = require('charming')

// Fade
export default class FadeTransition {
    constructor() {}

    leave(data) {
        // get custom data set in html of trigger element
        var sceneKey = data.trigger.dataset.scene

        webgl.currentSceneParams.sceneKey = sceneKey

        console.log(webgl.currentSceneParams.sceneKey)

        sceneTransition(webgl, webgl.currentSceneParams.sceneKey, function () {
            webgl.currentScene = webgl.scenes[sceneKey]
            webgl.currentSceneParams = webgl.scenesParams[sceneKey]
            webgl.camera.inTransition = false
        })
    }

    enter() {
        // create your amazing enter animation here
        // console.log('enter')
        // let h1 = to.querySelector('h1')
        // charming(h1)
        // let spans = [...h1.querySelectorAll('span')]
        // from.remove()
        // new TimelineMax({ onComplete: done }).staggerFromTo(
        //     spans,
        //     0.5,
        //     { opacity: 0, y: 100 },
        //     { opacity: 1, y: 0 },
        //     0.05
        // )
    }
}
