// @mattdesl x marcofugaro
// https://github.com/mattdesl/threejs-app/blob/master/src/webgl/WebGLApp.js
import * as THREE from 'three'
import createOrbitControls from 'orbit-controls'
import createTouches from 'touches'
import dataURIToBlob from 'datauritoblob'
import Stats from 'stats.js'
import State from 'controls-state'
import wrapGUI from 'controls-gui'
import { getGPUTier } from 'detect-gpu'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import CannonDebugRenderer from './CannonDebugRenderer'

export default class WebGLApp {
    #updateListeners = []
    #tmpTarget = new THREE.Vector3()
    #lastTime
    #width
    #height

    constructor({
        background = '#000',
        backgroundAlpha = 1,
        fov = 45,
        near = 0.01,
        far = 5000,
        ...options
    } = {}) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            // enabled for saving screenshots of the canvas,
            // may wish to disable this for perf reasons
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: true,
            ...options,
        })

        this.renderer.sortObjects = false
        this.canvas = this.renderer.domElement

        this.renderer.setClearColor(background, backgroundAlpha)

        if (options.xr) {
            this.renderer.xr.enabled = true
        }

        // save the fixed dimensions
        this.#width = options.width
        this.#height = options.height

        // clamp pixel ratio for performance
        this.maxPixelRatio = options.maxPixelRatio || 2
        // clamp delta to stepping anything too far forward
        this.maxDeltaTime = options.maxDeltaTime || 1 / 30

        // setup a basic camera
        this.camera = new THREE.PerspectiveCamera(fov, 1, near, far)
        this.cameraTarget = new THREE.Vector3(0, 0, 0)

        // object to hold multiple scenes
        this.scenes = {}
        this.scenesParams = {}

        // init a default scene
        this.scenes.defaultScene = new THREE.Scene()

        // set renderer to render default scene
        this.currentScene = this.scenes.defaultScene

        // used for updating composer
        this.oldScene = this.currentScene

        // mouse
        this.mouse = new THREE.Vector3()
        this.mouse2D = new THREE.Vector2()
        this.mouse3D = new THREE.Vector3()

        this.gl = this.renderer.getContext()

        this.time = 0
        this.isRunning = false
        this.#lastTime = performance.now()

        // handle mouse move events (without touch handler)
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false)

        // handle resize events
        window.addEventListener('resize', this.resize)
        window.addEventListener('orientationchange', this.resize)

        // force an initial resize event
        this.resize()

        // __________________________ADDONS__________________________

        // really basic touch handler that propagates through the scene
        this.touchHandler = createTouches(this.canvas, {
            target: this.canvas,
            filtered: true,
        })
        this.isDragging = false
        this.touchHandler.on('start', (ev, pos) => {
            this.isDragging = true
            this.traverse('onPointerDown', ev, pos)
        })
        this.touchHandler.on('move', (ev, pos) => this.traverse('onPointerMove', ev, pos))
        this.touchHandler.on('end', (ev, pos) => {
            this.isDragging = false
            this.traverse('onPointerUp', ev, pos)
        })

        // expose a composer for postprocessing passes
        if (options.postprocessing) {
            this.composer = new EffectComposer(this.renderer)
            this.composer.addPass(new RenderPass(this.currentScene, this.camera))
        }

        // set up a simple orbit controller
        if (options.orbitControls) {
            this.orbitControls = createOrbitControls({
                element: this.canvas,
                parent: window,
                distance: 4,
                ...(options.orbitControls instanceof Object ? options.orbitControls : {}),
            })

            // move the camera position accordingly to the orbitcontrols options
            this.camera.position.fromArray(this.orbitControls.position)
            this.camera.lookAt(new THREE.Vector3().fromArray(this.orbitControls.target))
        }

        // Attach the Cannon physics engine
        if (options.world) {
            this.world = options.world
            if (options.showWorldWireframes) {
                this.cannonDebugRenderer = new CannonDebugRenderer(this.currentScene, this.world)
            }
        }

        // show the fps meter
        if (options.showFps) {
            this.stats = new Stats()
            this.stats.showPanel(0)
            document.body.appendChild(this.stats.dom)
        }

        // initialize the controls-state
        if (options.controls) {
            const controlsState = State(options.controls)
            this.controls = options.hideControls
                ? controlsState
                : wrapGUI(controlsState, { expanded: !options.closeControls })

            // add the custom controls-gui styles
            if (!options.hideControls) {
                const styles = `
          [class^="controlPanel-"] [class*="__field"]::before {
            content: initial !important;
          }
          [class^="controlPanel-"] [class*="__labelText"] {
            text-indent: 6px !important;
          }
          [class^="controlPanel-"] [class*="__field--button"] > button::before {
            content: initial !important;
          }
        `
                const style = document.createElement('style')
                style.type = 'text/css'
                style.innerHTML = styles
                document.head.appendChild(style)
            }
        }

        // detect the gpu info
        const gpu = getGPUTier({ glContext: this.renderer.getContext() })
        this.gpu = {
            name: gpu.type,
            tier: Number(gpu.tier.slice(-1)),
            isMobile: gpu.tier.toLowerCase().includes('mobile'),
        }
    }

    get width() {
        return this.#width || window.innerWidth
    }

    get height() {
        return this.#height || window.innerHeight
    }

    get pixelRatio() {
        return Math.min(this.maxPixelRatio, window.devicePixelRatio)
    }

    resize = ({ width = this.width, height = this.height, pixelRatio = this.pixelRatio } = {}) => {
        // update pixel ratio if necessary
        if (this.renderer.getPixelRatio() !== pixelRatio) {
            this.renderer.setPixelRatio(pixelRatio)
        }

        // setup new size & update camera aspect if necessary
        this.renderer.setSize(width, height)
        if (this.camera.isPerspectiveCamera) {
            this.camera.aspect = width / height
        }
        this.camera.updateProjectionMatrix()

        // resize also the composer
        if (this.composer) {
            this.composer.setSize(pixelRatio * width, pixelRatio * height)
        }

        // recursively tell all child objects to resize
        this.currentScene.traverse((obj) => {
            if (typeof obj.resize === 'function') {
                obj.resize({
                    width,
                    height,
                    pixelRatio,
                })
            }
        })

        // draw a frame to ensure the new size has been registered visually
        this.draw()
        return this
    }

    // convenience function to trigger a PNG download of the canvas
    saveScreenshot = ({ width = 2560, height = 1440, fileName = 'image.png' } = {}) => {
        // force a specific output size
        this.resize({ width, height, pixelRatio: 1 })
        this.draw()

        const dataURI = this.canvas.toDataURL('image/png')

        // reset to default size
        this.resize()
        this.draw()

        // save
        saveDataURI(fileName, dataURI)
    }

    onMouseMove(event) {
        // get normalized mouse position on viewport

        var target = event.target

        var rect = target.getBoundingClientRect()

        var x = event.clientX - rect.left
        var y = event.clientY - rect.top

        this.mouse.x = (x * target.width) / target.clientWidth
        this.mouse.y = (y * target.height) / target.clientHeight

        this.mouse2D.x = (x * target.width) / target.clientWidth
        this.mouse2D.y = (y * target.height) / target.clientHeight

        this.normalizeMouse2D(target) // (0, 0) at window center

        //this.updateMouse3D()
    }

    normalizeMouse2D(target) {
        this.mouse2D.x = this.mouse2D.x / target.width - 0.5
        this.mouse2D.y = this.mouse2D.y / target.height - 0.5
    }

    updateMouse3D() {
        this.mouse.unproject(this.camera)
        this.mouse.sub(this.camera.position).normalize()
        var distance = -this.camera.position.z / this.mouse.z
        // var distance = (targetZ - this.camera.position.z) / vec.z;

        this.mouse3D.copy(this.camera.position).add(this.mouse.multiplyScalar(2.0))
    }

    update = (dt, time, xrframe) => {
        if (this.orbitControls) {
            this.orbitControls.update()

            // reposition to orbit controls
            this.camera.up.fromArray(this.orbitControls.up)
            this.camera.position.fromArray(this.orbitControls.position)
            this.#tmpTarget.fromArray(this.orbitControls.target)
            this.camera.lookAt(this.#tmpTarget)
        }

        // recursively tell all child objects to update
        this.currentScene.traverse((obj) => {
            if (typeof obj.update === 'function') {
                obj.update(dt, time, xrframe)
            }
        })

        if (this.world) {
            // update the Cannon physics engine
            this.world.step(1 / 60, dt)

            // update the debug wireframe renderer
            if (this.cannonDebugRenderer) {
                this.cannonDebugRenderer.update()
            }

            // recursively tell all child bodies to update
            this.world.bodies.forEach((body) => {
                if (typeof body.update === 'function') {
                    body.update(dt, time)
                }
            })
        }

        // call the update listeners
        this.#updateListeners.forEach((fn) => fn(dt, time, xrframe))

        return this
    }

    onUpdate(fn) {
        this.#updateListeners.push(fn)
    }

    offUpdate(fn) {
        const index = this.#updateListeners.indexOf(fn)

        // return silently if the function can't be found
        if (index === -1) {
            return
        }

        this.#updateListeners.splice(index, 1)
    }

    draw = () => {
        if (this.composer) {
            if (this.currentScene != this.oldScene) {
                // update composer if new scene requested

                this.composer.passes[0] = new RenderPass(this.currentScene, this.camera)
                this.oldScene = this.currentScene
            }

            // make sure to always render the last pass
            this.composer.passes.forEach((pass, i, passes) => {
                const isLastElement = i === passes.length - 1

                if (isLastElement) {
                    pass.renderToScreen = true
                } else {
                    pass.renderToScreen = false
                }
            })

            this.composer.render()
        } else {
            this.renderer.render(this.currentScene, this.camera)
        }
        return this
    }

    start = () => {
        if (this.isRunning) return
        this.renderer.setAnimationLoop(this.animate)
        this.isRunning = true
        return this
    }

    stop = () => {
        if (!this.isRunning) return
        this.renderer.setAnimationLoop(null)
        this.isRunning = false
        return this
    }

    animate = (now, xrframe) => {
        if (!this.isRunning) return

        if (this.stats) this.stats.begin()

        const dt = Math.min(this.maxDeltaTime, (now - this.#lastTime) / 1000)
        this.time += dt
        this.#lastTime = now
        this.update(dt, this.time, xrframe)
        this.draw()

        if (this.stats) this.stats.end()
    }

    traverse = (fn, ...args) => {
        this.currentScene.traverse((child) => {
            if (typeof child[fn] === 'function') {
                child[fn].apply(child, args)
            }
        })
    }

    get cursor() {
        return this.canvas.style.cursor
    }

    set cursor(cursor) {
        if (cursor) {
            this.canvas.style.cursor = cursor
        } else {
            this.canvas.style.cursor = null
        }
    }
}

function saveDataURI(name, dataURI) {
    const blob = dataURIToBlob(dataURI)

    // force download
    const link = document.createElement('a')
    link.download = name
    link.href = window.URL.createObjectURL(blob)
    link.onclick = setTimeout(() => {
        window.URL.revokeObjectURL(blob)
        link.removeAttribute('href')
    }, 0)

    link.click()
}
