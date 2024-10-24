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

    // if transy = 0, then transform to this.height - this.mTop, if transy=100, then transform to 0 + this.mBottom
    const transy =
      this.height -
      this.mTop -
      ((this.height - this.mTop - this.mBottom) * y) / this.depth;

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

  points: [number, number][] = [
    [0,200],
    [2.6, 150],
    [3.2, 130],
    [4.5, 115],
    [7, 100],
    [100, 80],
  ];

  pointsy: [number, number][] = [
    [2.6, 20],
    [3.2, 25],
    [4.5, 30],
    [7, 50],
    [100, 100],
  ];

  cmHeight: number = 18;

    // Transform world coordinates to camera coordinates
    transform(x: number, y: number): { x: number; y: number } {
        let transx = 0;
        let diffy = 0;
        let diffp = 0;
        let totalwidth = 100;
        const absy = Math.abs(y);
        // if y=0, if x = 0, then tarnsform to 0, if x=30, then transform to this.width
        if (absy < 0.01) {
            totalwidth = this.width*2;
                     transx =
                       (this.width - totalwidth) / 2 +
                       (totalwidth * x) / this.mScene.width;
        } else if (absy < 2.6) {
          // if y = 0.01 meters, x is 100% of the width (the total width for 30 meters is 1000 pixels)
          // if y = 2.6 meters, x is 97% of the width (the total width for 30 meters is 970 pixels)
          // the x is linearly interpolated between y meters 0 and 2.6
          diffy = 2.6 - absy;
          diffp = ((200 - 150) * diffy) / 2.6;
          totalwidth = ((150 + diffp) * this.width) / 100;
          transx =
            (this.width - totalwidth) / 2 +
            (totalwidth * x) / this.mScene.width;
        } else if (absy < 3.2) {
          // if y = 2.6 meters, x is 97% of the width (the total width for 30 meters is 970 pixels)
          // if y = 3.2 meters, x is 95% of the width (the total width for 30 meters is 950 pixels)
          // the x is linearly interpolated between y meters 2.6 and 3.2
          diffy = 3.2 - absy;
          diffp = ((150 - 130) * diffy) / 0.6;
          totalwidth = ((130 + diffp) * this.width) / 100;
          transx =
            (this.width - totalwidth) / 2 +
            (totalwidth * x) / this.mScene.width;
        } else if (absy < 4.5) {
          // if y = 3.2 meters, x is 95% of the width (the total width for 30 meters is 950 pixels)
          // if y = 4.5 meters, x is 90% of the width (the total width for 30 meters is 900 pixels)
          // the x is linearly interpolated between y meters 3.2 and 4.5
          diffy = 4.5 - absy;
          diffp = ((130 - 115) * diffy) / 1.3;
          totalwidth = ((115 + diffp) * this.width) / 100;
          transx =
            (this.width - totalwidth) / 2 +
            (totalwidth * x) / this.mScene.width;
        } else if (absy < 7) {
          // if y = 4.5 meters, x is 90% of the width (the total width for 30 meters is 900 pixels)
          // if y = 7 meters, x is 85% of the width (the total width for 30 meters is 850 pixels)
          // the x is linearly interpolated between y meters 4.5 and 7
          diffy = 7 - absy;
          diffp = ((115 - 100) * diffy) / 2.5;
          totalwidth = ((100 + diffp) * this.width) / 100;
          transx =
            (this.width - totalwidth) / 2 +
            (totalwidth * x) / this.mScene.width;
        } else if (absy <= 100) {
          // if y = 7 meters, x is 85% of the width (the total width for 30 meters is 850 pixels)
          // if y = 100 meters, x is 80% of the width (the total width for 30 meters is 800 pixels)
          // the x is linearly interpolated between y meters 7 and 100
          diffy = 100 - absy;
          diffp = ((100 - 80) * diffy) / 93;
          totalwidth = ((80 + diffp) * this.width) / 100;
          transx =
            (this.width - totalwidth) / 2 +
            (totalwidth * x) / this.mScene.width;
        } else {
          diffy = 0;
          diffp = 0;
          totalwidth = (80 * this.width) / 100;
          transx =
            (this.width - totalwidth) / 2 +
            (totalwidth * x) / this.mScene.width;
        }

        let transy = 0;
        let diff = 0;
        let diffpy = 0;
        let totalheight = 100;
        const signy = y < 0 ? -1 : 1;

        if (absy < 2.6) {
            diff = 2.6 - absy;
            diffpy = 20*diff/2.6;
            totalheight = this.height*(20-diffpy)/100;
            transy = (this.height - totalheight*signy);
        } else if (absy < 3.2) {
            diff = 3.2 - absy;
            diffpy = (25-20)*diff/0.6;
            totalheight = this.height*(25-diffpy)/100;
            transy = (this.height - totalheight*signy);
        }   else if (absy < 4.5) {
            diff = 4.5 - absy;
            diffpy = (30-25)*diff/1.3;
            totalheight = this.height*(30-diffpy)/100;
            transy = (this.height - totalheight*signy);
        } else if (absy < 7) {
            diff = 7 - absy;
            diffpy = (50-30)*diff/2.5;
            totalheight = this.height*(50-diffpy)/100;
            transy = (this.height - totalheight*signy);
        } else if (absy <= 100) {
            diff = 100 - absy;
            diffpy = (100-50)*diff/93;
            totalheight = this.height*(100-diffpy)/100;
            transy = (this.height - totalheight*signy);
        } else {
            totalheight = this.height*10;
            transy = (this.height - totalheight*signy);
        }
 
        return  {
            x: transx,
            y: transy,
        };

    }
}