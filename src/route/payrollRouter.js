import { Router } from "express";
import {
  createPayrollController,
  generatePayrollExcelReportController,
  getAllPayrollsController,
  getEmployeePayrollsController,
} from "../controller/payrollController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
const payrollRouter = Router();

// Routes for creating and getting all payroll records
payrollRouter
  .route("/")
  .post(isAuthenticated, isAdmin, createPayrollController)
  .get(isAuthenticated, isAdmin, getAllPayrollsController);

// Route for getting an individual employee's payroll history
payrollRouter.route("/:id").get(isAuthenticated, getEmployeePayrollsController);

// Route for generating and downloading an Excel payroll report
payrollRouter
  .route("/export/excel")
  .get(isAuthenticated, isAdmin, generatePayrollExcelReportController);
  
export default payrollRouter;
