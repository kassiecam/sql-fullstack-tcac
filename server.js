const express = require('express'),
    dbOperation = require('./dbfiles/dbOperation'),
    bodyParser = require("body-parser");
cors = require('cors');

const API_PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/client", async (req, res) => {
    try {
        const result = await dbOperation.createClient(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create client" });
    }
});


app.get("/clients", async (req, res) => {
    try {
        const filters = {
            Id: req.query.Id,
            First_Name: req.query.First_Name,
            Last_Name: req.query.Last_Name,
            DOB: req.query.DOB,
        };

        const result = await dbOperation.getRequest(filters);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch clients" });
    }
});


app.post("/api/search", async (req, res) => {
    try {
        const result = await dbOperation.getRequest(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to search clients" });
    }
});


app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`)); 