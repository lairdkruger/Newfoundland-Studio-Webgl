// GSAP Library
import { TimelineMax } from 'gsap'
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
    }

    async screenIn() {
        var screen = document.getElementsByClassName('loading-screen')[0]

        var tl = TweenLite.to(screen, { left: 0, duration: 0.5 })
        await tl
    }

    async screenOut() {
        var screen = document.getElementsByClassName('loading-screen')[0]
        var tl = TweenLite.to(screen, { left: '-100vw', duration: 0.5 })
        await tl
        screen.style.left = '100vw' // reset loading screen
    }

    async leave(data) {
        var _this = this

        // H1 animate out
        var h1 = data.current.container.querySelectorAll('h1')
        if (h1) {
            for (var i = 0; i < h1.length; i++) {
                var el = h1[i]
                charming(el)
                var spans = [...el.querySelectorAll('span')]
                new TimelineMax({}).staggerFromTo(
                    spans,
                    0.4,
                    { opacity: 1, y: 0 },
                    { opacity: 0, y: 25 },
                    0.04
                )
            }
        }

        // anchor links animate out
        var a = data.current.container.querySelectorAll('a')
        if (a) {
            for (var i = 0; i < a.length; i++) {
                var el = a[i]
                charming(el)
                var spans = [...el.querySelectorAll('span')]
                new TimelineMax({}).staggerFromTo(spans, 0.5, { opacity: 1 }, { opacity: 0 }, 0.02)
            }
        }

        // H3 animate out
        var h3 = data.current.container.querySelectorAll('h3')
        if (h3) {
            for (var i = 0; i < h3.length; i++) {
                var el = h3[i]
                charming(el)
                var spans = [...el.querySelectorAll('span')]
                new TimelineMax({}).staggerFromTo(
                    spans,
                    0.4,
                    { opacity: 1, y: 0 },
                    { opacity: 0, y: 25 },
                    0.01
                )
            }
        }

        // H2 animate out
        var h2 = data.current.container.querySelectorAll('h2')
        if (h2) {
            for (var i = 0; i < h2.length; i++) {
                var el = h2[i]
                TweenMax.to(el, 0.5, { opacity: 0 })
            }
        }

        // p animate out
        var p = data.current.container.querySelectorAll('p')
        if (p) {
            for (var i = 0; i < p.length; i++) {
                var el = p[i]
                TweenMax.to(el, 0.5, { opacity: 0 })
            }
        }

        var everything = data.current.container
        if (everything) {
            TweenMax.to(everything, 0.8, { delay: 0.5, opacity: 0 })
        }

        // Webgl animation
        // get custom data set in html of trigger element
        var sceneKey = data.trigger.dataset.scene

        webgl.currentSceneParams.sceneKey = sceneKey

        await sceneTransition(webgl, webgl.currentSceneParams.sceneKey, this.webglDuration)

        async function setNewScene() {
            webgl.currentScene = webgl.scenes[sceneKey]
            webgl.currentSceneParams = webgl.scenesParams[sceneKey]
            webgl.camera.inTransition = false
        }

        // Screen in before material update
        await this.screenIn()

        // Updates new scene (materials change here)
        await setNewScene()
    }

    async enter(data) {
        // Screen out after material update

        this.screenOut()
    }
}
