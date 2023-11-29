const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000; //eg django runs on 8000

// Create a connection to MySQL
const db = mysql.createConnection({
  host: "localhost", // Update if MySQL is running on a different host
  user: "root",
  password: "",
  database: "isalogindb",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL");
});

// Middleware to parse JSON and handle form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/error.html");
});

app.get("/profile", (req, res) => {
  res.sendFile(__dirname + "/profile.html");
});
app.get("/update", (req, res) => {
  res.sendFile(__dirname + "/update.html");
});
app.get("/signinpage", (req, res) => {
  res.sendFile(__dirname + "/signin.html");
});
// Handle form submissions
app.post("/submitForm", (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Insert the data into the MySQL table
    db.query(
      "INSERT INTO ISAloginDB (email, password, role) VALUES (?, ?, ?)", //here ISAloginDB is the author's db name
      [email, password, role],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into MySQL:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.sendFile(__dirname + "/signin.html");
        //res.send("Data inserted successfully");
      }
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signin",(req,res)=>{
try {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM ISAloginDB WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.error("Error querying data from MySQL:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Check if a user with the given email and password was found
      if (result.length > 0) {
        // User found, redirect to a different page with user data
        const user = result[0];
        res.redirect(`/profile?email=${user.email}&role=${user.role}`);
      } else {
        // User not found or invalid credentials, redirect to an error page
        res.redirect("/error");
      }
    }
  );
} catch (err) {
  console.error("Error:", err);
  res.status(500).send("Internal Server Error");
}
});

app.post("/changedata",(req,res)=>{
  try {
    const { email, role } = req.body;
    db.query(
      `UPDATE ISAloginDB SET role="${role}" WHERE email = ?`,
      [email],
      (err, result) => {
        if (err) {
          console.error("Error querying data from MySQL:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.redirect(`/profile?email=${email}&role=${role}`);
    
       } );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteProfile", (req,res)=>{
  try {
  const email = req.query.email;
  db.query(
    "DELETE FROM ISAloginDB WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Error querying data from MySQL:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
     } );
     
 } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
 }

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
