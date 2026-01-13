import { validateEmployee } from "./EmployeePage";

test("validates employee data correctly", () => {
  expect(validateEmployee({ name: "Bipan", email: "Bipan@gmail.com" })).toBe(true);
  expect(validateEmployee({ name: "", email: "Bipan@gmail.com" })).toBe(false);
});
