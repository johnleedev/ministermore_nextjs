'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import './Main.scss';
import axios from 'axios';
import MainURL from '../MainURL';
import { useRecoilValue } from 'recoil';
import { recoilLoginState, recoilUserData } from '../RecoilStore';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaItunesNote } from "react-icons/fa";
import { BsFileEarmarkPerson } from "react-icons/bs";
import { RiAdvertisementLine } from "react-icons/ri";
import { motion } from "framer-motion";

// Props 타입 정의
interface MainProps {
  initialRecruitList: any[];
}

export default function Main({ initialRecruitList }: MainProps) {
  const router = useRouter();
  const isLogin = useRecoilValue(recoilLoginState);
  const userData = useRecoilValue(recoilUserData);
  
  // 서버에서 받은 데이터를 초기값으로 세팅
  const [recruitList, setRecruitList] = useState<any[]>(initialRecruitList);
  // 서버에서 데이터를 이미 가져왔으므로 기본값은 false (단, 데이터가 없으면 로딩 표시 여부 결정)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'denomination' | 'school'>('denomination');
  const [myIp, setMyIp] = useState<string>('');

  // 1. 공통 countUp 함수 (useCallback으로 메모이제이션)
  const countUp = useCallback((type: string) => {
    const today = new Date().toISOString().slice(0, 10);
    axios.post(`${MainURL}/api/admin/countup`, { date: today, type })
      .catch((error) => console.log(error));
  }, []);

  // 2. 초기 로드 시 실행될 로직 (IP 체크 및 방문자 카운트)
  useEffect(() => {
    const initPage = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        setMyIp(data.ip);
        
        const today = new Date().toISOString().slice(0, 10);
        // 방문자 카운트 증가
        await axios.post(`${MainURL}/api/admin/homeusercount`, { date: today, ip: data.ip });
        // 메인 접속 카운트 증가
        countUp('mainconnect');
      } catch (error) {
        console.error("초기 로딩 에러:", error);
      }
    };

    initPage();
  }, [countUp]);

  // 헬퍼 함수들
  const renderPreview = (content: string, maxLength: number) => {
    if (content?.length > maxLength) return content.substring(0, maxLength) + '...';
    return content;
  };

  const cleanTitle = (title: string) => {
    if (!title) return '';
    return title.replaceAll("\\'", "'").replaceAll('\\"', '"').replaceAll('\\\\n', '\n');
  };

  const religiousbodyList = [
    {name: "기독교대한감리회", home: "https://kmc.or.kr/"},
    {name: "기독교대한성결교회", home: "https://www.kehc.org/"},
    {name: "기독교대한하나님의성회", home: "http://agk.or.kr/"},
    {name: "기독교한국침례회", home: "http://www.koreabaptist.or.kr/"},
    {name: "대한기독교나사렛성결회", home: "https://na.or.kr/"},
    {name: "대한예수교장로회고신", home: "http://kosin.org/"},
    {name: "대한예수교장로회통합", home: "https://www.pck.or.kr/"},
    {name: "대한예수교장로회합동", home: "https://alpha.gapck.org/"},
    {name: "대한예수교장로회합신", home: "https://www.hapshin.org/"},
    {name: "예수교대한성결교회", home: "https://www.sungkyul.org/"},
    {name: "한국기독교장로회", home: "https://www.prok.org/gnu/index.php"},
    {name: "독립교단(KAICAM)", home: "https://home.kaicam.org/index.asp"}
  ];

  const schoolList = [
    {name: "고려신학대학원", home: "https://www.kts.ac.kr/home/"},
    {name: "광신대학교", home: "https://www.kwangshin.ac.kr/home/index.do"},
    {name: "구세군군사관대학원대학교", home: "https://gufot.ac.kr"},
    {name: "대전신학대학교", home: "https://www.daejeon.ac.kr"},
    {name: "대신대학교", home: "https://www.daeshin.ac.kr/html/00_main/"},
    {name: "부산장신대학교", home: "https://www.bpu.ac.kr/Default.aspx"},
    {name: "서울장신대학교", home: "https://www.sjs.ac.kr"},
    {name: "서울신학대학교신대원", home: "https://gs.stu.ac.kr/CmsHome/StuGs0207_0101.eznic"},
    {name: "성결교신대원", home: "http://www.skts.org/"},
    {name: "영남신학대학교", home: "https://www.ytus.ac.kr/html/index.php"},
    {name: "웨스트민스터신학대학원대학교", home: "http://www.wgst.ac.kr/wgst_renew"},
    {name: "장로회신학대학교", home: "https://www.puts.ac.kr"},
    {name: "총신대학교", home: "https://www.csu.ac.kr/"},
    {name: "한세대학교", home: "https://www.hansei.ac.kr/sites/kor/index.do"},
    {name: "한신대학교", home: "https://www.hs.ac.kr/gradseoulcampus/index.do"},
    {name: "한일장신대학교", home: "https://www.hanil.ac.kr"},
    {name: "한국침례신학대학교신대원", home: "https://gtheology.kbtus.ac.kr/gtheology/Main.do"},
    {name: "호남신학대학교", home: "https://www.htus.ac.kr/index.php#"}
  ];

  return (
    <div className='main'>
      {/* 상단 배너 */}
      <div className="main__top__banner">
        <img src={`${MainURL}/images/main.png`} alt="메인 배너" className="main__top__banner__img" />
        <div className="main__top__banner__text">
          <span className="welcome">welcome</span>
          <span className="brand">사역자모아</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="main__box1">
          <div className="inner">
            <div className="main__recruit__header">
              <h2>최신 채용공고</h2>
              <button 
                className="main__recruit__more"
                onClick={() => {
                  window.scrollTo(0, 0);
                  router.push('/recruit');
                }}
              >
                더보기 <FaArrowRight />
              </button>
            </div>
            
            <div className="main__recruit__section">
              <div className="main__recruit__list">
                {isLoading ? (
                  <div className="main__recruit__loading"><p>채용공고를 불러오는 중...</p></div>
                ) : recruitList.length === 0 ? (
                  <div className="main__recruit__empty"><p>현재 등록된 채용공고가 없습니다.</p></div>
                ) : (
                  recruitList.map((item, index) => {
                    // 데이터 파싱 에러 방지 처리
                    let part = [{sort: '전임', content: ''}];
                    let pay = [{sort: '전임', paySort: 'select', selectCost: '', inputCost: ''}];
                    try {
                      if(item.part) part = JSON.parse(item.part);
                      if(item.pay) pay = JSON.parse(item.pay);
                    } catch(e) { console.error("JSON 파싱 에러", e); }

                    return (
                      <div
                        key={index} 
                        className="main__recruit__item"
                        onClick={() => {
                          countUp('recruitview');
                          router.push(`/recruit/minister/detail/${item.id}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <div className="main__recruit__content">
                          <div className="main__recruit__top">
                            <div className="main__recruit__church">
                              <img src={`${MainURL}/images/recruit/religiousbody/${item.religiousbody}.jpg`} alt={item.religiousbody} />
                              <span className="church-name">{item.church}</span>
                            </div>
                            <div className="main__recruit__date"><span>{item.date}</span></div>
                          </div>
                          <div className="main__recruit__title">
                            <h3>{renderPreview(cleanTitle(item.title), 40)}</h3>
                          </div>
                          <div className="main__recruit__details">
                            <div className="main__recruit__info">
                              <span className="location">{item.location} {item.locationDetail}</span>
                              <span className="divider">|</span>
                              <span className="sort">{item.sort}</span>
                              {part[0]?.content && (
                                <>
                                  <span className="divider">|</span>
                                  <span className="part">{renderPreview(part[0].content, 15)}</span>
                                </>
                              )}
                            </div>
                            <div className="main__recruit__pay">
                              {(pay[0]?.inputCost === '교회내규에따라' || pay[0]?.inputCost === '협의후결정') ? (
                                <span>{pay[0].inputCost}</span>
                              ) : (
                                <span>
                                  {pay[0]?.selectCost === '' && pay[0]?.inputCost !== '' 
                                    ? `${pay[0]?.sort}: ${pay[0]?.inputCost}`
                                    : `${pay[0]?.sort}: ${pay[0]?.paySort} ${pay[0]?.selectCost}`
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <a className="kakaoBtnBox" href='http://pf.kakao.com/_Xzwrn' target='_blank'>
              <Image src="/login/kakao.png" alt='kakao' width={50} height={50} />
              <p>카카오채널</p>
              <p>문의하기</p>
            </a>
          </div>  
        </div>
      </motion.div>

      {/* 공식 인스타 배너 */}
      <div className="main_adv_banner" style={{borderBottom:'1px solid #BDBDBD'}}>
        <a className='instarAdv' href='https://www.instagram.com/ministermore_' target='_blank'>
          <Image src="/instarlogo.jpeg" alt='instar' width={50} height={50} />
          <p className='instarAdv_textmagin'>ministermore_</p>
          <p>## 사역자모아 공식 인스타계정</p>
        </a>
      </div>

      {/* 총회/신학교 탭 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="main__denomination__section">
          <div className="inner">
            <div className="main__denomination__header">
              <div className="main__denomination__tabs">
                <button className={`main__denomination__tab ${activeTab === 'denomination' ? 'active' : ''}`} onClick={() => setActiveTab('denomination')}>총회 홈페이지</button>
                <button className={`main__denomination__tab ${activeTab === 'school' ? 'active' : ''}`} onClick={() => setActiveTab('school')}>신학교 홈페이지</button>
              </div>
            </div>
            <div className="main__denomination__grid">
              {(activeTab === 'denomination' ? religiousbodyList : schoolList).map((item, index) => (
                <div key={index} className="main__denomination__item">
                  <button className="main__denomination__button" onClick={() => item.home && window.open(item.home, '_blank')}>
                    <div className="main__denomination__image">
                      <img 
                        className={activeTab === 'denomination' ? 'main__denomination__image__denomination' : 'main__denomination__image__school'}
                        src={activeTab === 'denomination' ? `${MainURL}/images/recruit/religiousbody/${item.name}.jpg` : `${MainURL}/images/schools/${item.name}.png`}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = `${MainURL}/images/altImage.jpeg`; }}
                      />
                    </div>
                    <div className="main__denomination__name"><p>{item.name}</p></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 하단 링크 박스 */}
      <div className="main__box2">
        <div className="inner">
          <div className="main_bottom_cover">
            <div className="main_bottom_box" onClick={()=>{ router.push('/recruit'); window.scrollTo(0,0); }}>
              <div className="main_left_icon"><BsFileEarmarkPerson /></div>
              <div className="main_middle_text"><h1>사역정보</h1><p>원하시는 사역지&사역자 정보를 찾아보세요</p></div>
              <div className="main_right_link"><FaArrowRight /></div>
            </div>
            <div className="main_bottom_box" onClick={()=>{ router.push('/worship'); window.scrollTo(0,0); }}>
              <div className="main_left_icon"><FaItunesNote /></div>
              <div className="main_middle_text"><h1>예배사역</h1><p>예배에 관한 정보를 찾아보세요</p></div>
              <div className="main_right_link"><FaArrowRight /></div>
            </div>
            <div className="main_bottom_box" onClick={()=>{ router.push('/company/advertise'); window.scrollTo(0,0); }}>
              <div className="main_left_icon"><RiAdvertisementLine /></div>
              <div className="main_middle_text"><h1>광고및제휴</h1><p>광고나 제휴를 원하시면 신청해주세요</p></div>
              <div className="main_right_link"><FaArrowRight /></div>
            </div>
          </div>
        </div>  
      </div> 
    </div>
  );
}