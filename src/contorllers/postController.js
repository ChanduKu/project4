const mongoose = require("mongoose");
const shortId = require("shortid");
const validator = require("validator");
const urlModel = require("../models/urlModel");
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
const isValidReqBody = function (reqBody) {
  return Object.keys(reqBody).length > 0;
};
const urlShor = async (req, res) => {
  try {
    //----------connecting to radis--------
    console.log(req.body);
    if (!isValidReqBody(req.body))
      return res
        .status(400)
        .send({ status: true, message: "pelease enter body data " });
    const baseUrl = "http://localhost:3000";
    let longUrl = req.body.longUrl;
    
    if (!longUrl)
      return res
        .status(400)
        .send({ status: true, message: "pelease enter longUrl " });
    if (!validator.isURL(longUrl))
      return res
        .status(400)
        .send({ status: true, message: "url is not valid" });
   
    const usrlexists = await urlModel.findOne({ longUrl: longUrl },{_id:0,__v:0});
    console.log(usrlexists);

    let cacheData = await get(`${req.body.urlCode}`);

    if (usrlexists) {
      return res.status(200).send({ status: true, message: cacheData});
    }
  

    const shortedUrl = shortId.generate();
    const newUrl = baseUrl + "/" + shortedUrl;
    const finalUrl = {
      urlCode: shortedUrl,
      longUrl: longUrl,
      shortUrl: newUrl,
    };
    const createUrl = await urlModel.create(finalUrl);
    if (createUrl) {
      const da = await set(`${req.body.urlCode}`, JSON.stringify(createUrl));

      return res.status(201).send({ status: true, message:createUrl });
    }
    // res.status(200).send({ status: true, message: createUrl.shortUrl });
  } catch (e) {
    res.status(500).send({ status: false, error: e.message });
  }
};
module.exports = { urlShor };
