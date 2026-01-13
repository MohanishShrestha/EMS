import { Router } from "express";
import {
  createEmployeeController,
  deleteSpecificEmployeesController,
  loginEmployeeController,
  readSpecificEmployeesController,
  realAllEmployeesController,
  updateSpecificEmployeesController,
} from "../controller/employeeController.js";

const employeeRouter = Router();

employeeRouter.route("/").post(createEmployeeController).get(realAllEmployeesController);

employeeRouter.route("/login").post(loginEmployeeController);

employeeRouter
  .route("/:id")
  .get(readSpecificEmployeesController)
  .patch(updateSpecificEmployeesController)
  .delete(deleteSpecificEmployeesController);

export default employeeRouter;
