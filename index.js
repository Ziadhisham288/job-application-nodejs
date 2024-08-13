import express from "express";
import dotenv from "dotenv";
import { connectionDB } from "./Database/Connection.js";
import userRouter from "./Src/modules/User/User.routes.js";
import customError from "./Src/Utils/CustomErrors.js";
import companyRouter from "./Src/modules/Company/Company.routes.js";
import jobRouter from "./Src/modules/Job/Job.routes.js";

const app = express();
dotenv.config();
app.use(express.json())

const PORT = process.env.PORT || 3000;

app.use("/user", userRouter )
app.use("/company", companyRouter )
app.use("/Job", jobRouter )

// Check for invalid URL 

app.use("*", (req,res, next) => {
  next(new customError("Invalid url", 404))
})

// Global error handling middleware  

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({message : "ERROR", Error: err.message})
})


app.listen(PORT, () => {
  connectionDB()
  console.log(`App is running on port ${PORT}`);
});
