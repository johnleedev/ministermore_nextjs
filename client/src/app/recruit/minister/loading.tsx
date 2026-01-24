import { useState } from "react";
import '../../ForListPage.scss';
import '../RecruitList.scss';
// app/recruit/loading.tsx
export default function Loading() {

  const activeTab = '직무';
  const searchWord = '';
  const selectedSort: string[] = [];
  const selectedLocation: string[] = [];
  const selectedReligiousbody: string[] = [];
  const isSearching = false;
  
  return (
    <div className="recruit">

    <div className="inner">

      <div className="subpage__main">
        
        <div className="subpage__main__title">
          <h3>사역자구인</h3>
          <div className='postBtn'
            
          >
            <p>공고등록</p>
          </div>
        </div>
      

        <div className="subpage__main__tabrow">
          {['직무', '지역', '교단'].map(tab => (
            <button
              key={tab}
              className={`subpage__main__tabbtn${activeTab === tab ? ' active' : ''}`}
             
            >
              {tab}
            </button>
          ))}
        </div>

        <div className='checkInputCover Recruit'>
          <div
            className={`checkInputbox`}
              
            
          >
            <span style={{display:'flex', alignItems:'center', gap:'6px'}}>
              <p></p>
            </span>
          </div>
        </div>

        <div className="subpage__main__selectedwords">
          <b>선택된 단어:</b>
          <div className="subpage__main__selectedwords__list">
            {[...selectedSort, ...selectedLocation, ...selectedReligiousbody].length === 0 ? (
              <span className="subpage__main__selectedwords__none">없음</span>
            ) : (
              [...selectedSort, ...selectedLocation, ...selectedReligiousbody].map((item, idx) => (
                <span
                  key={idx}
                  className="subpage__main__selectedwords__item"
                >
                  {item}
                  <button
                    className="subpage__main__selectedwords__remove"
                    
                    aria-label="삭제"
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="subpage__main__search">
          <input 
            className="inputdefault width" 
            
            style={{margin:'0', outline:'none', paddingLeft:'10px', border: '1px solid #ccc'}}
            
          />
          <div className="buttons">
            <div className="btn search" 
              
            >
              <p>검색</p>
            </div>
            <div className="btn reset"
              
            >
              <p>초기화</p>
            </div>
          </div>
        </div>


      
        
        <div className="subpage__main__content">

          <div className="main__content">
              
              <div className="recruit__wrap--category">

                <div className="recruit__wrap--menu">
                  <div className='recruit_menu_box' style={{width:'15%'}}>
                    <p className='recruit_menu_text'>교회명</p>
                  </div>
                  <div className='recruit_menu_box' style={{width:'50%'}}>
                    <p className='recruit_menu_text'>구인정보/교단/지원자격/사례</p> 
                  </div>
                  <div className='recruit_menu_box' style={{width:'20%'}}>
                    <p className='recruit_menu_text'>사역조건/지역</p> 
                  </div>
                  <div className='recruit_menu_box' style={{width:'10%'}}>
                    <p className='recruit_menu_text'>등록일/모집기간</p> 
                  </div>
                </div>

                <div className="recruit__wrap--item">
                
                </div>
              </div>
          </div>

          
        </div>
        
        
        
      </div>

    </div>

  </div>
  );
}