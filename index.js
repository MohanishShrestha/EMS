import express, { json } from "express";
import connectToMongoDb from "./src/connectToDb/connectToMongoDb.js";
import { port } from "./src/constant.js";
import errorMiddleware from "./src/middleware/errorMiddleWare.js";
import PageNotFound from "./src/middleware/pageNotFound.js";
import cors from "cors";
import employeeRouter from "./src/route/employeeRouter.js";
import attendanceRouter from "./src/route/attendanceRouter.js";
let app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.listen(port, () => {
  console.log(`application is listening at ${port}`);
  connectToMongoDb();
});

app.use(json());

app.use("/employee", employeeRouter);
app.use("/attendance", attendanceRouter);

app.use(errorMiddleware);

app.use(PageNotFound);
