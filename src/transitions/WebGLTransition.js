import { TweenLite } from 'gsap'

export async function sceneTransition(webgl, sceneKey, duration) {
    if (window.DEBUG) return
    webgl.camera.inTransition = true

    var duration = duration / 1000
    var ease = 'power4.inOut'

    var scene = webgl.scenesParams[sceneKey]

    var cameraTarget = {
        x: webgl.cameraTarget.x,
        y: webgl.cameraTarget.y,
        z: webgl.cameraTarget.z,
    }

    // tween between the two pivot targets of each scene
    var directionTween = TweenLite.to(cameraTarget, {
        x: scene.cameraTarget.x,
        y: scene.cameraTarget.y,
        z: scene.cameraTarget.z,
        duration: duration,
        ease: ease,
    })

    // tween the camera to its new position
    var cameraTween = TweenLite.to(webgl.camera.position, {
        x: scene.cameraPosition.x,
        y: scene.cameraPosition.y,
        z: scene.cameraPosition.z,
        onUpdate: function () {
            webgl.camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
        },
        onComplete: function () {
            return
        },
        duration: duration,
        ease: ease,
    })

    await cameraTween
}
