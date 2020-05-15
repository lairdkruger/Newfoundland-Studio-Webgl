// GSAP Library
import { TweenMax } from 'gsap'
import { TweenLite } from 'gsap'

// Webgl Transitions
import webgl from '../lib/webgl'
import { sceneTransition } from './WebGLTransition'

const charming = require('charming')

// Fade
export default class FadeTransition {
    constructor() {
        this.webglDuration = 2000
        this.screenDuration = 0.5
    }

    async screenIn() {}

    async screenOut() {
        var screen = document.getElementsByClassName('loading-screen')[0]
        var tl = TweenLite.to(screen, {
            opacity: 0,
            duration: this.screenDuration,
            ease: 'Linear.easeNone',
        })
        await tl
        screen.style.display = 'none' // reset loading screen
        screen.style.opacity = 1 // reset loading screen
    }

    async leave(data) {
        var _this = this

        var everything = data.current.container
        if (everything) {
            TweenMax.to(everything, 0.8, { opacity: 0 })
        }

        // Webgl animation
        // get custom data set in html of trigger element
        var sceneKey = null // default
        if (data.trigger == 'back') {
            // browser back button was clicked
            sceneKey = webgl.previousScenes.pop()
        } else {
            // link was an anchor (not the back button)
            sceneKey = data.trigger.dataset.scene
        }

        await sceneTransition(webgl, sceneKey, this.webglDuration)

        async function setNewScene() {
            webgl.currentScene = webgl.scenes[sceneKey]
            webgl.currentSceneParams = webgl.scenesParams[sceneKey]
            webgl.camera.inTransition = false
        }

        function renderToImage() {
            var imageDataURL = webgl.renderer.domElement.toDataURL('image/png')
            var loadingScreen = document.getElementsByClassName('loading-screen')[0]
            loadingScreen.src = imageDataURL
            loadingScreen.style.display = 'block'
        }

        // Updates new scene (materials change here)
        await setNewScene()

        // Render old scene in new camera position
        renderToImage()
    }

    async enter(data) {
        // Screen out after material update

        // Fade out the render of the old scene
        this.screenOut()
    }
}
