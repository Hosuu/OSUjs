//@ts-nocheck
export function clamp01(value: number): number {
	if (value < 0) return 0
	if (value > 1) return 1
	/*//////////*/ return value
}

export function lerp(t: number, a: number, b: number): number {
	return a + (b - a) * t
}

export const lerper = (t) => (a, b) => lerp(t, a, b)

export const zip = (fn, ...arrs) => {
	const len = Math.max(...arrs.map((e) => e.length))
	const result = []
	for (let i = 0; i < len; i += 1) {
		result.push(fn(...arrs.map((e) => e[i])))
	}
	return result
}

export const lerperVector = (t) => (a, b) => zip(lerper(t), a, b)

export const bezierAt = (t, points) => {
	if (points.length === 1) {
		return points[0]
	}
	const starts = points.slice(0, -1)
	const ends = points.slice(1)
	return bezierAt(t, zip(lerperVector(t), starts, ends))
}
