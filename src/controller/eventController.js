import expressAsyncHandler from "express-async-handler";

import Event from "../schema/EventSchema.js";

export const createEventController = expressAsyncHandler(
  async (req, res, next) => {
    let data = req.body;

    let result = await Event.create(data);

    res.status(201).json({
      success: true,
      message: "Event registered",
      result: result,
    });
  }
);

export const realAllEventsController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Event.find({});
    res.status(200).json({
      sucess: true,
      message: "all event read successfully",
      result: result,
    });
  }
);

export const readSpecificEventsController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Event.findById(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const updateSpecificEventsController = expressAsyncHandler(
  async (req, res, next) => {
    let id = req.params.id;
    let data = req.body;

    delete data.password;

    let result = await Event.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const deleteSpecificEventsController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "delete successfully",
      result: result,
    });
  }
);
