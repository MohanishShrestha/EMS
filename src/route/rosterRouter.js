import { Router } from "express";
import {
  createRosterController,
  deleteSpecificRostersController,
  readSpecificRostersController,
  realAllRostersController,
  updateSpecificRostersController,
} from "../controller/rosterController.js";

const rosterRouter = Router();

rosterRouter.route("/").post(createRosterController).get(realAllRostersController);

rosterRouter
  .route("/:id")
  .get(readSpecificRostersController)
  .patch(updateSpecificRostersController)
  .delete(deleteSpecificRostersController);

export default rosterRouter;
