import mongoose, { model, Schema } from "mongoose";
const payrollSchema = new Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee ID is required"],
    },
    net_pay: { type: Number, required: [true, "Net pay is required"] },
    pay_period: { type: String, required: [true, "Pay period is required"] },
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
