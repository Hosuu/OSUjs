import Beatmap from '../Beatmap'
import { calcFadein, calcPrempt } from '../utils/ArCalc'
import { parseHitObjectLine } from '../utils/parser'
import { clamp01 } from '../utils/utils'
import HitCircle from './gameObjects/HitCircle'
import HitObject from './gameObjects/HitObject'
import Slider from './gameObjects/Slider'
import Spinner from './gameObjects/Spiner'

export default class OsuPlayer {
	private timeStamp: number
	private preempt: number
	private fadein: number = 10
	private circleRadius: number = 10

	private currentIndex = 0
	private gameObjects: HitObject[] = []

	constructor(AR: number, CS: number) {
		this.timeStamp = 0
		this.preempt = calcPrempt(AR)
		this.fadein = calcFadein(AR)
		this.circleRadius = 54.4 - 4.48 * CS

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
		this.timeStamp += dt

		const hitObject = this.gameObjects[this.currentIndex]
		const timeDiff = hitObject.getTime() - this.timeStamp
		if (timeDiff < -200) this.currentIndex++
		if (this.currentIndex >= this.gameObjects.length) throw Error('Song end')
	}

	public draw(ctx: CanvasRenderingContext2D) {
		for (let i = this.currentIndex; i < this.gameObjects.length; i++) {
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
}