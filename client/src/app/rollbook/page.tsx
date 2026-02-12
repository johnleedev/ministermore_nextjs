import axios from 'axios';
import MainURL from '../../MainURL';
import RollbookList from './RollbookList';


 // app/recruit/page.tsx
export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1; // URL에서 페이지 번호를 가져옴 (없으면 1)
  let rollbookList = [];
  let totalCount = 0;

  try {
    // 현재 페이지 번호를 API 주소에 넣습니다.
    const res = await axios.get(`${MainURL}/api/rollbookchurch/getchurchlist`);
    if (res.data) {
      rollbookList = res.data.data || []; 
      totalCount = res.data.count || 0;
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }

  return (
    <RollbookList rollbookList={rollbookList} totalCount={totalCount} currentPageProp={currentPage} />
  );
}




