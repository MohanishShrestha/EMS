import mongoose, { model, Schema } from "mongoose";
const payrollSchema = new Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee ID is required"],
    },
    annual_salary: { type: Number, required: [true, " Annual_salary is required"] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
const Payroll = model("Payroll", payrollSchema);
export default Payroll;
