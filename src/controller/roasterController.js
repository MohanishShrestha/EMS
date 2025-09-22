import expressAsyncHandler from "express-async-handler";
import Roster from "../schema/RosterSchema.js";

export const createRosterController = expressAsyncHandler(
  async (req, res, next) => {
    let data = req.body;

    let result = await Roster.create(data);

    res.status(201).json({
      success: true,
      message: "Roster created",
      result: result,
    });
  }
);


export const realAllRostersController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Roster.find({});
    res.status(200).json({
      sucess: true,
      message: "all roster read successfully",
      result: result,
    });
  }
);

export const readSpecificRostersController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Roster.findById(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const updateSpecificRostersController = expressAsyncHandler(
  async (req, res, next) => {
    let id = req.params.id;
    let data = req.body;

    let result = await Roster.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const deleteSpecificRostersController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Roster.findByIdAndDelete(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "delete successfully",
      result: result,
    });
  }
);
