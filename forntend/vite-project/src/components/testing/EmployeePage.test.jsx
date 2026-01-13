import { filterEmployees } from "./EmployeePage";

test("filters employees by search term", () => {
  const employees = [
    { name: "Bipan", role: "staff" },
    { name: "Admin", role: "admin" },
    { name: "Keshav", role: "staff" },
  ];

  const result = filterEmployees(employees, "bip");
  expect(result).toEqual([{ name: "Bipan", role: "staff" }]);
});
