'use client';
import { useEffect, useState } from 'react';
import '../RollbookAdmin.scss';
import axios from 'axios'
import MainURL from "../../../MainURL";
import { DropdownBox } from '../../../components/DropdownBox';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { BirthDayData, BirthMothData, BirthYearData } from './BirthData';
import AddStudentModal from './AddStudentModal';


interface PersonalListProps {
    id: string;
    name: string;
    birth_date: string | null;
    phone: string | null;
    is_active: boolean;
    // 표시용으로 변환된 값들
    birthYear?: string;
    birthMonth?: string;
    birthDay?: string;
}

export default function GroupAdmin({ churchIdProps = '', departmentIdProps = '', groupIdProps = '', studentListProps = [] }: { churchIdProps: string, departmentIdProps: string, groupIdProps: string, studentListProps: PersonalListProps[] }) {

  let router = useRouter();
  
  const [refresh, setRefresh] = useState<boolean>(false);

  // birth_date를 년/월/일로 변환하는 헬퍼 함수
  const parseBirthDate = (birthDate: string | null | undefined) => {
    if (!birthDate || birthDate === 'null' || birthDate === 'NULL') {
      return { year: '', month: '', day: '' };
    }
    try {
      // "YYYY-MM-DD" 또는 "YYYY-MM-DD HH:MM:SS" 형식 파싱
      const dateStr = String(birthDate).split(' ')[0]; // 시간 부분 제거
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        if (year && month && day) {
          // day에서 시간 부분이 있으면 제거
          const dayOnly = day.split(' ')[0].split('T')[0];
          return {
            year: `${year}년`,
            month: `${String(month).padStart(2, '0')}월`,
            day: `${String(dayOnly).padStart(2, '0')}일`
          };
        }
      }
      return { year: '', month: '', day: '' };
    } catch (error) {
      console.error('birth_date 파싱 오류:', error, birthDate);
      return { year: '', month: '', day: '' };
    }
  };
  
  // birth_date를 파싱해서 초기 데이터 변환
  const parseInitialStudents = (students: PersonalListProps[]) => {
    if (!Array.isArray(students)) return [];
    return students.map((student: any) => {
      const { year, month, day } = parseBirthDate(student.birth_date);
      return {
        ...student,
        birthYear: year,
        birthMonth: month,
        birthDay: day
      };
    });
  };
  
  const [studentList, setStudentList] = useState<PersonalListProps[]>(parseInitialStudents(studentListProps));
  
  // 초기 데이터가 변경될 때 다시 파싱
  useEffect(() => {
    if (studentListProps && studentListProps.length > 0) {
      const parsed = parseInitialStudents(studentListProps);
      setStudentList(parsed);
    }
  }, [studentListProps]);



  // 수정 함수 ----------------------------------------------
  const currentDate = new Date();
  const date = format(currentDate, 'yyyy-MM-dd');


	// 모달 ---------------------------------------------------------
	const [isViewAddPersonalModal, setIsViewAddPersonalModal] = useState<boolean>(false);

  // 학생 목록 새로고침
  const fetchStudents = async () => {
    if (!churchIdProps || !departmentIdProps || !groupIdProps) return;
    
    try {
      const res = await axios.post(`${MainURL}/api/rollbookstudents/getstudentlist`, {
        churchId: parseInt(churchIdProps),
        deptId: parseInt(departmentIdProps),
        groupId: parseInt(groupIdProps)
      });
      if (res.data) {
        // birth_date를 파싱해서 birthYear, birthMonth, birthDay로 변환
        const students = parseInitialStudents(Array.isArray(res.data) ? res.data : []);
        setStudentList(students);
      }
    } catch (error) {
      console.error('학생 목록 조회 실패:', error);
    }
  };

  // refresh 상태 변경 시 학생 목록 새로고침
  useEffect(() => {
    if (refresh) {
      fetchStudents();
      setRefresh(false);
    }
  }, [refresh]);

  // 학생 수정
  const updateStudent = async (item: PersonalListProps) => {
    if (!item.id) {
      alert('학생 ID가 없습니다.');
      return;
    }

    try {
      const res = await axios.post(`${MainURL}/api/rollbookstudents/updatestudent`, {
        id: parseInt(item.id),
        name: item.name.trim(),
        birthYear: item.birthYear || null,
        birthMonth: item.birthMonth || null,
        birthDay: item.birthDay || null,
        phone: item.phone?.trim() || ''
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchStudents();
      } else {
        alert(res.data.error || '학생 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('학생 수정 실패:', error);
      alert(error.response?.data?.error || '학생 수정에 실패했습니다.');
    }
  };

  // 학생 삭제
  const deleteStudent = async (item: PersonalListProps) => {
    if (!item.id) {
      alert('학생 ID가 없습니다.');
      return;
    }

    if (!confirm(`"${item.name}" 학생을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await axios.post(`${MainURL}/api/rollbookstudents/deletestudent`, {
        id: parseInt(item.id)
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchStudents();
      } else {
        alert(res.data.error || '학생 삭제에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('학생 삭제 실패:', error);
      alert(error.response?.data?.error || '학생 삭제에 실패했습니다.');
    }
  };
	
  
  return  (
    <div className="department-admin">

      <div className="inner">
        
        <div className="maintitle-box">
          <div className='maintitle'>관리</div>
        </div>

        <div className="inputbox">
          
          <div className="title-cover">
            <div className="title-row">
              <div className="title-box quarter" >
                <p>이름</p>
              </div>
              <div className="title-vertical-bar"></div>
              <div className="title-box quarter" >
                <p>생년월일</p>
              </div>
              <div className="title-vertical-bar"></div>
              <div className="title-box quarter" >
                <p>전화번호</p>
              </div>
              <div className="title-vertical-bar"></div>
              <div className="title-btn-box quarter" >
                <p></p>
              </div>
            </div>
          </div>
          <div className="inputBox-cover">
            
            {  studentList.length > 0
              ?
              studentList.map((item:any, index:any)=>{
                return (
                  <div className="inputBox-row" key={index}>
                    <div className='inputBox-inputbox quarter'>
                      <h1>{item.name} </h1>
                    </div>
                    <div className='inputBox-inputbox quarter'>
                      <h3 className='formobile'>생년월일</h3>
                      <div className="dropdownBox-row">
                        <DropdownBox
                          widthmain='30%'
                          height='35px'
                          selectedValue={item.birthYear || ''}
                          options={BirthYearData}
                          handleChange={(e)=>{
                            const copy = [...studentList];
                            copy[index].birthYear = e.target.value;
                            setStudentList(copy);
                          }}
                        />
                        <DropdownBox
                          widthmain='30%'
                          height='35px'
                          selectedValue={item.birthMonth || ''}
                          options={BirthMothData}
                          handleChange={(e)=>{
                            const copy = [...studentList];
                            copy[index].birthMonth = e.target.value;
                            setStudentList(copy);
                          }}
                        />
                        <DropdownBox
                          widthmain='30%'
                          height='35px'
                          selectedValue={item.birthDay || ''}
                          options={BirthDayData}
                          handleChange={(e)=>{
                            const copy = [...studentList];
                            copy[index].birthDay = e.target.value;
                            setStudentList(copy);
                          }}
                        />
                      </div>
                    </div>
                    <div className='inputBox-inputbox quarter'>
                      <h3 className='formobile'>전화번호</h3>
                      <input type="text" value={item.phone || ''}
                        onChange={(e)=>{
                          const copy = [...studentList];
                          copy[index].phone = e.target.value;
                          setStudentList(copy);
                        }} 
                      />
                    </div>
                    <div className='inputBox-btnBox quarter'>
                      <div className="inputBox-input-btn" 
                        style={{borderColor:'#B7F0B1'}}
                        onClick={()=>{
                          updateStudent(item);
                        }}
                      >
                        저장
                      </div>
                      <div className="inputBox-input-btn"
                        style={{borderColor:'#FFA7A7'}}
                        onClick={()=>{
                          deleteStudent(item);
                        }}
                      >
                        - 삭제
                      </div>
                    </div>
                  </div>
                )
              })
              :
              <div className="emptybox">
                <p>등록된 인원이 없습니다.</p>
              </div>
            }
          
          </div>
        </div>

        <div className="buttonbox">
          <div className="button" 
            onClick={()=>{
              router.back();
            }}
          >
            <p>뒤로가기</p>
          </div>
          <div className="button" 
            onClick={()=>{
              window.scrollTo(0, 0);
              setIsViewAddPersonalModal(true);
            }}
          >
            <p>학생 추가</p>
          </div>
        </div>

      </div>

      {/* 학생 추가 모달 */}
      {isViewAddPersonalModal && (
        <AddStudentModal
          isOpen={isViewAddPersonalModal}
          onClose={() => setIsViewAddPersonalModal(false)}
          onRefresh={fetchStudents}
          churchId={churchIdProps}
          deptId={departmentIdProps}
          groupId={groupIdProps}
        />
      )}

    </div>
  );
}