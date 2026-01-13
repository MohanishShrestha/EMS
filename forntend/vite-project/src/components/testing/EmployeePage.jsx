export const filterEmployees = (employees, searchTerm) => {
  if (!Array.isArray(employees)) return [];
  return employees
    .filter((emp) => emp.role !== "admin")
    .filter((emp) =>
      Object.values(emp).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
};
export const paginate = (items, page, perPage) =>
  items.slice((page - 1) * perPage, page * perPage);

export const validateEmployee = (emp) => {
  if (!emp.name || !emp.email) return false;
  return true;
};
