import axios from 'axios';
import MainURL from '../../../MainURL';
import ContiMain from './ContiMain';
import { themesList } from '../../../DefaultData';

interface SongData {
  id: number;
  title: string;
  stateSort: string;
  keySort: string;
  theme: string;
  tempoSort: string;
  image: string;
  lyrics: string;
}

 // app/recruit/page.tsx
export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const ID = searchParams.id;
  let allSongs: SongData[] = [];
  let stateSortOptions: string[] = [];
  let keySortOptions: string[] = [];
  let themeOptions: string[] = [];
  let tempoSortOptions: string[] = [];

  try {
    const response = await axios.get(`${MainURL}/api/worshipsongs/getsongsall`);
    if (response.data) {
      const songs = response.data.result;
      
      // 드롭다운 옵션들 추출
      const states = Array.from(new Set(songs.map((song: SongData) => song.stateSort).filter(Boolean))) as string[];
      const keys = Array.from(new Set(songs.map((song: SongData) => song.keySort).filter(Boolean))) as string[];
      const tempos = Array.from(new Set(songs.map((song: SongData) => song.tempoSort).filter(Boolean))) as string[];
      
      allSongs = songs;
      stateSortOptions = states.sort();
      keySortOptions = keys.sort();
      themeOptions = themesList; 
      tempoSortOptions = tempos.sort();
    }
  } catch (error) {
    console.error('곡을 불러오는 중 오류가 발생했습니다:', error);
  }

  return (
    <ContiMain allSongsProps={allSongs} stateSortOptionsProps={stateSortOptions} 
        keySortOptionsProps={keySortOptions} themeOptionsProps={themeOptions} tempoSortOptionsProps={tempoSortOptions} />
  )
}


  