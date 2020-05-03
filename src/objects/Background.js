import * as THREE from 'three'

// basic three.js component example

export default class Background extends THREE.Group {
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

        this.backgroundMaterialKey = 'backgroundMaterial'

        var width = 85
        var height = 50
        var segments = 1

        var geometry = new THREE.PlaneGeometry(width, height, segments)

        var texture = new THREE.TextureLoader().load('assets/textures/standard/retroBackground.jpg')

        var material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            map: texture,
            side: THREE.DoubleSide,
        })

        //https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderLib

        var plane = new THREE.Mesh(geometry, material)

        plane.position.z = -50
        plane.position.x = -25
        plane.rotation.y = 0.5

        this.add(plane)
    }
}
