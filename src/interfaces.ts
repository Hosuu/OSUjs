import OsuPlayer from './classes/OsuPlayer'

export interface Drawable {
	draw(ctx: CanvasRenderingContext2D, player: OsuPlayer, color: string): void
}

export interface BeatmapDifficulty {
	hpDrainRate: number
	CircleSize: number
	overallDifficulty: number
	approachRate: number
	sliderMultiplier: number
	sliderTickRate: number
}
