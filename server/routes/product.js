const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require("../models/Product");


//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)  //파일이름을 어떻게 저장을 해줄지 설정
    }
})

var upload = multer({ storage: storage }).single("file")


//index.js 에서 타고 와서  '/api/product/image'가 됨
router.post('/image', (req, req)=>{

    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })  // 에러가 났을떄 프론트에 전달
        }
        //파일저장에 성공하면
        //파일을 어디다가 저장했는지, 파일이름이 뭔지 전달 해줌
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})


//UploadProductPage에서 받아온 정보들을 DB에 넣어 준다.
router.post('/', (req, res) => {
    return res.status(200).json({ success: true })
    // product 모델을 가지고 오기/ req.body안에 모든 정보가 들어있
   const product = new Product(req.body)
    //product 저장중에 에러가 났을 경우
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

})

module.exports = router;
