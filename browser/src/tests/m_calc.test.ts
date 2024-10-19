import { M_CalcPosition } from "../execute/m_calc_position";
import { M_Me } from "../perspective/m_me";
import { M_Scene } from "../perspective/m_scene";


describe("M_CalcPosition", () => {
  let calcPosition: M_CalcPosition;
  let mMe: M_Me = M_Me.getInstance();
  let mScene: M_Scene = M_Scene.getInstance();

  beforeEach(() => {
    mMe.x = 0;
    mMe.y = 0;
    mMe.pressedy = 0;


    calcPosition = new M_CalcPosition();
  });

  test("calcPosition should calculate the correct position", () => {
    const result = calcPosition.calcPosition(15, 0);
    expect(result).toEqual({ x: 500, y: 600 });

    mMe.y = -100;
    const result2 = calcPosition.calcPosition(15, 0);
    expect(result2).toEqual({ x: 500, y: 500 });
  });

  test("calcDistance should calculate the correct distance", () => {
    const result = calcPosition.calcDistance(500, 600);
    expect(result).toBeCloseTo(0, 0);

    const result2 = calcPosition.calcDistance(500, 700);
    expect(result2).toBeCloseTo(100, 0);

    const result3 = calcPosition.calcDistance(500, 800);
    expect(result3).toBeCloseTo(200, 0);

    const result4 = calcPosition.calcDistance(839, 31);
    expect(result4).toBeCloseTo(662, 0);

    mMe.y = -100;
        const result5 = calcPosition.calcDistance(500, 500);
        expect(result5).toBeCloseTo(100, 0);
  });

  test("calcHeight should calculate the correct height", () => {
    const result = calcPosition.calcHeight(0, 1);
    expect(result).toBeCloseTo(33, 0);

    const result2 = calcPosition.calcHeight(0, 2);
    expect(result2).toBeCloseTo(67, 0);

    const result3 = calcPosition.calcHeight(300, 1);
    expect(result3).toBeCloseTo(25, 0);

    const result4 = calcPosition.calcHeight(300, 2);
    expect(result4).toBeCloseTo(50, 0);

    const result5 = calcPosition.calcHeight(0, 0.30);
    expect(result5).toBeCloseTo(10, 0);

    const result6 = calcPosition.calcHeight(662, 2);
    expect(result6).toBeCloseTo(30, 0);
  });
});
