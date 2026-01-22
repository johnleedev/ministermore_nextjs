const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const { commondb } = require('./routers/dbdatas/commondb');

var bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
var cors = require('cors');


// 라우터들
const LoginRouter = require('./routers/common/login');
const MypageRouter = require('./routers/common/Mypage');
app.use('/login', LoginRouter);
app.use('/mypage', MypageRouter);


const RecruitMinisterRouter = require('./routers/recruit/RecruitMinister');
const RecruitChurchRouter = require('./routers/recruit/RecruitChurch');
const RecruitInstituteRouter = require('./routers/recruit/RecruitInstitute');
const RecruitWorkRouter = require('./routers/recruit/RecruitWork');
app.use('/api/recruitminister', RecruitMinisterRouter);
app.use('/recruitchurch', RecruitChurchRouter);
app.use('/recruitinstitute', RecruitInstituteRouter);
app.use('/recruitwork', RecruitWorkRouter);


const SongsRouter = require('./routers/worship/Songs');
app.use('/worshipsongs', SongsRouter);
const SongWorkRouter = require('./routers/worship/SongWork');
app.use('/worshipsongswork', SongWorkRouter);

const ResumeRouter = require('./routers/resume/Resume');
app.use('/resume', ResumeRouter);


var NoticeBoardRouter = require('./routers/board/NoticeBoard');
app.use('/noticeboard', NoticeBoardRouter);

var UsedBoardRouter = require('./routers/board/UsedBoard');
app.use('/usedboard', UsedBoardRouter);

const RollbookHomeRouter = require('./routers/rollbook/List');
const RollbookPresentsRouter = require('./routers/rollbook/Presents');
const RollbookAdminRouter = require('./routers/rollbook/Admin');
const RollbookAuthRouter = require('./routers/rollbook/AuthList');
app.use('/rollbooklist', RollbookHomeRouter);
app.use('/rollbookpresents', RollbookPresentsRouter);
app.use('/rollbookadmin', RollbookAdminRouter);
app.use('/rollbookauth', RollbookAuthRouter);

const ChurchbookletbookletsRouter = require('./routers/booklet/ChurchMain');
app.use('/churchbookletbooklets', ChurchbookletbookletsRouter);

const EventbookletsRouter = require('./routers/booklet/EventMain');
app.use('/eventbooklets', EventbookletsRouter);

const InstitutionbookletsRouter = require('./routers/booklet/InstitutionMain');
const InstitutionBoardRouter = require('./routers/booklet/InstitutionBoard');
app.use('/institutionbooklets', InstitutionbookletsRouter);
app.use('/institutionboard', InstitutionBoardRouter);


const AdminRouter = require('./routers/Admin');
app.use('/api/admin', AdminRouter);

app.use(express.static('build'));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
app.use(helmet());
app.use(cors());
// Proxy Naver Maps script to serve from same-origin to satisfy strict CSP
app.get('/naver-maps.js', (req, res) => {
  const query = req.url.includes('?') ? req.url.split('?')[1] : '';
  const targetUrl = `https://oapi.map.naver.com/openapi/v3/maps.js${query ? `?${query}` : ''}`;

  res.setHeader('Content-Type', 'application/javascript');

  https
    .get(targetUrl, (upstream) => {
      if (upstream.statusCode && upstream.statusCode >= 300 && upstream.statusCode < 400 && upstream.headers.location) {
        // Handle redirects just in case
        https.get(upstream.headers.location, (redirected) => {
          redirected.pipe(res);
        }).on('error', (err) => {
          res.status(502).end(`// Failed to fetch redirected script: ${err.message}`);
        });
        return;
      }
      upstream.pipe(res);
    })
    .on('error', (err) => {
      res.status(502).end(`// Failed to fetch script: ${err.message}`);
    });
});

app.listen(8000, ()=>{
  console.log('server is running')
});





// 리액트 연결하기 ----------------------------------------------------------------- //

// app.use(express.static(path.join(__dirname, '/build')));
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '/build/index.html'));
// });
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '/build/index.html'));
// });
// app.use(function(req, res, next) {
//   res.status(404).send('Sorry cant find that!');
// });


