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
        }

        function aboutMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

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

            var reflectionCube = loader.load([
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
            ])

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                color: 0xeeeeee,
                reflectivity: 0.04,
                skinning: true,
                wireframe: false,
            })
        }

        function contactMaterial(_this) {
            var loader = new THREE.CubeTextureLoader()

            var reflectionCube = loader.load([
                'assets/textures/standard/dogs.jpg',
                'assets/textures/standard/dogs.jpg',
                'assets/textures/standard/dogs.jpg',
                'assets/textures/standard/dogs.jpg',
                'assets/textures/standard/dogs.jpg',
                'assets/textures/standard/dogs.jpg',
            ])

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                skinning: true,
                color: 0xffffff,
                reflectivity: 1.0,
            })
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
            contactMaterial(this)
        }

        function landingMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            var reflectionCube = loader.load([
                'assets/textures/skyboxes/skybox1/right.jpg',
                'assets/textures/skyboxes/skybox1/left_no_sun.jpg',
                'assets/textures/skyboxes/skybox1/top.jpg',
                'assets/textures/skyboxes/skybox1/bottom.jpg',
                'assets/textures/skyboxes/skybox1/front.jpg',
                'assets/textures/skyboxes/skybox1/back.jpg',
            ])

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                reflectivity: 1.0,
            })
        }

        function aboutMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            if (window.innerWidth > 480) {
                var reflectionCube = loader.load([
                    'assets/textures/standard/static.jpg',
                    'assets/textures/standard/static.jpg',
                    'assets/textures/standard/static.jpg',
                    'assets/textures/standard/static.jpg',
                    'assets/textures/standard/static.jpg',
                    'assets/textures/standard/static.jpg',
                ])
            } else {
                // mobile
                var reflectionCube = loader.load([
                    'assets/textures/standard/static_dark.jpg',
                    'assets/textures/standard/static_dark.jpg',
                    'assets/textures/standard/static_dark.jpg',
                    'assets/textures/standard/static_dark.jpg',
                    'assets/textures/standard/static_dark.jpg',
                    'assets/textures/standard/static_dark.jpg',
                ])
            }

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                reflectivity: 1.0,
            })
        }

        function workMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            var reflectionCube = loader.load([
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
                'assets/textures/standard/shimmer.jpg',
            ])

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                envMap: reflectionCube,
                reflectivity: 0.66,
            })
        }

        function contactMaterial(_this) {
            const loader = new THREE.CubeTextureLoader()

            var reflectionCube = loader.load([
                'assets/textures/skyboxes/skybox1/right.jpg',
                'assets/textures/skyboxes/skybox1/left.jpg',
                'assets/textures/skyboxes/skybox1/top.jpg',
                'assets/textures/skyboxes/skybox1/bottom.jpg',
                'assets/textures/skyboxes/skybox1/front.jpg',
                'assets/textures/skyboxes/skybox1/back.jpg',
            ])

            reflectionCube.mapping = THREE.CubeReflectionMapping

            material = new THREE.MeshBasicMaterial({
                envMap: reflectionCube,
                reflectivity: 1.0,
            })
        }

        this.rock.material = material

        //add material to the dictionary of ready materials
        this.basicMaterialsReady[this.reflectionMaterialKey] = material
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
        // update animation
        if (this.mixer) this.mixer.update(dt)
    }
}
