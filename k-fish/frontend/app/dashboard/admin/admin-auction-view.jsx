'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, Users, 
  Trophy, Bell, ArrowLeft, XCircle, StopCircle
} from 'lucide-react';
import AuctionList from '../buyer/auction-list';

export default function AdminAuctionView() {
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [currentBidPerUnit, setCurrentBidPerUnit] = useState(10000);
  const [bidHistory, setBidHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5분
  const [auctionStatus, setAuctionStatus] = useState('진행중'); // 대기중, 진행중, 종료
  
  // 현재 경매 상품 정보
  const [currentProduct, setCurrentProduct] = useState({
    id: 1,
    name: '광어',
    quantity: '4개',
    weight: '4kg',
    totalWeight: '16kg',
    origin: '제주도',
    unitPrice: 10000,
    startPrice: 160000,
    currentPrice: 160000,
    minBidIncrement: 5000,
    seller: '김철수',
    quality: 'A등급',
    catchDate: '2025.08.18',
    images: [1, 2, 3],
    totalQuantity: '100미 중 4개',
    lotNumber: '1/20',
    salesType: 'weight',
    packagingType: null,
    unitDisplay: 'kg당 ₩10,000'
  });

  // 참여 중도매인 목록
  const [participants] = useState([
    { id: 1, name: '부산수산', status: 'active', lastBid: 23000 },
    { id: 2, name: '서울수산', status: 'active', lastBid: 22000 },
    { id: 3, name: '대구유통', status: 'watching', lastBid: null },
    { id: 4, name: '광주도매', status: 'active', lastBid: 24000 },
    { id: 5, name: '인천수산', status: 'active', lastBid: 25000 }
  ]);

  // 타이머 효과
  useEffect(() => {
    if (auctionStatus === '진행중' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setAuctionStatus('종료');
    }
  }, [timeRemaining, auctionStatus]);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // 총액 계산 함수
  const calculateTotalPrice = (unitPrice) => {
    const totalWeight = parseInt(currentProduct.totalWeight);
    return unitPrice * totalWeight;
  };

  // 경매 선택 핸들러
  const handleAuctionSelect = (auction) => {
    setSelectedAuction(auction);
    setViewMode('detail');
    
    if (auction) {
      let salesType = 'weight';
      let packagingType = null;
      let unitDisplay = '';

      if (auction.name === '갈치') {
        salesType = 'box';
        packagingType = '박스';
        unitDisplay = '박스당 ₩45,000';
        setCurrentProduct(prev => ({
          ...prev,
          name: auction.name,
          quantity: '10박스',
          weight: '10kg',
          totalWeight: '100kg',
          origin: auction.location,
          unitPrice: 45000,
          startPrice: 450000,
          currentPrice: 450000,
          salesType,
          packagingType,
          unitDisplay,
          lotNumber: '1/5',
          totalQuantity: '50박스 중 10박스'
        }));
      } else {
        unitDisplay = 'kg당 ₩10,000';
        setCurrentProduct(prev => ({
          ...prev,
          name: auction.name,
          origin: auction.location,
          salesType: 'weight',
          packagingType: null,
          unitDisplay
        }));
      }

      setAuctionStatus(auction.status === 'upcoming' ? '대기중' : '진행중');
      setTimeRemaining(auction.remainingTime || 300);
      setCurrentBidPerUnit(auction.startPrice || 10000);
      
      // 호가 이력 초기화
      if (auction.status === 'upcoming') {
        setBidHistory([]);
      } else {
        setBidHistory([
          { time: '14:25:30', bidder: '나', amount: 25000, isHighest: true },
          { time: '14:25:20', bidder: '광주도매', amount: 24000, isHighest: false },
          { time: '14:25:10', bidder: '부산수산', amount: 23000, isHighest: false },
          { time: '14:25:00', bidder: '서울수산', amount: 22000, isHighest: false },
          { time: '14:24:50', bidder: '대구유통', amount: 21000, isHighest: false }
        ]);
      }
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedAuction(null);
  };

  // 관리자 전용: 거래 종료
  const handleForceEndAuction = () => {
    if (confirm('정말로 이 경매를 강제 종료하시겠습니까?')) {
      setAuctionStatus('종료');
      setTimeRemaining(0);
      alert('경매가 강제 종료되었습니다.');
    }
  };

  // 리스트 뷰
  if (viewMode === 'list') {
    return (
      <div>
        <AuctionList onAuctionSelect={handleAuctionSelect} isAdmin={true} />
      </div>
    );
  }

  // 상세 뷰
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 - 뒤로가기 + 관리자 컨트롤 */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <button 
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            경매 목록으로 돌아가기
          </button>
          
          {/* 관리자 전용 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={handleForceEndAuction}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                auctionStatus === '대기중' || auctionStatus === '종료' || auctionStatus === '거래불가'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              disabled={auctionStatus === '대기중' || auctionStatus === '종료' || auctionStatus === '거래불가'}
            >
              <StopCircle className="w-4 h-4" />
              거래 종료
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 상품 정보 */}
            <div className="lg:col-span-2">
              {/* 경매 정보 카드 */}
              <div className="bg-white rounded-lg shadow h-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">광어 경매</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      auctionStatus === '대기중' ? 'bg-yellow-100 text-yellow-700' :
                      auctionStatus === '진행중' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {auctionStatus}
                    </span>
                  </div>
                  
                  {/* 상품 이미지 */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">이미지 {i}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 상품 정보 그리드 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">품목</p>
                      <p className="font-medium">광어</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">수량</p>
                      <p className="font-medium">4개</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">개당 중량</p>
                      <p className="font-medium">4kg/개</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">총 중량</p>
                      <p className="font-medium">16kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">산지</p>
                      <p className="font-medium">제주도</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">어획일</p>
                      <p className="font-medium">2025.08.18</p>
                    </div>
                  </div>
                  
                  <div className="pb-3 border-b">
                    <p className="text-sm text-gray-500 mb-1">판매자</p>
                    <p className="font-medium">김철수</p>
                  </div>
                  
                  {/* 가격 정보 */}
                  <div className="grid grid-cols-3 gap-4 pt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">시작가</p>
                      <p className="text-2xl font-bold">₩10,000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">현재 최고가</p>
                      <p className="text-2xl font-bold text-blue-600">₩12,000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">남은 시간</p>
                      <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 입찰 현황 */}
            <div className="lg:col-span-1">
              {/* 참여 중도매인 */}
              <div className="bg-white rounded-lg shadow h-full flex flex-col">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">참여 중도매인</h3>
                  <p className="text-sm text-gray-500 mt-1">총 5명</p>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  {(selectedAuction?.status === 'upcoming' || auctionStatus === '대기중') ? (
                    <div className="text-center py-8 text-gray-500">
                      경매가 시작되면 입찰 현황이 표시됩니다.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bidHistory.map((bid, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-lg ${
                            bid.isHighest ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                bid.isHighest ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <span className="font-medium text-sm">{bid.bidder}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {bid.bidder === '나' ? '경매 참여 중' : '경매 참여 중'}
                            </span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xl font-bold">₩{bid.amount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">마지막 호가</p>
                            </div>
                            {bid.isHighest && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                최고가
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* 더미 데이터 추가 */}
                      {[...Array(5)].map((_, i) => (
                        <div key={`dummy-${i}`} className="p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                              <span className="font-medium text-sm">중도매인{i + 6}</span>
                            </div>
                            <span className="text-xs text-gray-500">경매 참여 중</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xl font-bold">₩{(20000 - i * 1000).toLocaleString()}</p>
                              <p className="text-xs text-gray-500">마지막 호가</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}