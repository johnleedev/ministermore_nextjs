'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainURL from '../../../MainURL';
import { themesList } from '../../../DefaultData';
import './ContiMain.scss';
import altImage from '../../../../public/altImage.jpeg';

interface SongData {
  id: number;
  title: string;
  stateSort: string;
  keySort: string;
  theme: string;
  tempoSort: string;
  image: string;
  lyrics: string;
}

export default function ContiMain ({ allSongsProps, stateSortOptionsProps, keySortOptionsProps, themeOptionsProps, tempoSortOptionsProps }: 
  { allSongsProps: SongData[], stateSortOptionsProps: string[], keySortOptionsProps: string[], themeOptionsProps: string[], tempoSortOptionsProps: string[] }) {

  const router = useRouter();
  
  const [filteredSongs, setFilteredSongs] = useState<SongData[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SongData[]>([]);
    
  // 단계별 선택을 위한 상태
  const [step, setStep] = useState<number>(2); // 1: 곡수 선택, 2: 세부 조건 선택
  const [songConditions, setSongConditions] = useState<Array<{
    stateSort: string;
    keySort: string;
    theme: string;
    tempoSort: string;
  }>>([]);
  
  // Props를 state로 초기화
  const [allSongs, setAllSongs] = useState<SongData[]>(allSongsProps);
  // 드롭다운 옵션들
  const [stateSortOptions, setStateSortOptions] = useState<string[]>(stateSortOptionsProps);
  const [keySortOptions, setKeySortOptions] = useState<string[]>(keySortOptionsProps);
  const [themeOptions, setThemeOptions] = useState<string[]>(themeOptionsProps);
  const [tempoSortOptions, setTempoSortOptions] = useState<string[]>(tempoSortOptionsProps);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [songsPerRow, setSongsPerRow] = useState<number>(3); // 한 줄에 표시할 곡 개수
  const [paperSize, setPaperSize] = useState<string>('A4 가로'); // 용지 크기
  const contiGridRef = useRef<HTMLDivElement>(null); // 캡처할 영역 ref
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [songCount, setSongCount] = useState<number>(0);
  
  

  // 용지 크기에 따른 width/height 계산 (mm to px, 96 DPI 기준)
  const getPaperDimensions = (size: string): { width: string; height: string } => {
    const mmToPx = (mm: number) => `${(mm * 96) / 25.4}px`;
    switch (size) {
      case 'A4 가로': return { width: mmToPx(297), height: mmToPx(210) }; // 가로 297mm × 세로 210mm
      case 'A4 세로': return { width: mmToPx(210), height: mmToPx(297) }; // 가로 210mm × 세로 297mm
      default: return { width: mmToPx(297), height: mmToPx(210) };
    }
  };

  // Props로 받은 옵션들을 state에 초기화
  useEffect(() => {
    if (allSongsProps) setAllSongs(allSongsProps);
    if (stateSortOptionsProps) setStateSortOptions(stateSortOptionsProps);
    if (keySortOptionsProps) setKeySortOptions(keySortOptionsProps);
    if (themeOptionsProps) setThemeOptions(themeOptionsProps);
    if (tempoSortOptionsProps) setTempoSortOptions(tempoSortOptionsProps);
  }, [stateSortOptionsProps, keySortOptionsProps, themeOptionsProps, tempoSortOptionsProps]);

  // 화면 크기 감지
  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // 곡수 변경 시 자동으로 2단계 활성화
  useEffect(() => {
    if (songCount > 0) {
      // 선택한 곡수만큼 빈 조건 배열 생성
      const conditions = Array(songCount).fill(null).map(() => ({
        stateSort: '',
        keySort: '',
        theme: '',
        tempoSort: ''
      }));
      
      setSongConditions(conditions);
      setStep(2);
    }
  }, [songCount]);

  // 두 번째 단계 완료 (세부 조건 선택)
  const completeStep2 = () => {
    // 선택하지 않은 조건들을 랜덤으로 채우기
    const updatedConditions = songConditions.map(condition => ({
      stateSort: condition.stateSort || getRandomOption(stateSortOptions),
      keySort: condition.keySort || getRandomOption(keySortOptions),
      theme: condition.theme || getRandomOption(themeOptions),
      tempoSort: condition.tempoSort || getRandomOption(tempoSortOptions)
    }));
    
    setSongConditions(updatedConditions);
    generateConti();
  };

  // 랜덤 옵션 선택 함수
  const getRandomOption = (options: string[]): string => {
    if (options.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  // 자동 콘티 생성
  const generateConti = () => {
    const selected: SongData[] = [];
    
    // 각 곡의 조건에 맞는 곡을 선택
    for (let i = 0; i < songConditions.length; i++) {
      const condition = songConditions[i];
      
      // 해당 조건에 맞는 곡들 필터링
      let availableSongs = allSongs.filter((song: SongData) => {
        if (condition.theme && (!song.theme || !song.theme.includes(condition.theme))) {
          return false;
        }
        if (condition.stateSort && song.stateSort !== condition.stateSort) {
          return false;
        }
        if (condition.keySort && song.keySort !== condition.keySort) {
          return false;
        }
        if (condition.tempoSort && song.tempoSort !== condition.tempoSort) {
          return false;
        }
        return true;
      });
      
      // 이미 선택된 곡 제외
      availableSongs = availableSongs.filter((song: SongData) => 
        !selected.some(selectedSong => selectedSong.id === song.id)
      );
      
      if (availableSongs.length === 0) {
        alert(`${i + 1}번째 곡의 조건에 맞는 곡이 없습니다.`);
        return;
      }
      
      // 랜덤하게 선택
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      selected.push(availableSongs[randomIndex]);
    }
    
    setSelectedSongs(selected);
    setIsGenerated(true);
  };

  // 특정 곡만 재생성 (동일 조건 내에서 다른 곡으로 변경)
  const regenerateSong = (songIndex: number) => {
    const condition = songConditions[songIndex];
    
    // 해당 조건에 맞는 곡들 필터링
    let availableSongs = allSongs.filter(song => {
      if (condition.theme && (!song.theme || !song.theme.includes(condition.theme))) {
        return false;
      }
      if (condition.stateSort && song.stateSort !== condition.stateSort) {
        return false;
      }
      if (condition.keySort && song.keySort !== condition.keySort) {
        return false;
      }
      if (condition.tempoSort && song.tempoSort !== condition.tempoSort) {
        return false;
      }
      return true;
    });
    
    // 현재 선택된 곡들(변경 대상 제외) 제외
    availableSongs = availableSongs.filter((song: SongData) => 
      !selectedSongs.some((selectedSong, idx) => idx !== songIndex && selectedSong.id === song.id)
    );
    
    if (availableSongs.length === 0) {
      alert(`${songIndex + 1}번째 곡의 조건에 맞는 다른 곡이 없습니다.`);
      return;
    }
    
    // 현재 곡이 아닌 다른 곡 중에서 랜덤 선택
    const currentSongId = selectedSongs[songIndex].id;
    const otherSongs = availableSongs.filter((song: SongData) => song.id !== currentSongId);
    
    if (otherSongs.length === 0) {
      alert('조건에 맞는 다른 곡이 없습니다.');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * otherSongs.length);
    const newSong = otherSongs[randomIndex];
    
    // 해당 인덱스의 곡만 교체
    const updatedSongs = [...selectedSongs];
    updatedSongs[songIndex] = newSong;
    setSelectedSongs(updatedSongs);
  };

  // 초기화
  const resetConti = () => {
    setSongCount(0);
    setSelectedSongs([]);
    setIsGenerated(false);
    setStep(1);
    // songConditions의 모든 값 초기화
    setSongConditions([]);
  };

  // 조건 업데이트
  const updateSongCondition = (index: number, field: string, value: string) => {
    const newConditions = [...songConditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setSongConditions(newConditions);
  };


  return (
    <div className="conti-main">
      <div className="inner">
        <div className="subpage__main">
          <div className="subpage__main__title">
             <h3>찬양 콘티 만들기</h3>
           </div>

          {isLoading ? (
            <div className="loading-container">
              <p>곡을 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 검색 및 필터 섹션 */}
              <div className="subpage__main__search">
                <h4>전체 곡 개수</h4>
                <div className="buttons">
                  <select 
                    className="inputdefault width" 
                    style={{padding:'0 10px'}} 
                    value={songCount} 
                    onChange={(e) => setSongCount(Number(e.target.value))}
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                      <option key={count} value={count}>{count}곡</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="subpage__main__search">
                {/* 각 곡의 구분, 주제, 템포 선택 */}
                {step >= 2 && songConditions.map((condition, index) => (
                  <div key={index} className="song-theme-selector">
                    <span className="song-number">{index + 1}번째</span>
                    <select 
                      className="inputdefault width" 
                      style={{padding:'0 10px', minHeight:'40px'}} 
                      value={condition.stateSort} 
                      onChange={(e) => updateSongCondition(index, 'stateSort', e.target.value)}
                    >
                      <option value="">구분 선택</option>
                      {stateSortOptions.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>{option}</option>
                      ))}
                    </select>
                    <select 
                      className="inputdefault width" 
                      style={{padding:'0 10px', minHeight:'40px'}} 
                      value={condition.keySort} 
                      onChange={(e) => updateSongCondition(index, 'keySort', e.target.value)}
                    >
                      <option value="">조성 선택</option>
                      {keySortOptions.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>{option}</option>
                      ))}
                    </select>
                    <select 
                      className="inputdefault width" 
                      style={{padding:'0 10px', minHeight:'40px'}} 
                      value={condition.theme} 
                      onChange={(e) => updateSongCondition(index, 'theme', e.target.value)}
                    >
                      <option value="">주제 선택</option>
                      {themeOptions.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>{option}</option>
                      ))}
                    </select>
                    <select 
                      className="inputdefault width" 
                      style={{padding:'0 10px', minHeight:'40px'}} 
                      value={condition.tempoSort} 
                      onChange={(e) => updateSongCondition(index, 'tempoSort', e.target.value)}
                    >
                      <option value="">템포 선택</option>
                      {tempoSortOptions.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="subpage__main__search">
                <div className="buttons">
                  {step >= 2 && (
                    <div className="btn generate" onClick={completeStep2}>
                      <p>콘티 작성</p>
                    </div>
                  )}
                  <div className="btn reset" onClick={resetConti}>
                    <p>초기화</p>
                  </div>
                </div>
              </div>
              
              {/* 안내 텍스트 */}
              {step >= 2 && (
                <div className='subpage__main__tabrow_notice'>
                  <p>* 선택하지 않은 구분, 조성, 주제, 템포는 자동으로 랜덤 선택됩니다.</p>
                </div>
              )}

                {/* 생성된 콘티 */}
                {isGenerated && selectedSongs.length > 0 && (
                <>
                 <div className="conti-result">
                   <div className="conti-header">
                     <div className="conti-header-title">
                      <h4>생성된 콘티</h4> 
                      {!isMobile && (
                        <>
                          <div className="conti-header-select">
                            <label style={{fontSize:'14px', fontWeight:500}}>용지 크기:</label>
                            <select 
                              value={paperSize} 
                              onChange={(e) => setPaperSize(e.target.value)}
                              style={{padding:'5px 10px', fontSize:'14px', borderRadius:'5px', border:'1px solid #ddd'}}
                            >
                              <option value="A4 가로">A4 가로</option>
                              <option value="A4 세로">A4 세로</option>
                            </select>
                          </div>
                          <div className="conti-header-select">
                            <label style={{fontSize:'14px', fontWeight:500}}>한 줄에 표시할 곡:</label>
                            <select 
                              value={songsPerRow} 
                              onChange={(e) => setSongsPerRow(Number(e.target.value))}
                              style={{padding:'5px 10px', fontSize:'14px', borderRadius:'5px', border:'1px solid #ddd'}}
                            >
                              <option value={1}>1곡</option>
                              <option value={2}>2곡</option>
                              <option value={3}>3곡</option>
                              <option value={4}>4곡</option>
                              <option value={5}>5곡</option>
                              <option value={6}>6곡</option>
                            </select>
                          </div>
                        </>
                      )}
                     </div>
                     <div className="conti-summary" style={{
                       display: 'grid',
                       gridTemplateColumns: `repeat(${isMobile ? 1 : songsPerRow}, 1fr)`,
                       gap: '15px',
                       marginTop: '15px'
                     }}>
                       {selectedSongs.map((song, index) => (
                         <div key={index} className="summary-item" style={{display:'flex', flexDirection:'column', alignItems:'flex-start', fontSize:'16px', fontWeight:500, padding:'12px', border:'1px solid #eee', borderRadius:'8px', background:'#fafafa'}}>
                           <span style={{marginBottom:'8px'}}>{index + 1}. {song.title} {song.keySort}</span>
                           <button 
                             className="regenerate-btn"
                             onClick={(e) => {
                               e.stopPropagation();
                               regenerateSong(index);
                             }}
                           >
                             변경
                           </button>
                         </div>
                       ))}
                     </div>
                    
                   </div>
                  </div>
                  <div className="conti-result">
                   <div className="conti-songs-grid" ref={contiGridRef} style={{
                     display: 'grid',
                     gridTemplateColumns: `repeat(${isMobile ? 1 : songsPerRow}, 1fr)`,
                     gap: '15px',
                     maxWidth: isMobile ? '100%' : getPaperDimensions(paperSize).width,
                     width: '100%',
                     ...(isMobile ? {} : { aspectRatio: paperSize.includes('가로') ? '297 / 210' : '210 / 297' }),
                     margin: '0 auto',
                     padding: '15px',
                     boxSizing: 'border-box',
                     border: '1px solid #ddd',
                     background: '#fff'
                   }}>
                     {selectedSongs.map((song, index) => (
                       <div key={song.id} className="conti-song-card" onClick={() => {
                         const url = `/worship/detail?id=${song.id}`;
                         const newWindow = window.open(url, '_blank');
                         if (newWindow) {
                           (newWindow as any).songData = song;
                         }
                       }}>
                         <div className="song-header">
                           <h5 className="song-title">{index + 1}. {song.title}</h5>
                           <div className="song-meta">
                             <span className="song-key">{song.keySort}</span>
                             <span className="song-tempo">{song.tempoSort}</span>
                           </div>
                         </div>
                         <div className="song-score">
                           {song.image && (
                             <img 
                               src={song.image} 
                               alt={song.title}
                               onError={(e) => {
                                 e.currentTarget.src = altImage.src;
                                 e.currentTarget.onerror = null;
                               }}
                             />
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
                 
                 </>
               )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}