/*
Handles all site behaviour
*/
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
    window.WEBGL = true

    // init default for browser back button
    webgl.previousSceneKeyTemp = 'landingScene'

    var fadeTransition = new FadeTransition()

    barba.init({
        debug: false,
        preventRunning: true, // prevent double clicking
        transitions: [
            // setting transitions between pages
            {
                name: 'default-transition',
                async beforeLeave(data) {
                    if (data.trigger == 'forward') {
                        // just take users home
                        window.location.href = '../'
                    } else if (data.trigger != 'back') {
                        webgl.previousSceneKeyTemp = webgl.currentSceneParams.sceneKey
                        webgl.previousScenes.push(webgl.previousSceneKeyTemp)
                    }
                },

                async leave(data) {
                    await fadeTransition.leave(data)
                },

                async enter(data) {
                    await fadeTransition.enter(data)
                },

                async afterEnter(data) {},
            },
        ],
        views: [
            // for updating settings specific to each page
            // {
            //     namespace: 'home',
            //     async beforeEnter(data) {
            //         landingScene.postprocessing()
            //     },
            // },
            // {
            //     namespace: 'about',
            //     async beforeEnter(data) {
            //         aboutScene.postprocessing()
            //     },
            // },
            // {
            //     namespace: 'work',
            //     async beforeEnter(data) {
            //         workScene.postprocessing()
            //     },
            // },
            // {
            //     namespace: 'contact',
            //     async beforeEnter(data) {
            //         contactScene.postprocessing()
            //     },
            // },
        ],
    })

    // set active scene and postprocessing
    // currentSceneParams include everything not in three.js
    webgl.currentScene = webgl.scenes['landingScene']
    webgl.currentSceneParams = webgl.scenesParams['landingScene']

    const staticCameraBehaviour = new StaticCameraBehaviour(webgl)

    // start animation loop
    webgl.start()
    webgl.draw()
})
