'use client';
import {  useEffect, useState } from 'react';
import '../Mypage.scss';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../../MainURL';
import { useRecoilState } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../../RecoilStore';

interface PostProps {
  id: number;
  title: string;
  writer: string;
  date: string;
  church: string;
  religiousbody: string;
  location: string;
  sort: string;
  recruitNum: string;
  customInput: string;
  tableType?: string; // 'minister', 'church', 'institute'
}

export default function PostingManage() {
  const router = useRouter(); 
  const [isLogin, setIsLogin] = useRecoilState(recoilLoginState);
  const [userData, setUserData] = useRecoilState(recoilUserData);

  const [refresh, setRefresh] = useState<boolean>(false);
  const [userPosts, setUserPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 사용자 게시글 가져오기
  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${MainURL}/api/mypage/getuserposts/${userData.userAccount}`);
      if (Array.isArray(res.data)) {
        setUserPosts(res.data);
      } else {
        setUserPosts([]);
      }
    } catch (error) {
      setUserPosts([]);
      console.error('게시글 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [refresh]);

  // 게시글 삭제 함수
  const handleDeletePost = async (postId: number, tableType?: string) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const res = await axios.post(`${MainURL}/api/mypage/deletepost`, {
          postId: postId,
          userAccount: userData.userAccount,
          tableType: tableType || 'minister'
        });
        if (res.data) {
          alert('게시글이 삭제되었습니다.');
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

  // 게시글 수정 페이지로 이동
  const handleEditPost = (postId: number, tableType?: string) => {
    const type = tableType || 'minister';
    router.push(`/mypage/postingedit?id=${postId}&tableType=${type}`);
    window.scrollTo(0, 0);
  };

  // 게시글 상세보기
  const handleViewPost = (postId: number, tableType?: string) => {
    if (tableType === 'church') {
      router.push(`/recruit/recruitchoirdetail?id=${postId}`);
    } else if (tableType === 'institute') {
      router.push(`/recruit/recruitinstitutedetail?id=${postId}`);
    } else {
      router.push(`/recruit/recruitministerdetail?id=${postId}`);
    }
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
              className="subpage__menu__item subpage__menu__item--on"
            >
              공고글 관리
            </div>
            <div
              onClick={()=>{router.push('/mypage/resume');}}
              className="subpage__menu__item"
            >
              이력서 관리
            </div>
          </div>
        </div>

        <div className="subpage__main">
          <div className="subpage__main__title">내 게시글 관리</div>
          
          <div className="subpage__main__content">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <p>Loading...</p>
              </div>
            ) : (
              <div className="main__content">
                {userPosts.length > 0 ? (
                  <div className="postingList">
                    {userPosts.map((post) => {
                      const categoryName = post.tableType === 'church' 
                        ? '찬양대/방송/직원' 
                        : post.tableType === 'institute' 
                        ? '학교/기관/단체' 
                        : '사역자';
                      
                      return (
                        <div key={post.id} className="postingItem">
                          <div className="postingHeader">
                            <div className="postingTitle">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                <span className="categoryTag">{categoryName}</span>
                                <h3 style={{ margin: 0 }}>{post.title}</h3>
                              </div>
                              <span className="postingDate">{post.date}</span>
                            </div>
                            <div className="postingActions">
                              <button 
                                className="actionBtn viewBtn"
                                onClick={() => handleViewPost(post.id, post.tableType)}
                              >
                                보기
                              </button>
                              <button 
                                className="actionBtn editBtn"
                                onClick={() => handleEditPost(post.id, post.tableType)}
                              >
                                수정
                              </button>
                              <button 
                                className="actionBtn deleteBtn"
                                onClick={() => handleDeletePost(post.id, post.tableType)}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                          <div className="postingInfo">
                            <div className="infoRow">
                              <span className="infoLabel">교회명:</span>
                              <span className="infoValue">{post.church}</span>
                            </div>
                            <div className="infoRow">
                              <span className="infoLabel">직무:</span>
                              <span className="infoValue">{post.sort}</span>
                            </div>
                          </div>
                          {post.customInput && (
                            <div className="postingContent">
                              <div 
                                className="contentPreview"
                                dangerouslySetInnerHTML={{ 
                                  __html: post.customInput.length > 200 
                                    ? post.customInput.substring(0, 200) + '...' 
                                    : post.customInput 
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="noPosts">
                    <p>작성한 게시글이 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
