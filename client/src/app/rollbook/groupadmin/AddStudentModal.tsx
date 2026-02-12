'use client';

import React, { useState } from 'react';
import axios from 'axios';
import MainURL from '../../../MainURL';
import { DropdownBox } from '../../../components/DropdownBox';
import { BirthDayData, BirthMothData, BirthYearData } from './BirthData';
import '../RollbookAdmin.scss';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  churchId: string;
  deptId: string;
  groupId: string;
}

export default function AddStudentModal({ isOpen, onClose, onRefresh, churchId, deptId, groupId }: AddStudentModalProps) {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStudent = async () => {
    if (isSubmitting) return;
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!churchId || !deptId || !groupId) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${MainURL}/api/rollbookstudents/addstudent`, {
        churchId: parseInt(churchId),
        deptId: parseInt(deptId),
        groupId: parseInt(groupId),
        name: name.trim(),
        birthYear: birthYear || null,
        birthMonth: birthMonth || null,
        birthDay: birthDay || null,
        phone: phone.trim() || ''
      });
      if (res.data.success) {
        alert(res.data.message);
        setName('');
        setBirthYear('');
        setBirthMonth('');
        setBirthDay('');
        setPhone('');
        onRefresh();
        onClose();
      } else {
        alert(res.data.error || '학생 추가에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('학생 추가 실패:', error);
      alert(error.response?.data?.error || '학생 추가에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='Modal'>
      <div className='modal-backcover' onClick={onClose}></div>
      <div className='modal-maincover'>
        <div style={{
          marginTop: '120px',
          width: '90%',
          maxWidth: '600px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '30px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '2px solid #eee',
            paddingBottom: '15px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>학생 추가</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 이름 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                이름 <span style={{ color: '#ff4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitting) {
                    e.preventDefault();
                    handleAddStudent();
                  }
                }}
              />
            </div>

            {/* 생년월일 */}
            <div style={{ width: '100%' }}>
              <h3 className='formobile' style={{ marginBottom: '8px' }}>생년월일</h3>
              <div className="dropdownBox-row" style={{ width: '95%', display: 'flex', alignItems: 'center' }}>
                <DropdownBox
                  widthmain='30%'
                  height='35px'
                  selectedValue={birthYear}
                  options={BirthYearData}
                  handleChange={(e) => setBirthYear(e.target.value)}
                />
                <DropdownBox
                  widthmain='30%'
                  height='35px'
                  selectedValue={birthMonth}
                  options={BirthMothData}
                  handleChange={(e) => setBirthMonth(e.target.value)}
                />
                <DropdownBox
                  widthmain='30%'
                  height='35px'
                  selectedValue={birthDay}
                  options={BirthDayData}
                  handleChange={(e) => setBirthDay(e.target.value)}
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                전화번호
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호를 입력하세요"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitting) {
                    e.preventDefault();
                    handleAddStudent();
                  }
                }}
              />
            </div>

            {/* 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '10px'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#999',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                취소
              </button>
              <button
                onClick={handleAddStudent}
                disabled={isSubmitting}
                style={{
                  padding: '10px 30px',
                  backgroundColor: isSubmitting ? '#999' : '#33383f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
