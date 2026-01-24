'use client';

import React, { useEffect, useState } from 'react';
// import './Rollbook.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../MainURL';
import Footer from '../../components/Footer';
import MenuTemplate from './MenuTemplate';
import { useRecoilState } from 'recoil';
import { recoilLoginState, recoilUserData } from '../../RecoilStore';
import Header from '../../components/Header';

interface ListProps {
  id : number,
  isView: string;
  location : string;
  churchName: string;
  religiousbody : string;
  image: string;
}

export default function RollbookListPage() {

  const router = useRouter();
  const [isLogin, setIsLogin] = useRecoilState(recoilLoginState);
  const [userData, setUserData] = useRecoilState(recoilUserData);
  
  const [list, setList] = useState<ListProps[]>([]);
  const [searchWord, setSearchWord] = useState('');
  const [listAllLength, setListAllLength] = useState<number>(0);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);

  const fetchPosts = async () => {
    const res = await axios.post(`${MainURL}/rollbooklist/getchurchlist`, {
      
    })
    if (res.data.data) {
      setIsResdataFalse(false);
      let copy: any = [...res.data.data];
      copy.reverse();
      setList(copy);
      setListAllLength(res.data.count);
    } else {
      setListAllLength(0);
      setIsResdataFalse(true);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);  

  return (
    <div>
      <Header />
      <div>
        {/* Rollbook List Content */}
      </div>
      <Footer/>
    </div>
  )
}
