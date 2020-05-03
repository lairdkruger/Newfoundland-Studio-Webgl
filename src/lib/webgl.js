/*
Exports an instance of WebGLApp as a singleton
This acts partly like a global variable
To reference this instance in another file use: import webgl from './lib/webgl'
*/

import WebGLApp from './WebGLApp'

// grab our canvas
const canvas = document.querySelector('#webgl-canvas')

export default new WebGLApp({
    canvas,
    alpha: true,
    background: '#000',
    backgroundAlpha: 1,
    postprocessing: true,
    orbitControls: false,
})
