import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from 'dotenv';
config();
import { create_captcha, add_data, login, get_data } from "./controller.js";
import { check_captcha, check_auth, check_json } from "./middleware.js";

const { port } = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(check_json);
app.use(cors());
app.use(express.static('public'));
// Route
app.get("/captcha", create_captcha);
app.post("/kharazmiforms", check_captcha, add_data);

app.post("/login", check_captcha, login);
app.post('/data', check_auth, get_data);
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
