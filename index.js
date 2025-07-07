const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "HamtaP@ss@123",
  database: "kharazmiforms",
  port: 3306, // Default MySQL port
  waitForConnections: true,
});

app.post("/kharazmiforms", (req, res) => {
  const nationalCode = req.body.nationalCode;
  const name = req.body.name;
  const familyname = req.body.familyname;
  const address = req.body.address;
  const postalCode = req.body.postalCode;
  const phoneNumber = req.body.phoneNumber;
  const houseArea = req.body.houseArea;
  const earthquake = req.body.earthquake;
  const flood = req.body.flood;
  const thunderstorm = req.body.thunderstorm;
  const war = req.body.war;
  const increaseCapital = req.body.increaseCapital;
  const robbery = req.body.robbery;

  db.query(
    "INSERT INTO forms (national_code, name, family_name, address, postal_code, phone_number, house_area, earthquake, flood, stormthunder, war, increase_capital, robbery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nationalCode,
      name,
      familyname,
      address,
      postalCode,
      phoneNumber,
      houseArea,
      earthquake ? 1 : 0,
      flood ? 1 : 0,
      thunderstorm ? 1 : 0,
      war ? 1 : 0,
      increaseCapital ? 1 : 0,
      robbery ? 1 : 0,
    ],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Data inserted successfully", results });
    }
  );
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
