export default class Vector2 {
	public x: number
	public y: number

	constructor()
	constructor(x: number, y: number)
	constructor(x?: number, y?: number) {
		this.x = x ?? 0
		this.y = y ?? x ?? 0
	}

	public static get Zero(): Vector2 {
		return new Vector2(0, 0)
	}

	public static get Right(): Vector2 {
		return new Vector2(1, 0)
	}

	public static get Left(): Vector2 {
		return new Vector2(-1, 0)
	}

	public static get Down(): Vector2 {
		return new Vector2(0, 1)
	}

	public static get Up(): Vector2 {
		return new Vector2(0, -1)
	}

	public static get RandomDirection(): Vector2 {
		const angle = Math.random() * Math.PI * 2
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	public static FromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	public add(vec: Vector2): Vector2 {
		this.x += vec.x
		this.y += vec.y

		return this
	}

	public subtract(vec: Vector2): Vector2 {
		this.x -= vec.x
		this.y -= vec.y

		return this
	}

	public multiply(scalar: number): Vector2 {
		this.x *= scalar
		this.y *= scalar

		return this
	}

	public divide(scalar: number): Vector2 {
		if (scalar === 0) return this

		this.x /= scalar
		this.y /= scalar

		return this
	}

	public lerpTowards(target: Vector2, t: number): Vector2 {
		this.x += (target.x - this.x) * t
		this.y += (target.y - this.y) * t

		return this
	}

	public set(x: number, y?: number): Vector2 {
		this.x = x
		this.y = y ?? x
		return this
	}

	public setMagnitude(scalar: number): Vector2 {
		this.normalize().multiply(scalar)

		return this
	}

	public getMagnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2)
	}

	public normalize(): Vector2 {
		this.divide(this.getMagnitude())

		return this
	}

	public getNormalized(): Vector2 {
		return this.clone().normalize()
	}

	public negate(): Vector2 {
		this.set(-this.x, -this.y)

		return this
	}

	public getNegated(): Vector2 {
		return this.clone().negate()
	}

	public getAngle(): number {
		return Math.atan2(this.y, this.x)
	}

	public getDistanceTo(vec: Vector2): number {
		return Math.abs(this.clone().subtract(vec).getMagnitude())
	}

	public clone(): Vector2 {
		return new Vector2(this.x, this.y)
	}

	public toString(): string {
		return `x: ${this.x}, y: ${this.y}`
	}

	public toArray(): Array<number> {
		return [this.x, this.y]
	}

	public static sum(...vectors: Vector2[]): Vector2 {
		const v = new Vector2(0, 0)
		for (const vec of vectors) {
			v.add(vec)
		}
		return v
	}

	public renderAt(ctx: CanvasRenderingContext2D, color: string, r: number = 2): void {
		ctx.save()
		ctx.beginPath()
		ctx.fillStyle = color
		ctx.arc(this.x, this.y, r, 0, Math.PI * 2)
		ctx.fill()
		ctx.restore()
	}

	public static dot(v1: Vector2, v2: Vector2): number {
		return v1.x * v2.x + v1.y * v2.y
	}

	public static cross(v1: Vector2, v2: Vector2): number {
		return v1.x * v2.y - v1.y * v2.x
	}

	public static distance(v1: Vector2, v2: Vector2): number {
		return v1.getDistanceTo(v2)
	}

	public static lerp(v1: Vector2, v2: Vector2, t: number) {
		const x = v1.x + (v2.x - v1.x) * t
		const y = v1.y + (v2.y - v1.y) * t
		return new Vector2(x, y)
	}
}
