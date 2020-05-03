/*
Handles all site behaviour
*/

import { addScreenshotButton } from './lib/SaveScreenshot'
import assets from './lib/AssetManager'

// create a singleton instance of webgl (called 'webgl')
import webgl from './lib/webgl'

// create singleton scenes
import landingScene from './scenes/landing'
import aboutScene from './scenes/about'
import workScene from './scenes/work'

// camera
import StaticCameraBehaviour from './objects/cameras/StaticCamera'

// barba for transitions
import barba from '@barba/core'
import FadeTransition from './transitions/fade.js'

window.DEBUG = window.location.search.includes('debug')

// hide canvas
webgl.canvas.style.visibility = 'hidden'

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
    // show canvas
    webgl.canvas.style.visibility = ''

    function delay(n) {
        n = n || 2000
        return new Promise((done) => {
            setTimeout(() => {
                done()
            }, n)
        })
    }

    var fadeTransition = new FadeTransition()

    barba.init({
        debug: true,
        transitions: [
            // setting transitions between pages
            {
                name: 'default-transition',
                async leave(data) {
                    const done = this.async()
                    fadeTransition.leave(data)
                    await delay(2000)
                    done()
                },

                enter: (data) => fadeTransition.enter(data),
            },
        ],
        views: [
            // for updating settings specific to each page
            {
                namespace: 'home',
                async afterEnter(data) {
                    landingScene.postprocessing()
                },
            },

            {
                namespace: 'about',
                async afterEnter(data) {
                    aboutScene.postprocessing()
                },
            },

            {
                namespace: 'work',
                async afterEnter(data) {
                    workScene.postprocessing()
                },
            },
        ],
    })

    // set active scene and postprocessing
    // currentSceneParams include everything not in three.js
    webgl.currentScene = webgl.scenes['landingScene']
    webgl.currentSceneParams = webgl.scenesParams['landingScene']
    landingScene.postprocessing()

    var staticCameraBehaviour = new StaticCameraBehaviour(webgl)

    console.log(webgl)

    // start animation loop
    webgl.start()
    webgl.draw()
})
