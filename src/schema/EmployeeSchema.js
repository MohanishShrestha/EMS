import { model, Schema } from "mongoose";

const employeeSchema = Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: { type: String, required: [true, "password is required"] }, 
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
  },
  {
    timeStamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id; 
        delete ret._id; 
        delete ret.__v; 
      },
    },
  }
);

const Employee = model("Employee", employeeSchema);

export default Employee;
