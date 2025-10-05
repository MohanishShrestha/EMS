import expressAsyncHandler from "express-async-handler";

import ExcelJS from "exceljs";
import Attendance from "../schema/AttendanceSchema.js";

export const manualAttendanceController = expressAsyncHandler(async (req, res) => {
    const { employee_id, date, checkIn, checkOut } = req.body;
    console.log(employee_id)
    console.log(date)

    if (!employee_id || !date ) {
        return res.status(400).json({ message: "Employee ID, Date (YYYY-MM-DD),  are required for manual entry." });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0); 

    const existing = await Attendance.findOne({
        employee: employee_id,
        date: attendanceDate,
    });

    if (existing) {
        return res.status(400).json({
            message: "An attendance record already exists for this employee on this date. Use the update route instead.",
            record: existing
        });
    }

    // Create the new attendance record
    const attendance = new Attendance({
        employee: employee_id,
        date: attendanceDate,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
    });

    const result = await attendance.save();

    res.status(201).json({
        success: true,
        message: "Manual attendance record created successfully.",
        result,
    });
});

export const checkInController = expressAsyncHandler(async (req, res, next) => {
  
  const employeeId = req.employee?.id;
  console.log(employeeId)
  const today = new Date();
  console.log(today)
  today.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({
    employee: employeeId,
    date: today,
  });
  console.log(existing)
  if (existing) {
    return res.status(400).json({ message: "Already checked in today." });
  }

  const attendance = new Attendance({
    employee: employeeId,
    date: today,
    checkIn: new Date().toLocaleTimeString(),
  });

  const result = await attendance.save();

  res.status(201).json({
    success: true,
    message: "Check-in successful",
    result,
  });
});

export const checkOutController = expressAsyncHandler(
  async (req, res, next) => {
    const employeeId = req.employee?.id;

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No check-in record found for today." });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today." });
    }

    attendance.checkOut = now.toLocaleTimeString();
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      result: attendance,
    });
  }
);

export const applyLeaveController = expressAsyncHandler(async (req, res) => {
  const employeeId = req.employee?.id;
  const { date } = req.body;

  // if (!employeeId) {
  //   return res.status(401).json({ message: "Unauthorized. Please log in." });
  // }

  if (!date) {
    return res.status(400).json({ message: "Leave date is required." });
  }

  const leaveDate = new Date(date);
  leaveDate.setHours(0, 0, 0, 0); // normalize to midnight

  // Check if record already exists
  const existing = await Attendance.findOne({
    employee: employeeId,
    date: leaveDate,
  });

  if (existing) {
    return res.status(400).json({ message: "Already marked for this date." });
  }

  const leave = new Attendance({
    employee: employeeId,
    date: leaveDate,
    status: "Leave",
  });

  const result = await leave.save();

  res.status(201).json({
    success: true,
    message: "Leave applied successfully.",
    result,
  });
});

export const getEmployeeAttendanceController = expressAsyncHandler(
  async (req, res) => {
    const employeeId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const records = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 }) // Sort by newest date first
      .populate("employee", "name email"); // Populate employee info if needed

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  }
);


export const generateExcelReportController = expressAsyncHandler(
  async (req, res) => {
    try {
      const { employeeId, startDate, endDate } = req.query;
      // e.g. /api/reports/excel?employeeId=123&startDate=2025-09-01&endDate=2025-09-20

      // Build query object
      const query = {};
      if (employeeId) query.employee = employeeId;
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        query.date = { $gte: new Date(startDate) };
      } else if (endDate) {
        query.date = { $lte: new Date(endDate) };
      }

      // Fetch data with filters
      const data = await Attendance.find(query).populate(
        "employee",
        "name email"
      );

      // Create workbook + sheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Attendance Report");

      worksheet.columns = [
        { header: "S.No", key: "sno", width: 6 },
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Date", key: "date", width: 15 },
        { header: "Check In", key: "checkIn", width: 15 },
        { header: "Check Out", key: "checkOut", width: 15 },
        { header: "Status", key: "status", width: 12 },
      ];

      // Fill rows
      data.forEach((entry, index) => {
        worksheet.addRow({
          sno: index + 1,
          name: entry.employee?.name || "N/A",
          email: entry.employee?.email || "N/A",
          date: new Date(entry.date).toLocaleDateString(),
          checkIn: entry.checkIn
            ? new Date(entry.checkIn).toLocaleTimeString()
            : "-",
          checkOut: entry.checkOut
            ? new Date(entry.checkOut).toLocaleTimeString()
            : "-",
          status: entry.status || "Present",
        });
      });

      worksheet.getRow(1).font = { bold: true };

      // Generate buffer and send
      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance-report.xlsx"
      );
      res.setHeader("Content-Length", buffer.length);

      res.send(buffer);
    } catch (error) {
      res.status(500).json({ message: "Error generating report", error });
    }
  }
);

export const realAllAttendancesController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Attendance.find({});
    console.log(result);
    res.status(200).json({
      sucess: true,
      message: "all employee read successfully",
      result: result,
    });
  }
);

export const readSpecificAttendancesController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Attendance.findById(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const updateSpecificAttendancesController = expressAsyncHandler(
  async (req, res, next) => {
    let id = req.params.id;
    let data = req.body;
    delete data.email;
    delete data.password;

    let result = await Attendance.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const deleteSpecificAttendancesController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Attendance.findByIdAndDelete(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "delete successfully",
      result: result,
    });
  }
);
