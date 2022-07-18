import { Drawable } from '../../interfaces'
import { ParsedSlider } from '../../utils/parser'
import Vector2 from '../Vector2'
import HitObject from './HitObject'

export default class Slider extends HitObject implements Drawable {
	protected readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider' = 'Slider'
	protected readonly curveType: string
	protected readonly curvePoints: Vector2[]
	protected readonly slides: number
	protected readonly length: number

	//TODO SAMPLES
	// protected readonly edgeSounds: number[]
	// protected readonly edgeSets: string[]

	constructor(data: ParsedSlider) {
		super(data)
		this.curveType = data.curveType
		this.curvePoints = data.curvePoints.map((point: string) => {
			const [x, y] = point.split(':')
			return new Vector2(+x / 512, +y / 384)
		})
		this.slides = data.slides
		this.length = data.length
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
		ctx.fillStyle = `rgba(255,150,150,${opacity / 2})`
		ctx.strokeStyle = `rgba(255,200,200,${opacity})`
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
