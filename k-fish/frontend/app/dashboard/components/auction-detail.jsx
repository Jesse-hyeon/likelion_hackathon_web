'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, Users, Trophy, ArrowLeft
} from 'lucide-react';

export default function AuctionDetail({ 
  auction, 
  onBack, 
  userType = 'buyer', // 'buyer' or 'fisherman'
  showBidding = true // 호가 입력 표시 여부
}) {
  const [auctionStatus, setAuctionStatus] = useState('진행중');
  const [currentBidPerUnit, setCurrentBidPerUnit] = useState(10000);
  const [myBidAmount, setMyBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isMyHighestBid, setIsMyHighestBid] = useState(false);
  
  // 현재 경매 상품 정보
  const [currentProduct, setCurrentProduct] = useState({
    id: auction?.id || 1,
    name: auction?.species || '광어',
    quantity: auction?.quantity || '4개',
    weight: auction?.weight || '4kg',
    totalWeight: '16kg',
    origin: auction?.origin || '제주도',
    unitPrice: auction?.startPrice || 10000,
    startPrice: auction?.startPrice || 160000,
    currentPrice: auction?.currentPrice || 160000,
    minBidIncrement: 5000,
    seller: auction?.seller || '김철수',
    catchDate: auction?.catchDate || '2025.08.18',
    images: [1, 2, 3],
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
    { id: 5, name: '나', status: 'active', lastBid: 25000 }
  ]);

  // 경매 데이터 초기화
  useEffect(() => {
    if (auction) {
      // 판매 유형 결정
      let salesType = 'weight';
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
        salesType: salesType,
        packagingType: packagingType,
        unitDisplay: unitDisplay
      }));
      
      // 경매 상태 설정
      if (auction.status === 'active' || auction.status === 'approved') {
        setAuctionStatus('진행중');
        setCurrentBidPerUnit(auction.currentPrice || auction.startPrice || 10000);
        setTimeRemaining(auction.timeRemaining || 300);
      } else if (auction.status === 'upcoming' || auction.status === 'pending') {
        setAuctionStatus('대기중');
        setCurrentBidPerUnit(auction.startPrice || 10000);
        setTimeRemaining(0);
      } else if (auction.status === 'completed' || auction.status === 'rejected') {
        setAuctionStatus('종료');
        setCurrentBidPerUnit(auction.finalPrice || auction.currentPrice || 10000);
        setTimeRemaining(0);
      }
    }
  }, [auction]);

  // 타이머 효과
  useEffect(() => {
    if (auctionStatus === '진행중' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && auctionStatus === '진행중') {
      setAuctionStatus('종료');
    }
  }, [timeRemaining, auctionStatus]);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // 총액 계산
  const calculateTotalPrice = (unitPrice) => {
    const totalWeight = parseInt(currentProduct.totalWeight);
    return unitPrice * totalWeight;
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
    setTimeRemaining(Math.min(timeRemaining + 15, 300));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 왼쪽: 경매 정보 및 호가 입력 */}
      <div className="lg:col-span-2 space-y-6">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
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
                {currentProduct.name} 경매
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                auctionStatus === '대기중' ? 'border-yellow-500 text-yellow-700' :
                auctionStatus === '진행중' ? 'border-green-500 text-green-700' :
                'border-gray-300 text-gray-700'
              }`}>
                {auctionStatus}
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
              {auctionStatus === '대기중' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">시작가</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₩{currentProduct.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">시작 시간</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {auction?.startTime || '14:30'}
                    </p>
                  </div>
                </div>
              ) : auctionStatus === '종료' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">시작가</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₩{currentProduct.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">낙찰가</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₩{currentBidPerUnit.toLocaleString()}
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

          {/* 호가 입력 영역 - 구매업체만 표시 */}
          {showBidding && userType === 'buyer' && (
            <>
              {auctionStatus === '대기중' ? (
                <div className="border-t p-6">
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">경매 대기중</h3>
                    <p className="text-sm text-gray-600">
                      {auction?.startTime || '14:30'}에 경매가 시작됩니다
                    </p>
                  </div>
                </div>
              ) : auctionStatus === '진행중' ? (
                <div className="border-t p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    호가 참여 ({currentProduct.salesType === 'weight' ? 'kg당 가격 입력' :
                               currentProduct.packagingType === 'box' ? '박스당 가격 입력' :
                               currentProduct.packagingType === 'S/P' ? 'S/P당 가격 입력' :
                               '개당 가격 입력'})
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
                        <input
                          type="number"
                          value={myBidAmount}
                          onChange={(e) => setMyBidAmount(e.target.value)}
                          placeholder={`현재 ₩${currentBidPerUnit.toLocaleString()}`}
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
            </>
          )}

          {/* 어민용 상태 표시 */}
          {userType === 'fisherman' && auctionStatus === '진행중' && (
            <div className="border-t p-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">경매 진행중</h3>
                <p className="text-sm text-blue-700">
                  구매업체들이 입찰에 참여하고 있습니다
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽: 참여 중도매인 */}
      <div className="space-y-6">
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
            {auctionStatus === '대기중' ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">경매 시작 전입니다</p>
                <p className="text-xs text-gray-400 mt-1">
                  {auction?.startTime || '14:30'}에 경매가 시작됩니다
                </p>
              </div>
            ) : auctionStatus === '종료' ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700">경매 종료</p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  낙찰자: 부산수산
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  낙찰가: ₩{currentBidPerUnit.toLocaleString()}
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
                        <span className={`text-sm font-medium ${
                          userType === 'buyer' && participant.name === '나' ? 'text-blue-600' : 'text-gray-900'
                        }`}>
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
  );
}