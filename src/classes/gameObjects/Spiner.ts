import { CIRCLE_FADEOUT_TIME } from '../../constants'
import { Drawable } from '../../interfaces'
import { ParsedSpinner } from '../../utils/parser'
import { clamp01 } from '../../utils/utils'
import OsuPlayer from '../OsuPlayer'
import Vector2 from '../Vector2'
import HitObject from './HitObject'

export default class Spinner extends HitObject implements Drawable {
	protected readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider' = 'Spinner'
	protected readonly endTime: number

	constructor(data: ParsedSpinner) {
		super(data)
		this.endTime = data.endTime
	}

	public getEndTime(): number {
		return this.endTime
	}

	public getPositionAt(_timeStamp: number): Vector2 {
		return new Vector2(256, 192)
	}

	public draw(ctx: CanvasRenderingContext2D, player: OsuPlayer, _color: string): void {
		const time = player.getTimeStamp()
		if (this.endTime < time) return

		const { preempt, fadein } = player
		let opacity = 1 - clamp01((this.time - time - (preempt - fadein)) / fadein)
		if (time > this.time)
			opacity = clamp01((this.endTime - time) / ((CIRCLE_FADEOUT_TIME * (this.endTime - this.time)) / 100)) //prettier-ignore

		const t = 1 - clamp01((time - this.time) / (this.endTime - this.time))

		ctx.save()
		ctx.beginPath()
		ctx.arc(256, 192, 180 * t, 0, Math.PI * 2)
		ctx.strokeStyle = `rgba(255,255,255,${opacity})`
		ctx.stroke()
		ctx.restore()
	}
}
