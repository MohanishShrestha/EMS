import { paginate } from "./EmployeePage";

test("paginates employees correctly", () => {
  const items = [1, 2, 3, 4, 5, 6];
  const result = paginate(items, 2, 3);
  expect(result).toEqual([4, 5, 6]);
});
