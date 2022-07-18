import { Drawable } from '../../interfaces'
import { ParsedSpinner } from '../../utils/parser'
import HitObject from './HitObject'

export default class Spinner extends HitObject implements Drawable {
	protected readonly hitObjectType: 'HitCircle' | 'Spinner' | 'Slider' = 'Spinner'
	protected readonly endTime: number

	constructor(data: ParsedSpinner) {
		super(data)
		this.endTime = data.endTime
	}

	draw(): void {}
}
