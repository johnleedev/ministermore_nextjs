'use client';

import { useEffect, useState } from 'react';
import './praise/PraiseMain.scss';
import '../ForListPage.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../MainURL';
import { themesList } from '../../DefaultData';
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface ListProps {
  id : number,
  bookletId: string;
}

export default function PraiseListPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [listView, setListView] = useState<ListProps[]>([]);
  const [searchWord, setSearchWord] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortFilter, setSortFilter] = useState<string>('');
  const [keyFilter, setKeyFilter] = useState<string>('');
  const [tempoFilter, setTempoFilter] = useState<string>('');

  const PAGE_SIZE = 15;

  const fetchPosts = async (currentPageCopy:any) => {
    setIsLoading(true);
    const res = await axios.get(`${MainURL}/worshipsongs/getsongs/${currentPageCopy}`);
    if (res.data) {
      const newItems = [...res.data.resultData];
      setListView(prev => [...prev, ...newItems]);
      if (newItems.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const savedSearchWord = searchParams.get('searchWord');
    const savedThemes = searchParams.get('themes');
    const savedSort = searchParams.get('sort');
    const savedKey = searchParams.get('key');
    const savedTempo = searchParams.get('tempo');
    
    if (savedSearchWord || savedSort || savedKey || savedTempo) {
      if (savedSearchWord) setSearchWord(savedSearchWord);
      if (savedSort) setSortFilter(savedSort);
      if (savedKey) setKeyFilter(savedKey);
      if (savedTempo) setTempoFilter(savedTempo);
    } else {
      fetchPosts(1);
    }
  }, []);

  return (
    <div>
      <Header/>
      <div>
        {/* Praise List Content */}
      </div>
      <Footer/>
    </div>
  )
}
