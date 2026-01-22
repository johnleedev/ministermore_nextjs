const express = require('express');
const router = express.Router()
router.use(express.json()); // axios 전송 사용하려면 이거 있어야 함
const { bookletdb } = require('../dbdatas/bookletdb');
var cors = require('cors');
router.use(cors());
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const multer  = require('multer')
var fs = require("fs");

const escapeQuotes = (str) => str.replaceAll('è', '\è').replaceAll("'", "\\\'").replaceAll('"', '\\\"').replaceAll('\\n', '\\\\n');


// 게시글 전체 목록 조회 API
router.get('/getposts/:page', async (req, res) => {
  var page = parseInt(req.params.page) || 1;
  var pageSize = 10;
  var offset = (page - 1) * pageSize;

  const dataQuery = `ORDER BY p.id DESC LIMIT ? OFFSET ?`;

  const query = `
    SELECT p.*
    FROM institutionPosts p
    ${dataQuery}
  `;

  const countQuery = `
    SELECT COUNT(*) AS totalCount
    FROM institutionPosts p
  `;

  const queryParams = [pageSize, offset];

  try {
    const [dataResult, countResult] = await Promise.all([
      new Promise((resolve, reject) => {
        bookletdb.query(query, queryParams, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        bookletdb.query(countQuery, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      })
    ]);

    const totalCount = countResult[0].totalCount;
    res.send({
      resultData: dataResult,
      totalCount: totalCount
    });
    res.end();
  } catch (error) {
    res.status(500).send({ error: 'Database query failed' });
  }
});



// 게시글 조회시, 조회수 증가시키기
router.post('/postsviews', (req, res) => {
  const { postId } = req.body;
  bookletdb.query(`
    UPDATE institutionPosts SET views = views + 1 WHERE id = ${postId}
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



// 게시글 사진 파일 저장 미들웨어
const storage = multer.diskStorage({
  destination(req, file, done) { 
    done(null, 'build/images/institution/postimage');
  }, 
  filename(req, file, done) {
    done(null, file.originalname);
  }
});

const upload_default = multer({ storage });

// 이미지 업로드 미들웨어를 조건부로 실행
const conditionalUpload = (req, res, next) => {
  if (req.query.postImage) {
    upload_default.array('img')(req, res, next);
  } else {
    next();
  }
};


// 게시글 생성하기
router.post('/posts', conditionalUpload, (req, res) => {
  const { title, content, userAccount, userNickName, date, postImage } = req.query;
  const titleCopy = escapeQuotes(title);
  const contentCopy = escapeQuotes(content);
  
  bookletdb.query(`
    INSERT IGNORE INTO institutionPosts (title, content, userAccount, userNickName, date, images) VALUES
     ('${titleCopy}', '${contentCopy}', '${userAccount}', '${userNickName}', '${date}', '${postImage}');
    `,function(error, result){
    if (error) {throw error}
    if (result.affectedRows > 0) {            
      res.send(true);
      res.end();
    } else {
      res.send(false);  
      res.end();
    }});
});


// 게시글 삭제하기
router.post('/deletepost', async (req, res) => {
  
  const { postId, userAccount, images } = req.body;

  try {
   
    // 각 이미지를 삭제하는 비동기 함수
    const deleteImage = (image) => {
      return new Promise((resolve, reject) => {
        const imagePath = `build/images/institution/postimage/${image}`;
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    };

    // 모든 이미지 삭제
    const deletePromises = images.map(deleteImage);
    await Promise.all(deletePromises);

    bookletdb.query(`
      DELETE FROM institutionPosts WHERE id = '${postId}' AND userAccount = '${userAccount}';
      `,function(error, result){
      if (error) {throw error}
      if (result.affectedRows > 0) {
        res.send(true);
        res.end();
      } else {
        res.send(false);  
        res.end();
      }})

    } catch (error) {
    res.send(error);
    res.end();
  }
 
});





module.exports = router;