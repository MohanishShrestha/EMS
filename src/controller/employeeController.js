import expressAsyncHandler from "express-async-handler";

import bcrypt from "bcryptjs";
import { secretkey } from "../constant.js";
import jwt from "jsonwebtoken";
import Employee from "../schema/EmployeeSchema.js";

export const createEmployeeController = expressAsyncHandler(
  async (req, res, next) => {
    let data = req.body;
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    data = {
      ...data,
      password: hash,
    };

    let result = await Employee.create(data);

    res.status(201).json({
      success: true,
      message: "Employee registered",
      result: result,
    });
  }
);

export const loginEmployeeController = expressAsyncHandler(
  async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    let employee = await Employee.findOne({ email: email });
    if (employee) {
      let isValidPassword = await bcrypt.compare(password, employee.password);

      if (isValidPassword) {
        let info = {
          id: employee._id,
        };

        let expireInfo = { expiresIn: "20d" };
        let token = jwt.sign(info, secretkey, expireInfo);

        res.status(200).json({
          success: true,
          message: "employee login successfull",
          data: employee,
          token: token,
        });
      } else {
        let error = new Error("Crenditial do not match");
        throw error;
      }
    } else {
      let error = new Error("Crenditial not found");
      throw error;
    }
  }
);

export const realAllEmployeesController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Employee.find({});
    res.status(200).json({
      sucess: true,
      message: "all employee read successfully",
      result: result,
    });
  }
);

export const readSpecificEmployeesController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Employee.findById(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const updateSpecificEmployeesController = expressAsyncHandler(
  async (req, res, next) => {
    let id = req.params.id;
    let data = req.body;

    delete data.password;

    let result = await Employee.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
      sucess: true,
      message: "read successfully",
      result: result,
    });
  }
);

export const deleteSpecificEmployeesController = expressAsyncHandler(
  async (req, res, next) => {
    let result = await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({
      sucess: true,
      message: "delete successfully",
      result: result,
    });
  }
);
