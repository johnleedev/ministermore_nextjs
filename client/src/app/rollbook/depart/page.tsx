import axios from 'axios';
import MainURL from '../../../MainURL';
import ChurchDepart from './ChurchDepart';
import { headers } from 'next/headers';


 // app/recruit/page.tsx
export default async function Page({ searchParams }: { searchParams: { church_id?: number, department_id?: string, churchName?: string } }) {
  
  const department_id = searchParams.department_id || '';
  const church_id = searchParams.church_id || '';
  const churchName = searchParams.churchName || '';
  let groupList = [];

  const resDepartment = await axios.post(`${MainURL}/api/rollbookgroup/getgrouplist`, {
    churchId : church_id,
    deptId : department_id
  })
  if (resDepartment.data) {
   groupList = resDepartment.data;
  } 
  

  return (
    
    <ChurchDepart 
      churchIdProps={church_id.toString()}
      departmentIdProps={department_id.toString()}
      groupListProps={groupList}
      churchNameProps={churchName}
    />
  );
}




