import mongoose, { model, Schema } from "mongoose";

const attendanceSchema = Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
    checkIn: String,
    checkOut: String,
    status: { type: String, enum: ["Present", "Leave"], default: "Present" },
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

const Attendance = model("Attendance", attendanceSchema);

export default Attendance;
