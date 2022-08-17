/* eslint-disable no-undef */

/**
 * Title: Admin route credentials
 * Description: All admin literals and credentials convey here
 * Author: Hasibul Islam
 * Date: 14/08/2022
 */

// external imports
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const fs = require("fs");

// internal imports
const admin = express.Router();
admin.use(cors());
admin.use(express.static("public"));

// mongodb connectivity
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@luxuryliving.38sh1rq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        console.log("MongoDB connected on admin route");

        // databases for admin
        const database = client.db("main");
        const services = database.collection("services");

        /**
         * -------------------------
         * FILE UPLOADING PROPERTIES
         * -------------------------
         * fieldname: "avatar",
         * originalname: "myself signature.png",
         * encoding: "7bit",
         * mimetype: "image/png",
         * destination: "../uploads/",
         * filename: "459273ff01083535f203b2cb13a080d1",
         * path: "..\\uploads\\459273ff01083535f203b2cb13a080d1",
         * size: 11646
         */
        admin.post("/service", upload.single("avatar"), (req, res) => {
            // console.log(req.file);
            const modifiedFileName = req.file.originalname.split(" ").join("_");
            const newFileName = modifiedFileName.split(".").join(`-${Date.now()}.`);
            fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, err => {
                if (!err) {
                    // console.log(newFileName);
                    res.status(203).send({ avatar: newFileName });
                }
            });
        });

        admin.route("/servicing")
            .post(async (req, res) => {
                res.status(201).send(await services.insertOne(req.body));
            })
            .get(async (req, res) => {
                res.status(200).send(await services.find({}).toArray());
            });

        admin.route("/servicing/:id")
            .put(async (req, res) => {
                const body = req.body;
                const { id } = req.params;
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: body,
                };
                const result = await services.updateOne(filter, updateDoc, options);
                res.status(201).send(result);
            })
            .delete(async (req, res) => {
                res.status(200).send(await services.deleteOne({ _id: ObjectId(req.params.id) }));
            });
    } catch {
        // await client.close();
    }
}
run().catch(console.dir);

// admin route credentials started
admin.get("/", (req, res) => {
    res.status(200).json({
        message: "welcome to Admin route"
    });
});

// export admin router as default
module.exports = admin;
