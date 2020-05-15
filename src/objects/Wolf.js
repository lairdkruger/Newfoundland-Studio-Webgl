import * as THREE from 'three'
import assets from '../lib/AssetManager'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// preload the models
const wolfKey = assets.queue({
    url: 'assets/obj/wolf.glb',
    type: 'gltf',
})

export default class Wolf extends THREE.Group {
    constructor(webgl, options) {
        super(options)
        this.webgl = webgl
        this.options = options

        // a dictionary mapping material keys to the material's shaders
        // allows for a modular method of adding custom shaders to existing materials
        this.shaders = {}

        // a dictionary mapping material keys to the material once material is ready
        // used to check if material is ready before updating
        this.basicMaterialsReady = {}
        this.shaderMaterialsReady = {}

        this.addGLTF(wolfKey)
    }

    addGLTF(key) {
        var _this = this

        // Instantiate a loader
        var loader = new GLTFLoader()

        // Load a glTF resource
        loader.load(
            // resource URL
            key,
            // called when the resource is loaded
            function (gltf) {
                _this.gltf = gltf
                _this.gltfScene = gltf.scene

                // scale and center object in scene
                var bbox = new THREE.Box3().setFromObject(_this.gltfScene)
                var cent = bbox.getCenter(new THREE.Vector3())
                var size = bbox.getSize(new THREE.Vector3())

                // rescale the object to normalized space
                var maxAxis = Math.max(size.x, size.y, size.z)
                _this.gltfScene.scale.multiplyScalar(1.0 / maxAxis)
                bbox.setFromObject(_this.gltfScene)
                bbox.getCenter(cent)
                bbox.getSize(size)

                // lower the scene slightly
                _this.gltfScene.position.y -= 0.1

                // add gtlf scene to the webgl scene (this)
                _this.add(_this.gltfScene)
                _this.gltfLoaded = true

                // label assets
                _this.wolf = _this.gltfScene.getObjectByName('Wolf')
                _this.wolfSkeleton = _this.gltfScene.getObjectByName('Wolf_Skeleton')
                _this.rock = _this.gltfScene.getObjectByName('Rock')

                _this.createMaterials()
                _this.initAnimations()
            },

            // called while loading is progressing
            function (xhr) {},

            // called when loading has errors
            function (error) {
                console.log(error)
            }
        )
    }

    createMaterials() {
        this.createWolfMaterial()
        this.createRockMaterial()
    }

    createWolfMaterial() {
        var _this = this
        var material

        this.wolfMaterialKey = 'wolfMaterial'

        if (this.options.scene == 'landing') {
            landingMaterial(_this)
        }

        if (this.options.scene == 'about') {
            aboutMaterial(_this)
        }

        if (this.options.scene == 'work') {
            workMaterial(_this)
        }

        if (this.options.scene == 'contact') {
            contactMaterial(_this)
        }

        function landingMaterial(_this) {
            material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                skinning: true,
                wireframe: false,
            })

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
                /*
                  float fluctuate = (sin(uTime) + 1.0) / 2.0;
                  diffuseColor.rgb = vec3(0.0, 0.0, 0.0);
                */
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
                _this.shaders[_this.wolfMaterialKey] = shader

                // add material to ready dictionary
                _this.shaderMaterialsReady[_this.wolfMaterialKey] = material
            }
        }

        function aboutMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            const skyBoxIndex = _this.options.skyIndex

            var reflectionCube = loader.load([
                'assets/textures/standard/colourBars_square.jpg',
                'assets/textures/standard/colourBars_square.jpg',
                'assets/textures/standard/colourBars_square.jpg',
                'assets/textures/standard/colourBars_square.jpg',
                'assets/textures/standard/colourBars_square.jpg',
                'assets/textures/standard/colourBars_square.jpg',
            ])

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                //map: texture,
                envMap: reflectionCube,
                reflectivity: 1.0,
                skinning: true,
            })
        }

        function workMaterial(_this) {
            var loader = new THREE.CubeTextureLoader()

            const skyBoxIndex = _this.options.skyIndex

            var reflectionCube = loader.load([
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
            ])

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                color: 0xeeeeee,
                reflectivity: 0.04,
                skinning: true,
                wireframe: false,
            })

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
                /*
                  float fluctuate = (sin(uTime) + 1.0) / 2.0;
                  diffuseColor.rgb = vec3(0.0, 0.0, 0.0);
                */
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
                _this.shaders[_this.wolfMaterialKey] = shader

                // add material to ready dictionary
                _this.shaderMaterialsReady[_this.wolfMaterialKey] = material
            }
        }

        function contactMaterial(_this) {
            var loader = new THREE.CubeTextureLoader()

            const skyBoxIndex = _this.options.skyIndex

            var reflectionCube = loader.load([
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
                'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
            ])

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                color: 0xeeeeee,
                reflectivity: 0.4,
                skinning: true,
                wireframe: false,
            })

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
                /*
                  float fluctuate = (sin(uTime) + 1.0) / 2.0;
                  diffuseColor.rgb = vec3(0.0, 0.0, 0.0);
                */
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
                _this.shaders[_this.wolfMaterialKey] = shader

                // add material to ready dictionary
                _this.shaderMaterialsReady[_this.wolfMaterialKey] = material
            }
        }

        // assign scene material to wolf
        this.wolf.material = material
    }

    createRockMaterial() {
        var _this = this
        this.reflectionMaterialKey = 'reflectionMaterial'
        var material

        if (this.options.scene == 'landing') {
            landingMaterial(this)
        }

        if (this.options.scene == 'about') {
            aboutMaterial(this)
        }

        if (this.options.scene == 'work') {
            workMaterial(this)
        }

        if (this.options.scene == 'contact') {
            landingMaterial(_this)
        }

        function landingMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            const skyBoxIndex = _this.options.skyIndex

            if (_this.options.noSun) {
                var reflectionCube = loader.load([
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left_no_sun.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
                ])
            } else {
                var reflectionCube = loader.load([
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
                ])
            }

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                reflectivity: 1.0,
            })
        }

        function aboutMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            var reflectionCube = loader.load([
                'assets/textures/standard/static.jpg',
                'assets/textures/standard/static.jpg',
                'assets/textures/standard/static.jpg',
                'assets/textures/standard/static.jpg',
                'assets/textures/standard/static.jpg',
                'assets/textures/standard/static.jpg',
            ])

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                reflectivity: 1.0,
            })
        }

        function workMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            const skyBoxIndex = _this.options.skyIndex

            if (_this.options.noSun) {
                var reflectionCube = loader.load([
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left_no_sun.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
                ])
            } else {
                var reflectionCube = loader.load([
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/right.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/left.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/top.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/bottom.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/front.png',
                    'assets/textures/skyboxes/starscape' + skyBoxIndex + '/back.png',
                ])
            }

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                envMap: reflectionCube,
                reflectivity: 0.66,
            })
        }

        this.rock.material = material

        //add material to the dictionary of ready materials
        this.basicMaterialsReady[this.reflectionMaterialKey] = material
    }

    updateUniforms(delta) {
        if (this.wolfMaterialKey in this.shaderMaterialsReady) {
            this.shaders[this.wolfMaterialKey].uniforms.uTime.value += delta
        }
    }

    initAnimations() {
        this.mixer = new THREE.AnimationMixer(this.gltfScene)
        this.clips = this.gltf.animations

        this.rockPoseClip = THREE.AnimationClip.findByName(this.clips, 'Rock Pose FK')
        this.rockPoseAction = this.mixer.clipAction(this.rockPoseClip)

        this.rockPoseAction.play()
    }

    onPointerDown(event, [x, y]) {}

    onPointerMove(event, [x, y]) {}

    onPointerUp(event, [x, y]) {}

    update(dt, time) {
        this.updateUniforms(dt)

        // update animation
        if (this.mixer) this.mixer.update(dt)
    }
}
