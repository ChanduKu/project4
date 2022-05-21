const urlModel = require("../models/urlModel");
const radis = require("redis");
const isValidReqBody = function (reqBody) {
  return Object.keys(reqBody).length > 0;
};
//--------------redis--------------
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
//----------------------------------------------
const originalUrl = async (req, res) => {
  try {
    if (!isValidReqBody)
      return res
        .status(400)
        .send({ status: true, message: "pelease enter body data " });
    const urlCode = req.params.urlCode;
    if (!urlCode)
      return res
        .status(400)
        .send({ status: false, message: "please enter the urlCode" });

    const findUrl = await urlModel.findOne({ urlCode: urlCode });
    if (!findUrl)
      return res.status(404).send({ status: false, message: "url  not found" });
    if (findUrl) {
      const d = await get(`${req.body.urlCode}`);
      const datas=JSON.parse(d)
      return res.status(302).redirect(datas.longUrl);
    }
    return res.status(302).redirect(findUrl.longUrl);
  } catch (e) {
    res.status(400).send({ status: false, error: e.messsgae });
  }
};
module.exports = { originalUrl };