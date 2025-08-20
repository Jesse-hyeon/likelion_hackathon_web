'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, ChevronRight, Search, CheckCircle
} from 'lucide-react';
import AuctionDetail from '../components/auction-detail';

export default function AuctionStatus() {
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [myAuctions, setMyAuctions] = useState([]);

  // 로컬 스토리지에서 본인이 등록한 상품 로드
  useEffect(() => {
    const loadMyAuctions = () => {
      const registrations = JSON.parse(localStorage.getItem('fishRegistrations') || '[]');
      
      // 승인된 상품만 경매 목록에 표시
      const approvedItems = registrations.filter(item => item.status === 'approved').map(item => ({
        id: item.id,
        species: item.species,
        fishType: item.fishType || 'fresh',
        quantity: item.quantity,
        weight: item.specification ? `${item.specification}kg/마리` : item.packagingType,
        origin: '포항',
        currentPrice: parseInt(item.unitPrice?.replace(/,/g, '') || 20000),
        startPrice: parseInt(item.unitPrice?.replace(/,/g, '') || 20000),
        timeRemaining: Math.floor(Math.random() * 300) + 60, // 랜덤 시간
        seller: item.producer || '김철수',
        registerDate: item.registerDate,
        status: 'active', // 진행중으로 설정
        catchDate: item.catchDate || '2025.08.18'
      }));

      // 대기중 상품
      const pendingItems = registrations.filter(item => item.status === 'pending').map(item => ({
        id: item.id,
        species: item.species,
        fishType: item.fishType || 'fresh',
        quantity: item.quantity,
        weight: item.specification ? `${item.specification}kg/마리` : item.packagingType,
        origin: '포항',
        startPrice: parseInt(item.unitPrice?.replace(/,/g, '') || 20000),
        startTime: '14:30',
        seller: item.producer || '김철수',
        registerDate: item.registerDate,
        status: 'upcoming',
        catchDate: item.catchDate || '2025.08.18'
      }));

      // 종료된 경매 (예시)
      const completedItems = registrations.filter(item => item.status === 'rejected').map(item => ({
        id: item.id,
        species: item.species,
        fishType: item.fishType || 'fresh',
        quantity: item.quantity,
        weight: item.specification ? `${item.specification}kg/마리` : item.packagingType,
        origin: '포항',
        finalPrice: parseInt(item.unitPrice?.replace(/,/g, '') || 20000) + 5000,
        startPrice: parseInt(item.unitPrice?.replace(/,/g, '') || 20000),
        endTime: '09:45',
        winner: '부산수산',
        seller: item.producer || '김철수',
        status: 'completed',
        catchDate: item.catchDate || '2025.08.18'
      }));

      setMyAuctions([...approvedItems, ...pendingItems, ...completedItems]);
    };

    loadMyAuctions();
    const interval = setInterval(loadMyAuctions, 1000);
    return () => clearInterval(interval);
  }, []);

  // 필터링된 데이터
  const filteredData = myAuctions.filter(item => {
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    if (searchTerm && !item.species.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // 카운트
  const counts = {
    all: myAuctions.length,
    active: myAuctions.filter(item => item.status === 'active').length,
    upcoming: myAuctions.filter(item => item.status === 'upcoming').length,
    completed: myAuctions.filter(item => item.status === 'completed').length
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

  // 시간 포맷팅
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // 경매 선택 핸들러
  const handleAuctionSelect = (auction) => {
    setSelectedAuction(auction);
    setViewMode('detail');
  };

  // 리스트로 돌아가기
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedAuction(null);
  };

  return (
    <div>
      {viewMode === 'list' ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">경매 상태</h2>
            <p className="text-gray-600 mt-1">내가 등록한 상품의 경매 상태를 확인하세요.</p>
          </div>

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
                      상세보기
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
                            {item.weight} | {item.quantity}
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
                          getStatusColor(item.status)
                        }`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.status === 'active' ? (
                          <span className="text-red-600 font-medium">
                            {formatTime(item.timeRemaining)}
                          </span>
                        ) : item.status === 'upcoming' ? (
                          <span className="text-gray-600">{item.startTime}</span>
                        ) : item.status === 'completed' ? (
                          <span className="text-gray-500">{item.endTime}</span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => handleAuctionSelect(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                등록한 상품이 없습니다.
              </div>
            )}

            {/* 페이지네이션 */}
            {filteredData.length > 0 && (
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
                      다음
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        // 상세보기 - 공통 컴포넌트 사용
        <AuctionDetail 
          auction={selectedAuction}
          onBack={handleBackToList}
          userType="fisherman"
          showBidding={false}
        />
      )}
    </div>
  );
}