import OsuPlayer from './OsuPlayer'

export default class OsuEngine {
	//Render
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D

	// Game loop variables
	private isRunning: boolean
	private lastUpdateTimeStamp: DOMHighResTimeStamp
	private lastRequestedFrameId: number
	// private frameCount: number
	// private deltaTime: number
	// private timeElapsed: number

	//OsuPlayer
	private player!: OsuPlayer //Remove !

	constructor() {
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')!
		document.querySelector('#app')?.append(this.canvas)

		//Init variables
		this.isRunning = true
		this.lastUpdateTimeStamp = performance.now()
		this.lastRequestedFrameId = 0
		// this.frameCount = 0
		// this.deltaTime = 0
		// this.timeElapsed = 0

		window.addEventListener('keypress', (e) => {
			if (e.code === 'KeyP') {
				this.player = new OsuPlayer(9.7, 3.3, 9)
			}
		})

		//Pause/resume engine of focus loss/gain
		window.addEventListener('focus', this.resume.bind(this))
		window.addEventListener('blur', this.pause.bind(this))

		//Resize event handler
		window.addEventListener('resize', this.adjustCanvasTransform.bind(this))
		window.dispatchEvent(new Event('resize')) //Instant dipach resize event to adjust transforms

		//Run
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
		if (document.visibilityState === 'hidden') this.pause()
	}

	private mainLoop(timeStamp: DOMHighResTimeStamp) {
		const dt: number = timeStamp - this.lastUpdateTimeStamp
		// this.deltaTime = dt
		// this.timeElapsed += dt

		//Update
		this.player?.update(dt)

		//Draw
		this.ctx.clearRect(-256, -192, 512 * 2, 384 * 2)

		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.rect(0, 0, 512, 384)
		this.ctx.stroke()
		this.ctx.restore()

		this.player?.draw(this.ctx)

		//loop
		this.lastUpdateTimeStamp = timeStamp
		// this.frameCount += 1
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
	}

	private pause(): void {
		if (!this.isRunning) return

		//Game Loop
		window.cancelAnimationFrame(this.lastRequestedFrameId)
		this.isRunning = false
		OsuPlayer.music.pause()
	}

	private resume(): void {
		if (this.isRunning) return

		//Game Loop
		this.lastUpdateTimeStamp = performance.now()
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
		this.isRunning = true
		if (OsuPlayer.music.currentTime > 0) OsuPlayer.music.play()
	}

	private adjustCanvasTransform() {
		//Source: https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/osu%21_pixel
		const OSUPIXEL_TO_PIXEL = Math.min(innerWidth / 640, innerHeight / 480)
		const BASE_GAME_WIDTH = 512
		const BASE_GAME_HEIGHT = 384

		this.canvas.width = innerWidth
		this.canvas.height = innerHeight

		this.ctx.translate(
			(innerWidth - BASE_GAME_WIDTH * OSUPIXEL_TO_PIXEL) / 2,
			(innerHeight - BASE_GAME_HEIGHT * OSUPIXEL_TO_PIXEL) / 2
		)
		this.ctx.scale(OSUPIXEL_TO_PIXEL, OSUPIXEL_TO_PIXEL)
	}
}
