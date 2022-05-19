const urlModel = require("../models/urlModel");
const originalUrl = async (req, res) => {
  try {
    const urlCode = req.params.urlCode;
    if (!urlCode)
      return res
        .status(400)
        .send({ status: false, message: "please enter the urlCode" });

    const findUrl = await urlModel.findOne({ urlCode: urlCode });
    if (!findUrl)
      return res.status(404).send({ status: false, message: "url  not found" });
    return res.status(302).redirect(findUrl.longUrl);
  } catch (e) {
    res.status(400).send({ status: false, error: e.messsgae });
  }
};
module.exports = { originalUrl };
