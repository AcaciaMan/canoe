import { M_CalcPosition } from "../execute/m_calc_position";
import { M_Stick_Length } from "../m_stick/m_stick_length";
import { M_Camera_Boat, M_Camera_Top } from "../perspective/m_camera";
import { M_Me } from "../perspective/m_me";
import { M_Scene } from "../perspective/m_scene";


describe("M_CalcPosition", () => {
  let calcPosition: M_CalcPosition;
  let mMe: M_Me = M_Me.getInstance();
  let mScene: M_Scene = M_Scene.getInstance();
  let mStickLength: M_Stick_Length = M_Stick_Length.getInstance();
  let mCameraTop: M_Camera_Top = M_Camera_Top.getInstance() as M_Camera_Top;

  beforeEach(() => {
    mMe.x = 0;
    mMe.y = 0;
    mMe.pressedy = 0;


    calcPosition = new M_CalcPosition();
  });


  test("calcDistance should calculate the correct distance", () => {
    const result = calcPosition.calcDistance(0, 0);
    expect(result).toBeCloseTo(15, 0);

    const result2 = calcPosition.calcDistance(15, 100);
    expect(result2).toBeCloseTo(100, 0);

    const result4 = calcPosition.calcDistance(12, 4);
    expect(result4).toBeCloseTo(5, 0);

    mMe.y = 10;
    let trans = mMe.transform(15, 10);
        const result5 = calcPosition.calcDistance(trans.x,trans.y);
        expect(result5).toBeCloseTo(0, 0);
  });

  test("calcWidth should calculate the correct width", () => {
    const result = mStickLength.get_width(20);
    expect(result).toBeCloseTo(3.5, 0);

  });

  test("mCameraTop transform", () => {
    const trans =  mCameraTop.transform(0, 0);
    expect(trans.x).toBeCloseTo(10, 0);
    expect(trans.y).toBeCloseTo(590, 0);

    const trans2 =  mCameraTop.transform(30, 300);
    expect(trans2.x).toBeCloseTo(990
      , 0);
    expect(trans2.y).toBeCloseTo(-1150, 0);

  });

  test("mCameraBoat transform", () => {
    const mCameraBoat = M_Camera_Boat.getInstance();
    const trans = mCameraBoat.transform(0, 0);
    expect(trans.x).toBeCloseTo(-500, 0);
    expect(trans.y).toBeCloseTo(600, 0);

    const trans2 = mCameraBoat.transform(16, 1.3);
    expect(trans2.x).toBeCloseTo(558,0);
    expect(trans2.y).toBeCloseTo(540,0);


  });

});
