import * as THREE from 'three'

// basic three.js component example

export default class Skybox extends THREE.Group {
    constructor(webgl, options) {
        super(options)
        // these can be used also in other methods
        this.webgl = webgl
        this.options = options

        // a dictionary mapping material keys to the material's shaders
        // allows for a modular method of adding custom shaders to existing materials
        this.shaders = {}

        // a dictionary mapping material keys to the material once material is ready
        // used to check if material is ready before updating
        this.shaderMaterialsReady = {}

        this.init()
    }

    init() {
        var _this = this

        this.skyMaterialKey = 'skyMaterial'

        const loader = new THREE.CubeTextureLoader()

        const skyBoxIndex = this.options.skyIndex

        this.skyBoxTexture = loader.load([
            'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
            'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left.png',
            'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
            'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
            'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
            'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
        ])

        //const geometry = new THREE.BoxGeometry(2000, 2000, 2000)
        const geometry = new THREE.SphereGeometry(200, 1, 1)
        const material = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            envMap: this.skyBoxTexture,
        })

        //https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderLib

        const customShader = [
            {
                from: '#include <common>',
                to: `
                #include <common>
                /* custom uniforms go here */

                uniform float uTime;
              `,
            },
            {
                from: '#include <color_fragment>',
                to: `
                #include <color_fragment>
                /* set diffuseColor.rgb here */

                {
                  float fluctuate = (sin(uTime) + 1.0) / 4.0;

                  diffuseColor.rgb = vec3(1.0, 1.0, 1.0);
                }
              `,
            },
        ]

        material.onBeforeCompile = function (shader) {
            customShader.forEach((rep) => {
                shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to)
            })

            // custom uniforms
            shader.uniforms.uTime = { value: 0.0 }

            // make material's shader accessible
            _this.shaders[_this.skyMaterialKey] = shader
            _this.shaderMaterialsReady[_this.skyMaterialKey] = material
        }

        const skyBox = new THREE.Mesh(geometry, material)

        this.add(skyBox)
    }

    updateUniforms(delta) {
        if (this.skyMaterialKey in this.shaderMaterialsReady) {
            this.shaders[this.skyMaterialKey].uniforms.uTime.value += delta
        }
    }

    update(dt, time) {
        this.updateUniforms(dt)
    }
}
