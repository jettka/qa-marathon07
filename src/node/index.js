//require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");

//app.use(cors());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3507", // PostgreSQLのユーザー名に置き換えてください
  //user: "postgres", // PostgreSQLのユーザー名に置き換えてください
  host: "postgres",
  database: "crm_3507", // PostgreSQLのデータベース名に置き換えてください
  //database: "qamarathon", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_3507", // PostgreSQLのパスワードに置き換えてください
  //password: "postgres", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});


const port = 3507;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


app.post("/add-customer", async (req, res) => {
  try {
     console.log("POST /add-customer", req.body);
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.get("/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [customerId]);

    if (customerData.rows.length === 0) {
      // データが見つからない場合の処理
      res.status(404).send("Customer not found");
    } else {
      res.json(customerData.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const { companyName, industry, contact, location } = req.body;

    const updateResult = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5 RETURNING *",
      [companyName, industry, contact, location, customerId]
    );

    if (updateResult.rows.length === 0) {
      // データが見つからない場合の処理
      res.status(404).send("Customer not found");
    } else {
      res.json({ success: true, updatedCustomer: updateResult.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.delete("/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const deleteResult = await pool.query("DELETE FROM customers WHERE customer_id = $1 RETURNING *", [customerId]);

    if (deleteResult.rows.length === 0) {
      // データが見つからない場合の処理
      res.status(404).send("Customer not found");
    } else {
      res.json({ success: true, deletedCustomer: deleteResult.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.use(express.static("public"));
