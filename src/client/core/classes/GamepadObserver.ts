export class GamepadObserver {
  constructor(
    private readonly index: number,
    private readonly states = new Set<string>()) {}

  *buttons() {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.index];
    if (!gamepad) return;
    yield *this.checkAxes(gamepad);
    yield *this.checkButtons(gamepad);
  }

  private *checkAxes(gamepad: Gamepad) {
    for (let axisIndex = 0; axisIndex < gamepad.axes.length && axisIndex < 2; axisIndex++) {
      const axis = gamepad.axes[axisIndex];
      const i = axisIndex % 2 ? (axis < 0 ? 12 : 13) : (axis < 0 ? 14 : 15);
      const key = `axis-${i}`;
      if (Math.abs(axis) >= 0.5) {
        if (!this.states.has(key)) yield i;
        this.states.add(key);
      } else if (this.states.has(key)) {
        this.states.delete(key);
      }
    }
  }

  private *checkButtons(gamepad: Gamepad) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i];
      const key = `button-${i}`;
      if (button.pressed) {
        if (!this.states.has(key)) yield i;
        this.states.add(key);
      } else if (this.states.has(key)) {
        this.states.delete(key);
      }
    }
  }
}
