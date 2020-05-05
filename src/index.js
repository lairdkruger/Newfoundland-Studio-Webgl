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
import contactScene from './scenes/contact'

// camera
import StaticCameraBehaviour from './objects/cameras/StaticCamera'

// barba for transitions
import barba from '@barba/core'
import FadeTransition from './transitions/FadeTransition.js'

window.DEBUG = window.location.search.includes('debug')

// hide canvas
webgl.canvas.style.visibility = 'hidden'

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
    // show canvas
    webgl.canvas.style.visibility = ''

    var fadeTransition = new FadeTransition()

    barba.init({
        debug: true,
        preventRunning: true, // prevent double clicking
        transitions: [
            // setting transitions between pages
            {
                name: 'default-transition',
                async leave(data) {
                    await fadeTransition.leave(data)
                },

                async enter(data) {
                    await fadeTransition.enter(data)
                },
            },
            {
                name: 'instant-transition',
                to: {
                    namespace: ['about'],
                },
                async leave(data) {
                    await fadeTransition.leave(data)
                },

                async enter(data) {
                    await fadeTransition.enter(data)
                },
            },
        ],
        views: [
            // for updating settings specific to each page
            {
                namespace: 'home',
                async beforeEnter(data) {
                    landingScene.postprocessing()
                },
            },

            {
                namespace: 'about',
                async beforeEnter(data) {
                    aboutScene.postprocessing()
                },
            },

            {
                namespace: 'work',
                async beforeEnter(data) {
                    workScene.postprocessing()
                },
            },

            {
                namespace: 'contact',
                async beforeEnter(data) {
                    contactScene.postprocessing()
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
