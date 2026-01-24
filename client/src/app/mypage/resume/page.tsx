'use client';

import { useEffect, useState } from 'react';
import '../Mypage.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../../MainURL';
import { useRecoilState } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../../RecoilStore';

interface ResumeProps {
  id: string;
  title: string;
  updatedAt: string;
}

export default function ResumeManage() {
  const router = useRouter(); 
  const [isLogin, setIsLogin] = useRecoilState(recoilLoginState);
  const [userData, setUserData] = useRecoilState(recoilUserData);

  const [refresh, setRefresh] = useState<boolean>(false);
  const [resumeList, setResumeList] = useState<ResumeProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 이력서 목록 가져오기
  const fetchResumeList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${MainURL}/api/resume/getresumelist/${userData.userAccount}`);
      if (res.data.success && Array.isArray(res.data.resumeList)) {
        setResumeList(res.data.resumeList);
      } else {
        setResumeList([]);
      }
    } catch (error) {
      setResumeList([]);
      console.error('이력서 목록 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeList();
  }, [refresh]);

  // 이력서 삭제 함수
  const handleDeleteResume = async (resumeId: string) => {
    if (window.confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
      try {
        const res = await axios.post(`${MainURL}/resume/deleteresume`, {
          resumeId: resumeId,
          userAccount: userData.userAccount
        });
        if (res.data.success) {
          alert('이력서가 삭제되었습니다.');
          setRefresh(!refresh);
        } else {
          alert('삭제에 실패했습니다.');
        }
      } catch (error) {
        alert('삭제에 실패했습니다.');
        console.error('삭제 실패:', error);
      }
    }
  };

  // 이력서 수정 페이지로 이동
  const handleEditResume = (resumeId: string) => {
    router.push(`/mypage/resumeedit?id=${resumeId}`);
    window.scrollTo(0, 0);
  };

  // 이력서 작성 페이지로 이동
  const handleCreateResume = () => {
    router.push('/mypage/resumeedit');
    window.scrollTo(0, 0);
  };

  return (
    <div className='mypage'>
      <div className="inner">
        {/* 왼쪽 메뉴바 */}
        <div className="subpage__menu">
          <div className="subpage__menu__title">마이페이지</div>
          <div className="subpage__menu__list">
            <div
              onClick={()=>{router.push('/mypage');}}
              className="subpage__menu__item"
            >
              프로필
            </div>
            <div
              onClick={()=>{router.push('/mypage/posting');}}
              className="subpage__menu__item"
            >
              공고글 관리
            </div>
            <div
              onClick={()=>{router.push('/mypage/resume');}}
              className="subpage__menu__item subpage__menu__item--on"
            >
              이력서 관리
            </div>
          </div>
        </div>

        <div className="subpage__main">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <div className="subpage__main__title">이력서 관리</div>
            <button
              onClick={handleCreateResume}
              style={{
                padding: '12px 24px',
                background: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              이력서 작성
            </button>
          </div>
          
          <div className="subpage__main__content">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <p>Loading...</p>
              </div>
            ) : Array.isArray(resumeList) && resumeList.length > 0 ? (
              <div className="main__content">
                <div className="postingList">
                  {resumeList.map((resume, index) => (
                    <div key={resume.id} className="postingItem">
                      <div className="postingHeader">
                        <div className="postingTitle">
                          <h3>{resume.title || '제목 없음'}</h3>
                          <span className="postingDate">{resume.updatedAt}</span>
                        </div>
                        <div className="postingActions">
                          <button 
                            className="actionBtn editBtn"
                            onClick={() => handleEditResume(resume.id)}
                          >
                            수정
                          </button>
                          <button 
                            className="actionBtn deleteBtn"
                            onClick={() => handleDeleteResume(resume.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="noPosts">
                <p>작성한 이력서가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

