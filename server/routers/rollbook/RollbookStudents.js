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


router.post('/getstudentlist', (req, res) => {
  
  const { churchId, deptId, groupId } = req.body;

  rollbookdb.query(`
    SELECT 
      id,
      church_id,
      dept_id,
      group_id,
      name,
      CASE 
        WHEN birth_date IS NULL THEN NULL 
        ELSE DATE_FORMAT(birth_date, '%Y-%m-%d') 
      END as birth_date,
      phone,
      is_active
    FROM students 
    WHERE church_id = ? AND dept_id = ? AND group_id = ?
    ORDER BY name ASC;
    `, [churchId, deptId, groupId], function(error, result){
    if (error) {
      console.error('학생 목록 조회 오류:', error);
      res.status(500).json({ error: '학생 목록 조회 실패' });
      return;
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json([]);
    }
  })
});

// 학생 추가
router.post('/addstudent', (req, res) => {
  const { churchId, deptId, groupId, name, birthYear, birthMonth, birthDay, phone } = req.body;
  
  if (!churchId || !deptId || !groupId || !name) {
    res.status(400).json({ success: false, error: 'churchId, deptId, groupId, name이 필요합니다.' });
    return;
  }

  // birthYear, birthMonth, birthDay를 birth_date로 변환
  let birthDate = null;
  if (birthYear && birthMonth && birthDay) {
    // "2025년", "01월", "15일" 형식을 "2025-01-15"로 변환
    const year = birthYear.replace('년', '');
    const month = birthMonth.replace('월', '').padStart(2, '0');
    const day = birthDay.replace('일', '').padStart(2, '0');
    birthDate = `${year}-${month}-${day}`;
  }

  rollbookdb.query(`
    INSERT INTO students (church_id, dept_id, group_id, name, birth_date, phone, is_active)
    VALUES (?, ?, ?, ?, ?, ?, TRUE);
  `, [churchId, deptId, groupId, escapeQuotes(name), birthDate, escapeQuotes(phone || '')], function(error, result){
    if (error) {
      console.error('학생 추가 오류:', error);
      res.status(500).json({ success: false, error: '학생 추가 실패' });
      return;
    }
    res.json({ 
      success: true, 
      message: '학생이 추가되었습니다.',
      id: result.insertId
    });
  });
});

// 학생 수정
router.post('/updatestudent', (req, res) => {
  const { id, name, birthYear, birthMonth, birthDay, phone } = req.body;
  
  if (!id) {
    res.status(400).json({ success: false, error: 'id가 필요합니다.' });
    return;
  }

  // birthYear, birthMonth, birthDay를 birth_date로 변환
  let birthDate = null;
  if (birthYear && birthMonth && birthDay) {
    // "2025년", "01월", "15일" 형식을 "2025-01-15"로 변환
    const year = birthYear.replace('년', '');
    const month = birthMonth.replace('월', '').padStart(2, '0');
    const day = birthDay.replace('일', '').padStart(2, '0');
    birthDate = `${year}-${month}-${day}`;
  }

  rollbookdb.query(`
    UPDATE students
    SET name = ?, birth_date = ?, phone = ?
    WHERE id = ?;
  `, [escapeQuotes(name || ''), birthDate, escapeQuotes(phone || ''), id], function(error, result){
    if (error) {
      console.error('학생 수정 오류:', error);
      res.status(500).json({ success: false, error: '학생 수정 실패' });
      return;
    }
    if (result.affectedRows === 0) {
      res.json({ success: false, error: '수정할 학생을 찾을 수 없습니다.' });
      return;
    }
    res.json({ 
      success: true, 
      message: '학생 정보가 수정되었습니다.' 
    });
  });
});

// 학생 삭제
router.post('/deletestudent', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    res.status(400).json({ success: false, error: 'id가 필요합니다.' });
    return;
  }

  rollbookdb.query(`
    DELETE FROM students
    WHERE id = ?;
  `, [id], function(error, result){
    if (error) {
      console.error('학생 삭제 오류:', error);
      res.status(500).json({ success: false, error: '학생 삭제 실패' });
      return;
    }
    if (result.affectedRows === 0) {
      res.json({ success: false, error: '삭제할 학생을 찾을 수 없습니다.' });
      return;
    }
    res.json({ 
      success: true, 
      message: '학생이 삭제되었습니다.' 
    });
  });
});

module.exports = router;

