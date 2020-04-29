/*
Simple Noise/Film-Grain Shader
- Laird Kruger
*/

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export function addGrainPassLite(webgl, options) {
    var grainPassLite = new ShaderPass(grainLiteShader)

    grainPassLite.uniforms.movement.value = 0.1
    grainPassLite.uniforms.intensity.value = 0.1

    webgl.composer.addPass(grainPassLite)

    webgl.onUpdate((dt, time) => updateGrainLiteUniforms(dt))

    function updateGrainLiteUniforms(dt) {
        grainPassLite.uniforms.movement.value += dt
    }
}

var grainLiteShader = {
    uniforms: {
        tDiffuse: { value: null }, //pixel color passed over by previous shader
        movement: { value: 0.0 }, //custom float value
        intensity: { value: 0.0 }, //custom float value
    },

    vertexShader: [
        'varying vec2 vUv;',

        'void main() {',
        'vUv = uv;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

        '}',
    ].join('\n'),

    fragmentShader: [
        'uniform sampler2D tDiffuse;',
        'uniform float movement;',
        'uniform float intensity;',

        'varying vec2 vUv;',

        'float random( vec2 p ) {',
        'vec2 K1 = vec2(23.14069263277926, 2.665144142690225);',
        'return fract( cos( dot(p,K1) ) * 12345.6789 );',
        '}',

        'void main() {',

        'vec4 color = texture2D( tDiffuse, vUv );',
        'vec2 uvRandom = vUv;',
        'uvRandom.y *= random( vec2(uvRandom.y,movement) );',
        'color.rgb += random( uvRandom ) * intensity;',
        'gl_FragColor = vec4( color );',

        '}',
    ].join('\n'),
}
