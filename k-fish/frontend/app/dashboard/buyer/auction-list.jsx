'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, ChevronRight, Search,
  CheckCircle
} from 'lucide-react';

export default function AuctionList({ onAuctionSelect, isAdmin = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [auctionTimers, setAuctionTimers] = useState({});
  const [auctionStatuses, setAuctionStatuses] = useState({});

  // 실시간 진행 중인 경매
  const liveAuctions = [
    {
      id: 1,
      species: '광어',
      fishType: 'live',
      quantity: '4개',
      weight: '4kg/개',
      origin: '제주도',
      currentPrice: 12000,
      startPrice: 10000,
      timeRemaining: 245,
      seller: '김철수',
      quality: 'A등급',
      registerDate: '2025.08.18 10:00',
      status: 'active'
    },
    {
      id: 2,
      species: '갈치',
      fishType: 'fresh',
      quantity: '15박스',
      weight: '2kg/박스',
      origin: '부산',
      currentPrice: 22000,
      startPrice: 20000,
      timeRemaining: 180,
      seller: '이영희',
      quality: 'B등급',
      registerDate: '2025.08.18 10:15',
      status: 'active'
    },
    {
      id: 3,
      species: '고등어',
      fishType: 'frozen',
      quantity: '10개',
      weight: '3kg/개',
      origin: '포항',
      currentPrice: 8500,
      startPrice: 8000,
      timeRemaining: 120,
      seller: '박민수',
      quality: 'A등급',
      registerDate: '2025.08.18 10:30',
      status: 'active'
    }
  ];

  // 예정 경매
  const upcomingAuctions = [
    {
      id: 4,
      species: '참돔',
      fishType: 'live',
      quantity: '5마리',
      weight: '2kg/마리',
      origin: '통영',
      startPrice: 35000,
      startTime: '14:30',
      seller: '정상호',
      quality: 'A+등급',
      registerDate: '2025.08.18 08:00',
      status: 'upcoming'
    },
    {
      id: 5,
      species: '오징어',
      fishType: 'fresh',
      quantity: '20미',
      weight: 'S/P',
      origin: '울릉도',
      startPrice: 15000,
      startTime: '15:00',
      seller: '최민정',
      quality: 'A등급',
      registerDate: '2025.08.18 08:30',
      status: 'upcoming'
    }
  ];

  // 최근 종료된 경매
  const completedAuctions = [
    {
      id: 6,
      species: '도미',
      fishType: 'live',
      quantity: '3마리',
      weight: '2kg/마리',
      origin: '여수',
      finalPrice: 28000,
      startPrice: 25000,
      endTime: '09:45',
      winner: '부산수산',
      quality: 'A등급',
      status: 'completed'
    },
    {
      id: 7,
      species: '꽃게',
      fishType: 'live',
      quantity: '2박스',
      weight: '4kg/박스',
      origin: '태안',
      finalPrice: 42000,
      startPrice: 35000,
      endTime: '09:30',
      winner: '서울수산',
      quality: 'B등급',
      status: 'completed'
    }
  ];

  // 모든 경매 데이터 합치기
  const allAuctions = [...liveAuctions, ...upcomingAuctions, ...completedAuctions];

  // 필터링된 데이터
  const filteredData = allAuctions.filter(item => {
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    if (searchTerm && !item.species.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // 카운트
  const counts = {
    all: allAuctions.length,
    active: liveAuctions.length,
    upcoming: upcomingAuctions.length,
    completed: completedAuctions.length
  };

  // 상태별 라벨
  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return '진행중';
      case 'upcoming': return '대기중';
      case 'completed': return '종료';
      default: return '';
    }
  };

  // 상태별 색상
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // 시작 시간을 초 단위로 변환 (현재 시간으로부터)
  const getSecondsUntilStart = (startTime) => {
    if (!startTime) return null;
    const [hours, minutes] = startTime.split(':').map(Number);
    const now = new Date();
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    
    // 만약 시작 시간이 이미 지났다면 다음날로 설정
    if (start < now) {
      start.setDate(start.getDate() + 1);
    }
    
    return Math.floor((start - now) / 1000);
  };

  // 초기 타이머 및 상태 설정
  useEffect(() => {
    const initialTimers = {};
    const initialStatuses = {};
    
    // 진행중 경매 타이머 설정
    liveAuctions.forEach(auction => {
      if (auction.status === 'active' && auction.timeRemaining) {
        initialTimers[auction.id] = auction.timeRemaining;
        initialStatuses[auction.id] = 'active';
      }
    });
    
    // 대기중 경매 타이머 설정
    upcomingAuctions.forEach(auction => {
      const secondsUntilStart = getSecondsUntilStart(auction.startTime);
      if (secondsUntilStart !== null) {
        initialTimers[auction.id] = secondsUntilStart;
        initialStatuses[auction.id] = 'upcoming';
      }
    });
    
    setAuctionTimers(initialTimers);
    setAuctionStatuses(initialStatuses);
  }, []);

  // 타이머 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        
        setAuctionStatuses(prevStatuses => {
          const newStatuses = { ...prevStatuses };
          
          Object.keys(newTimers).forEach(id => {
            // 대기중 경매가 시작 시간에 도달했을 때
            if (newStatuses[id] === 'upcoming' && newTimers[id] <= 0) {
              newStatuses[id] = 'active';
              newTimers[id] = 300; // 5분 경매 시작
            } 
            // 진행중 경매 타이머 감소
            else if (newStatuses[id] === 'active' && newTimers[id] > 0) {
              newTimers[id] = newTimers[id] - 1;
            }
            // 대기중 경매 카운트다운
            else if (newStatuses[id] === 'upcoming' && newTimers[id] > 0) {
              newTimers[id] = newTimers[id] - 1;
            }
          });
          
          return newStatuses;
        });
        
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {!isAdmin && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">실시간 경매</h2>
          <p className="text-gray-600 mt-1">실시간 경매 현황을 확인하고 참여하세요.</p>
        </div>
      )}
      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">실시간 경매</h2>
          <p className="text-gray-600 mt-1">실시간 진행중인 경매를 모니터링하고 관리하세요.</p>
        </div>
      )}

      {/* 필터 버튼들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            selectedFilter === 'all' 
              ? 'bg-blue-50 border-blue-500' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-600 mb-2">전체보기</p>
          <p className="text-3xl font-bold text-gray-900">{counts.all}건</p>
        </button>

        <button
          onClick={() => setSelectedFilter('active')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            selectedFilter === 'active' 
              ? 'bg-green-50 border-green-500' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-600 mb-2">진행중</p>
          <p className="text-3xl font-bold text-green-600">{counts.active}건</p>
        </button>

        <button
          onClick={() => setSelectedFilter('upcoming')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            selectedFilter === 'upcoming' 
              ? 'bg-blue-50 border-blue-500' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-600 mb-2">대기중</p>
          <p className="text-3xl font-bold text-blue-600">{counts.upcoming}건</p>
        </button>

        <button
          onClick={() => setSelectedFilter('completed')}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            selectedFilter === 'completed' 
              ? 'bg-gray-50 border-gray-500' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-600 mb-2">종료</p>
          <p className="text-3xl font-bold text-gray-600">{counts.completed}건</p>
        </button>
      </div>

      {/* 검색 바 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="수산물 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수산물 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시작가
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  판매자
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  경매 상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  남은 시간
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isAdmin ? '관리하기' : '참여하기'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.fishType === 'live' ? '(활)' : item.fishType === 'frozen' ? '(냉)' : '(선)'}{item.species}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.weight === 'S/P' ? 'S/P 4개' : `${item.weight} | ${item.quantity}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₩{item.startPrice?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.seller}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(auctionStatuses[item.id] || item.status)
                    }`}>
                      {getStatusLabel(auctionStatuses[item.id] || item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(auctionStatuses[item.id] || item.status) === 'active' ? (
                      <span className="text-red-600 font-medium">
                        {formatTime(auctionTimers[item.id] !== undefined ? auctionTimers[item.id] : item.timeRemaining)}
                      </span>
                    ) : (auctionStatuses[item.id] || item.status) === 'upcoming' ? (
                      <span className="text-gray-600">
                        {auctionTimers[item.id] && auctionTimers[item.id] < 60 
                          ? `${auctionTimers[item.id]}초 후 시작` 
                          : item.startTime}
                      </span>
                    ) : item.status === 'completed' ? (
                      <span className="text-gray-500">{item.endTime}</span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {(auctionStatuses[item.id] || item.status) === 'active' || 
                     (auctionStatuses[item.id] || item.status) === 'upcoming' ? (
                      <button 
                        onClick={() => onAuctionSelect({
                          ...item,
                          status: auctionStatuses[item.id] || item.status,
                          timeRemaining: (auctionStatuses[item.id] || item.status) === 'active' 
                            ? (auctionTimers[item.id] || item.timeRemaining)
                            : null
                        })}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : item.status === 'completed' && item.winner ? (
                      <span className="text-sm text-gray-500">{item.winner}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-3 border-t">
          <div className="flex justify-center">
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50">
                이전
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50">
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}