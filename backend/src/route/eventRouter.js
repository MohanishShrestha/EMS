import { Router } from "express";
import {
  createEventController,
  deleteSpecificEventsController,
  readSpecificEventsController,
  realAllEventsController,
  updateSpecificEventsController
} from "../controller/eventController.js";

const eventRouter = Router();

eventRouter.route("/").post(createEventController).get(realAllEventsController);



eventRouter
  .route("/:id")
  .get(readSpecificEventsController)
  .patch(updateSpecificEventsController)
  .delete(deleteSpecificEventsController);

export default eventRouter;
