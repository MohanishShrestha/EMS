import mongoose from "mongoose";
import { dburl } from "../constant.js";

const connectToMongoDb = async() => {

   await mongoose.connect(dburl)
   console.log("application is connected to mongoDb sucessfully")
};

export default connectToMongoDb;
