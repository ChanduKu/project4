const express=require("express");
const postController=require('../contorllers/postController')
const getController=require('../contorllers/getController')
const router=express.Router();
router.post('/url/shorten',postController.urlShor)
router.get('/:urlCode',getController.originalUrl)
module.exports=router; 