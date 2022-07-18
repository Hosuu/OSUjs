import { Drawable } from '../../interfaces'
import { ParsedSpinner } from '../../utils/parser'
import Vector2 from '../Vector2'
import HitObject from './HitObject'

export default class Spinner extends HitObject implements Drawable {
	protected readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider' = 'Spinner'
	protected readonly endTime: number

	constructor(data: ParsedSpinner) {
		super(data)
		this.endTime = data.endTime
	}

	draw(): void {}

	public getEndTime(): number {
		return this.endTime
	}
	public getPositionAt(): Vector2 {
		throw new Error('Method not implemented.')
	}
}
