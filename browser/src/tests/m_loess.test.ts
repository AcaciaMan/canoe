import { Loess } from "../util/m_loess";

describe("M_Loess", () => {
    let loess: Loess;
    
    beforeEach(() => {
        loess = new Loess(0.5);
    });
    
    test("calculateWeights should calculate the correct weights", () => {
        const result = loess.calculateWeights(new Uint8Array([0, 1, 2]), 1);
        expect(result).toEqual([0.5, 1, 0.5]);
    });
    
    test("smooth should calculate the correct smoothed values", () => {
        const result = loess.smooth(new Uint8Array([0, 1, 2]), [0, 1, 2]);
        expect(result).toEqual([0, 1, 2]);
    });

    test("arrays should be the same length", () => {
        const a = new Uint8Array([4, 5, 6]);
        const b = [...a].map((_,idx) => idx);
        console.log(b);
    }

);
})