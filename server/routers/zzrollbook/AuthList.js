const express = require('express');
const router = express.Router()
router.use(express.json()); // axios 전송 사용하려면 이거 있어야 함
const { rollbookdb } = require('../dbdatas/rollbookdb');
const { commondb } = require('../dbdatas/commondb');
var cors = require('cors');
router.use(cors());
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const multer  = require('multer')
var fs = require("fs");


const escapeQuotes = (str) => str.replaceAll('è', '\è').replaceAll("'", "\\\'").replaceAll('"', '\\\"').replaceAll('\\n', '\\\\n');



// 사용 권한 요청 리스트 가져오기
router.post('/getauthlist', (req, res) => {
  
  const { churchId } = req.body;

  rollbookdb.query(`
    SELECT * FROM authList WHERE church_Id = '${churchId}';
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


// 사용 권한 요청하기
router.post('/registerauth', (req, res) => {
  const { churchId, departmentName, groupName, userAccount, userNickName, date } = req.body;
 
  rollbookdb.query(`
      INSERT IGNORE INTO authList
      (church_Id, departmentName, groupName, userAccount, userNickName, date) 
      VALUES ('${churchId}', '${departmentName}', '${groupName}', '${userAccount}', '${userNickName}', '${date}');
    `,function(error, result){
    if (error) {throw error}
    if (result.affectedRows > 0) {            
      res.send(true);
      res.end();
    } else {
      res.send(false);  
      res.end();
    }})
});


// 사용 권한 승인하기
router.post('/reviseconfirmauth', (req, res) => {
  const { churchId, departmentName, userAccount, groupName } = req.body;
 
  commondb.query(`
    UPDATE user
      SET 
      authChurch = '${churchId}', 
      authDepartment = '${departmentName}', 
      authGroup = '${groupName}' 
      WHERE userAccount = '${userAccount}';
    `,(error, result) => {
      if (error) {
          console.error(error);
          return res.status(500).send("Database query failed");
      }
      if (result.affectedRows > 0) {     
        rollbookdb.query(`
          DELETE FROM authList
          WHERE church_Id = '${churchId}' AND departmentName = '${departmentName}' AND userAccount = '${userAccount}';
        `)
        res.json(result);
      } else {
          res.send(false);
      }
    })
});



module.exports = router;

