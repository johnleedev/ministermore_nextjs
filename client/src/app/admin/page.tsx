'use client';

import './Admin.scss'; 
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainURL from '../../MainURL'; 
import axios from 'axios';

export default function AdminLogin( props: any) {

  const router = useRouter();

  let [user, setuser] = useState('');
  let [passwd, setpasswd] = useState('');

  const login = () => {
    if (user === 'johnleedev' && passwd === 'gksksla' || user === 'noah' && passwd === '1234' 
      ||  user === 'jueun' && passwd === '1111' || user === 'seoyun' && passwd === '1212') {
      alert('관리자 로그인 되었습니다.')
      router.push('/admin/main'); 
      sessionStorage.setItem('user', user);
    } else {
      alert('아이디,passwd이 잘못되었습니다. 다시 시도하세요.')
    }

  }

  return (
    <div className="AdminContainer">

      <div className="inner">
      
        <div  className="AdminContent">

          <div className='admin_input_wrapper'>
            <div className='admin_box'>
              <div className='admin_content_text'>아이디</div>
              <input className='admin_content_input' type='text' onChange={(e)=>{setuser(e.target.value)}}></input>
            </div>

            <div className='admin_box'>
              <div className='admin_content_text'>비밀번호</div>
              <input className='admin_content_input' type='password' 
                onChange={(e)=>{setpasswd(e.target.value)}}
                onKeyDown={(e)=>{if (e.key === 'Enter') {login();}}}
              ></input>
            </div>

          </div>

          <button className='login_button' 
              onClick={login}>로그인</button>

          <button className='login_button' 
              onClick={()=>{router.push('/')}}>뒤로가기</button>
        
        </div>
      </div>
     
     
    </div>
  );
}
