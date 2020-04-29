/*
Handles All Webgl Content
*/

import WebGLApp from './lib/WebGLApp'
import { addScreenshotButton } from './lib/SaveScreenshot'
import assets from './lib/AssetManager'

// scenes
import LandingScene from './scenes/landing'
import AboutScene from './scenes/about'
import WorkScene from './scenes/work'

// camera
import StaticCameraBehaviour from './objects/cameras/StaticCamera'

// transitions
import { sceneTransition } from './objects/cameras/SceneTransition'

window.DEBUG = window.location.search.includes('debug')

// grab our canvas
const canvas = document.querySelector('#webgl-canvas')
// webgl
var webgl
// attach it to the window to inspect in the console
if (window.DEBUG) {
    // debug is active when '?debug' is at the end of the URL
    // setup the WebGLRenderer for debug mode
    webgl = new WebGLApp({
        canvas,
        alpha: true,
        background: '#000',
        backgroundAlpha: 1,
        postprocessing: true,
        orbitControls: true,
    })
    window.webgl = webgl

    // add screenshot button to debug page
    addScreenshotButton(webgl)
} else {
    // settings for standard scene
    webgl = new WebGLApp({
        canvas,
        alpha: true,
        background: '#000',
        backgroundAlpha: 1,
        postprocessing: true,
        orbitControls: false,
    })
}

// hide canvas
webgl.canvas.style.visibility = 'hidden'

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
    // show canvas
    webgl.canvas.style.visibility = ''

    // init scenes
    const aboutScene = new AboutScene(webgl)
    const landingScene = new LandingScene(webgl)
    const workScene = new WorkScene(webgl)

    // set active scene and postprocessing
    // params include everything not in three.js
    webgl.currentScene = webgl.scenes['landingScene']
    webgl.currentSceneParams = webgl.scenesParams['landingScene']
    landingScene.postprocessing()

    var staticCameraBehaviour = new StaticCameraBehaviour(webgl)

    setTimeout(function () {
        sceneTransition(webgl, 'landingScene', 'workScene', function () {
            webgl.currentScene = webgl.scenes['workScene']
            webgl.currentSceneParams = webgl.scenesParams['workScene']
            webgl.camera.inTransition = false
            workScene.postprocessing()
        })
    }, 8000)

    setTimeout(function () {
        sceneTransition(webgl, 'workScene', 'aboutScene', function () {
            webgl.currentScene = webgl.scenes['aboutScene']
            webgl.currentSceneParams = webgl.scenesParams['aboutScene']
            webgl.camera.inTransition = false
            aboutScene.postprocessing()
        })
    }, 16000)

    setTimeout(function () {
        sceneTransition(webgl, 'aboutScene', 'landingScene', function () {
            webgl.currentScene = webgl.scenes['landingScene']
            webgl.currentSceneParams = webgl.scenesParams['landingScene']
            webgl.camera.inTransition = false
            landingScene.postprocessing()
        })
    }, 24000)

    console.log(webgl)

    // start animation loop
    webgl.start()
    webgl.draw()
})
