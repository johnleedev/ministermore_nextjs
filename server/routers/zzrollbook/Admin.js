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


// churchAdmin ------------------------------------------------------------------------------

// 특정 교회 전체 현황 가져오기
router.post('/getdepartmentall', (req, res) => {
  
  const { churchId } = req.body;

  rollbookdb.query(`
    SELECT * FROM departmentState WHERE church_Id = '${churchId}';
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


// 특정 교회 부서 추가하기
router.post('/registerdepartment', (req, res) => {
  const { churchId, departmentName, chief, pastor, groupState } = req.body;
  const groupStateCopy = escapeQuotes(groupState);

  rollbookdb.query(`
      INSERT IGNORE INTO departmentState
      (church_Id, department, chief, pastor, groupState) 
      VALUES ('${churchId}', '${departmentName}', '${chief}', '${pastor}', '${groupStateCopy}');
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

// 특정 교회 부서별 정보 수정하기
router.post('/revisedepartmentinfo', (req, res) => {
  const { churchId, department, pastor, chief } = req.body;

  rollbookdb.query(`
    UPDATE departmentState SET 
      pastor = '${pastor}', 
      chief = '${chief}'
    WHERE church_Id = '${churchId}' AND department = '${department}';
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

// // 특정 교회 부서 삭제하기
router.post('/deletedepartment', (req, res) => {
  const { churchId, department } = req.body;

  rollbookdb.query(`
      DELETE FROM departmentState WHERE church_Id = '${churchId}' AND department = '${department}';
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

// departmentAdmin ------------------------------------------------------------------------------

// 특정 교회 부서별 현황 가져오기
router.post('/getdepartmentstate', (req, res) => {
  
  const { churchId, department } = req.body;

  rollbookdb.query(`
    SELECT * FROM departmentState WHERE church_Id = '${churchId}' AND department = '${department}';
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


// 특정 교회 부서별 소그룹 정보 수정하기
router.post('/revisedepartmentstate', (req, res) => {
  const { churchId, department, groupState } = req.body;

  const groupStateCopy = escapeQuotes(groupState);

  rollbookdb.query(`
    UPDATE departmentState SET 
      groupState = '${groupStateCopy}'
    WHERE church_Id = '${churchId}' AND department = '${department}';
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


// GroupAdmin ------------------------------------------------------------------------------

// 특정 부서별 학생 리스트 가져오기
router.post('/getpersonallist', (req, res) => {
  
  const { churchId, department, groupName } = req.body;

  rollbookdb.query(`
    SELECT * FROM personalPresents${churchId} 
    WHERE department = '${department}' AND groupName = '${groupName}';
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


// 특정 학생 추가하기
router.post('/registerpersonal', (req, res) => {
  const { churchId, department, groupName, name } = req.body;
  
  rollbookdb.query(`
      INSERT IGNORE INTO personalPresents${churchId}
      (name, department, groupName) 
      VALUES ('${name}', '${department}', '${groupName}');
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




// 특정 학생 정보 수정하기
router.post('/revisepersonalinfo', (req, res) => {
  const { churchId, department, groupName, name, birthYear, birthMonth, birthDay, school } = req.body;
  
  rollbookdb.query(`
		UPDATE personalPresents${churchId} SET 
		 name = '${name}', 
		 birthYear = '${birthYear}', 
		 birthMonth = '${birthMonth}', 
		 birthDay = '${birthDay}', 
		 school = '${school}'
    WHERE department = '${department}' AND groupName = '${groupName}' AND name = '${name}';

		`,(error, result) => {
			if (error) {
					console.error(error);
					return res.status(500).send("Database query failed");
			}
			if (result.affectedRows > 0) {     
					res.json(result);
			} else {
					res.send(false);
			}
		}
	);
});

// 특정 학생 삭제하기
router.post('/deletepersonalinfo', (req, res) => {
  const { churchId, department, groupName, name } = req.body;
  
  rollbookdb.query(`
      DELETE FROM personalPresents${churchId} 
      WHERE department = '${department}' AND groupName = '${groupName}' AND name = '${name}';;
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

