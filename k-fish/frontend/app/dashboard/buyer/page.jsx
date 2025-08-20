'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, Users, 
  Trophy, Bell, ArrowLeft
} from 'lucide-react';
import AuctionList from './auction-list';
import ReceiptStatus from './receipt-status';

export default function BuyerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('auction');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [currentBidPerUnit, setCurrentBidPerUnit] = useState(10000); // 단위당 현재 최고가 (kg당 10,000원)
  const [myBidAmount, setMyBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5분
  const [isMyHighestBid, setIsMyHighestBid] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState('진행중'); // 대기중, 진행중, 종료
  const [purchaseFilter, setPurchaseFilter] = useState('all'); // 구매내역 필터
  const [selectedPurchases, setSelectedPurchases] = useState([]); // 선택된 구매내역
  const [selectAll, setSelectAll] = useState(false); // 전체 선택
  
  // 현재 경매 상품 정보 (적절한 단위로 분할)
  const [currentProduct, setCurrentProduct] = useState({
    id: 1,
    name: '광어',
    quantity: '4개',  // 수량
    weight: '4kg',     // 개당 중량
    totalWeight: '16kg', // 총 중량
    origin: '제주도',
    unitPrice: 10000,  // kg당 가격
    startPrice: 160000, // 시작가 (총액 = 4kg × 4개 × 10000원)
    currentPrice: 160000,
    minBidIncrement: 5000,
    seller: '김철수',
    quality: 'A등급',
    catchDate: '2025.08.18',
    images: [1, 2, 3],
    totalQuantity: '100미 중 4개', // 전체 물량 중 현재 경매 물량
    lotNumber: '1/20', // 20개 묶음 중 1번째
    salesType: 'weight', // 'weight', 'box', 'sp', 'net'
    packagingType: null, // 'box', 'S/P', '그물망' 등
    unitDisplay: 'kg당 ₩10,000' // 단위당 가격 표시
  });

  // 참여 중도매인 목록
  const [participants] = useState([
    { id: 1, name: '부산수산', status: 'active', lastBid: 23000 },
    { id: 2, name: '서울수산', status: 'active', lastBid: 22000 },
    { id: 3, name: '대구유통', status: 'watching', lastBid: null },
    { id: 4, name: '광주도매', status: 'active', lastBid: 24000 },
    { id: 5, name: '나', status: 'active', lastBid: 25000 }
  ]);

  // 탭 메뉴
  const tabs = [
    { id: 'auction', label: '실시간 경매' },
    { id: 'pickup', label: '수령 현황' },
    { id: 'history', label: '구매 내역' }
  ];

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
    // 중량판매인 경우: kg당 가격 × 총 중량
    // 포장판매인 경우: 개당 가격 × 수량
    const totalWeight = parseInt(currentProduct.totalWeight); // 16kg
    return unitPrice * totalWeight;
  };

  // 경매 선택 핸들러
  const handleAuctionSelect = (auction) => {
    setSelectedAuction(auction);
    setViewMode('detail');
    
    // 선택한 경매의 상품 정보 업데이트
    if (auction) {
      // 판매 유형 결정 (박스, kg 등)
      let salesType = 'weight'; // 기본값
      let packagingType = null;
      let unitDisplay = '';
      
      if (auction.weight?.includes('박스')) {
        salesType = 'box';
        packagingType = 'box';
        unitDisplay = `박스당 ₩${(auction.startPrice || 20000).toLocaleString()}`;
      } else if (auction.weight?.includes('S/P')) {
        salesType = 'sp';
        packagingType = 'S/P';
        unitDisplay = `S/P당 ₩${(auction.startPrice || 15000).toLocaleString()}`;
      } else {
        unitDisplay = `kg당 ₩${(auction.startPrice || 10000).toLocaleString()}`;
      }
      
      setCurrentProduct(prev => ({
        ...prev,
        name: auction.species || prev.name,
        quantity: auction.quantity || prev.quantity,
        weight: auction.weight || prev.weight,
        origin: auction.origin || prev.origin,
        startPrice: auction.startPrice || prev.startPrice,
        currentPrice: auction.currentPrice || auction.startPrice || prev.currentPrice,
        seller: auction.seller || prev.seller,
        quality: auction.quality || prev.quality,
        salesType: salesType,
        packagingType: packagingType,
        unitDisplay: unitDisplay
      }));
    }
    
    // 선택한 경매 데이터로 초기화
    if (auction.status === 'active') {
      setAuctionStatus('진행중');
      if (auction.currentPrice) {
        setCurrentBidPerUnit(auction.currentPrice);
      } else {
        setCurrentBidPerUnit(auction.startPrice || 10000);
      }
      if (auction.timeRemaining) {
        setTimeRemaining(auction.timeRemaining);
      }
    } else if (auction.status === 'upcoming') {
      setAuctionStatus('대기중');
      setCurrentBidPerUnit(auction.startPrice || 10000);
      setTimeRemaining(0);
      setIsMyHighestBid(false);
    } else {
      // 기본값 설정
      setAuctionStatus('진행중');
      setCurrentBidPerUnit(auction.startPrice || auction.currentPrice || 10000);
      setTimeRemaining(300);
    }
  };

  // 리스트로 돌아가기
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedAuction(null);
    setBidHistory([]);
    setMyBidAmount('');
  };

  // 호가 제출
  const handleBidSubmit = () => {
    const bidAmountPerUnit = parseInt(myBidAmount);
    if (bidAmountPerUnit <= currentBidPerUnit) {
      alert('현재 최고가보다 높은 금액을 입력해주세요.');
      return;
    }
    
    setCurrentBidPerUnit(bidAmountPerUnit);
    const totalPrice = calculateTotalPrice(bidAmountPerUnit);
    setBidHistory([
      { 
        time: new Date().toLocaleTimeString(), 
        bidder: '나', 
        unitPrice: bidAmountPerUnit,
        totalPrice: totalPrice 
      },
      ...bidHistory
    ]);
    setIsMyHighestBid(true);
    setMyBidAmount('');
    setTimeRemaining(Math.min(timeRemaining + 15, 300)); // 호가 시 시간 15초 추가
  };

  // 빠른 호가 버튼
  const quickBidAmounts = [1000, 2000, 5000, 10000];

  // 구매 내역 데이터
  const purchaseHistory = [
    { id: 1, name: '대게', origin: '포항', quantity: '30마리', price: 250000, date: '2025. 8. 9.' },
    { id: 2, name: '대게', origin: '포항', quantity: '100마리', price: 85000, date: '2025. 8. 10.' },
    { id: 3, name: '대게', origin: '포항', quantity: '200마리', price: 120000, date: '2025. 8. 11.' },
    { id: 4, name: '포항 대게', origin: '포항', quantity: '80마리', price: 95000, date: '2025. 8. 12.' }
  ];

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPurchases([]);
    } else {
      setSelectedPurchases(purchaseHistory.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  // 개별 선택
  const handleSelectPurchase = (id) => {
    if (selectedPurchases.includes(id)) {
      setSelectedPurchases(selectedPurchases.filter(item => item !== id));
      setSelectAll(false);
    } else {
      const newSelection = [...selectedPurchases, id];
      setSelectedPurchases(newSelection);
      setSelectAll(newSelection.length === purchaseHistory.length);
    }
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (selectedPurchases.length === 0) {
      alert('다운로드할 항목을 선택해주세요.');
      return;
    }
    const downloadCount = selectedPurchases.length;
    alert(`${downloadCount}개 항목을 다운로드합니다.`);
  };

  // 예정 경매 목록
  const upcomingAuctions = [
    { 
      id: 1, 
      name: '갈치', 
      quantity: '15박스', 
      unitPrice: '박스당 ₩20,000',
      totalPrice: '₩300,000',
      startTime: '10:30', 
      status: '10분 후',
      calculation: '15박스 × ₩20,000'
    },
    { 
      id: 2, 
      name: '고등어', 
      quantity: '10개 (3kg/개)', 
      unitPrice: 'kg당 ₩8,000',
      totalPrice: '₩240,000',
      startTime: '10:45', 
      status: '25분 후',
      calculation: '30kg × ₩8,000'
    },
    { 
      id: 3, 
      name: '오징어', 
      quantity: '20미 (S/P)', 
      unitPrice: 'S/P당 ₩15,000',
      totalPrice: '₩15,000',
      startTime: '11:00', 
      status: '40분 후',
      calculation: '1 S/P × ₩15,000'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/')}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                어울림
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <span className="text-sm text-gray-600">부산수산(중도매인)</span>
              <button className="text-sm text-gray-500 hover:text-gray-700">로그아웃</button>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 relative font-medium text-sm
                    ${isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'}
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 실시간 경매 탭 */}
        {activeTab === 'auction' && viewMode === 'list' && (
          <AuctionList onAuctionSelect={handleAuctionSelect} />
        )}

        {/* 경매 상세 페이지 */}
        {activeTab === 'auction' && viewMode === 'detail' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 경매 정보 및 호가 입력 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 뒤로가기 버튼 */}
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>경매 목록으로 돌아가기</span>
              </button>

              {/* 경매 상품 정보 */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedAuction?.name || currentProduct.name} 경매
                    </h2>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      (selectedAuction?.status === 'upcoming' || auctionStatus === '대기중') ? 'border-yellow-500 text-yellow-700' :
                      auctionStatus === '진행중' ? 'border-green-500 text-green-700' :
                      'border-gray-300 text-gray-700'
                    }`}>
                      {selectedAuction?.status === 'upcoming' ? '대기중' : auctionStatus}
                    </div>
                  </div>

                  {/* 상품 이미지 */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {currentProduct.images.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">이미지 {img}</span>
                      </div>
                    ))}
                  </div>

                  {/* 상품 상세 정보 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">품목</p>
                      <p className="font-medium">{currentProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">수량</p>
                      <p className="font-medium">{currentProduct.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">개당 중량</p>
                      <p className="font-medium">{currentProduct.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">총 중량</p>
                      <p className="font-medium">{currentProduct.totalWeight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">산지</p>
                      <p className="font-medium">{currentProduct.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">어획일</p>
                      <p className="font-medium">{currentProduct.catchDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">판매자</p>
                      <p className="font-medium">{currentProduct.seller}</p>
                    </div>
                  </div>
                  

                  {/* 현재 경매 상태 */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    {(selectedAuction?.status === 'upcoming' || auctionStatus === '대기중') ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">시작가</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₩{(selectedAuction?.startPrice || currentProduct.unitPrice).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">시작 시간</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {selectedAuction?.startTime || '14:30'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">시작가</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₩{currentProduct.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">현재 최고가</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ₩{currentBidPerUnit.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">남은 시간</p>
                          <p className={`text-2xl font-bold ${
                            timeRemaining < 30 ? 'text-red-600 animate-pulse' : 'text-gray-900'
                          }`}>
                            {formatTime(timeRemaining)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 호가 입력 영역 */}
                {(selectedAuction?.status === 'upcoming' || auctionStatus === '대기중') ? (
                  <div className="border-t p-6">
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">경매 대기중</h3>
                      <p className="text-sm text-gray-600">
                        {selectedAuction?.startTime || '14:30'}에 경매가 시작됩니다
                      </p>
                    </div>
                  </div>
                ) : auctionStatus === '진행중' ? (
                  <div className="border-t p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      호가 참여 ({(() => {
                        if (currentProduct.salesType === 'weight') return 'kg당 가격 입력';
                        if (currentProduct.packagingType === 'box') return '박스당 가격 입력';
                        if (currentProduct.packagingType === 'S/P') return 'S/P당 가격 입력';
                        if (currentProduct.packagingType === '그물망') return '그물망당 가격 입력';
                        return '개당 가격 입력';
                      })()})
                    </h3>
                    
                    {/* 빠른 호가 버튼 */}
                    <div className="flex gap-2 mb-4">
                      {[500, 1000, 2000, 5000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setMyBidAmount((currentBidPerUnit + amount).toString())}
                          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          +₩{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    {/* 직접 입력 */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600 mb-1 block">
                            {(() => {
                              if (currentProduct.salesType === 'weight') return 'kg당 호가';
                              if (currentProduct.packagingType === 'box') return '박스당 호가';
                              if (currentProduct.packagingType === 'S/P') return 'S/P당 호가';
                              if (currentProduct.packagingType === '그물망') return '그물망당 호가';
                              return '개당 호가';
                            })()}
                          </label>
                          <input
                            type="number"
                            value={myBidAmount}
                            onChange={(e) => setMyBidAmount(e.target.value)}
                            placeholder={`현재 ${(() => {
                              if (currentProduct.salesType === 'weight') return 'kg당';
                              if (currentProduct.packagingType === 'box') return '박스당';
                              if (currentProduct.packagingType === 'S/P') return 'S/P당';
                              if (currentProduct.packagingType === '그물망') return '그물망당';
                              return '개당';
                            })()} ₩${currentBidPerUnit.toLocaleString()}`}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={handleBidSubmit}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                          >
                            호가하기
                          </button>
                        </div>
                      </div>
                      
                      {/* 실시간 총액 계산 표시 */}
                      {myBidAmount && parseInt(myBidAmount) > 0 && (
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">총 지불금액</span>
                            <span className="text-lg font-bold text-red-600">
                              ₩{calculateTotalPrice(parseInt(myBidAmount)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {isMyHighestBid && (
                      <div className="mt-3 flex items-center text-green-600">
                        <Trophy className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">현재 최고 입찰자입니다!</span>
                      </div>
                    )}

                  </div>
                ) : null}
              </div>
            </div>

            {/* 오른쪽: 참여 중도매인 */}
            <div className="space-y-6">
              {/* 참여자 현황 - 확장된 버전 */}
              <div className="bg-white rounded-lg shadow-sm border h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">참여 중도매인</h3>
                    {auctionStatus === '진행중' && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {participants.length}명
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {(selectedAuction?.status === 'upcoming' || auctionStatus === '대기중') ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">경매 시작 전입니다</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedAuction?.startTime || '14:30'}에 경매가 시작됩니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {participants
                        .sort((a, b) => (b.lastBid || 0) - (a.lastBid || 0))
                        .map(participant => (
                        <div key={participant.id} className="flex items-center justify-between py-3 border-b last:border-0">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              participant.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <div>
                              <span className={`text-sm font-medium ${participant.name === '나' ? 'text-blue-600' : 'text-gray-900'}`}>
                                {participant.name}
                              </span>
                              {participant.status === 'active' && (
                                <p className="text-xs text-gray-500 mt-0.5">경매 참여 중</p>
                              )}
                            </div>
                          </div>
                          {participant.lastBid && (
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-900">
                                ₩{participant.lastBid.toLocaleString()}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">마지막 호가</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 수령 현황 탭 */}
        {activeTab === 'pickup' && (
          <ReceiptStatus />
        )}

        {/* 구매 내역 탭 */}
        {activeTab === 'history' && (
          <div>
            {/* 헤더 섹션 */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">구매 내역</h2>
              <p className="text-gray-600 mt-1">구매한 상품 내역을 한눈에 보고, 액셀파일로 쉽게 관리하세요.</p>
            </div>
            
            {/* 엑셀 다운로드 바 */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                {selectedPurchases.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedPurchases.length}개 선택됨
                  </span>
                )}
              </div>
              <button 
                onClick={handleExcelDownload}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                엑셀 다운로드
              </button>
            </div>
            
            {/* 구매 내역 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border">

              {/* 필터 탭 */}
              <div className="px-6 py-3 border-b flex gap-2">
                <button 
                  onClick={() => setPurchaseFilter('all')}
                  className={`px-4 py-1.5 text-sm rounded ${
                    purchaseFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 border hover:bg-gray-50'
                  }`}>
                  전체
                </button>
                <button 
                  onClick={() => setPurchaseFilter('week')}
                  className={`px-4 py-1.5 text-sm rounded ${
                    purchaseFilter === 'week' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 border hover:bg-gray-50'
                  }`}>
                  최근 1주
                </button>
                <button 
                  onClick={() => setPurchaseFilter('month')}
                  className={`px-4 py-1.5 text-sm rounded ${
                    purchaseFilter === 'month' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 border hover:bg-gray-50'
                  }`}>
                  최근 1개월
                </button>
                <button 
                  onClick={() => setPurchaseFilter('quarter')}
                  className={`px-4 py-1.5 text-sm rounded ${
                    purchaseFilter === 'quarter' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 border hover:bg-gray-50'
                  }`}>
                  최근 3개월
                </button>
              </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">낙찰가</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">낙찰일</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchaseHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedPurchases.includes(item.id)}
                            onChange={() => handleSelectPurchase(item.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.origin}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₩ {item.price.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}