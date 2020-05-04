// GSAP Library
import { TimelineMax } from 'gsap'
import { TweenMax } from 'gsap'

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
    constructor() {
        this.webglDuration = 2000
    }

    //converts viewport units to pixels (like "50vw" or "20vh" into pixels)
    toPX(value) {
        return (
            (parseFloat(value) / 100) *
            (/vh/gi.test(value) ? window.innerHeight : window.innerWidth)
        )
    }

    screenIn(data) {
        var _this = this
        var screens = document.getElementsByClassName('loading-screen')[0]
        new TimelineMax({}).fromTo(screens, 0.4, { x: 500 }, { x: 0 }, 0.04)
    }

    screenOut(data) {
        var _this = this
        var screens = document.getElementsByClassName('loading-screen')[0]
        new TimelineMax({}).fromTo(screens, 0.4, { x: 0 }, { x: -500 }, 0.04)
    }

    leave(data) {
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
                new TimelineMax({}).staggerFromTo(spans, 0.5, { opacity: 1 }, { opacity: 0 }, 0.04)
            }
        }

        // H2 animate out
        // p animate out
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

        // Webgl animation
        // get custom data set in html of trigger element
        var sceneKey = data.trigger.dataset.scene

        webgl.currentSceneParams.sceneKey = sceneKey

        sceneTransition(webgl, webgl.currentSceneParams.sceneKey, this.webglDuration, function () {
            webgl.currentScene = webgl.scenes[sceneKey]
            webgl.currentSceneParams = webgl.scenesParams[sceneKey]
            webgl.camera.inTransition = false
        })
    }

    enter(data) {
        // H1 animate in
        // var h1 = data.next.container.querySelectorAll('h1')
        // if (h1) {
        //     for (var i = 0; i < h1.length; i++) {
        //         var el = h1[i]
        //         charming(el)
        //         var spans = [...el.querySelectorAll('span')]
        //         new TimelineMax({}).staggerFromTo(
        //             spans,
        //             0.4,
        //             { opacity: 0, y: -25 },
        //             { opacity: 1, y: 0 },
        //             0.04
        //         )
        //     }
        // }
        // // anchor links animate in
        // var a = data.next.container.querySelectorAll('a')
        // if (a) {
        //     for (var i = 0; i < a.length; i++) {
        //         var el = a[i]
        //         charming(el)
        //         var spans = [...el.querySelectorAll('span')]
        //         new TimelineMax({}).staggerFromTo(spans, 0.5, { opacity: 0 }, { opacity: 1 }, 0.04)
        //     }
        // }
        // // H2 animate in
        // var h2 = data.next.container.querySelectorAll('h2')
        // if (h2) {
        //     for (var i = 0; i < h2.length; i++) {
        //         var el = h2[i]
        //         charming(el, {
        //             split: function (string) {
        //                 // Word by word
        //                 return string.split(/(\s+)/)
        //             },
        //         })
        //         var spans = [...el.querySelectorAll('span')]
        //         new TimelineMax({}).staggerFromTo(spans, 0.5, { opacity: 0 }, { opacity: 1 }, 0.04)
        //     }
        // }
        // // p animate in
        // var p = data.next.container.querySelectorAll('p')
        // if (p) {
        //     for (var i = 0; i < p.length; i++) {
        //         var el = p[i]
        //         new TimelineMax({}).fromTo(el, 1.0, { opacity: 0 }, { opacity: 1 })
        //     }
        // }
    }
}
