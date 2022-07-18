import { Drawable } from '../../interfaces'
import { ParsedSlider } from '../../utils/parser'
import { bezierAt } from '../../utils/utils'
import OsuPlayer from '../OsuPlayer'
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
			return new Vector2(+x, +y)
		})
		this.slides = data.slides
		this.length = data.length
	}

	draw(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string): void {
		if (this.curveType === 'L') this.computeLinearSliderPath(ctx)
		else if (this.curveType === 'B') this.computeBezierSliderPath(ctx)
		else if (this.curveType === 'P') this.computePerfectSliderPath(ctx)
		this.drawSliderTrack(ctx, player, color)

		this.drawHitCircle(ctx, player, color)
	}

	private computeLinearSliderPath(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.beginPath()
		ctx.moveTo(this.position.x, this.position.y)
		for (const point of this.curvePoints) {
			ctx.lineTo(point.x, point.y)
		}
	}

	private computeBezierSliderPath(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.beginPath()
		const points = [...this.curvePoints]

		if (points.length === 1) {
			ctx.moveTo(points[0].x, points[0].y)
		} else if (points.length === 2) {
			ctx.moveTo(points[0].x, points[0].y)
			ctx.lineTo(points[1].x, points[1].y)
		} else if (points.length === 3) {
			ctx.moveTo(points[0].x, points[0].y)
			ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y)
		} else if (points.length === 4) {
			ctx.moveTo(points[0].x, points[0].y)
			ctx.bezierCurveTo(
				points[1].x,
				points[1].y,
				points[2].x,
				points[2].y,
				points[3].x,
				points[3].y
			)
		} else {
			const divisions = Math.min(64, Math.ceil(500 / points.length))
			for (let j = 0; j <= divisions; j += 1) {
				const [x1, y1] = bezierAt(j / divisions, points)
				ctx.lineTo(x1, y1)
			}
		}
	}

	private computePerfectSliderPath(ctx: CanvasRenderingContext2D) {
		// https://stackoverflow.com/q/4103405
		const A = this.position
		const B = this.curvePoints[0]
		const C = this.curvePoints[1]
		const yDeltaA = B.y - A.y
		const xDeltaA = B.x - A.x
		const yDeltaB = C.y - B.y
		const xDeltaB = C.x - B.x

		const aSlope = yDeltaA / xDeltaA
		const bSlope = yDeltaB / xDeltaB
		const centerX =
			(aSlope * bSlope * (A.y - C.y) + bSlope * (A.x + B.x) - aSlope * (B.x + C.x)) /
			(2 * (bSlope - aSlope))
		const centerY = (-1 * (centerX - (A.x + B.x) / 2)) / aSlope + (A.y + B.y) / 2
		const radius = Math.sqrt(
			(centerX - this.position.x) * (centerX - this.position.x) +
				(centerY - this.position.y) * (centerY - this.position.y)
		)
		const angleA = Math.atan2(A.y - centerY, A.x - centerX)
		const angleC = Math.atan2(C.y - centerY, C.x - centerX)

		const anticlockwise = xDeltaB * yDeltaA - xDeltaA * yDeltaB > 0
		const startAngle = angleA
		const endAngle = angleC

		ctx.save()
		ctx.beginPath()
		ctx.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise)
	}

	private drawSliderTrack(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string) {
		//Make rounded caps
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'

		//Stroke
		ctx.strokeStyle = `rgba(${color},${1})`
		ctx.lineWidth = player.circleRadius * 2
		ctx.stroke()

		//Body
		ctx.strokeStyle = `rgba(50,50,50,${1})`
		ctx.lineWidth = player.circleRadius * 2 * 0.9
		ctx.stroke()

		//Restore from computing
		ctx.restore()
	}

	public getEndTime(): number {
		return this.time
	}
	public getPositionAt(): Vector2 {
		throw new Error('Method not implemented.')
	}
}
