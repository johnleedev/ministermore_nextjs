import MainURL from '../../../MainURL';
import axios from 'axios';
import UsedBoard from './UsedBoard';
 

 export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1; // URL에서 페이지 번호를 가져옴 (없으면 1)
  let usedList = [];
  let totalCount = 0;

  try {
    // 현재 페이지 번호를 API 주소에 넣습니다.
    const res = await axios.get(`${MainURL}/api/usedboard/getusedposts/${currentPage}`);
    if (res.data.resultData) {
      usedList = res.data.resultData || []; 
      totalCount = res.data.totalCount || 0;
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }

  return (
    <UsedBoard usedListProp={usedList} totalCountProp={totalCount} currentPagePropProp={currentPage} />
  );
}

