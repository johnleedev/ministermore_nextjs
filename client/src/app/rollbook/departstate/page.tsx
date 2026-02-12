'use client';
import React, { useEffect, useState } from 'react';
import '../RollbookPresents.scss';
import MainURL from '../../../MainURL';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getYear } from 'date-fns';

interface PersonalListProps {
  id: number;
  name: string;
  department: string;
  groupName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  school: string;
  presents2025: string; // JSON 문자열
}

export default function page (props:any) {
  const router = useRouter();
  const currentDate = new Date();
  const thisyear = getYear(currentDate);

  const [dateAll, setDateAll] = useState<string[]>([]);
  const [personalList, setPersonalList] = useState<PersonalListProps[]>([]);
  const [department, setDepartment] = useState<string>('');

  // 날짜 데이터 가져오기
  const fetchYearPosts = async () => {
    const resYear = await axios.post(`${MainURL}/api/rollbookpresents/getyearstate`, {
      thisyear: thisyear,
    });
    if (resYear.data) {
      const yearcopy = resYear.data[0];
      const daysList = Object.keys(yearcopy)
        .filter((key) => key.startsWith('day'))
        .map((key) => yearcopy[key]);
      const result = daysList.filter((day: any) => day !== null);
      setDateAll(result);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedList = sessionStorage.getItem('personalList');
      const storedDept = sessionStorage.getItem('department');
      if (storedList) {
        setPersonalList(JSON.parse(storedList));
      }
      if (storedDept) {
        setDepartment(storedDept);
      }
    }
  }, []);

  useEffect(() => {
    fetchYearPosts();
  }, []);

  // 그룹별 출석 데이터 계산
  const getGroupAttendance = () => {
    const groupAttendance: { [groupName: string]: { [date: string]: number } } = {};

    dateAll.forEach((date) => {
      personalList.forEach((student) => {
        const groupName = student.groupName || '미지정';
        const presents = student.presents2025 ? JSON.parse(student.presents2025) : [];
        const attendance = presents.find((entry: any) => entry.day === date)?.present;

        if (!groupAttendance[groupName]) {
          groupAttendance[groupName] = {};
        }
        if (!groupAttendance[groupName][date]) {
          groupAttendance[groupName][date] = 0;
        }

        if (attendance) {
          groupAttendance[groupName][date]++;
        }
      });
    });

    return groupAttendance;
  };

  const groupAttendance = getGroupAttendance();

  // 전체 출석 수 계산
  const calculateTotalAttendance = (date: string) => {
    return Object.keys(groupAttendance).reduce((total, groupName) => {
      return total + (groupAttendance[groupName][date] || 0);
    }, 0);
  };

  return (
    <div className="Rollbook_presents">

      <div className='department_main'>
        <div className="maintitle-box">
          <div className='maintitle'>{department} 통계</div>
        </div>
      </div>

      <div className="attendance-container">
       <div className="attendance-body">
          <div className='attendance-topbox'>
            <div className="attendance-row">
              <h3 className='datebox'>날짜</h3>
              <h3 className='datebox'>총계</h3>
              {
                Object.keys(groupAttendance).map((groupName) => (
                  <p className="attendance-date" key={groupName}>{groupName}</p>
                ))
              }
            </div>
          </div>
          <div className='attendance-bottombox'>
            {dateAll.map((date:any, index:any) => (
              <div key={index} className='attendance-row'>
                <h3 className='datebox'>{`${date.slice(0, 2)}/${date.slice(2, 4)}`}</h3>
                <div className="datebox">{calculateTotalAttendance(date)}</div>
                {
                  Object.keys(groupAttendance).map((groupName:any, subIndex:any) => (
                    <div key={subIndex} className="attendance-status">
                      {groupAttendance[groupName][date] || ''}
                    </div>
                  ))
                }
                
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: '100px' }}></div>

      <div className="dep_buttonbox">
        <div
          className="link_btn"
          onClick={() => {
            router.back();
          }}
        >
          뒤로가기
        </div>
      </div>

      <div style={{ height: '200px' }}></div>
    </div>
  );
}