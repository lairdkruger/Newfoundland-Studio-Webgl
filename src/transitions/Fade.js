// Import Highway
import Highway from '@dogstudio/highway'

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
class Fade extends Highway.Transition {
    out({ from, trigger, done }) {
        var activeScene = trigger.dataset.scene

        webgl.currentSceneParams.sceneKey = [activeScene]

        new TimelineMax({
            onComplete: done,
        }).to(from, 0.5, {
            opacity: 0.5,
        })

        sceneTransition(webgl, webgl.currentSceneParams.sceneKey, function () {
            webgl.currentScene = webgl.scenes[activeScene]
            webgl.currentSceneParams = webgl.scenesParams[activeScene]
            webgl.camera.inTransition = false
            // activeScene.postprocessing()

            console.log(webgl)
        })
    }

    in({ from, to, trigger, done }) {
        //console.log(trigger)

        let h1 = to.querySelector('h1')
        charming(h1)

        let spans = [...h1.querySelectorAll('span')]

        from.remove()

        new TimelineMax({ onComplete: done }).staggerFromTo(
            spans,
            0.5,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0 },
            0.05
        )
    }
}

export default Fade
