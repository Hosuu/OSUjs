import { Drawable } from '../../interfaces'
import { ParsedHitCircle } from '../../utils/parser'
import HitObject from './HitObject'

export default class HitCircle extends HitObject implements Drawable {
	protected readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider' = 'HitCircle'

	constructor(data: ParsedHitCircle) {
		super(data)
	}

	draw(
		ctx: CanvasRenderingContext2D,
		opacity: number,
		circleRadius: number,
		approachScale: number
	): void {
		//HitCircle
		ctx.save()
		ctx.beginPath()
		ctx.arc(this.position.x, this.position.y, circleRadius, 0, Math.PI * 2)
		ctx.fillStyle = `rgba(150,150,150,${opacity / 2})`
		ctx.strokeStyle = `rgba(200,200,200,${opacity})`
		ctx.lineWidth = circleRadius * 0.075
		ctx.fill()
		ctx.stroke()
		ctx.restore()

		//Approach circle
		ctx.save()
		ctx.beginPath()
		ctx.strokeStyle = `rgba(255,255,255,${opacity})`
		ctx.lineWidth = circleRadius * 0.1
		ctx.arc(this.position.x, this.position.y, circleRadius * approachScale, 0, Math.PI * 2)
		ctx.stroke()
		ctx.restore()
	}
}
