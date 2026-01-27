'use client';
import { useEffect, useState } from 'react';
import '../Admin.scss'; 
import { useRouter } from 'next/navigation';

export default function Main( props: any) {
  const router = useRouter();
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const item = sessionStorage.getItem('user');
    setData(item);
  }, []);

  return (
    <div className="AdminContainer">
    
      <div className='AdminContent'>
        
        
     
        
        <div className='amdin_Main_Btn' onClick={()=>{
           window.scrollTo(0, 0);
          router.push(`/admin/main/recruit`)
        }}>
          사역게시판
        </div>
        {
          data === 'johnleedev' && (
            <>
              <div className='amdin_Main_Btn' onClick={()=>{
                window.scrollTo(0, 0);
                router.push(`/admin/main/recruitlist`)
              }}>
                일괄 관리 (사역게시판)
              </div>
            </>
          )
        }
        {/* <div className='amdin_Main_Btn' onClick={()=>{
          window.scrollTo(0, 0);
          router.push(`/admin/worshipmanage`)
        }}>
          예배사역 관리
        </div> */}
     
        
        {
          data === 'johnleedev' && (
            <>
              {/* <div className='amdin_Main_Btn' onClick={()=>{
                window.scrollTo(0, 0);
              navigate(`/admin/communitymanage`)
            }}>
              커뮤니티 게시판 관리
            </div> */}
            {/* <div className='amdin_Main_Btn' onClick={()=>{
                window.scrollTo(0, 0);
              router.push(`/admin/emailmanage`)
            }}>
              메일전송관리
           </div> */}
          
            <div className='amdin_Main_Btn' onClick={()=>{
              window.scrollTo(0, 0);
              router.push(`/admin/main/manage`)
            }}>
              통계
            </div>
            <div className='amdin_Main_Btn' onClick={()=>{
              window.scrollTo(0, 0);
              router.push(`/admin/backup`)
            }}>
              백업
            </div>
            </>
          )
        }
        {/* <div className='amdin_Main_Box' onClick={()=>{
          navigate(`/admin/registersolo`)
        }}>
          전단지 (solo) 등록
        </div>
        <div className='amdin_Main_Box' onClick={()=>{
          navigate(`/admin/revise`)
        }}>
          수정하기
        </div>
        <div className='amdin_Main_Box' onClick={()=>{
          navigate(`/admin/schoolinfo`)
        }}>
          학교 소개 (졸연)
        </div> */}
      </div>
        

     
    </div>
  );
}
