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

// HIGHWAY FOR TRANSTIONS
import Highway from '@dogstudio/highway'
import Fade from './transitions/fade.js'

// Call Highway.Core once.
const H = new Highway.Core({
    transitions: {
        default: Fade,
    },
})

window.DEBUG = window.location.search.includes('debug')

// grab our canvas
const canvas = document.querySelector('#webgl-canvas')

// hide canvas
webgl.canvas.style.visibility = 'hidden'

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
    // show canvas
    webgl.canvas.style.visibility = ''

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
