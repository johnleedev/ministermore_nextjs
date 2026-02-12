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



// 교회 전체 리스트 (새로운 churches 테이블 사용)
router.get('/getchurchlist', (req, res) => {
  rollbookdb.query(`
    SELECT * FROM churches;
  `, function(error, result){
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    if (result.length > 0) {
      res.json({
        count: result.length,
        data: result
      });
    } else {
      res.json({
        count: 0,
        data: []
      });
    }
  });
});

// 교회 검색
router.post('/getdatabookletsearch', (req, res) => {
  const { location, word } = req.body;
  
  if (!word || word.length < 2) {
    res.json({
      count: 0,
      data: []
    });
    return;
  }

  rollbookdb.query(`
    SELECT 
      id,
      name,
      address,
      domain_slug,
      created_at
    FROM churches
    WHERE name LIKE ? OR address LIKE ?
    ORDER BY created_at DESC;
  `, [`%${word}%`, `%${word}%`], function(error, result){
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    if (result.length > 0) {
      res.json({
        count: result.length,
        data: result
      });
    } else {
      res.json({
        count: 0,
        data: []
      });
    }
  });
});



module.exports = router;