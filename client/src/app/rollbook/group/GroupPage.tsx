'use client';
import React, { useEffect, useRef, useState } from 'react';
import '../RollbookPresents.scss';
import MainURL from '../../../MainURL';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getYear } from 'date-fns';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import presentImg from '../../../../public/rollbook/present.png';
import absentImg from '../../../../public/rollbook/absent.png';

interface PersonalListProps {
  id : number,
  name: string;
  department : string;
  groupName : string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  school : string;
  presents2025 : {
    day : string;
    present : string;
  }
}

export default function GroupPage ({ churchIdProps = '', departmentIdProps = '', groupIdProps = '', studentListProps = [] }: { churchIdProps: string, departmentIdProps: string, groupIdProps: string, studentListProps: PersonalListProps[] }) {
  
  const currentDate = new Date();
  const thisyear = getYear(currentDate);
  const [currentMonth, setCurrentMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
  const todayFormatted = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`;

  const [refresh, setRefresh] = useState(true);
  let router = useRouter();
  const [departmentInfo, setDepartmentInfo] = useState<any>({});
  const [departmentDetail, setDepartmentDetail] = useState<any>({});

  const [yearDateAll, setYearDateAll] = useState<any[]>([]);
  const [viewYearDate, setViewYearDate] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [personalList, setPersonalList] = useState<PersonalListProps[]>(studentListProps);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // 데이터 가져오기
  // const fetchYearPosts = async () => {
  //   const resYear = await axios.post(`${MainURL}/api/rollbookpresents/getyearstate`, {
  //     thisyear : thisyear
  //   })
  //   if (resYear.data) {
  //     const yearcopy = resYear.data[0];
  //     const daysList = Object.keys(yearcopy)
  //       .filter((key) => key.startsWith('day'))
  //       .map((key) => ({ day: yearcopy[key] }));
  //     setYearDateAll(daysList);
  //     findCurrentMonthDate(daysList, currentMonth);
  //   } 
  // };

  // const fetchPresentPosts = async () => {
  //   const resPresents = await axios.post(`${MainURL}/api/rollbookpresents/getpersonalpresents`, {
  //     churchId : departmentInfo.church_Id,
  //     department : departmentInfo.department,
  //     groupName : departmentDetail.group
  //   })
  //   if (resPresents.data) {
  //     const copy = resPresents.data;
  //     const result = copy.map((item:any) => ({
  //       ...item,
  //       presents2025: JSON.parse(item.presents2025)
  //     }));
  //     setPersonalList(result);
  //   } 
  // };

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const info = sessionStorage.getItem('departmentInfo');
  //     const detail = sessionStorage.getItem('departmentDetail');
  //     if (info) setDepartmentInfo(JSON.parse(info));
  //     if (detail) setDepartmentDetail(JSON.parse(detail));
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchYearPosts();
  // }, []);  

  // useEffect(() => {
  //   if (departmentInfo.church_Id && departmentInfo.department && departmentDetail.group) {
  //     fetchPresentPosts();
  //   }
  // }, [refresh, departmentInfo, departmentDetail]);  

  // 날짜 함수
  const findCurrentMonthDate = async (daysList:any, currentMonthCopy:any) => {
    // 현재 월에 해당하는 day 값 추출
    const currentMonthDaysCopy = daysList
      .map((item:any) => item.day) // day 값만 추출
      .filter((day:any) => day && day.startsWith(currentMonthCopy));
    setViewYearDate(currentMonthDaysCopy);

    // 현재월 내에서 오늘 날짜(가장가까운) 찾기
    const nextClosestDayInMonthCopy = currentMonthDaysCopy
      .filter((day:any) => day >= todayFormatted) // 오늘 이후 날짜 필터링
      .sort((a:any, b:any) => a - b)[0]; // 가장 가까운 날짜 선택
    setSelectedDate(nextClosestDayInMonthCopy);
  };

  
  // 데이터 저장하기
  const savePresentState = async (username: string, result :any) => {
    const churchId = typeof window !== 'undefined' ? sessionStorage.getItem('churchId') || '' : '';
    const department = typeof window !== 'undefined' ? sessionStorage.getItem('department') || '' : '';
    const groupName = typeof window !== 'undefined' ? sessionStorage.getItem('departmentDetail') || '' : '';
    const res = await axios.post(`${MainURL}/api/rollbookpresents/revisepersonalpresents`, {
      churchId : churchId,
      department : department,
      groupName : groupName,
      name : username,
      presents : JSON.stringify(result),
      year : thisyear
    })
    if (res.data) {
      setRefresh(!refresh);
    } 
  };

  // 출결석 함수
  const updateAttendance = (item: any, isPresent: boolean) => {
    
    
  };
  

 
  return  (
    <div className="Rollbook_presents">

      {/* 출석/결석 팝업 */}
      {
        popupMessage && 
        <div className={`popup ${popupMessage ? 'popup-active' : ''}`}>
          <img src={popupMessage === '출석' ? presentImg.src : absentImg.src} />
        </div>
      }

      <div className='department_main'>
        <div className="maintitle-box">
          <div className='maintitle'>{departmentDetail.group}</div>
        </div>
      </div>

      <div className='yeardate_box'>
        <div className="yeardate_btn"
          onClick={()=>{
            const copyMonth = parseInt(currentMonth);
            if (copyMonth === 1) {
              alert('가장 첫 달입니다.')
            } else {
              const lastMonth = copyMonth-1 < 10 ? String(copyMonth-1).padStart(2, '0') : String(copyMonth-1);
              setCurrentMonth(lastMonth);
              findCurrentMonthDate(yearDateAll, lastMonth);
            }
          }}
        >
          <IoIosArrowBack />
        </div>
       { viewYearDate.map((item:any, index:any)=>{
          const month = `${item.slice(0, 2)}월`;
          const day = `${item.slice(2, 4)}일`;

          return (
            <div key={index} className={selectedDate === item ? 'yeardate_list selected' : 'yeardate_list'}
              onClick={()=>{
                setSelectedDate(item);
              }}
            >
              <p>{month}</p>
              <p>{day}</p>
            </div>           
          )
        })}
        <div className="yeardate_btn"
          onClick={()=>{
            const copyMonth = parseInt(currentMonth);
            if (copyMonth === 12) {
              alert('가장 마지막 달입니다.')
            } else {
              const nextMonth = copyMonth+1 < 10 ? String(copyMonth+1).padStart(2, '0') : String(copyMonth+1);
              setCurrentMonth(nextMonth);
              findCurrentMonthDate(yearDateAll, nextMonth);
            }
          }}
        >
          <IoIosArrowForward />
        </div>
      </div>
      <div className='personal_box'>
        { personalList.map((item:any, index:any)=>{

          console.log(item);
            return (
              <div key={index} className='personal_list' >
                <div className="namebox">
                  <h3>{ item.name }</h3>
                  <p>{ item.school }</p>
                  <p>{ item.birthMonth }{ item.birthDay }</p>
                </div>
                <div className="present-row">
                  <div className={`present-box`} 
                    onClick={() => updateAttendance(item, true)}
                  >
                    <img src={presentImg.src} />
                  </div>
                  <div className={`absent-box`} 
                    onClick={() => updateAttendance(item, false)}
                  >
                    <img src={absentImg.src} />
                  </div>
                </div>
              </div>           
            )
          })}
      </div>

      <div style={{height:'100px'}}></div>
   
      <div className='dep_buttonbox'>
        
       <div className='link_btn' onClick={()=>{
          router.back();
        }}> 뒤로가기 </div>  
        <div className='link_btn' onClick={()=>{
          window.scrollTo(0, 0);
          sessionStorage.setItem('departmentDetail', JSON.stringify(departmentDetail));
          sessionStorage.setItem('personalList', JSON.stringify(personalList));
          sessionStorage.setItem('yearDateAll', JSON.stringify(yearDateAll));
          router.push(`/rollbook/presentsstate`);
        }}> 출석현황 </div> 
        <div className='link_btn' onClick={()=>{
          router.push(`/rollbook/groupadmin?church_id=${churchIdProps}&department_id=${departmentIdProps}&group_id=${groupIdProps}`);
        }}> 관리 </div>   
      </div>
          
        
  
      <div style={{height:'200px'}}></div>

    </div>
  )
}


