'use client';

import React, { useEffect, useState } from 'react';
import './RollbookList.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../MainURL';
import Footer from '../../components/Footer';
import { useRecoilState } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../RecoilStore';


interface ListProps {
  id : number,
  name: string;
  address : string | null;
  created_at: string;
}


export default function RollbookList ({ rollbookList, totalCount, currentPageProp }: { rollbookList: any[], totalCount: number, currentPageProp: number }) {

  let router = useRouter();
  const [isLogin, setIsLogin] = useRecoilState(recoilLoginState);
  const [userData, setUserData] = useRecoilState(recoilUserData);
  
  const [list, setList] = useState<ListProps[]>(rollbookList || []);
  const [searchWord, setSearchWord] = useState('');
  const [listAllLength, setListAllLength] = useState<number>(totalCount);
  
  // 데이터를 표시용 형식으로 변환
  const displayList = list.map((item: any) => ({
    id: item.id,
    churchName: item.name || item.churchName || '',
    location: item.address || item.location || '',
    religiousbody: item.religiousbody || '',
    image: item.image || '',
    isView: item.isView || 'true'
  }));

  // 글자 검색 ------------------------------------------------------
	const handleWordSearching = async () => {
    setList([]);
    if (searchWord.length < 2) {
      alert('2글자이상 입력해주세요')
    } else {
      const res = await axios.post(`${MainURL}/api/rollbooklist/getdatabookletsearch`, {
        location : '교회소개',
        word: searchWord
      })
      if (res.data.data) {
        let copy: any = [...res.data.data];
        setList(copy);
        setListAllLength(res.data.count);
      } else {
        setListAllLength(0);
      }
    }
	};

  const alertLogin = () => {
    alert('로그인이 필요합니다.');
    router.push('/login');
  }

 
  return (
    <div className="Rollbook">

      <div className="inner">

        
        <div className="subpage__main">
          <div className="subpage__main__title">
            <h3>전체교회</h3>
          </div>
          
          <div className="subpage__main__search">
           
            <div className="subpage__main__search__box">
              <p className="buttons" style={{marginRight:'10px'}}>검색:</p>
              <input className="inputdefault width" type="text" placeholder='교회명 검색'
                value={searchWord} onChange={(e)=>{setSearchWord(e.target.value)}} 
                onKeyDown={(e)=>{if (e.key === 'Enter') {handleWordSearching();}}}
                />
              <div className="buttons" style={{margin:'20px 0'}}>
                <div className="btn" 
                  onClick={handleWordSearching}>
                  <p>검색</p>
                </div>
              </div>
              <div className="buttons" style={{margin:'20px 0'}}>
                <div className="btn" 
                  onClick={()=>{
                    setSearchWord('');
                  }}>
                  <p>초기화</p>
                </div>
              </div>
            </div>
          </div>

          <div className="subpage__main__content">

            <div className="main__content">
              {
                displayList.length > 0
                ?
                <div
                  className="pamphlet__wrap--category"
                  data-aos="fade-up"
                >
                  <div className="pamphlet__title__row">
                    <div>현재 {displayList.length}개가 있습니다.</div>
                  </div>
                  <div className="pamphlet__wrap--item">
                    {
                      displayList.map((item:any, index:any) => (
                        <div key={item.id || index} className="pamphlet__item"
                          onClick={()=>{
                            if (isLogin) {
                              window.scrollTo(0, 0);
                              router.push(`/rollbook/churhmain?id=${item.id}&churchName=${item.churchName}`);  
                            } else {
                              alertLogin();
                            }
                          }}
                        >
                          <div className="pamphlet__img--cover">
                            <div className='imageBox'>
                              {item.image ? (
                                <img src={`${MainURL}/images/rollbook_church/${item.image}`} alt={'등록된 사진이 없습니다.'} />
                              ) : (
                                <div style={{width: '100%', height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                  <p style={{color: '#999'}}>이미지 없음</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {item.religiousbody && (
                            <div className="namecard">
                              <p>{item.religiousbody}</p>
                            </div>
                          )}
                          <div className="pamphlet__coname">
                            <p>{item.churchName}</p>
                          </div>
                          {item.location && (
                            <div className="pamphlet__name">
                              <p className='pamphlet__name-title'>위치</p>
                              <div className="pamphlet__divider"></div>
                              <p>{item.location}</p>
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
                :
                <div
                  className="pamphlet__wrap--category"
                  data-aos="fade-up"
                >
                  <div className="pamphlet__title">검색 결과가 없습니다.</div>
                </div>
              }
              </div>
            </div>
          </div>

        </div>
        <Footer />
    </div>
  )
}


