import axios from 'axios';
import MainURL from '../../../MainURL';
import ChurchDepartAdmin from './ChurchDepartAdmin';

interface Group {
  id: number;
  church_id: number;
  dept_id: number;
  name: string;
  leader_id: number | null;
}

interface User {
  id: number;
  userNickName: string;
  userAccount: string;
}

export default async function Page({ searchParams }: { searchParams: { church_id?: string, department_id?: string, churchName?: string } }) {
  const churchId = searchParams.church_id || '';
  const departmentId = searchParams.department_id || '';
  const churchName = searchParams.churchName || '';
  
  let groups: Group[] = [];
  let users: User[] = [];

  // churchId와 deptId가 있을 때만 데이터 가져오기
  if (churchId && departmentId) {
    try {
      // 소그룹 목록 가져오기
      const resGroups = await axios.post(`${MainURL}/api/rollbookgroup/getgrouplist`, {
        churchId: churchId,
        deptId: departmentId
      });
      if (resGroups.data) {
        console.log(resGroups.data);
        groups = Array.isArray(resGroups.data) ? resGroups.data : [];
      }

      // 사용자 목록 가져오기 (리더 선택용)
      const resUsers = await axios.post(`${MainURL}/api/rollbookgroup/getdeptusers`, {
        churchId: parseInt(churchId),
        deptId: parseInt(departmentId)
      });
      if (resUsers.data) {
        users = Array.isArray(resUsers.data) ? resUsers.data : [];
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  }

  return (
    <ChurchDepartAdmin 
      initialGroups={groups}
      initialUsers={users}
      churchId={churchId}
      churchNameProps={churchName}
      departmentId={departmentId}
    />
  );
}
