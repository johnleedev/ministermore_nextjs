import axios from 'axios';
import MainURL from '../../../MainURL';
import PraiseDetail from './PraiseDetail';


interface SongProps {
  id: number;
  title: string;
  theme: string;
  image: string;
  source: string;
  lyrics: string;
  keySort: string;
  date: string;
  stateSort: string;
  pptlist?: string;
  youtubelist?: string;
}

 // app/recruit/page.tsx
export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const ID = searchParams.id;
  let songData = null;

  try {
    // 현재 페이지 번호를 API 주소에 넣습니다.
    const resMinister = await axios.post(`${MainURL}/api/worshipsongs/getsongdatapart`, {
      id : ID
    })
    if (resMinister.data) {
      const row = resMinister.data[0];
      const mapped: SongProps = {
        id: Number(row?.id ?? row?._id ?? ''),
        title: String(row?.title ?? ''),
        theme: String(row?.theme ?? ''),
        image: String(row?.image ?? ''),
        source: String(row?.source ?? ''),
        lyrics: String(row?.lyrics ?? ''),
        keySort: String(row?.keySort ?? ''),
        date: String(row?.date ?? ''),
        stateSort: String(row?.stateSort ?? ''),
        pptlist: String(row?.pptlist ?? ''),
        youtubelist: String(row?.youtubelist ?? ''),
      };
      songData = mapped;
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }

  return (
    <PraiseDetail songDataProp={songData as SongProps} />
  )
}


  