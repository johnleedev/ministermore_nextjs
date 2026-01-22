'use client';

import { useEffect, useState } from 'react';
import './Community.scss';
import MainURL from '../../MainURL';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DateFormmating from '../../components/DateFormmating';
import { useRecoilValue } from 'recoil';
import { recoilLoginState } from '../../RecoilStore';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CommunityPage() {
  
  const router = useRouter();
  const isLogin = useRecoilValue(recoilLoginState);
  
  interface ListProps {
    id : number;
    sort : string;
    title : string;
    content : string;
    userAccount : string;
    userNickName : string;
    isLiked : string;
    date : string;
    views : string;
    images : [string]
  }
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list, setList] = useState<ListProps[]>([]);
  const [listAllLength, setListAllLength] = useState<number>(0);
  const fetchDatas = async () => {
    const res = await axios.get(`${MainURL}/noticeboard/getnoticeposts/${currentPage}`);
    if (res.data) {
      const copy = res.data.resultData || [];
      setList(copy);
      setListAllLength(res.data.totalCount || 0);
    } else {
      setList([]);
      setListAllLength(0);
    }
  }

  useEffect(()=>{
    fetchDatas();
  }, [currentPage]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(listAllLength / itemsPerPage);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPreview = (content : string) => {
    if (content?.length > 40) {
      return content.substring(0, 40) + '...';
    }
    return content;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 4;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage - half < 1) {
      end = Math.min(totalPages, end + (half - currentPage + 1));
    }

    if (currentPage + half > totalPages) {
      start = Math.max(1, start - (currentPage + half - totalPages));
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const openPostDetails = async (post: any) => {
    axios.post(`${MainURL}/noticeboard/noticepostsviews`, {
      postId: post.id,
      sort : 'notice'
    })
    .then(()=>{
      window.scrollTo(0, 0);
      router.push(`/community/noticedetail?id=${post.id}`);
    }).catch((error: any)=>{
      console.error(error);
    })
  };

  const openPostPage = async () => {
    if (!isLogin) {
      alert('권한이 없습니다. 로그인이 필요합니다.')
    } else {
      router.push('/community/noticepost');  
    }
  };

  return (
    <div>
      <Header/>
      <div className='community'>

        <div className="inner">
          
          <div className="subpage__main">
            <div className="subpage__main__title">
              <div className="subpage__main__title">
                <h3>공지사항</h3>
              </div>
            </div>

            <div className="subpage__main__content">
              
              <div className="tbl_wrap">
                <div className="tbl_head01">
                  <ul className='titleRow'>
                    <li className="th_num">번호</li>
                    <li className="th_title">제목</li>
                    <li className="th_name">글쓴이</li>
                    <li className="th_date">등록일</li>
                    <li className="th_views">조회수</li>
                  </ul>
                  {
                    list.length > 0 
                    ?
                    list.map((item:any, index:any)=>{

                      return(
                        <ul className="textRow" key={index}
                          onClick={()=>{
                            openPostDetails(item)
                            
                          }}
                        >
                          <li className="td_num">{item.id}</li>
                          <li className="td_title">{renderPreview(item.title)}</li>
                          <li className="td_name">{item.userNickName}</li>
                          <li className="td_date">{DateFormmating(item.date)}</li>
                          <li className="td_views">{item.views}</li>
                        </ul>
                      )
                    })
                    :
                    <ul className="textRow">
                      <li className="td_num"></li>
                      <li className="td_title"><p>등록된 글이 없습니다.</p></li>
                      <li className="td_name"></li>
                      <li className="td_date"></li>
                      <li className="td_views"></li>
                    </ul>
                  }
                </div>
              </div>

              <div className='btn-row'>
                <div
                  onClick={() => changePage(1)}
                  className='btn'
                  style={{ backgroundColor: currentPage === 1 ? "#EAEAEA" : "#2c3d54" }}
                >
                  <p style={{ color: currentPage === 1 ? "#ccc" : "#fff" }}>{"<<"}</p>
                </div>
                <div
                  onClick={() => changePage(currentPage - 1)}
                  className='btn'
                  style={{ backgroundColor: currentPage === 1 ? "#EAEAEA" : "#2c3d54" }}
                >
                  <p style={{ color: currentPage === 1 ? "#ccc" : "#fff" }}>{"<"}</p>
                </div>
                {getPageNumbers().map((page) => (
                  <div
                    key={page}
                    onClick={() => changePage(page)}
                    className='btn'
                    style={{ backgroundColor: currentPage === page ? "#2c3d54" : "#EAEAEA" }}
                  >
                    <p style={{ color: currentPage === page ? "#fff" : "#333" }}>{page}</p>
                  </div>
                ))}
                <div
                  onClick={() => changePage(currentPage + 1)}
                  className='btn'
                  style={{ backgroundColor: currentPage === totalPages ? "#EAEAEA" : "#2c3d54" }}
                >
                  <p style={{ color: currentPage === totalPages ? "#ccc" : "#fff" }}>{">"}</p>
                </div>
                <div
                  onClick={() => changePage(totalPages)}
                  className='btn'
                  style={{ backgroundColor: currentPage === totalPages ? "#EAEAEA" : "#2c3d54" }}
                >
                  <p style={{ color: currentPage === totalPages ? "#ccc" : "#fff" }}>{">>"}</p>
                </div>
              </div>
              
            </div>
          
          </div>
         
        </div>
      </div>
      <Footer/>
    </div>
  )
}
