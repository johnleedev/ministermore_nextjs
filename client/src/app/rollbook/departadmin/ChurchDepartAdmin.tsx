'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainURL from '../../../MainURL';
import { useRouter } from 'next/navigation';
import { DropdownBox } from '../../../components/DropdownBox';
import '../ChurchMain.scss';

interface Group {
  id: number;
  church_id: number;
  dept_id: number;
  name: string;
  leader_id: number | null;
  leader_name?: string | null;
}

interface User {
  id: number;
  userNickName: string;
  userAccount: string;
}

interface ChurchDepartAdminProps {
  initialGroups: Group[];
  initialUsers: User[];
  churchId: string;
  departmentId: string;
  churchNameProps: string;
}

export default function ChurchDepartAdmin({ initialGroups, initialUsers, churchId, churchNameProps = '', departmentId }: ChurchDepartAdminProps) {
  const router = useRouter();
  const [departmentName, setDepartmentName] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<number | null>(null);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>('');

  // 초기 데이터 로드 (sessionStorage에서 departmentName 가져오기)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDepartmentName = sessionStorage.getItem('department') || '';
      setDepartmentName(storedDepartmentName);
    }
  }, []);

  // 소그룹 목록 새로고침
  const fetchGroups = async () => {
    if (!churchId || !departmentId) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${MainURL}/api/rollbookgroup/getgrouplist`, {
        churchId: parseInt(churchId),
        deptId: parseInt(departmentId)
      });
      if (res.data) {
        setGroups(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('소그룹 목록 조회 실패:', error);
      alert('소그룹 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 소그룹 추가
  const handleAddGroup = async () => {
    if (isSubmitting) return;
    if (!newGroupName.trim()) {
      alert('소그룹명을 입력해주세요.');
      return;
    }
    if (!churchId || !departmentId) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }

    const churchIdNum = parseInt(churchId);
    const deptIdNum = parseInt(departmentId);
    
    if (isNaN(churchIdNum) || isNaN(deptIdNum)) {
      alert('유효하지 않은 교회 또는 부서 정보입니다.');
      return;
    }

    // 중복 체크
    const trimmedName = newGroupName.trim();
    const isDuplicate = groups.some(
      group => group.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      alert('이미 등록된 소그룹명입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('소그룹 추가 요청:', { churchId: churchIdNum, deptId: deptIdNum, name: trimmedName });
      const res = await axios.post(`${MainURL}/api/rollbookgroup/addgroup`, {
        churchId: churchIdNum,
        deptId: deptIdNum,
        name: trimmedName
      });
      console.log('소그룹 추가 응답:', res.data);
      if (res.data.success) {
        alert(res.data.message);
        setNewGroupName('');
        fetchGroups();
      } else {
        alert(res.data.error || res.data.details || '소그룹 추가에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('소그룹 추가 실패:', error);
      console.error('에러 응답:', error.response?.data);
      alert(error.response?.data?.error || error.response?.data?.details || '소그룹 추가에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 소그룹 삭제
  const handleDeleteGroup = async (id: number, name: string) => {
    if (!confirm(`"${name}" 소그룹을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await axios.post(`${MainURL}/api/rollbookgroup/deletegroup`, {
        id: id
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchGroups();
      } else {
        alert(res.data.error || '소그룹 삭제에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('소그룹 삭제 실패:', error);
      alert(error.response?.data?.error || '소그룹 삭제에 실패했습니다.');
    }
  };

  // 리더 지정 시작
  const handleStartEditLeader = (group: Group) => {
    setEditingLeaderId(group.id);
    setSelectedLeaderId(group.leader_id ? group.leader_id.toString() : '');
  };

  // 리더 지정 취소
  const handleCancelEditLeader = () => {
    setEditingLeaderId(null);
    setSelectedLeaderId('');
  };

  // 리더 지정 저장
  const handleSetLeader = async (groupId: number) => {
    try {
      const res = await axios.post(`${MainURL}/api/rollbookgroup/setleader`, {
        groupId: groupId,
        leaderId: selectedLeaderId || null
      });
      if (res.data.success) {
        alert(res.data.message);
        setEditingLeaderId(null);
        setSelectedLeaderId('');
        fetchGroups();
      } else {
        alert(res.data.error || '리더 지정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('리더 지정 실패:', error);
      alert(error.response?.data?.error || '리더 지정에 실패했습니다.');
    }
  };

  // 소그룹 수정 시작
  const handleStartEditGroup = (group: Group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  // 소그룹 수정 취소
  const handleCancelEditGroup = () => {
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  // 소그룹 수정 저장
  const handleUpdateGroup = async (groupId: number) => {
    if (!editingGroupName.trim()) {
      alert('소그룹명을 입력해주세요.');
      return;
    }

    const trimmedName = editingGroupName.trim();
    
    // 중복 체크
    const isDuplicate = groups.some(
      group => group.id !== groupId && group.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      alert('이미 등록된 소그룹명입니다.');
      return;
    }

    try {
      const res = await axios.post(`${MainURL}/api/rollbookgroup/updategroup`, {
        id: groupId,
        name: trimmedName,
        churchId: parseInt(churchId),
        deptId: parseInt(departmentId)
      });
      if (res.data.success) {
        alert(res.data.message);
        setEditingGroupId(null);
        setEditingGroupName('');
        fetchGroups();
      } else {
        alert(res.data.error || '소그룹 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('소그룹 수정 실패:', error);
      alert(error.response?.data?.error || error.response?.data?.details || '소그룹 수정에 실패했습니다.');
    }
  };

  // 사용자 옵션 생성 (리더 선택용)
  const userOptions = [
    { value: '', label: '리더 없음' },
    ...users.map(user => ({
      value: user.id.toString(),
      label: user.userNickName
    }))
  ];

  // 리더 이름 가져오기 헬퍼 함수
  const getLeaderName = (leaderId: number | null) => {
    if (!leaderId) return '미지정';
    const leader = users.find(user => user.id === leaderId);
    return leader ? leader.userNickName : '미지정';
  };

  // 사용자가 리더로 지정된 소그룹 찾기
  const getGroupByLeaderId = (leaderId: number | null) => {
    if (!leaderId) return null;
    return groups.find(group => group.leader_id === leaderId);
  };

  return (
    <div className="Rollbook_churchmain">
      <div className='department_main'>
        <div className="maintitle-box">
          <div className='maintitle'>{departmentName}</div>
          <div className='maintitle'>소그룹/반 관리</div>
        </div>

        {/* 좌우 분할 레이아웃 */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          alignItems: 'flex-start'
        }}>
          {/* 왼쪽: 소그룹 관리 */}
          <div style={{
            flex: 1,
            minWidth: 0
          }}>
            {/* 소그룹 등록 */}
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>새 소그룹/반 등록</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="소그룹/반명을 입력하세요"
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
                      handleAddGroup();
                    }
                  }}
                />
                <button
                  onClick={handleAddGroup}
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

            {/* 소그룹 목록 */}
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>소그룹/반 목록</h3>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
              ) : groups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  등록된 소그룹/반이 없습니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '15px',
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        flexWrap: 'wrap'
                      }}
                    >
                      {editingGroupId === group.id ? (
                        <>
                          <div style={{ flex: 1, minWidth: '150px' }}>
                            <input
                              type="text"
                              value={editingGroupName}
                              onChange={(e) => setEditingGroupName(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px',
                                fontWeight: '500'
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleUpdateGroup(group.id);
                                }
                                if (e.key === 'Escape') {
                                  handleCancelEditGroup();
                                }
                              }}
                              autoFocus
                            />
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                              리더: {getLeaderName(group.leader_id)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUpdateGroup(group.id)}
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
                            onClick={handleCancelEditGroup}
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
                          <div style={{ flex: 1, minWidth: '150px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '5px' }}>
                              {group.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              리더: {getLeaderName(group.leader_id)}
                            </div>
                          </div>
                          
                          {editingLeaderId === group.id ? (
                        <>
                          <div style={{ minWidth: '150px' }}>
                            <DropdownBox
                              widthmain='100%'
                              height='35px'
                              selectedValue={selectedLeaderId}
                              options={userOptions}
                              handleChange={(e) => setSelectedLeaderId(e.target.value)}
                            />
                          </div>
                          <button
                            onClick={() => handleSetLeader(group.id)}
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
                            onClick={handleCancelEditLeader}
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
                              <button
                                onClick={() => handleStartEditGroup(group)}
                                style={{
                                  padding: '8px 15px',
                                  backgroundColor: '#4A90E2',
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
                                onClick={() => handleStartEditLeader(group)}
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
                                리더 지정
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.id, group.name)}
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() =>{
                  router.back();
                }}
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
                뒤로가기
              </button>
            </div>
          </div>

          {/* 오른쪽: 교사/리더 목록 */}
          <div style={{
            flex: 1,
            minWidth: 0,
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>교사/리더 목록</h3>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                등록된 교사/리더가 없습니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {users.map((user) => {
                  const leadingGroup = getGroupByLeaderId(user.id);
                  return (
                    <div
                      key={user.id}
                      style={{
                        padding: '15px',
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        backgroundColor: '#fff'
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                        {user.userNickName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        계정: {user.userAccount}
                      </div>
                      {leadingGroup ? (
                        <div style={{
                          fontSize: '12px',
                          color: '#1DDB16',
                          fontWeight: '500',
                          marginTop: '8px',
                          padding: '5px 10px',
                          backgroundColor: '#f0f9f0',
                          borderRadius: '5px',
                          display: 'inline-block'
                        }}>
                          리더: {leadingGroup.name}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '12px',
                          color: '#999',
                          marginTop: '8px'
                        }}>
                          리더로 지정되지 않음
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
