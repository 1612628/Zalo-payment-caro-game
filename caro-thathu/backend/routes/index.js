const express=require('express');
const router = express.Router();

import {createUser,isUserExisted} from '../controllers/user.js'

router.get('/',(req,res)=>{
    res.send({response:"I am alive"}).status(200);
})

module.exports=router;