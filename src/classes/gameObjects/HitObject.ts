import { APPROACH_CIRCLE_INITIAL_SCALE, CIRCLE_FADEOUT_TIME } from '../../constants'
import { Drawable } from '../../interfaces'
import { ParsedHitObject } from '../../utils/parser'
import { clamp01 } from '../../utils/utils'
import OsuPlayer from '../OsuPlayer'
import Vector2 from '../Vector2'

export default abstract class HitObject implements Drawable {
	protected readonly position: Vector2
	protected readonly time: number
	protected abstract readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider'
	protected readonly newCombo: boolean
	protected readonly comboColorSkips: number
	//TODO SAMPLES

	constructor(data: ParsedHitObject) {
		this.position = new Vector2(data.x, data.y)
		this.time = data.time
		this.newCombo = (data.type & (1 << 2)) !== 0
		this.comboColorSkips = (data.type & ~(1 << 7)) >> 4
		//TODO SAMPLES
	}

	public getType(): 'HitCircle' | 'Spinner' | 'Slider' {
		return this.hitObjectType
	}

	public getTime(): number {
		return this.time
	}

	public abstract getEndTime(): number

	public abstract getPositionAt(timeStamp: number): Vector2

	public isNewCombo(): boolean {
		return this.newCombo
	}

	public getComboColorSkips(): number {
		return this.comboColorSkips
	}

	public abstract draw(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string): void

	protected drawHitCircle(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string) {
		const [x, y] = this.position.toArray()
		const { circleRadius: cr, fadein, preempt } = player
		const gameTime = player.getTimeStamp()
		const timeDiff = this.time - gameTime

		let opacity = 1 - clamp01((timeDiff - (preempt - fadein)) / fadein)
		let scale = 1
		let approachScale = 1 + (timeDiff / preempt) * (APPROACH_CIRCLE_INITIAL_SCALE - 1)
		if (timeDiff < 0) {
			opacity = 1 + timeDiff / CIRCLE_FADEOUT_TIME
			scale = 1 - (timeDiff / (CIRCLE_FADEOUT_TIME * 2)) * 0.5
			approachScale = 0
		}

		//HitCircle
		ctx.save()
		ctx.beginPath()
		ctx.arc(x, y, cr * scale, 0, Math.PI * 2)
		ctx.fillStyle = `rgba(${color}, ${opacity / 2})`
		ctx.strokeStyle = `rgba(${color}, ${opacity})`
		ctx.lineWidth = cr * 0.1
		ctx.fill()
		ctx.stroke()
		ctx.restore()

		//ApproachCircle
		ctx.save()
		ctx.beginPath()
		ctx.strokeStyle = `rgba(${color}, ${opacity})`
		ctx.lineWidth = cr * 0.1
		ctx.arc(x, y, cr * approachScale, 0, Math.PI * 2)
		ctx.stroke()
		ctx.restore()
	}
}
