const express = require('express');
const router = express.Router()
var cors = require('cors');
router.use(cors());
router.use(express.json()); // axios 전송 사용하려면 이거 있어야 함
const { bookletdb } = require('../dbdatas/bookletdb');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const multer  = require('multer')
var fs = require("fs");

const escapeQuotes = (str) => str.replaceAll('è', '\è').replaceAll("'", "\\\'").replaceAll('"', '\\\"').replaceAll('\\n', '\\\\n');
// 팜플렛 ----------------------------------------------------------------------------------------

// 팜플렛 데이터 리스트 보내기
router.post('/getdatabooklets', async (req, res) => {
  
  const query = `SELECT *FROM churchMain`;
  
  bookletdb.query(query, function (error, result) {
    if (error) { throw error; }
    if (result.length > 0) {
      res.json({
        count: result.length,
        data: result
      });
    } else {
      res.json({
        count: 0,
        data: false
      });
    }
  });
});


// 특정 교회전단지 데이터 보내기
router.post('/getdatabookletspart', async (req, res) => {
  var { id } = req.body;
  const query = `
    SELECT * FROM churchMain WHERE bookletId = '${id}';
  `;
  bookletdb.query(query, function (error, result) {
    if (error) {
      throw error;
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.send(false);
    }
    res.end();
  });
});


// 특정 교회 섬김이 데이터 보내기
router.post('/getdataserverspart', async (req, res) => {
  var { id } = req.body;
  const query = `
    SELECT * FROM churchServers WHERE bookletId = '${id}';
  `;
  bookletdb.query(query, function (error, result) {
    if (error) {
      throw error;
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.send(false);
    }
    res.end();
  });
});


// 특정 사역 데이터 보내기
router.post('/getdataministrypart', async (req, res) => {
  var { id } = req.body;
  const query = `
    SELECT * FROM churchMinistry WHERE bookletId = '${id}';
  `;
  bookletdb.query(query, function (error, result) {
    if (error) {
      throw error;
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.send(false);
    }
    res.end();
  });
});

// 특정 행사 데이터 보내기
router.post('/getdataeventspart', async (req, res) => {
  var { id } = req.body;
  const query = `
    SELECT * FROM churchEvents WHERE bookletId = '${id}';
  `;
  bookletdb.query(query, function (error, result) {
    if (error) {
      throw error;
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.send(false);
    }
    res.end();
  });
});





// 팜플렛 데이터 검색하기
router.post('/getdatabookletsearch', async (req, res)=>{
  var {word, type} = req.body;
  const whereType = type === 'all' ? '' : `AND type = '${type}'`;
  
  const query = 
   `SELECT 
    *
    FROM churchMain
    WHERE (title LIKE '%${word}%')
    ${whereType};`

  bookletdb.query(query, function(error, result) {
    if (error) throw error;
    if (result.length > 0) {
      res.json({
        count: result.length,
        data: result
      });
    } else {              
      res.json({
        count: 0,
        data: false
      });
    }
  })
});



module.exports = router;
