'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainURL from '../../../MainURL';

interface Department {
  id: number;
  church_id: number;
  name: string;
}

interface DepartmentManageModalProps {
  churchId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function DepartmentManageModal({ churchId, isOpen, onClose, onRefresh }: DepartmentManageModalProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 부서 목록 가져오기
  const fetchDepartments = async () => {
    if (!churchId) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${MainURL}/api/rollbookdepart/getdepartments`, {
        church_id: parseInt(churchId)
      });
      if (res.data.success) {
        setDepartments(res.data.data || []);
      }
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
      alert('부서 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && churchId) {
      fetchDepartments();
    }
  }, [isOpen, churchId]);

  // 부서 등록
  const handleAddDepartment = async () => {
    if (isSubmitting) return; // 이미 제출 중이면 무시
    if (!newDepartmentName.trim()) {
      alert('부서명을 입력해주세요.');
      return;
    }
    if (!churchId) return;

    // 중복 체크
    const trimmedName = newDepartmentName.trim();
    const isDuplicate = departments.some(
      dept => dept.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      alert('이미 등록된 부서명입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${MainURL}/api/rollbookdepart/adddepartment`, {
        church_id: parseInt(churchId),
        name: trimmedName
      });
      if (res.data.success) {
        alert(res.data.message);
        setNewDepartmentName('');
        fetchDepartments();
        onRefresh();
      }
    } catch (error: any) {
      console.error('부서 등록 실패:', error);
      alert(error.response?.data?.error || '부서 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 부서 수정 시작
  const handleStartEdit = (department: Department) => {
    setEditingId(department.id);
    setEditName(department.name);
  };

  // 부서 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  // 부서 수정 저장
  const handleUpdateDepartment = async (id: number) => {
    if (!editName.trim()) {
      alert('부서명을 입력해주세요.');
      return;
    }

    // 중복 체크 (현재 수정 중인 부서 제외)
    const trimmedName = editName.trim();
    const isDuplicate = departments.some(
      dept => dept.id !== id && dept.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      alert('이미 등록된 부서명입니다.');
      return;
    }

    try {
      const res = await axios.post(`${MainURL}/api/rollbookdepart/updatedepartment`, {
        id: id,
        name: trimmedName
      });
      if (res.data.success) {
        alert(res.data.message);
        setEditingId(null);
        setEditName('');
        fetchDepartments();
        onRefresh();
      }
    } catch (error: any) {
      console.error('부서 수정 실패:', error);
      alert(error.response?.data?.error || '부서 수정에 실패했습니다.');
    }
  };

  // 부서 삭제
  const handleDeleteDepartment = async (id: number, name: string) => {
    if (!confirm(`"${name}" 부서를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await axios.post(`${MainURL}/api/rollbookdepart/deletedepartment`, {
        id: id
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchDepartments();
        onRefresh();
      }
    } catch (error: any) {
      console.error('부서 삭제 실패:', error);
      alert(error.response?.data?.error || '부서 삭제에 실패했습니다.');
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
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>부서 관리</h2>
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

          {/* 부서 등록 */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>새 부서 등록</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="부서명을 입력하세요"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitting) {
                    e.preventDefault();
                    handleAddDepartment();
                  }
                }}
              />
              <button
                onClick={handleAddDepartment}
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px',
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
                {isSubmitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>

          {/* 부서 목록 */}
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>부서 목록</h3>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
            ) : departments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                등록된 부서가 없습니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '15px',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }}
                  >
                    {editingId === dept.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateDepartment(dept.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateDepartment(dept.id)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#1DDB16',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#999',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ flex: 1, fontSize: '16px', fontWeight: '500' }}>
                          {dept.name}
                        </div>
                        <button
                          onClick={() => handleStartEdit(dept)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#33383f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#ff4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
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
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
