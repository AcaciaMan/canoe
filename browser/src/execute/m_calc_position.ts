import { M_Me } from "../perspective/m_me";
import { M_Scene } from "../perspective/m_scene";

export class M_CalcPosition {
  mMe: M_Me = M_Me.getInstance();
  mScene: M_Scene = M_Scene.getInstance();


  constructor() {}

  calcDistance(x: number, y: number): number {

    // calculate distance between me and element in meters
    const metersX = (this.mScene.width / 2 - x);

    return Math.sqrt(metersX * metersX + y*y);

  }

}