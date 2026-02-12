import axios from 'axios';
import MainURL from '../../../MainURL';
import ChurchMain from './ChurchMain';
import { headers } from 'next/headers';


 // app/recruit/page.tsx
export default async function Page({ searchParams }: { searchParams: { id?: number, churchName?: string } }) {
  const churchId = Number(searchParams.id); 
  const churchName = searchParams.churchName;
  
  // 전체 URL 가져오기
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const pathname = '/rollbook/churhmain';
  const searchParamsString = new URLSearchParams(
    Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  const fullUrl = `${protocol}://${host}${pathname}${searchParamsString ? `?${searchParamsString}` : ''}`;
  
  let departmentList = [];

  try {
    if (churchId) {
      const resDepartment = await axios.post(`${MainURL}/api/rollbookdepart/getdepartments`, {
        church_id : churchId
      })
      if (resDepartment.data && resDepartment.data.success) {
        departmentList = resDepartment.data.data || [];
      } 
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }

  return (
    <ChurchMain 
      departmentListProps={departmentList} 
      churchNameProps={churchName || ''}
      churchIdProps={churchId}
      fullUrlProps={fullUrl}
    />
  );
}




