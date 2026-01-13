import { calculatePercentageWorking } from "./calculateWorkforce";

describe("calculatePercentageWorking", () => {
  it("calculates correct percentage when some employees are working", () => {
    expect(calculatePercentageWorking(5, 10)).toBe(50);
  });

  it("returns 0 when no employees are working", () => {
    expect(calculatePercentageWorking(0, 10)).toBe(0);
  });

  it("returns 0 when totalEmployees is 0 (avoid division by zero)", () => {
    expect(calculatePercentageWorking(5, 0)).toBe(0);
  });

  it("rounds percentage to nearest whole number", () => {
    expect(calculatePercentageWorking(3, 7)).toBe(43); 
})});
