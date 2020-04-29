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

    var fadeTransition = new FadeTransition()

    barba.init({
        transitions: [
            {
                name: 'default-transition',
                async leave(data) {
                    fadeTransition.leave(data)
                },
                async enter() {
                    console.log(webgl)
                    //fadeTransition.enter()
                },
            },
        ],
        views: [
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

    console.log(fadeTransition)

    // set active scene and postprocessing
    // params include everything not in three.js
    webgl.currentScene = webgl.scenes['landingScene']
    webgl.currentSceneParams = webgl.scenesParams['landingScene']
    landingScene.postprocessing()

    var staticCameraBehaviour = new StaticCameraBehaviour(webgl)

    console.log(webgl)

    // start animation loop
    webgl.start()
    webgl.draw()
})
