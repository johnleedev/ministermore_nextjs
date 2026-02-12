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


const escapeQuotes = (str) => str.replaceAll('è', '\è').replaceAll("'", "\\\'").replaceAll('"', '\\\"').replaceAll('\\n', '\\\\n');


// 연도 정보 가져오기
router.post('/getyearstate', (req, res) => {
  
  const { thisyear } = req.body;

  rollbookdb.query(`
    SELECT * FROM yearState WHERE year = '${thisyear}';
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


// 특정 학생 출석 현황 가져오기
router.post('/getpersonalpresents', (req, res) => {
  const { churchId, department, groupName } = req.body;

  rollbookdb.query(
		`SELECT * FROM personalPresents${churchId} WHERE department = ? AND groupName = ?`,
		[department, groupName],
		(error, result) => {
			if (error) {
					console.error(error);
					return res.status(500).send("Database query failed");
			}
			if (result.length > 0) {
					res.json(result);
			} else {
					res.send(false);
			}
		}
  );
});


// 특정 학생 출석 저장하기
router.post('/revisepersonalpresents', (req, res) => {
  const { churchId, department, groupName, name, presents, year } = req.body;

  rollbookdb.query(`
    UPDATE personalPresents${churchId} SET 
      presents${year} = '${presents}'
    WHERE department = '${department}' AND groupName = '${groupName}' AND name = '${name}';
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

  




module.exports = router;

