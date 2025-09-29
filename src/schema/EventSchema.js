import { model, Schema } from "mongoose";

const eventSchema = new Schema(
  {
    event: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      sparse: true,
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

const Event = model("Event", eventSchema);
export default Event;
