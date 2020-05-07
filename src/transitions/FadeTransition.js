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
        this.screenDuration = 0.4
        this.screenEase = 'linear'
    }

    async screenIn() {
        var leftScreens = document.getElementsByClassName('loading-screen-left')
        var rightScreens = document.getElementsByClassName('loading-screen-right')
        var tl
        for (var i = 0; i < leftScreens.length; i++) {
            tl = TweenMax.to(leftScreens[i], this.screenDuration, {
                left: 0,
                ease: this.screenEase,
            })
        }

        for (var i = 0; i < rightScreens.length; i++) {
            tl = TweenMax.to(rightScreens[i], this.screenDuration, {
                right: 0,
                ease: this.screenEase,
            })
        }

        // staggered
        // var tl = new TimelineMax({}).staggerTo(
        //     leftScreens,
        //     this.screenDuration,
        //     { left: 0 },
        //     this.screenDuration
        // )
        // var tl = new TimelineMax({}).staggerTo(
        //     rightScreens,
        //     this.screenDuration,
        //     { right: 0, delay: this.screenDuration / 2 },
        //     this.screenDuration
        // )

        await tl
    }

    async screenOut() {
        var leftScreens = document.getElementsByClassName('loading-screen-left')
        var rightScreens = document.getElementsByClassName('loading-screen-right')
        var tl

        for (var i = 0; i < leftScreens.length; i++) {
            tl = TweenMax.to(leftScreens[i], this.screenDuration, {
                left: '-100vw',
                ease: this.screenEase,
            })
        }

        for (var i = 0; i < rightScreens.length; i++) {
            tl = TweenMax.to(rightScreens[i], this.screenDuration, {
                right: '-100vw',
                ease: this.screenEase,
            })
        }

        // staggered
        // var tl = new TimelineMax({}).staggerTo(
        //     leftScreens,
        //     this.screenDuration,
        //     { left: '-100vw' },
        //     this.screenDuration
        // )
        // var tl = new TimelineMax({}).staggerTo(
        //     rightScreens,
        //     this.screenDuration,
        //     { right: '-100vw', delay: this.screenDuration / 2 },
        //     this.screenDuration
        // )

        await tl

        // reset bars
        for (var i = 0; i < leftScreens.length; i++) {
            tl = TweenMax.set(leftScreens[i], { left: '100vw' })
        }

        for (var i = 0; i < rightScreens.length; i++) {
            tl = TweenMax.set(rightScreens[i], { right: '100vw' })
        }
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
