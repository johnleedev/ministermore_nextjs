const express = require('express');
const router = express.Router()
router.use(express.json()); // axios 전송 사용하려면 이거 있어야 함
const { rollbookdb } = require('../dbdatas/rollbookdb');
var cors = require('cors');
router.use(cors());
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const multer  = require('multer')
var fs = require("fs");



// 교회 전체 리스트
router.post('/getchurchlist', (req, res) => {

  rollbookdb.query(`
    SELECT * FROM churchsList;
    `, function(error, result){
    if (error) {throw error}
    if (result.length > 0) {
        res.json({
          count: result.length,
          data: result
        });
        res.end();
    } else {
        res.send(false);  
        res.end();
  }})
});


// 교회 부서별 전체 학생 리스트
router.post('/getdepartmentpersonalall', (req, res) => {

  const { churchId, department } = req.body;
  
  rollbookdb.query(`
    SELECT * FROM personalPresents${churchId} 
    WHERE department = '${department}';
    `, function(error, result){
    if (error) {throw error}
    if (result.length > 0) {
      res.json(result);
      res.end();
    } else {
      res.send(false);  
      res.end();
  }})
});


module.exports = router;