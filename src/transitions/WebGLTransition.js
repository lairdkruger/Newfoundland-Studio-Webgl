import { TweenLite } from 'gsap'

export function sceneTransition(webgl, sceneKey, afterTransition) {
    if (window.DEBUG) return
    webgl.camera.inTransition = true

    var duration = 2.5
    var ease = 'power4.inOut'

    var scene = webgl.scenesParams[sceneKey]

    var cameraTarget = {
        x: webgl.cameraTarget.x,
        y: webgl.cameraTarget.y,
        z: webgl.cameraTarget.z,
    }

    // tween between the two pivot targets of each scene
    var directionTween = TweenLite.to(cameraTarget, 2, {
        x: scene.cameraTarget.x,
        y: scene.cameraTarget.y,
        z: scene.cameraTarget.z,
        duration: duration,
        ease: ease,
    })

    // tween the camera to its new position
    var cameraTween = TweenLite.to(webgl.camera.position, 2, {
        x: scene.cameraPosition.x,
        y: scene.cameraPosition.y,
        z: scene.cameraPosition.z,
        onUpdate: function () {
            webgl.camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
        },
        onComplete: function () {
            afterTransition()
        },
        duration: duration,
        ease: ease,
    })
}
