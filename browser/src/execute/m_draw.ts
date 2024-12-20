import { M_Stick_Length } from "../m_stick/m_stick_length";
import { M_Camera, M_Camera_Top } from "../perspective/m_camera";
import { M_Me } from "../perspective/m_me";
import { M_Scene } from "../perspective/m_scene";
import { M_CalcPosition } from "./m_calc_position";

export class M_Draw {
  mMe: M_Me = M_Me.getInstance();
  mScene: M_Scene = M_Scene.getInstance();

  constructor() {
    }
    // create svg image in resources folder to draw a line 
    createSvg(mCamera: M_Camera, x: number, y: number, color: string, d: number) {
        return {s: "", sDelete: ""};
    }

    drawBorder() {

        return {s : "", sDelete : ""};
    }

}

export class M_Draw_Top extends M_Draw {

    mCameraTop: M_Camera_Top;
    constructor() {
        super();
        this.mCameraTop = M_Camera_Top.getInstance() as M_Camera_Top;
    }


    createSvg(mCamera: M_Camera,  x: number, y: number, color: string, d: number) {
        let s = "";
        let sDelete = "";

        const mPosition = mCamera.transform(x, y);



        // draw a circle radius 2 pixels
        s += `<circle cx="${mPosition.x}" cy="${mPosition.y}" r="4" fill="${color}" />`;
        sDelete += `<circle cx="${mPosition.x}" cy="${mPosition.y}" r="4" stroke="white" stroke-width="3" fill="white" />`;
        return {s : s, sDelete : sDelete};
    }

    drawBorder() {
        let s = "";
        let sDelete = "";

        const mSceneBL = this.mMe.transform(0, 0);
        const mSceneTR = this.mMe.transform(this.mScene.width, this.mScene.height);



        // draw a rectangle for the scene
        const mBottomLeft = this.mCameraTop.transform(mSceneBL.x, mSceneBL.y);
        const mTopRight = this.mCameraTop.transform(mSceneTR.x, mSceneTR.y);

        //s+= `<rect x="${mBottomLeft.x}" y="${mTopRight.y}" width="${mTopRight.x - mBottomLeft.x}" height="${mBottomLeft.y - mTopRight.y}" stroke="black" />`;
        //sDelete += `<rect x="${mBottomLeft.x}" y="${mTopRight.y}" width="${mTopRight.x - mBottomLeft.x}" height="${mBottomLeft.y - mTopRight.y}" stroke="white" stroke-width="2" />`;
        s+=`<line x1="${mBottomLeft.x}" y1="${mBottomLeft.y}" x2="${mTopRight.x}" y2="${mBottomLeft.y}" stroke="black" />`;
        s+=`<line x1="${mTopRight.x}" y1="${mBottomLeft.y}" x2="${mTopRight.x}" y2="${mTopRight.y}" stroke="black" />`;
        s+=`<line x1="${mTopRight.x}" y1="${mTopRight.y}" x2="${mBottomLeft.x}" y2="${mTopRight.y}" stroke="black" />`;
        s+=`<line x1="${mBottomLeft.x}" y1="${mTopRight.y}" x2="${mBottomLeft.x}" y2="${mBottomLeft.y}" stroke="black" />`;

        



        sDelete+=`<line x1="${mBottomLeft.x}" y1="${mBottomLeft.y}" x2="${mTopRight.x}" y2="${mBottomLeft.y}" stroke="white" stroke-width="3" />`;
        sDelete+=`<line x1="${mTopRight.x}" y1="${mBottomLeft.y}" x2="${mTopRight.x}" y2="${mTopRight.y}" stroke="white" stroke-width="3" />`;
        sDelete+=`<line x1="${mTopRight.x}" y1="${mTopRight.y}" x2="${mBottomLeft.x}" y2="${mTopRight.y}" stroke="white" stroke-width="3" />`;
        sDelete+=`<line x1="${mBottomLeft.x}" y1="${mTopRight.y}" x2="${mBottomLeft.x}" y2="${mBottomLeft.y}" stroke="white" stroke-width="3" />`;


        return {s : s, sDelete : sDelete};
    }


}

export class M_Draw_Boat extends M_Draw {
  mH: number = 2;
  mW: number = 0.15;
  mWater: number = 0.3;
  mCalcPosition: M_CalcPosition = new M_CalcPosition();
  mStickLength: M_Stick_Length = M_Stick_Length.getInstance();

  constructor() {
    super();
  }

  createSvg(mCamera: M_Camera, x: number, y: number, color: string, d: number) {
    let s = "";
    let sDelete = "";

    const mPosition = mCamera.transform(x, y);

    // draw a stick length 30 pixels, width 5 pixels from top 30 pixels of the scene
    const rectWidth = this.mStickLength.get_width(d);
    const rectHeight = this.mStickLength.get_length(d);


    s += `<rect x="${mPosition.x}" y="${mPosition.y-rectHeight}" width="${rectWidth}" height="${rectHeight}" fill="${color}" />`;
    sDelete += `<rect x="${mPosition.x}" y="${mPosition.y-rectHeight}" width="${rectWidth}" height="${rectHeight}" fill="white" stroke="white" stroke-width="2" />`;

    return { s: s, sDelete: sDelete };
  }
}