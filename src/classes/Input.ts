import OsuEngine from './OsuEngine'
import Vector2 from './Vector2'

export default class Input {
	private static eventsRegistered: boolean = this.registerEventListeners()

	//### Input Data
	private static states: Map<Key | Button, InputState> = new Map()
	private static cursorPosition: Vector2 = new Vector2()
	private static mouseWheelState: MouseWheelState = { x: 0, y: 0, z: 0, frame: 0 }
	private static lastPressedKey: Key | null = null
	private static lastPressedButton: Button | null = null
	private static lastInputTimeStamp: number = 0

	private static ignoreKeyHolding: boolean = true
	private static preventingDefaults: boolean = true

	//### Disabled constructor
	private constructor() {
		throw new Error('This is static-only class')
	}

	//### Private methods
	private static registerEventListeners(): boolean {
		if (this.eventsRegistered) return true
		window.addEventListener('keydown', this.keyboardEventHandler.bind(this))
		window.addEventListener('keyup', this.keyboardEventHandler.bind(this))
		window.addEventListener('mousedown', this.mouseEventHandler.bind(this))
		window.addEventListener('mouseup', this.mouseEventHandler.bind(this))
		window.addEventListener('mousemove', this.onMouseMoveHandler.bind(this))
		window.addEventListener('wheel', this.onMouseWheelHandler.bind(this))
		window.addEventListener('blur', this.onFocusLostHandler.bind(this))
		return true
	}

	private static registerDefaultPreventers(): void {
		window.addEventListener('contextmenu', this.preventDefaultsHandler.bind(this))
		window.addEventListener('keypress', this.preventDefaultsHandler.bind(this))
	}

	private static unregisterDefaultPreventers(): void {
		window.removeEventListener('contextmenu', this.preventDefaultsHandler.bind(this))
		window.removeEventListener('keypress', this.preventDefaultsHandler.bind(this))
	}

	private static keyboardEventHandler(event: KeyboardEvent) {
		const { code, type, repeat, timeStamp } = event

		if (repeat && this.ignoreKeyHolding) return
		const state = type === 'keydown'
		const frame = OsuEngine.getFrameCount()
		this.states.set(code as Key, { frame, state })
		if (state) this.lastPressedKey = code as Key
		this.lastInputTimeStamp = timeStamp
	}

	private static mouseEventHandler(event: MouseEvent): void {
		const { button, type, timeStamp } = event

		const state = type === 'mousedown'
		const frame = OsuEngine.getFrameCount()
		this.states.set(button as Button, { frame, state })
		if (state) this.lastPressedButton = button as Button
		this.lastInputTimeStamp = timeStamp
	}

	private static onMouseMoveHandler(event: MouseEvent): void {
		const { clientX, clientY, timeStamp } = event
		this.cursorPosition.set(clientX, clientY)
		this.lastInputTimeStamp = timeStamp
	}

	private static onMouseWheelHandler(event: WheelEvent): void {
		const { deltaX: x, deltaY: y, deltaZ: z, timeStamp } = event
		const frame = OsuEngine.getFrameCount()
		this.mouseWheelState = { x, y, z, frame }
		this.lastInputTimeStamp = timeStamp
	}

	private static onFocusLostHandler(): void {
		//unPress all inputs
		for (const [key] of this.states) {
			this.states.delete(key)
		}
	}

	private static preventDefaultsHandler(event: Event): void {
		event.preventDefault()
	}

	private static getState(code: Key | Button): InputState {
		if (this.states.has(code)) {
			return this.states.get(code)!
		} else
			return {
				state: false,
				frame: 0,
			}
	}

	/** Returns true while the user holds down the {@link Key} / {@link Button}. */
	public static get(code: Key | Button): boolean {
		return this.getState(code).state
	}

	/** Returns true during the frame the user releases the {@link Key} / {@link Button}. */
	public static getUp(code: Key | Button): boolean {
		const { state, frame } = this.getState(code)
		return frame === OsuEngine.getFrameCount() && state === false
	}

	/** Returns true during the frame the user starts pressing down the {@link Key} / {@link Button}. */
	public static getDown(code: Key | Button): boolean {
		const { state, frame } = this.getState(code)
		return frame === OsuEngine.getFrameCount() && state === true
	}

	//Public Getters
	/** Is any {@link Key} (Keyboard) currently held down? */
	public static getAnyKey(): boolean {
		for (const [key, value] of this.states) {
			if (typeof key === 'number') continue
			if (value.state) return true
		}
		return false
	}

	/** Was any {@link Key} (Keyboard) pressed since last frame? */
	public static getAnyKeyDown(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'number') continue
			if (frame == OsuEngine.getFrameCount() && state === true) return true
		}
		return false
	}

	/** Was any {@link Key} (Keyboard) released since last frame? */
	public static getAnyKeyUp(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'number') continue
			if (frame == OsuEngine.getFrameCount() && state === false) return true
		}
		return false
	}

	/** Is any {@link Button} (Mouse) currently held down? */
	public static getAnyMouseButton(): boolean {
		for (const [key, value] of this.states) {
			if (typeof key === 'string') continue
			if (value.state) return true
		}
		return false
	}

	/** Was any {@link Button} (Mouse) pressed since last frame? */
	public static getAnyMouseButtonDown(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'string') continue
			if (frame == OsuEngine.getFrameCount() && state === true) return true
		}
		return false
	}

	/** Was any {@link Button} (Mouse) released since last frame? */
	public static getAnyMouseButtonUp(): boolean {
		for (const [key, { frame, state }] of this.states) {
			if (typeof key === 'string') continue
			if (frame == OsuEngine.getFrameCount() && state === false) return true
		}
		return false
	}

	/** What was the least recently pressed {@link Key} (Keyboard)? */
	public static getLastPressedKey(): Key | null {
		return this.lastPressedKey
	}

	/** What was the least recently pressed {@link Button} (Mouse)? */
	public static getLastPressedMouseButton(): Button | null {
		return this.lastPressedButton
	}

	/** Array of currently pressed {@link Key}s */
	public static getCurrentlyPressedKeys(): Key[] {
		const keys = []
		for (const [key, value] of this.states) {
			if (typeof key === 'number') continue
			if (value.state) keys.push(key)
		}
		return keys
	}

	/** Array of currently pressed {@link Button}s */
	public static getCurrentlyPressedButtons(): Button[] {
		const buttons = []
		for (const [key, value] of this.states) {
			if (typeof key === 'string') continue
			if (value.state) buttons.push(key)
		}
		return buttons
	}

	/** Current cursor position relative to page */
	public static getCursorPosition(): Vector2 {
		return this.cursorPosition.clone()
	}

	/** User scroll values during this frame */
	public static getMouseWheel(): MouseWheelState {
		return this.mouseWheelState
	}

	public static getLastInputTimeStamp(): number {
		return this.lastInputTimeStamp
	}

	public static getIdleTime(): number {
		return performance.now() - this.lastInputTimeStamp
	}

	public static isPreventingDefaults(): boolean {
		return this.preventingDefaults
	}

	public static setPreventingDefaults(value: boolean): void {
		if (value === this.preventingDefaults) return
		this.preventingDefaults = value
		if (value) this.registerDefaultPreventers()
		else this.unregisterDefaultPreventers()
	}
}

export enum Key {
	//Arrows
	ArrowUp = 'ArrowUp',
	ArrowLeft = 'ArrowLeft',
	ArrowDown = 'ArrowDown',
	ArrowRight = 'ArrowRight',

	//Functional
	F1 = 'F1',
	F2 = 'F2',
	F3 = 'F3',
	F4 = 'F4',
	F5 = 'F5',
	F6 = 'F6',
	F7 = 'F7',
	F8 = 'F8',
	F9 = 'F9',
	F10 = 'F10',
	F11 = 'F11',
	F12 = 'F12',

	//Operational
	End = 'End',
	Home = 'Home',
	Pause = 'Pause',
	Insert = 'Insert',
	PageUp = 'PageUp',
	Delete = 'Delete',
	PageDown = 'PageDown',
	ScrollLock = 'ScrollLock',
	PrintScreen = 'PrintScreen',

	//Special
	Tab = 'Tab',
	Slash = 'Slash',
	Quote = 'Quote',
	Comma = 'Comma',
	Space = 'Space',
	Enter = 'Enter',
	Escape = 'Escape',
	Period = 'Period',
	AltLeft = 'AltLeft',
	CapsLock = 'CapsLock',
	AltRight = 'AltRight',
	Backspace = 'Backspace',
	Semicolon = 'Semicolon',
	ShiftLeft = 'ShiftLeft',
	Backslash = 'Backslash',
	Backquote = 'Backquote',
	ShiftRight = 'ShiftRight',
	BracketLeft = 'BracketLeft',
	ControlLeft = 'ControlLeft',
	BracketRight = 'BracketRight',
	ControlRight = 'ControlRight',

	//Letters
	A = 'KeyA',
	B = 'KeyB',
	C = 'KeyC',
	D = 'KeyD',
	E = 'KeyE',
	F = 'KeyF',
	G = 'KeyG',
	H = 'KeyH',
	I = 'KeyI',
	J = 'KeyJ',
	K = 'KeyK',
	L = 'KeyL',
	M = 'KeyM',
	N = 'KeyN',
	O = 'KeyO',
	P = 'KeyP',
	Q = 'KeyQ',
	R = 'KeyR',
	S = 'KeyS',
	T = 'KeyT',
	U = 'KeyU',
	V = 'KeyV',
	W = 'KeyW',
	X = 'KeyX',
	Y = 'KeyY',
	Z = 'KeyZ',

	//Numerals
	Minus = 'Minus',
	Equal = 'Equal',
	Digit1 = 'Digit1',
	Digit2 = 'Digit2',
	Digit3 = 'Digit3',
	Digit4 = 'Digit4',
	Digit5 = 'Digit5',
	Digit6 = 'Digit6',
	Digit7 = 'Digit7',
	Digit8 = 'Digit8',
	Digit9 = 'Digit9',
	Digit0 = 'Digit0',

	//Numpad
	NumLock = 'NumLock',
	Numpad0 = 'Numpad0',
	Numpad1 = 'Numpad1',
	Numpad2 = 'Numpad2',
	Numpad3 = 'Numpad3',
	Numpad4 = 'Numpad4',
	Numpad5 = 'Numpad5',
	Numpad6 = 'Numpad6',
	Numpad7 = 'Numpad7',
	Numpad8 = 'Numpad8',
	Numpad9 = 'Numpad9',
	NumpadAdd = 'NumpadAdd',
	NumpadEnter = 'NumpadEnter',
	NumpadDivide = 'NumpadDivide',
	NumpadDecimal = 'NumpadDecimal',
	NumpadSubtract = 'NumpadSubtract',
	NumpadMultiply = 'NumpadMultiply',
}

export enum Button {
	Left = 0,
	Middle = 1,
	Right = 2,
	Back = 3,
	Forward = 4,
}

type InputState = { state: boolean; frame: number }

type MouseWheelState = { x: number; y: number; z: number; frame: number }
