'use client';

import React, { useEffect, useState } from 'react';
import '../ForListPage.scss';
import './RecruitList.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../MainURL';
import { useRecoilValue } from 'recoil';
import { recoilLoginState } from '../../RecoilStore';
import { religiousbodyList, locationList, sortList, citydata } from '../../DefaultData';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface ListProps {
  title : string,
  source : string,
  writer : string,
  date : string,
  church : string,
  religiousbody : string,
  location : string,
  locationDetail : string,
  address : string,
  mainpastor : string,
  homepage : string,
  school : string,
  career : string,
  sort : string,
  part : string,
  partDetail : string,
  recruitNum : string,
  workday : string,
  workTimeSunDay : string,
  workTimeWeek : string,
  dawnPray : string,
  pay : string,
  welfare : string,
  insurance : string,
  severance : string,
  applydoc : string,
  applyhow : string,
  applytime : string,
  etcNotice : string,
  inquiry : string,
  churchLogo : string,
  customInput : string,
}

export default function RecruitListPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [restoredFromRouterState, setRestoredFromRouterState] = useState(false);

  const isLogin = useRecoilValue(recoilLoginState);

  const [refresh, setRefresh] = useState<boolean>(false); 
  const [listSort, setListSort] = useState('크롤링');
  const [listView, setListView] = useState<ListProps[]>([]);
  const [searchResult, setSearchResult] = useState<ListProps[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listAllLength, setListAllLength] = useState<number>(0);
  const [listAllLengthOrigin, setListAllLengthOrigin] = useState<number>(0);

  const fetchPosts = async () => {
    if (searchResult) return;
    const res = await axios.get(`${MainURL}/recruitminister/getrecruitdata/${currentPage}`)
      if (res.data.resultData) {
        setListView(res.data.resultData);
        setListAllLength(res.data.totalCount);
        setListAllLengthOrigin(res.data.totalCount);
      } 
   };

  useEffect(() => {
    fetchPosts();
  }, [refresh, currentPage, listSort]); 

  return (
    <div>
      <Header />
      <div>
        {/* Recruit List Content */}
      </div>
      <Footer />
    </div>
  )
}
