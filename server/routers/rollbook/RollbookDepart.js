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

// 부서 목록 조회
router.post('/getdepartments', (req, res) => {
  const { church_id } = req.body;
  
  if (!church_id) {
    res.status(400).json({ error: 'church_id is required' });
    return;
  }

  rollbookdb.query(`
    SELECT 
      id,
      church_id,
      name
    FROM departments
    WHERE church_id = ?
    ORDER BY name ASC;
  `, [church_id], function(error, result){
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json({
      success: true,
      data: result
    });
  });
});

// 부서 등록
router.post('/adddepartment', (req, res) => {
  const { church_id, name } = req.body;
  
  if (!church_id || !name) {
    res.status(400).json({ error: 'church_id and name are required' });
    return;
  }

  // 중복 체크
  rollbookdb.query(`
    SELECT id FROM departments 
    WHERE church_id = ? AND LOWER(name) = LOWER(?);
  `, [church_id, name], function(checkError, checkResult){
    if (checkError) {
      console.error('Database error:', checkError);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    
    if (checkResult.length > 0) {
      res.status(400).json({ error: '이미 등록된 부서명입니다.' });
      return;
    }

    // 중복이 없으면 등록
    rollbookdb.query(`
      INSERT INTO departments (church_id, name)
      VALUES (?, ?);
    `, [church_id, name], function(error, result){
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
      res.json({
        success: true,
        message: '부서가 등록되었습니다.',
        data: { id: result.insertId, church_id, name }
      });
    });
  });
});

// 부서 수정
router.post('/updatedepartment', (req, res) => {
  const { id, name } = req.body;
  
  if (!id || !name) {
    res.status(400).json({ error: 'id and name are required' });
    return;
  }

  // 현재 부서의 church_id 가져오기
  rollbookdb.query(`
    SELECT church_id FROM departments WHERE id = ?;
  `, [id], function(getError, getResult){
    if (getError) {
      console.error('Database error:', getError);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    
    if (getResult.length === 0) {
      res.status(404).json({ error: 'Department not found' });
      return;
    }

    const church_id = getResult[0].church_id;

    // 중복 체크 (현재 수정 중인 부서 제외)
    rollbookdb.query(`
      SELECT id FROM departments 
      WHERE church_id = ? AND LOWER(name) = LOWER(?) AND id != ?;
    `, [church_id, name, id], function(checkError, checkResult){
      if (checkError) {
        console.error('Database error:', checkError);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
      
      if (checkResult.length > 0) {
        res.status(400).json({ error: '이미 등록된 부서명입니다.' });
        return;
      }

      // 중복이 없으면 수정
      rollbookdb.query(`
        UPDATE departments
        SET name = ?
        WHERE id = ?;
      `, [name, id], function(error, result){
        if (error) {
          console.error('Database error:', error);
          res.status(500).json({ error: 'Database query failed' });
          return;
        }
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Department not found' });
          return;
        }
        res.json({
          success: true,
          message: '부서가 수정되었습니다.'
        });
      });
    });
  });
});

// 부서 삭제
router.post('/deletedepartment', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }

  rollbookdb.query(`
    DELETE FROM departments
    WHERE id = ?;
  `, [id], function(error, result){
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Department not found' });
      return;
    }
    res.json({
      success: true,
      message: '부서가 삭제되었습니다.'
    });
  });
});


module.exports = router;

