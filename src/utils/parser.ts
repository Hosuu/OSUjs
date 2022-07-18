export interface ParsedHitObject {
	hitObjectType: 'HitCircle' | 'Spinner' | 'Slider'
	x: number
	y: number
	time: number
	type: number
	hitSound: number
	normalSet: number
	additionSet: number
	index: number
	volume: number
	filename: string
}

export interface ParsedHitCircle extends ParsedHitObject {
	hitObjectType: 'HitCircle'
}

export interface ParsedSpinner extends ParsedHitObject {
	hitObjectType: 'Spinner'
	endTime: number
}

export interface ParsedSlider extends ParsedHitObject {
	hitObjectType: 'Slider'
	curveType: string
	curvePoints: string[]
	slides: number
	length: number
	edgeSounds: number[]
	edgeSets: string[]
}

export function parseHitObjectLine(line: string): ParsedHitCircle | ParsedSpinner | ParsedSlider {
	const [x, y, time, type, hitSound, ...objectParams] = line.split(',')
	const [normalSet, additionSet, index, volume, filename] = /,.+:.+:.+:.+:.*$/.test(line)
		? objectParams.pop()!.split(':')
		: '0:0:0:0:'.split(':')

	//If spinner
	if ((+type & 8) === 8) {
		return {
			hitObjectType: 'Spinner',
			x: +x,
			y: +y,
			time: +time,
			type: +type,
			hitSound: +hitSound,
			endTime: +objectParams[0],
			normalSet: +normalSet,
			additionSet: +additionSet,
			index: +index,
			volume: +volume,
			filename,
		}
	}

	//If slider
	else if ((+type & 2) === 2) {
		const [curveType, ...curvePoints] = objectParams[0].split('|')
		const slides = objectParams[1]
		const length = objectParams[2]
		const edgeSounds = objectParams[3]?.split('|') ?? ['0', '0'] //FIXME fast fix
		const edgeSets = objectParams[4]?.split('|') ?? ['0:0', '0:0'] //FIXME fast fix

		return {
			hitObjectType: 'Slider',
			x: +x,
			y: +y,
			time: +time,
			type: +type,
			hitSound: +hitSound,
			curveType,
			curvePoints,
			slides: +slides,
			length: +length,
			edgeSounds: edgeSounds.map(Number),
			edgeSets,
			normalSet: +normalSet,
			additionSet: +additionSet,
			index: +index,
			volume: +volume,
			filename,
		}
	}

	//If circle
	else {
		return {
			hitObjectType: 'HitCircle',
			x: +x,
			y: +y,
			time: +time,
			type: +type,
			hitSound: +hitSound,
			normalSet: +normalSet,
			additionSet: +additionSet,
			index: +index,
			volume: +volume,
			filename,
		}
	}
}
