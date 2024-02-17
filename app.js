import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import router from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();



const dbHost = process.env.DB_HOST;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use('/api/users', router);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose.connect(dbHost).then(app.listen(3000, () => {console.log('Database connection successful')})).catch(() => {console.error(err.message);
process.exit(1)});

