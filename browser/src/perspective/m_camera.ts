import { M_Me } from "./m_me";
import { M_Scene } from "./m_scene";

export class M_Camera {
  // singleton
  static instance: M_Camera;
  static getInstance() {
    if (!M_Camera.instance) {
      M_Camera.instance = new M_Camera();
    }
    return M_Camera.instance;
  }

  width: number = 1000;
  height: number = 600;

  depth: number = 100;

  mMe: M_Me = M_Me.getInstance();
  mScene: M_Scene = M_Scene.getInstance();

  constructor() {}

  // Transform world coordinates to camera coordinates
  transform(x: number, y: number): { x: number; y: number } {
    return {
      x: x,
      y: y,
    };
  }
}

export class M_Camera_Top extends M_Camera {

    static topInstance: M_Camera_Top;
  static getInstance() {
    if (!M_Camera_Top.topInstance) {
      M_Camera_Top.topInstance = new M_Camera_Top();
    }
    return M_Camera_Top.topInstance;
  }

  private mTop: number = 10;
  private mRight: number = 10;
  private mBottom: number = 10;
  private mLeft: number = 10;

  constructor() {
    super();}

  // Transform world coordinates to camera coordinates
  transform(x: number, y: number): { x: number; y: number } {
    // if x = 0, then tarnsform to 0 + this.mLeft, if x=30, then transform to this.width - this.mRight
    const transx =
      ((this.width - this.mRight - this.mLeft) * x) / this.mScene.width +
      this.mLeft;

    let transy = this.mMe.transform(x, y).y;
    // if transy = 0, then transform to this.height - this.mTop, if transy=100, then transform to 0 + this.mBottom
    transy =
      this.height -
      this.mTop -
      ((this.height - this.mTop - this.mBottom) * transy) / this.depth;

    return {
      x: transx,
      y: transy,
    };
  }
}

export class M_Camera_Boat extends M_Camera {
    static boatInstance: M_Camera_Boat;
  static getInstance() {
    if (!M_Camera_Boat.boatInstance) {
      M_Camera_Boat.boatInstance = new M_Camera_Boat();
    }
    return M_Camera_Boat.boatInstance;
  }

  constructor() {
    super();
  }

  z: number = 1;

  horizon: number = 20;
  h = (this.height * this.horizon) / 100;


  perspective: number = 50;

  cmHeight: number = 18;
}