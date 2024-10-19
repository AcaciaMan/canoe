import { M_Me } from "../perspective/m_me";
import { M_Scene } from "../perspective/m_scene";

export class M_CalcPosition {
  mMe: M_Me = M_Me.getInstance();
  mScene: M_Scene = M_Scene.getInstance();
  distance0r = this.mScene.width / 30;
  distance600r = this.mScene.width / 60;

  constructor() {}
  // calculate position of svg elements
  calcPosition(x: number, y: number): { x: number; y: number } {
    const result: { x: number; y: number } = { x: 0, y: 0 };

    // calculate distance between me and element
    // scene height is 100m, scene width is 30m, element y is 30m, me y is 0m, me x means 15m, element x is 5m, at what pixel should the element be drawn?
    // scene height - (scene height * element y / 100) + me y
    // 0 + (scene width * element x / 30) + me x

    result.x = (this.mScene.width * x) / 30;
    result.y =
      this.mScene.height -
      (this.mScene.height * y) / 100 +
      this.mMe.y +
      this.mMe.pressedy;
    return result;
  }

  calcDistance(x: number, y: number): number {
    return Math.sqrt(
      (this.mMe.x + this.mScene.width / 2 - x) *
        (this.mMe.x + this.mScene.width / 2 - x) +
        (this.mMe.y + this.mMe.pressedy - y + this.mScene.height) *
          (this.mMe.y + this.mMe.pressedy - y + this.mScene.height)
    );
  }

  calcHeight(distance: number, mH: number): number {
    return this.distance0r * mH - ((this.distance0r - this.distance600r) * distance * mH/ 600);
  }
}