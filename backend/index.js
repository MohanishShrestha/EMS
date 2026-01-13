import express, { json } from "express";
import connectToMongoDb from "./src/connectToDb/connectToMongoDb.js";
import { port } from "./src/constant.js";
import errorMiddleware from "./src/middleware/errorMiddleWare.js";
import PageNotFound from "./src/middleware/pageNotFound.js";
import cors from "cors";
import employeeRouter from "./src/route/employeeRouter.js";
import attendanceRouter from "./src/route/attendanceRouter.js";
import payrollRouter from "./src/route/payrollRouter.js";
import rosterRouter from "./src/route/rosterRouter.js";
import eventRouter from "./src/route/eventRouter.js";
let app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use("/roster", rosterRouter);
app.use("/payroll", payrollRouter);
app.use("/event", eventRouter);

app.use(errorMiddleware);

app.use(PageNotFound);
