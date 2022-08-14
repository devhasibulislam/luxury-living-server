/* eslint-disable no-undef */

/**
 * Title: Customer routes credentials
 * Description: All customer literals and credentials convey here
 * Author: Hasibul Islam
 * Date: 14/08/2022
 */

// external imports
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

// internal imports
const customer = express.Router();

// mongodb connectivity
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        console.log("MongoDB connected");
        const collection = client.db("test").collection("devices");
    } catch {
        // await client.close();
    }
}
run().catch(console.dir);

// customer route credentials started
customer.get("/", async (req, res) => {
    res.status(200).json({
        message: "welcome to customer route."
    });
});

// export customer route as default
module.exports = customer;
