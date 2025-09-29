import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { secretkey } from "../constant.js";

const isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  let bearerToken = req.headers.authorization;

  if (bearerToken) {
    try {
      let token = bearerToken.split(" ")[1];
      let info = jwt.verify(token, secretkey);
      req.employee = { id: info.id };
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid or expired token");
    }
  } else {
    res.status(401);
    throw new Error("No token provided");
  }
});

export default isAuthenticated;
