import axios from 'axios';
import MainURL from '../../../MainURL';
import GroupAdmin from './GroupAdmin';
import { headers } from 'next/headers';


 // app/recruit/page.tsx
export default async function Page({ searchParams }: { searchParams: { church_id?: number, department_id?: string, group_id?: string } }) {
  
  const church_id = searchParams.church_id || '';
  const department_id = searchParams.department_id || '';
  const group_id = searchParams.group_id || '';
  let studentList = [];

  const resPresents = await axios.post(`${MainURL}/api/rollbookstudents/getstudentlist`, {
    churchId : church_id,
    deptId : department_id,
    groupId : group_id
  })
  if (resPresents.data) {
    const copy = resPresents.data;
    studentList = copy;
  } 
  
  return (
    <GroupAdmin 
      churchIdProps={church_id.toString()}
      departmentIdProps={department_id.toString()}
      groupIdProps={group_id.toString()}
      studentListProps={studentList}
    />
  );
}




