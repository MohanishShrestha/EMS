import { Router } from "express";
import {
  createPayrollController,
  generatePayrollExcelReportController,
  getAllPayrollsController,
  getEmployeePayrollsController,
} from "../controller/payrollController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const payrollRouter = Router();

// Routes for creating and getting all payroll records
payrollRouter
  .route("/")
  .post(isAuthenticated, createPayrollController)
  .get(isAuthenticated, getAllPayrollsController);

// Route for getting an individual employee's payroll history
payrollRouter.route("/:id").get(isAuthenticated, getEmployeePayrollsController);

// Route for generating and downloading an Excel payroll report
payrollRouter
  .route("/export/excel")
  .get(isAuthenticated, generatePayrollExcelReportController);

export default payrollRouter;
