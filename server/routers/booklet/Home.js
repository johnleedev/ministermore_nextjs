const express = require('express');
const router = express.Router()
var cors = require('cors');
router.use(cors());

router.use(express.json()); // axios 전송 사용하려면 이거 있어야 함
const { bookletdb } = require('../dbdatas/bookletdb');
const multer  = require('multer')


// 최근 장소 리스트 가져오기 ////
router.get('/getlastplace', (req, res) => {
  bookletdb.query(`
    SELECT * FROM dataplace ORDER BY id DESC LIMIT 10;
    `, function(error, result){
    if (error) {throw error}
    if (result.length > 0) {
        res.send(result);
        res.end();
    } else {
        res.send(error);  
        res.end();
    }
  })
});

// 최근 연합수련회 리스트 가져오기 ////
router.get('/getlastunite', (req, res) => {
  bookletdb.query(`
    SELECT * FROM dataunite ORDER BY id DESC LIMIT 10;
    `, function(error, result){
    if (error) {throw error}
    if (result.length > 0) {
        res.send(result);
        res.end();
    } else {
        res.send(error);  
        res.end();
    }
  })
});

// 최근 강사 리스트 가져오기 ////
router.get('/getlastcasting', (req, res) => {
  bookletdb.query(`
    SELECT * FROM datacasting ORDER BY id DESC LIMIT 10;
    `, function(error, result){
    if (error) {throw error}
    if (result.length > 0) {
        res.send(result);
        res.end();
    } else {
        res.send(error);  
        res.end();
    }
  })
});

// 공지사항 가져오기
router.get('/getnotice/:page', (req, res) => {
  var page = parseInt(req.params.page) || 1;
  var pageSize = 10;
  var offset = (page - 1) * pageSize;

  const query = `
    SELECT * FROM notice 
    ORDER BY id DESC 
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  bookletdb.query(query, function(error, result) {
    if (error) {
      res.status(500).send({ error: 'Database query failed' });
      return;
    }
    if (result.length > 0) {
      res.send({
        resultData: result,
        totalCount: result.length
      });
      res.end();
    } else {
      res.send(false);  
      res.end();
    }
  });
});


// 조회시, 조회수 증가시키기
router.post('/noticeviews', (req, res) => {
  const { postId } = req.body;
  bookletdb.query(`
    UPDATE notice SET views = views + 1 WHERE id = ${postId}
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
