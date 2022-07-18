import { Drawable } from '../../interfaces'
import { ParsedHitCircle } from '../../utils/parser'
import OsuPlayer from '../OsuPlayer'
import Vector2 from '../Vector2'
import HitObject from './HitObject'

export default class HitCircle extends HitObject implements Drawable {
	protected readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider' = 'HitCircle'

	constructor(data: ParsedHitCircle) {
		super(data)
	}

	public getEndTime(): number {
		return this.time
	}

	public getPositionAt(_timeStamp: number): Vector2 {
		return this.position.clone()
	}

	public draw(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string): void {
		this.drawHitCircle(ctx, player, color)
	}
}
