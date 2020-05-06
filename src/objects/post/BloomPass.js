import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

export function addBloomPass(webgl, scene, options) {
    var bloomPass = new UnrealBloomPass(
        options.resolution,
        options.strength, // strength
        options.radius, // radius
        options.threshold // threshold
    )

    webgl.composer.addPass(bloomPass)
}
