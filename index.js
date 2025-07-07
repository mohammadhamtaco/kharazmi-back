import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
config();
const { port } = process.env;
import { create_captcha, check_captcha, add_data } from "./controller.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Route
app.get("/captcha", create_captcha);
app.post("/kharazmiforms", check_captcha, add_data);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
