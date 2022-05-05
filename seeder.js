const fs = require("fs");

const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

const Bootcamp = require("./models/Bootcamp");

// Connect to DB
mongoose
  .connect(
    "mongodb://erevos13:erevos13@kronos-shard-00-00.omk7p.mongodb.net:27017,kronos-shard-00-01.omk7p.mongodb.net:27017,kronos-shard-00-02.omk7p.mongodb.net:27017/devcamper?ssl=true&replicaSet=atlas-uwv1y7-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connect DB success");
    const bootcamps = JSON.parse(
      fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
    );

    //import data in DB
    const importData = async () => {
      try {
        console.log("imported data ".yellow);
        await Bootcamp.create(bootcamps);
        console.log(`Data imported...`.green.inverse);
        process.exit();
      } catch (error) {
        console.error(error);
      }
    };

    //Delete data
    const deleteData = async () => {
      try {
        await Bootcamp.deleteMany();
        console.log(`Data deleted...`.red.inverse);
        process.exit();
      } catch (error) {
        console.error(error);
      }
    };
    if (process.argv[2] === "-i") {
      importData();
    } else if (process.argv[2] === "-d") {
      deleteData(0);
    }
  })
  .catch((err) => console.log(err));
