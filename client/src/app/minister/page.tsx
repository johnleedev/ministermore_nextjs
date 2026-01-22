'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../ForListPage.scss';
import './pages/MinisterPageList.scss';
import axios from 'axios';
import MainURL from '../../MainURL';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

type MinisterListItem = {
  id: string;
  isView: string;
  sort: string;
  name: string;
  mainImage: string;
  phone: string;
  porfile: string;
  images: string;
  date: string;
};

const ministryFieldsList = ['청년부', '예배', '교육', '찬양', '전도', '상담', '행정', '미디어'];
const denominationList = ['대한예수교장로회', '기독교대한감리회', '기독교대한하나님의성회', '기독교대한성결교회'];
const locationList = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

export default function MinisterPageList() {
  const router = useRouter();
  const [list, setList] = useState<MinisterListItem[]>([]);
  const [searchWord, setSearchWord] = useState('');
  const [activeTab, setActiveTab] = useState('사역분야');
  const [selectedMinistryFields, setSelectedMinistryFields] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedDenomination, setSelectedDenomination] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<MinisterListItem[] | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${MainURL}/minister/getdataministers`);
      const rows = res?.data?.data;
      if (!rows || rows === false) {
        setSearchResult(null);
        return;
      }

      const mapped: MinisterListItem[] = rows.map((row: any, idx: number) => ({
        id: String(row?.id ?? row?._id ?? idx),
        isView: String(row?.isView ?? row?.title ?? ''),
        sort: String(row?.sort ?? ''),
        name: String(row?.name ?? ''),
        mainImage: String(row?.mainImage ?? ''),
        phone: String(row?.phone ?? ''),
        porfile: String(row?.porfile ?? row?.profile ?? row?.profileImage ?? ''),
        images: String(row?.images ?? row?.imageUrl ?? ''),
        date: String(row?.date ?? row?.createdAt ?? ''),
      }));

      setList(mapped);
      setSearchResult(mapped);
    } catch (e) {
      setSearchResult(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);  

  return (
    <div>
      <Header />
      <div>
        {/* Minister List Content */}
      </div>
      <Footer />
    </div>
  )
}
