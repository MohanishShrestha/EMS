import mongoose, { model, Schema } from "mongoose";

const rosterSchema = new Schema(
  {
    shift_date: {
      type: Date,
      required: [true, "Shift date is required"],
      default: () => new Date().setHours(0, 0, 0, 0),
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee ID is required"],
    },
    start_time: {
      type: String,
      required: [true, "Start time is required"],
    },
    end_time: {
      type: String,
      required: [true, "End time is required"],
    },
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

const Roster = model("Roster", rosterSchema);

export default Roster;
