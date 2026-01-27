import axios from 'axios';
import MainURL from '../MainURL';
import Main from './Main';
import './Main.scss';

export default async function Page() {
  let ministerList = [];

  try {
    const res = await axios.get(`${MainURL}/api/recruitminister/getrecruitformain`);
    ministerList = res.data.resultData || []; 
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
 
  return (
    <div>
      <Main initialRecruitList={ministerList} />
    </div>
  );
}