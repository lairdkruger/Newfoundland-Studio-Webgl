import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { ConeBufferGeometry } from 'three'

export function addTVPass(webgl, options) {
    var tvPass = new ShaderPass(TVShader)
    tvPass.uniforms.distortion.value = options.distortion
    tvPass.uniforms.distortion2.value = options.distortion2
    tvPass.uniforms.speed.value = options.speed
    tvPass.uniforms.rollSpeed.value = options.rollSpeed

    webgl.composer.addPass(tvPass)

    var grainPass = new ShaderPass(tvShader)
    webgl.composer.addPass(grainPass)

    webgl.onUpdate((dt, time) => updateTVUniforms(dt))

    function updateTVUniforms(dt) {
        tvPass.uniforms.time.value += dt
    }
}

/**
 * @author Felix Turner / www.airtight.cc / @felixturner
 *
 * Bad TV Shader
 * Simulates a bad TV via horizontal distortion and vertical roll
 * Uses Ashima WebGl Noise: https://github.com/ashima/webgl-noise
 *
 * Uniforms:
 * time: steadily increasing float passed in
 * distortion: amount of thick distortion
 * distortion2: amount of fine grain distortion
 * speed: distortion vertical travel speed
 * rollSpeed: vertical roll speed
 *
 * The MIT License
 *
 * Copyright (c) Felix Turner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

var TVShader = {
    uniforms: {
        tDiffuse: { type: 't', value: null },
        time: { type: 'f', value: 0.0 },
        distortion: { type: 'f', value: 3.0 },
        distortion2: { type: 'f', value: 5.0 },
        speed: { type: 'f', value: 0.2 },
        rollSpeed: { type: 'f', value: 0.1 },
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
        'uniform float time;',
        'uniform float distortion;',
        'uniform float distortion2;',
        'uniform float speed;',
        'uniform float rollSpeed;',
        'varying vec2 vUv;',

        // Start Ashima 2D Simplex Noise

        'vec3 mod289(vec3 x) {',
        '  return x - floor(x * (1.0 / 289.0)) * 289.0;',
        '}',

        'vec2 mod289(vec2 x) {',
        '  return x - floor(x * (1.0 / 289.0)) * 289.0;',
        '}',

        'vec3 permute(vec3 x) {',
        '  return mod289(((x*34.0)+1.0)*x);',
        '}',

        'float snoise(vec2 v)',
        '  {',
        '  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0',
        '                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)',
        '                     -0.577350269189626,  // -1.0 + 2.0 * C.x',
        '                      0.024390243902439); // 1.0 / 41.0',
        '  vec2 i  = floor(v + dot(v, C.yy) );',
        '  vec2 x0 = v -   i + dot(i, C.xx);',

        '  vec2 i1;',
        '  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
        '  vec4 x12 = x0.xyxy + C.xxzz;',
        ' x12.xy -= i1;',

        '  i = mod289(i); // Avoid truncation effects in permutation',
        '  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))',
        '		+ i.x + vec3(0.0, i1.x, 1.0 ));',

        '  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
        '  m = m*m ;',
        '  m = m*m ;',

        '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
        '  vec3 h = abs(x) - 0.5;',
        '  vec3 ox = floor(x + 0.5);',
        '  vec3 a0 = x - ox;',

        '  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );',

        '  vec3 g;',
        '  g.x  = a0.x  * x0.x  + h.x  * x0.y;',
        '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
        '  return 130.0 * dot(m, g);',
        '}',

        // End Ashima 2D Simplex Noise

        'void main() {',

        'vec2 p = vUv;',
        'float ty = time*speed;',
        'float yt = p.y - ty;',
        //smooth distortion
        'float offset = snoise(vec2(yt*3.0,0.0))*0.2;',
        // boost distortion
        'offset = offset*distortion * offset*distortion * offset;',
        //add fine grain distortion
        'offset += snoise(vec2(yt*50.0,0.0))*distortion2*0.001;',
        //combine distortion on X with roll on Y
        'gl_FragColor = texture2D(tDiffuse,  vec2(fract(p.x + offset),fract(p.y-time*rollSpeed) ));',

        '}',
    ].join('\n'),
}

var tvShader = {
    uniforms: {
        tDiffuse: { type: 't', value: null },
        time: { type: 'f', value: 0.0 },
        nIntensity: { type: 'f', value: 0.5 },
        sIntensity: { type: 'f', value: 0.05 },
        sCount: { type: 'f', value: 4096 },
        grayscale: { type: 'i', value: 0 },
    },

    vertexShader: [
        'varying vec2 vUv;',

        'void main() {',

        'vUv = uv;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

        '}',
    ].join('\n'),

    fragmentShader: [
        // control parameter
        'uniform float time;',

        'uniform bool grayscale;',

        // noise effect intensity value (0 = no effect, 1 = full effect)
        'uniform float nIntensity;',

        // scanlines effect intensity value (0 = no effect, 1 = full effect)
        'uniform float sIntensity;',

        // scanlines effect count value (0 = no effect, 4096 = full effect)
        'uniform float sCount;',

        'uniform sampler2D tDiffuse;',

        'varying vec2 vUv;',

        'void main() {',

        // sample the source
        'vec4 cTextureScreen = texture2D( tDiffuse, vUv );',

        // make some noise
        'float x = vUv.x * vUv.y * time *  1000.0;',
        'x = mod( x, 13.0 ) * mod( x, 123.0 );',
        'float dx = mod( x, 0.01 );',

        // add noise
        'vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );',

        // get us a sine and cosine
        'vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );',

        // add scanlines
        'cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;',

        // interpolate between source and result by intensity
        'cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );',

        // convert to grayscale if desired
        'if( grayscale ) {',

        'cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );',

        '}',

        'gl_FragColor =  vec4( cResult, cTextureScreen.a );',

        '}',
    ].join('\n'),
}
