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

	draw(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string): void {
		this.drawHitCircle(ctx, player, color)
	}

	public getEndTime(): number {
		throw new Error('Method not implemented.')
	}
	public getPositionAt(): Vector2 {
		throw new Error('Method not implemented.')
	}
}
