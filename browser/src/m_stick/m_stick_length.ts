import { M_Camera_Boat } from "../perspective/m_camera";
import { M_Scene } from "../perspective/m_scene";

export class M_Stick_Length {

  //singleton
    private static instance: M_Stick_Length;
    static getInstance() {
        if (!M_Stick_Length.instance) {
            M_Stick_Length.instance = new M_Stick_Length();
        }
        return M_Stick_Length.instance;
    }


  // Given points
  points: [number, number][] = [
    [2.6, 10],
    [3.2, 8],
    [4.5, 6],
    [7, 4.2],
    [100, 1.7],
  ];

  mCameraBoat: M_Camera_Boat = M_Camera_Boat.getInstance() as M_Camera_Boat;

  constructor() {}

  get_length(d: number) {

    let cmLength = 0;
    if (d > 100) {
      return 0;
    } else if (d < 2.6) {
        // if the meters is 0, the length is 13 cm, if the meters is 2.6, the length is 10 cm
        // the length is linearly interpolated between 0 and 2.6

        cmLength = 13 - (d / 2.6) * (13 - 10);

    } else if (d < 3.2) {
        // if the meters is 2.6, the length is 10 cm, if the meters is 3.2, the length is 8 cm
        // the length is linearly interpolated between 2.6 and 3.2
        cmLength = 10 - (d - 2.6) * (10 - 8) / 0.6;
    } else if (d < 4.5) {
        // if the meters is 3.2, the length is 8 cm, if the meters is 4.5, the length is 6 cm
        // the length is linearly interpolated between 3.2 and 4.5
        cmLength = 8 - (d - 3.2) * (8 - 6) / 1.3;
    } else if (d < 7) {
        // if the meters is 4.5, the length is 6 cm, if the meters is 7, the length is 4.2 cm
        // the length is linearly interpolated between 4.5 and 7
        cmLength = 6 - (d - 4.5) * (6 - 4.2) / 2.5;
    } else if (d <= 100) {
        // if the meters is 7, the length is 4.2 cm, if the meters is 100, the length is 1.7 cm
        // the length is linearly interpolated between 7 and 100
        cmLength = 4.2 - (d - 7) * (4.2 - 1.7) / 93;
    }


    return cmLength*this.mCameraBoat.height/this.mCameraBoat.cmHeight; 
    
  }

  get_width(d: number) {

    let pixels = 0;
    if (d > 100) {
      return 0;
    } else if (d < 2.6) {
        pixels = 11;
    } else if (d < 3.2) {
        // if the meters is 2.6, the width is 11 pixels, if the meters is 3.2, the width is 6 pixels
        // the width is linearly interpolated between 2.6 and 3.2
        pixels = 11 - (d - 2.6) * (11 - 6) / 0.6;
    } else if (d < 4.5) {
        // if the meters is 3.2, the width is 6 pixels, if the meters is 4.5, the width is 5 pixels
        // the width is linearly interpolated between 3.2 and 4.5
        pixels = 6 - (d - 3.2) * (6 - 5) / 1.3;
    } else if (d < 7) {
        // if the meters is 4.5, the width is 5 pixels, if the meters is 7, the width is 4 pixels
        // the width is linearly interpolated between 4.5 and 7
        pixels = 5 - (d - 4.5) * (5 - 4) / 2.5;
    } else if (d < 80) {
        // if the meters is 7, the width is 4 pixels, if the meters is 80, the width is 3 pixels
        // the width is linearly interpolated between 7 and 80
        pixels = 4 - (d - 7) * (4 - 3) / 73;
    } else {
        pixels = 2;
    }

    return pixels; 
    
  }


}
