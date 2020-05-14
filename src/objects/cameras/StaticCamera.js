import * as THREE from 'three'

export default class StaticCameraBehaviour {
    constructor(webgl) {
        this.webgl = webgl

        // initial positions
        this.staticPosition = this.webgl.currentSceneParams.cameraPosition
        this.webgl.cameraTarget = this.webgl.currentSceneParams.cameraTarget

        // easing and params
        this.easeTarget = new THREE.Vector3()
        this.movementIntensity = 0.1
        this.ease = 0.05

        this.init()
    }

    init() {
        var _this = this

        if (!window.DEBUG) {
            this.webgl.onUpdate((dt, time) => _this.updateCamera())
        }
    }

    updateCamera() {
        if (!this.webgl.camera.inTransition) {
            this.staticPosition = this.webgl.currentSceneParams.cameraPosition
            this.webgl.cameraTarget = this.webgl.currentSceneParams.cameraTarget

            var mouseX = this.webgl.mouse2D.x * this.movementIntensity
            var mouseY = this.webgl.mouse2D.y * this.movementIntensity

            this.easeTarget.x += (mouseX - this.easeTarget.x) * this.ease
            this.easeTarget.y += (mouseY - this.easeTarget.y) * this.ease
            this.easeTarget.z += (mouseX - this.easeTarget.z) * this.ease

            this.webgl.camera.position.x = this.staticPosition.x - this.easeTarget.x
            this.webgl.camera.position.y = this.staticPosition.y - this.easeTarget.y
            this.webgl.camera.position.z = this.staticPosition.z - this.easeTarget.z

            this.webgl.camera.lookAt(
                this.webgl.cameraTarget.x,
                this.webgl.cameraTarget.y,
                this.webgl.cameraTarget.z
            )
        } else {
            // reset values for jumpless animation
            this.webgl.mouse2D.x = 0
            this.webgl.mouse2D.y = 0

            this.easeTarget.x = 0
            this.easeTarget.y = 0
            this.easeTarget.z = 0
        }
    }
}
