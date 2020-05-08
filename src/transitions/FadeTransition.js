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
        this.screenDuration = 0.3
    }

    async screenIn() {
        // set up elements
        var doughnut = document.getElementsByClassName('doughnut')[0]
        doughnut.style.display = 'block'

        var doughnutSize = 0
        var height = window.innerHeight
        var width = window.innerWidth

        // set doughnut size fill screen (still be circular)
        if (width > height) {
            doughnutSize = Math.sqrt(width ** 2 + width ** 2)
        } else {
            doughnutSize = Math.sqrt(height ** 2 + height ** 2)
        }

        var tl = TweenLite.to(doughnut, this.screenDuration, {
            borderTopWidth: doughnutSize / 2,
            borderRightWidth: doughnutSize / 2,
            borderBottomWidth: doughnutSize / 2,
            borderLeftWidth: doughnutSize / 2,
        })
        await tl
    }

    async screenOut() {
        var oldScreen = document.getElementsByClassName('doughnut')[0]
        oldScreen.style.display = 'none'
        var tl = TweenLite.set(oldScreen, {
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
        })

        var newScreen = document.getElementsByClassName('doughnut-out')[0]
        newScreen.style.display = 'block'

        var doughnutSize = 0

        var height = window.innerHeight
        var width = window.innerWidth

        // set doughnut size fill screen (still be circular)
        var borderSize = Math.sqrt((height / 2) ** 2 + (width / 2) ** 2)

        if (width > height) {
            doughnutSize = Math.sqrt(width ** 2 + width ** 2)
        } else {
            doughnutSize = Math.sqrt(height ** 2 + height ** 2)
        }

        var tweenTarget = String(borderSize * 2) + 'px'

        var tl = TweenMax.to(document.documentElement, {
            '--innerRadius': tweenTarget,
            duration: this.screenDuration,
        })

        await tl

        // reset elements
        newScreen.style.display = 'none'
        var tl = TweenMax.set(document.documentElement, {
            '--innerRadius': 0,
        })
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
