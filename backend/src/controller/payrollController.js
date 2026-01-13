import expressAsyncHandler from "express-async-handler";
import ExcelJS from "exceljs";
import Payroll from "../schema/PayrollSchema.js";
// Create a new payroll record

// export const createPayrollController = expressAsyncHandler(async (req, res) => {
//     const employeeId = req.employee?.id;
//   const {  annual_salary } = req.body;
//   if ( !annual_salary ) {
//     return res
//       .status(400)
//       .json({ message: "All payroll fields are required." });
//   }
//   const newPayroll = new Payroll({
//     employee: employeeId,
//     net_pay,
//     pay_period_start: new Date(pay_period_start),
//     pay_period_end: new Date(pay_period_end),
//   });
//   const result = await newPayroll.save();
//   res.status(201).json({
//     success: true,
//     message: "Payroll record created successfully",
//     result,
//   });
// });
export const createPayrollController = expressAsyncHandler(async (req, res) => {
  const { employee_id, annual_salary } = req.body;

  if (!employee_id || !annual_salary) {
    return res.status(400).json({ message: "All payroll fields are required." });
  }

  const newPayroll = new Payroll({
    employee_id,
    annual_salary,
  });

  const result = await newPayroll.save();

  res.status(201).json({
    success: true,
    message: "Payroll record created successfully",
    result,
  });
});


// Get all payroll records for all employees
export const getAllPayrollsController = expressAsyncHandler(
  async (req, res) => {
    const payrolls = await Payroll.find({}).populate(
      "employee_id",
      "name email"
    );
    res.status(200).json({ success: true, count: payrolls.length, payrolls });
  }
);

// Get all payroll records for a specific employee
export const getEmployeePayrollsController = expressAsyncHandler(
  async (req, res) => {
    const employeeId = req.params.id;
    const payrolls = await Payroll.find({ employee_id: employeeId })
      .sort({ pay_period_start: -1 })
      .populate("employee_id", "name email");
    if (!payrolls.length) {
      return res
        .status(404)
        .json({ message: "No payroll records found for this employee." });
    }
    res.status(200).json({ success: true, count: payrolls.length, payrolls });
  }
);
// Generate Excel report for payroll
export const generatePayrollExcelReportController = expressAsyncHandler(
  async (req, res) => {
    try {
      const { employeeId, startDate, endDate } = req.query;

      // Build a query object based on filters
      const query = {};
      if (employeeId) query.employee_id = employeeId;
      if (startDate && endDate) {
        query.pay_period_start = { $gte: new Date(startDate) };
        query.pay_period_end = { $lte: new Date(endDate) };
      } else if (startDate) {
        query.pay_period_start = { $gte: new Date(startDate) };
      } else if (endDate) {
        query.pay_period_end = { $lte: new Date(endDate) };
      }
      const data = await Payroll.find(query).populate(
        "employee_id",
        "name email"
      );
      if (data.length === 0) {
        return res
          .status(404)
          .json({ message: "No payroll data found for the given criteria." });
      }

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Payroll Report");

      // Define worksheet headers
      worksheet.columns = [
        { header: "S.No", key: "sno", width: 6 },
        { header: "Employee Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Pay Period Start", key: "startDate", width: 20 },
        { header: "Pay Period End", key: "endDate", width: 20 },
        { header: "Net Pay ($)", key: "netPay", width: 15 },
      ];

      // Fill data rows
      data.forEach((entry, index) => {
        worksheet.addRow({
          sno: index + 1,
          name: entry.employee_id?.name || "N/A",
          email: entry.employee_id?.email || "N/A",
          startDate: new Date(entry.pay_period_start).toLocaleDateString(),
          endDate: new Date(entry.pay_period_end).toLocaleDateString(),
          netPay: entry.net_pay,
        });
      });

      // Make header row bold
      worksheet.getRow(1).font = { bold: true };

      // Generate buffer and send as a file
      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=payroll-report.xlsx"
      );
      res.setHeader("Content-Length", buffer.length);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ message: "Error generating report", error });
    }
  }
);
