'use client';

import './footer.scss'
import { useRouter } from 'next/navigation';

export default function Footer (props:any) {
  
  const router = useRouter();

  return (
    <footer className='footer'>

      <div className="response-cover">

        <div className="inner">
          
          <ul className='mobile-none'>
            <a href='http://www.ministermore.co.kr/usingpolicy.html' target='_blank'>
              <li className='link'>이용약관</li>
            </a>
            <div className='divider'></div>
            <a href='http://www.ministermore.co.kr/personalinfo.html' target='_blank'>
              <li className='link'>개인정보처리방침</li>
            </a>
            <div className='divider'></div>
            <div onClick={()=>{
               router.push(`/admin`);
            }}>
              <li className='link'>관리자</li>
            </div>
          </ul>

          <ul>
            <li className='text black'>예플랫</li>
            <li className='text black'>대표자: 이요한</li>
            <li className='text'>사업자등록번호: 736-29-01512</li>
            <li className='text'>통신판매업신고번호: 2023-대구달성-1006호</li>
          </ul>

          <ul>
            <li className='text'>E-mail: yeplat@naver.com</li>
          </ul>

          <ul className='copyright'>
            <li className='text'>COPYRIGHT</li>
            <li className='text black'>© 2024. Yeplat.</li>
            <li className='text'>All rights reserved.</li>
          </ul>

          {/* <a className="kakaoBtnBox"
            href='http://pf.kakao.com/_xmwxoIn' target='_blank'
          >
            <img src={kakaologo}/>
            <p>카카오채널</p>
            <p>문의하기</p>
          </a> */}

        </div>
      </div>
    </footer>
      
  );
}

 

