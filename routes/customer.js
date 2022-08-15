/* eslint-disable no-undef */

/**
 * Title: Customer routes credentials
 * Description: All customer literals and credentials convey here
 * Author: Hasibul Islam
 * Date: 14/08/2022
 */

// external imports
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
        console.log("MongoDB connected on customer route");

        // databases for customer
        const database = client.db("customer");
        const booking = database.collection("booking");
        const bookingList = database.collection("booking_list");
        const review = database.collection("review");

        /**
         * ----------------
         * CUSTOMER BOOKING
         * ----------------
         */
        customer.route("/booking")
            .post(async (req, res) => {
                res.status(201).send(await booking.insertOne(req.body));
            })
            .get(async (req, res) => {
                res.status(200).send(await booking.find({}).toArray());
            })
            .put(async (req, res) => {
                const { id, status } = req.body;
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        status: status,
                    }
                };
                const result = await booking.updateOne(filter, updateDoc, options);
                res.status(201).send(result);
            });

        /**
         * ---------------
         * CUSTOMER REVIEW
         * ---------------
         */
        customer.route("/review")
            .post(async (req, res) => {
                res.status(201).send(await review.insertOne(req.body));
            })
            .get(async (req, res) => {
                res.status(200).send(await review.find({}).toArray());
            });
    } catch {
        // await client.close();
    }
}
run().catch(console.dir);

// customer route credentials started
customer.get("/", async (req, res) => {
    res.status(200).json({
        message: "welcome to Customer route."
    });
});

// export customer route as default
module.exports = customer;
