import Beatmap from '../Beatmap'
import { calcFadein, calcPrempt } from '../utils/ArCalc'
import { parseHitObjectLine } from '../utils/parser'
import { clamp01 } from '../utils/utils'
import HitCircle from './gameObjects/HitCircle'
import HitObject from './gameObjects/HitObject'
import Slider from './gameObjects/Slider'
import Spinner from './gameObjects/Spiner'
import music from '/src/audio.mp3'

export default class OsuPlayer {
	private timeStamp: number
	private speedMultiplier: number

	public static music = new Audio(music)

	public readonly preempt: number
	public readonly fadein: number
	public readonly circleRadius: number
	public readonly hit300Window: number
	public readonly hit100Window: number
	public readonly hit50Window: number

	private currentIndex = 0
	private gameObjects: HitObject[] = []

	constructor(AR: number, CS: number, OD: number) {
		this.timeStamp = 0
		this.preempt = calcPrempt(AR)
		this.fadein = calcFadein(AR)
		this.circleRadius = 54.4 - 4.48 * CS
		this.hit300Window = 80 - 6 * OD
		this.hit100Window = 140 - 8 * OD
		this.hit50Window = 200 - 10 * OD

		this.speedMultiplier = 3
		OsuPlayer.music.play()
		OsuPlayer.music.playbackRate = 3
		//@ts-ignore
		OsuPlayer.music.preservesPitch = false
		OsuPlayer.music.currentTime = 0
		//@ts-ignore
		window.player = OsuPlayer.music

		this.gameObjects = Beatmap.split('\n').map((l) => {
			const data = parseHitObjectLine(l)

			switch (data.hitObjectType) {
				case 'HitCircle':
					return new HitCircle(data)
				case 'Spinner':
					return new Spinner(data)
				case 'Slider':
					return new Slider(data)
			}
		})
	}

	public update(dt: number) {
		this.timeStamp += dt * this.speedMultiplier

		const hitObject = this.gameObjects[this.currentIndex]
		const timeDiff = hitObject.getTime() - this.timeStamp
		if (timeDiff < -200) this.currentIndex++
		if (this.currentIndex >= this.gameObjects.length) throw Error('Song end')
	}

	public draw(ctx: CanvasRenderingContext2D) {
		let endIndex = this.currentIndex
		for (let i = this.currentIndex; i < this.gameObjects.length; i++) {
			const hitObject = this.gameObjects[i] as HitObject
			const timeDiff = hitObject.getTime() - this.timeStamp

			if (timeDiff > this.preempt) break
			endIndex = i
		}

		for (let i = endIndex; i >= this.currentIndex; i--) {
			const hitObject = this.gameObjects[i] as HitObject
			const timeDiff = hitObject.getTime() - this.timeStamp

			if (timeDiff < -200) continue
			if (timeDiff > this.preempt) break

			const opacity = 1 - clamp01((timeDiff - (this.preempt - this.fadein)) / this.fadein)
			const circleRadius = this.circleRadius
			const approachScale = 1 + (timeDiff / this.preempt) * 2

			if (timeDiff < 0) {
				const opacity = 1 + timeDiff / 100
				const circleRadius = this.circleRadius * (1 - (timeDiff / 200) * 0.5)
				const approachScale = 0
				hitObject.draw(ctx, opacity, circleRadius, approachScale)

				continue
			}

			hitObject.draw(ctx, opacity, circleRadius, approachScale)
		}
	}

	public getTimeStamp(): number {
		return this.timeStamp
	}
}
