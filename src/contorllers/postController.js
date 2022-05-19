const mongoose = require("mongoose");
const shortId = require("shortid");
const validator = require("validator");
const urlModel = require("../models/urlModel");
const { createClient } = require("redis");
const radis = require("redis");
const { promisify } = require("util");
const redisClinet = radis.createClient(
  14765,
  "redis-14765.c91.us-east-1-3.ec2.cloud.redislabs.com",
  { no_ready_chek: true }
);
redisClinet.auth("sEBlgcKqfCBQfdnxtyvtaXRKIkaOPYy6", function (err) {
  if (err) throw err;
});
redisClinet.on("connect", async function () {
  console.log("connected to radis....");
});
const set = promisify(redisClinet.SET).bind(redisClinet);
const get = promisify(redisClinet.GET).bind(redisClinet);

const urlShor = async (req, res) => {
  try {
    //----------connecting to radis--------

    const baseUrl = "http://localhost:3000";
    let longUrl = req.body.longUrl.toString();
    console.log(validator.isURL(longUrl) + " " + longUrl);
    if (!validator.isURL(longUrl))
      return res
        .status(400)
        .send({ status: true, message: "url is not valid" });
    const usrlexists = await urlModel.findOne({ longUrl: longUrl });
    if (usrlexists)
      return res
        .status(200)
        .send({ status: true, message: usrlexists.shortUrl });
    const shortedUrl = shortId.generate();
    const newUrl = baseUrl + "/" + shortedUrl;
    const finalUrl = {
      urlCode: req.body.urlCode,
      longUrl: longUrl,
      shortUrl: newUrl,
    };
    const createUrl = await urlModel.create(finalUrl);
    res.status(200).send({ status: true, message: createUrl.shortUrl });
  } catch (e) {
    res.status(500).send({ status: false, error: e.message });
  }
};
module.exports = { urlShor };
