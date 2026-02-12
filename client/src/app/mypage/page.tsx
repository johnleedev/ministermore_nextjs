'use client';

import { useEffect, useState } from 'react';
import './Mypage.scss';
import axios from 'axios';
import MainURL from '../../MainURL'; // 경로가 올바른지 확인 필요
import { useRecoilState } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../RecoilStore';
import { useRouter } from 'next/navigation'; // next/router 대신 next/navigation 사용

interface ProfileProps {
  grade: string;
  userAccount: string;
  userNickName: string;
  userSort: string;
  userDetail: string;
  userURL: string;
}

export default function Profile() {
  const router = useRouter();
  
  // Hydration 이슈 해결을 위한 상태
  const [isMounted, setIsMounted] = useState(false);
  
  const [isLogin, setIsLogin] = useRecoilState(recoilLoginState);
  const [userData, setUserData] = useRecoilState(recoilUserData);

  const [currentTab, setCurrentTab] = useState(1);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<ProfileProps | null>(null);
  const [userNickName, setUserNickName] = useState('');
  const [userSort, setUserSort] = useState('');
  const [userDetail, setUserDetail] = useState('');
  
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordChange, setPasswordChange] = useState('');

  const [isViewPasswdChange, setIsViewPasswdChange] = useState<boolean>(false);
  const [isViewDeleteAccount, setIsViewDeleteAccount] = useState<boolean>(false);
  const [agreeDeleteAccount, setAgreeDeleteAccount] = useState<boolean>(false);

  // 1. 컴포넌트 마운트 체크 및 초기 데이터 로드
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isLogin) {
        alert('로그인이 필요한 페이지입니다.');
        router.replace('/'); // replace를 사용하여 뒤로가기 방지
        return;
      }
      fetchPosts();
    }
  }, [isMounted, refresh]);

  const fetchPosts = async () => {
    if (!userData.userAccount) return;
    try {
      const res = await axios.get(`${MainURL}/api/mypage/getprofile/${userData.userAccount}`);
      if (res.data && res.data[0]) {
        const profile = res.data[0];
        setUserProfile(profile);
        setUserNickName(profile.userNickName || '');
        setUserSort(profile.userSort || '');
        setUserDetail(profile.userDetail || '');
      }
    } catch (error) {
      console.error("프로필 로드 실패:", error);
    }
  };

  // 프로필 수정
  const handleRevise = async () => {
    try {
      const res = await axios.post(`${MainURL}/api/mypage/changeprofile`, {
        userAccount: userData.userAccount,
        userNickName,
        userSort,
        userDetail,
      });
      if (res.data) {
        setUserData((prev: any) => ({
          ...prev,
          userNickName,
          userSort,
          userDetail,
        }));
        setRefresh(!refresh);
        alert('수정되었습니다.');
        setCurrentTab(1);
      }
    } catch (err) {
      alert('다시 시도해주세요.');
    }
  };

  // 비밀번호 변경
  const handlePasswdChange = async () => {
    if (!passwordCurrent || !passwordChange) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    try {
      const res = await axios.post(`${MainURL}/api/mypage/profilechangepassword`, {
        userAccount: userData.userAccount,
        passwordCurrent,
        passwordChange,
      });
      if (res.data === true) {
        alert('변경되었습니다.');
        setPasswordCurrent('');
        setPasswordChange('');
        setIsViewPasswdChange(false);
      } else {
        alert(res.data || '비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      alert('다시 시도해주세요.');
    }
  };

  // 계정 삭제
  const handleDeleteAccount = async () => {
    try {
      const res = await axios.post(`${MainURL}/api/mypage/deleteaccount`, {
        userAccount: userData.userAccount,
      });
      if (res.data === true) {
        alert('탈퇴되었습니다.');
        setIsLogin(false);
        setUserData({
          userAccount: '',
          userNickName: '',
          userSort: '',
          userDetail: '',
          grade: '',
        });
        sessionStorage.clear();
        router.push('/');
      } else {
        alert(res.data);
      }
    } catch (err) {
      alert('다시 시도해주세요.');
    }
  };

  // 하이드레이션 완료 전에는 아무것도 렌더링하지 않음 (서버 HTML과 클라이언트 불일치 방지)
  if (!isMounted) return null;

  return (
    <div className='mypage'>
      <div className="inner">
        {/* 왼쪽 메뉴바 */}
        <div className="subpage__menu">
          <div className="subpage__menu__title">마이페이지</div>
          <div className="subpage__menu__list">
            <div onClick={() => router.push('/mypage')} className="subpage__menu__item subpage__menu__item--on">프로필</div>
            <div onClick={() => router.push('/mypage/posting')} className="subpage__menu__item">공고글 관리</div>
            <div onClick={() => router.push('/mypage/resume')} className="subpage__menu__item">이력서 관리</div>
          </div>
        </div>

        <div className="subpage__main">
          <div className="subpage__main__title">프로필</div>
          
          {currentTab === 1 ? (
            <div className="subpage__main__content">
              <div className="reviseBtn" onClick={() => setCurrentTab(2)}>
                <p>프로필 수정하기</p>
              </div>
              <div className="main__content">
                <div className="textarea">
                  <div className="textrow"><h3>계정</h3><p>{userProfile?.userAccount}</p></div>
                  <div className="textrow"><h3>닉네임</h3><p>{userProfile?.userNickName}</p></div>
                  <div className="textrow"><h3>직분</h3><p>{userProfile?.userSort}</p></div>
                  <div className="textrow"><h3>상세</h3><p>{userProfile?.userDetail}</p></div>
                  <div className="textrow"><h3>가입경로</h3><p>{userProfile?.userURL}</p></div>
                </div>
              </div>
              <div className='divider'></div>
            </div>
          ) : (
            /* 프로필 수정 모드 */
            <div className="subpage__main__content">
              <div className="main__content">
                <div className="textarea">
                  <div className="textrow">
                    <h3>닉네임</h3>
                    <input value={userNickName} className="profileinputdefault" type="text" onChange={(e) => setUserNickName(e.target.value)} />
                  </div>
                  <div className="textrow">
                    <h3>직분</h3>
                    <input value={userSort} className="profileinputdefault" type="text" onChange={(e) => setUserSort(e.target.value)} />
                  </div>
                  <div className="textrow">
                    <h3>상세</h3>
                    <input value={userDetail} className="profileinputdefault" type="text" onChange={(e) => setUserDetail(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className='divider'></div>

              {userProfile?.userURL === 'email' && (
                <>
                  <div className="reviseBtn" onClick={() => setIsViewPasswdChange(!isViewPasswdChange)}>
                    <p>비밀번호 변경</p>
                  </div>
                  {isViewPasswdChange && (
                    <div className="main__content">
                      <div className="textarea">
                        <div className="textrow">
                          <h3>현재 비번</h3>
                          <input value={passwordCurrent} className="profileinputdefault" type="password" onChange={(e) => setPasswordCurrent(e.target.value)} />
                        </div>
                        <div className="textrow">
                          <h3>변경할 비번</h3>
                          <input value={passwordChange} className="profileinputdefault" type="password" onChange={(e) => setPasswordChange(e.target.value)} />
                        </div>
                        <div className="reviseBtn" style={{ borderColor: '#333', marginTop: '10px' }} onClick={handlePasswdChange}>
                          <p>변경완료</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <div className="reviseBtn" onClick={() => setCurrentTab(1)}><p>이전</p></div>
                <div className="reviseBtn" style={{ backgroundColor: '#333', color: '#fff' }} onClick={handleRevise}><p style={{ color: '#fff' }}>수정완료</p></div>
              </div>

              {/* 회원 탈퇴 영역 */}
              {!isViewDeleteAccount ? (
                <div className='accountDeleteBtn'>
                  <div className='deleteBtnBox' onClick={() => setIsViewDeleteAccount(true)}><p className='deleteBtn'>회원탈퇴</p></div>
                </div>
              ) : (
                <div className="deleteSection">
                  <div className="deleteAccountBox">
                    <div className="deleteAccountCover">
                      <h1>탈퇴 시 모든 정보가 사라지며, 복구할 수 없습니다.</h1>
                      <h2>* 유의 사항 안내</h2>
                      <p>1. 회원 탈퇴 시 즉시 서비스 이용이 불가합니다.</p>
                      <p>2. 게시물 및 댓글은 자동으로 삭제되지 않으며 운영진에게 권한이 위임됩니다.</p>
                      <p>3. 관련 법령에 따라 일정 기간 정보가 보관될 수 있습니다.</p>
                    </div>
                  </div>
                  <div className="deletecheckInputCover">
                    <div className='deletecheckInput'>
                      <input type="checkbox" checked={agreeDeleteAccount} onChange={() => setAgreeDeleteAccount(!agreeDeleteAccount)} />
                      <h5>유의사항을 확인했습니다.</h5>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="reviseBtn" onClick={() => setIsViewDeleteAccount(false)}><p>취소</p></div>
                    <div className="reviseBtn" style={{ borderColor: agreeDeleteAccount ? '#ff4d4d' : '#EAEAEA' }}
                      onClick={() => agreeDeleteAccount ? handleDeleteAccount() : alert('유의사항 확인에 체크해주세요!')}>
                      <p style={{ color: agreeDeleteAccount ? '#ff4d4d' : '#ccc' }}>탈퇴하기</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}