import expressAsyncHandler from "express-async-handler";

import bcrypt from "bcryptjs";
import { secretkey } from "../constant.js";
import jwt from "jsonwebtoken";
import Employee from "../schema/EmployeeSchema.js";

// export const createEmployeeController = expressAsyncHandler(
//   async (req, res, next) => {
//     let data = req.body;
//     const hash = await bcrypt.hash(data.password, 10);
//     data.password = hash;
//     data = {
//       ...data,
//       password: hash,
//     };

//     let result = await Employee.create(data);

//     res.status(201).json({
//       success: true,
//       message: "Employee registered",
//       result: result,
//     });
//   }
// );


export const createEmployeeController = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body;

    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // ✅ Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number (min length 6)",
      });
    }

    // ✅ Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // ✅ Case-insensitive check for name
    const existingName = await Employee.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "Name is already taken",
      });
    }

    // ✅ Hash password
    const hash = await bcrypt.hash(password, 10);

    // ✅ Create employee
    const result = await Employee.create({
      name,
      email,
      password: hash,
      department,
      position,
    });

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


export const loginEmployeeController = expressAsyncHandler(
  async (req, res, next) => {
    let name = req.body.name;
    let password = req.body.password;

    console.log("name:", name);

    let employee = await Employee.findOne({ name: name });
    console.log(employee);

    if (employee) {
      let isValidPassword = await bcrypt.compare(password, employee.password);

      if (isValidPassword) {
        let info = { id: employee._id };
        let expireInfo = { expiresIn: "20d" };
        let token = jwt.sign(info, secretkey, expireInfo);

        res.status(200).json({
          success: true,
          message: "employee login successful",
          data: employee,
          token: token,
        });
      } else {
        throw new Error("Credentials do not match");
      }
    } else {
      throw new Error("Credentials not found");
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
