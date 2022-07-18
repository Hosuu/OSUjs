//Source: https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

export function calcPrempt(AR: number) {
	if (AR === 5) return 1200
	else if (AR > 5) return 1200 - (750 * (AR - 5)) / 5
	else return 1200 + (600 * (5 - AR)) / 5
}

export function calcFadein(AR: number) {
	if (AR === 5) return 800
	else if (AR > 5) return 800 - (500 * (AR - 5)) / 5
	else return 800 + (400 * (5 - AR)) / 5
}
