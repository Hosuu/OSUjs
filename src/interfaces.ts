export interface Drawable {
	draw(
		ctx: CanvasRenderingContext2D,
		opacity: number,
		circleRadius: number,
		approachScale: number
	): void
}

export interface BeatmapDifficulty {
	hpDrainRate: number
	CircleSize: number
	overallDifficulty: number
	approachRate: number
	sliderMultiplier: number
	sliderTickRate: number
}
