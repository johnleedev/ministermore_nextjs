// app/recruit/minister/detail/[id]/page.tsx
import axios from 'axios';
import MainURL from '../../../../../MainURL';
import RecruitDetail from './RecruitDetail'; // 새로 만들 클라이언트 컴포넌트

export default async function Page({ params }: { params: { id: string } }) {
  const ID = params.id;
  let postData = null;

  try {
    // 서버에서 데이터를 미리 가져옵니다.
    const res = await axios.post(`${MainURL}/api/recruitminister/getrecruitdatapart`, {
      id: ID
    });
    postData = res.data[0] || null;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }

  if (!postData) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <RecruitDetail postData={postData} id={ID} />
  );
}