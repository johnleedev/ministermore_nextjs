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



router.post('/getgrouplist', (req, res) => {
  
  const { churchId, deptId } = req.body;

  rollbookdb.query(`
    SELECT * FROM smallgroups WHERE church_id = ? AND dept_id = ?;
    `, [churchId, deptId], function(error, result){
    if (error) {
      console.error('그룹 목록 조회 오류:', error);
      res.status(500).json({ error: '그룹 목록 조회 실패' });
      return;
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json([]);
    }
  })
});

// 소그룹 추가
router.post('/addgroup', (req, res) => {
  const { churchId, deptId, name } = req.body;
  
  console.log('소그룹 추가 요청:', { churchId, deptId, name });
  
  if (!churchId || !deptId || !name) {
    console.log('필수 파라미터 누락:', { churchId, deptId, name });
    res.status(400).json({ success: false, error: 'churchId, deptId, name이 필요합니다.' });
    return;
  }

  // 숫자 검증
  const churchIdNum = parseInt(churchId);
  const deptIdNum = parseInt(deptId);
  
  if (isNaN(churchIdNum) || isNaN(deptIdNum)) {
    console.log('유효하지 않은 ID:', { churchId, deptId });
    res.status(400).json({ success: false, error: '유효하지 않은 교회 또는 부서 ID입니다.' });
    return;
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    res.status(400).json({ success: false, error: '소그룹명을 입력해주세요.' });
    return;
  }

  // 중복 체크
  rollbookdb.query(`
    SELECT id FROM smallgroups 
    WHERE church_id = ? AND dept_id = ? AND LOWER(name) = LOWER(?);
  `, [churchIdNum, deptIdNum, trimmedName], function(checkError, checkResult){
    if (checkError) {
      console.error('중복 체크 오류:', checkError);
      res.status(500).json({ success: false, error: '중복 체크 실패', details: checkError.message });
      return;
    }
    
    if (checkResult.length > 0) {
      res.json({ success: false, error: '이미 등록된 소그룹명입니다.' });
      return;
    }

    // 소그룹 추가
    rollbookdb.query(`
      INSERT INTO smallgroups (church_id, dept_id, name, leader_id)
      VALUES (?, ?, ?, NULL);
    `, [churchIdNum, deptIdNum, escapeQuotes(trimmedName)], function(error, result){
      if (error) {
        console.error('소그룹 추가 오류:', error);
        console.error('SQL 에러 상세:', error.sqlMessage);
        res.status(500).json({ 
          success: false, 
          error: '소그룹 추가 실패',
          details: error.message || error.sqlMessage
        });
        return;
      }
      console.log('소그룹 추가 성공:', result.insertId);
      res.json({ 
        success: true, 
        message: '소그룹이 추가되었습니다.',
        id: result.insertId
      });
    });
  });
});

// 소그룹 삭제
router.post('/deletegroup', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    res.status(400).json({ success: false, error: 'id가 필요합니다.' });
    return;
  }

  rollbookdb.query(`
    DELETE FROM smallgroups
    WHERE id = ?;
  `, [id], function(error, result){
    if (error) {
      console.error('소그룹 삭제 오류:', error);
      res.status(500).json({ success: false, error: '소그룹 삭제 실패' });
      return;
    }
    if (result.affectedRows === 0) {
      res.json({ success: false, error: '삭제할 소그룹을 찾을 수 없습니다.' });
      return;
    }
    res.json({ 
      success: true, 
      message: '소그룹이 삭제되었습니다.' 
    });
  });
});

// 소그룹 수정
router.post('/updategroup', (req, res) => {
  const { id, name, churchId, deptId } = req.body;
  
  console.log('소그룹 수정 요청:', { id, name, churchId, deptId });
  
  if (!id || !name) {
    res.status(400).json({ success: false, error: 'id와 name이 필요합니다.' });
    return;
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    res.status(400).json({ success: false, error: '소그룹명을 입력해주세요.' });
    return;
  }

  // 숫자 검증
  const idNum = parseInt(id);
  const churchIdNum = churchId ? parseInt(churchId) : null;
  const deptIdNum = deptId ? parseInt(deptId) : null;
  
  if (isNaN(idNum)) {
    res.status(400).json({ success: false, error: '유효하지 않은 소그룹 ID입니다.' });
    return;
  }

  // 중복 체크 (같은 이름이 다른 소그룹에 있는지 확인)
  if (churchIdNum && deptIdNum) {
    rollbookdb.query(`
      SELECT id FROM smallgroups 
      WHERE church_id = ? AND dept_id = ? AND LOWER(name) = LOWER(?) AND id != ?;
    `, [churchIdNum, deptIdNum, trimmedName, idNum], function(checkError, checkResult){
      if (checkError) {
        console.error('중복 체크 오류:', checkError);
        res.status(500).json({ success: false, error: '중복 체크 실패', details: checkError.message });
        return;
      }
      
      if (checkResult.length > 0) {
        res.json({ success: false, error: '이미 등록된 소그룹명입니다.' });
        return;
      }

      // 소그룹 수정
      rollbookdb.query(`
        UPDATE smallgroups
        SET name = ?
        WHERE id = ?;
      `, [escapeQuotes(trimmedName), idNum], function(error, result){
        if (error) {
          console.error('소그룹 수정 오류:', error);
          console.error('SQL 에러 상세:', error.sqlMessage);
          res.status(500).json({ 
            success: false, 
            error: '소그룹 수정 실패',
            details: error.message || error.sqlMessage
          });
          return;
        }
        if (result.affectedRows === 0) {
          res.json({ success: false, error: '수정할 소그룹을 찾을 수 없습니다.' });
          return;
        }
        console.log('소그룹 수정 성공:', idNum);
        res.json({ 
          success: true, 
          message: '소그룹명이 수정되었습니다.'
        });
      });
    });
  } else {
    // churchId와 deptId가 없으면 중복 체크 없이 바로 수정
    rollbookdb.query(`
      UPDATE smallgroups
      SET name = ?
      WHERE id = ?;
    `, [escapeQuotes(trimmedName), idNum], function(error, result){
      if (error) {
        console.error('소그룹 수정 오류:', error);
        console.error('SQL 에러 상세:', error.sqlMessage);
        res.status(500).json({ 
          success: false, 
          error: '소그룹 수정 실패',
          details: error.message || error.sqlMessage
        });
        return;
      }
      if (result.affectedRows === 0) {
        res.json({ success: false, error: '수정할 소그룹을 찾을 수 없습니다.' });
        return;
      }
      console.log('소그룹 수정 성공:', idNum);
      res.json({ 
        success: true, 
        message: '소그룹명이 수정되었습니다.'
      });
    });
  }
});

// 소그룹 리더 지정
router.post('/setleader', (req, res) => {
  const { groupId, leaderId } = req.body;
  
  if (!groupId) {
    res.status(400).json({ success: false, error: 'groupId가 필요합니다.' });
    return;
  }

  // leaderId가 null이거나 빈 문자열이면 리더 해제
  const leaderValue = (leaderId && leaderId !== '') ? leaderId : null;

  rollbookdb.query(`
    UPDATE smallgroups
    SET leader_id = ?
    WHERE id = ?;
  `, [leaderValue, groupId], function(error, result){
    if (error) {
      console.error('리더 지정 오류:', error);
      res.status(500).json({ success: false, error: '리더 지정 실패' });
      return;
    }
    if (result.affectedRows === 0) {
      res.json({ success: false, error: '소그룹을 찾을 수 없습니다.' });
      return;
    }
    res.json({ 
      success: true, 
      message: leaderValue ? '리더가 지정되었습니다.' : '리더가 해제되었습니다.' 
    });
  });
});

// 부서의 사용자 목록 가져오기 (리더 선택용)
router.post('/getdeptleaders', (req, res) => {
  const { churchId, deptId } = req.body;
  
  if (!churchId || !deptId) {
    res.status(400).json({ error: 'churchId와 deptId가 필요합니다.' });
    return;
  }

  // 숫자 검증
  const churchIdNum = parseInt(churchId);
  const deptIdNum = parseInt(deptId);
  
  if (isNaN(churchIdNum) || isNaN(deptIdNum)) {
    res.status(400).json({ error: '유효하지 않은 교회 또는 부서 ID입니다.' });
    return;
  }

  // users 테이블에서 직접 가져오기
  // rollbook_auth 테이블이 없으므로 users 테이블에서 모든 사용자를 가져옵니다
  // 실제 구현에서는 users 테이블 구조에 맞게 수정이 필요할 수 있습니다
  rollbookdb.query(`
    SELECT 
      id,
      userNickName,
      userAccount
    FROM leaders
    ORDER BY userNickName ASC;
  `, [], function(error, result){
    if (error) {
      console.error('사용자 목록 조회 오류:', error);
      res.status(500).json({ error: '사용자 목록 조회 실패' });
      return;
    }
    res.json(result || []);
  });
});


module.exports = router;

