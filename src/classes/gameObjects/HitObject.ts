import { Drawable } from '../../interfaces'
import { ParsedHitObject } from '../../utils/parser'
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

	public getTime(): number {
		return this.time
	}

	public getPosition(): Vector2 {
		return this.position.clone()
	}

	public abstract draw(
		ctx: CanvasRenderingContext2D,
		opacity: number,
		circleRadius: number,
		approachScale: number
	): void

	// protected drawApproachCircle(
	// 	pos: Vector2,
	// 	circleRadius: number,
	// 	approacHScale: number,
	// 	opacity: number
	// ) {}
}
