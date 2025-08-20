'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Gavel, Package, ChevronRight, 
  Search, Filter, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import ReviewDetailModal from './review-detail-modal';
import AdminAuctionView from './admin-auction-view';
import ReceiptConfirmation from './receipt-confirmation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('review');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 탭 메뉴 항목
  const tabs = [
    { id: 'review', label: '검토요청 처리', icon: FileText },
    { id: 'auction', label: '실시간 경매 관리', icon: Gavel },
    { id: 'receipt', label: '수령 확인', icon: Package }
  ];

  // 필터 상태
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 샘플 검토 데이터
  const [reviewData, setReviewData] = useState([
    {
      id: 1,
      productInfo: '대게\n포항 | 25.5kg',
      inspectionStatus: 80,
      statusColor: 'green',
      price: '₩175,750',
      producer: '김철수(어민 정보 추가)',
      result: '승인',
      status: 'approved'
    },
    {
      id: 2,
      productInfo: '대게\n포항 | 25.5kg',
      inspectionStatus: 97,
      statusColor: 'green',
      price: '₩175,750',
      producer: '김철수(어민 정보 추가)',
      result: '승인',
      status: 'approved'
    },
    {
      id: 3,
      productInfo: '대게\n포항 | 25.5kg',
      inspectionStatus: 13,
      statusColor: 'red',
      price: '₩175,750',
      producer: '김철수(어민 정보 추가)',
      result: '승인거부',
      status: 'rejected'
    },
    {
      id: 4,
      productInfo: '대게\n포항 | 25.5kg',
      inspectionStatus: 32,
      statusColor: 'red',
      price: '₩175,750',
      producer: '김철수(어민 정보 추가)',
      result: '검토요청',
      status: 'pending'
    }
  ]);

  // 통계 데이터 (reviewData 기반으로 동적 계산)
  const stats = {
    total: reviewData.length,
    pending: reviewData.filter(item => item.status === 'pending').length,
    approved: reviewData.filter(item => item.status === 'approved').length,
    rejected: reviewData.filter(item => item.status === 'rejected').length
  };

  // 필터링된 데이터
  const filteredData = reviewData.filter(item => {
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    if (searchTerm && !item.productInfo.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDetailClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (itemId, newStatus, rejectReason = null) => {
    const updatedData = reviewData.map(d => {
      if (d.id === itemId) {
        const updated = {
          ...d, 
          status: newStatus, 
          result: newStatus === 'approved' ? '승인' : '승인거부',
          rejectReason: rejectReason
        };
        
        // 승인 시 10분 후 경매 자동 등록
        if (newStatus === 'approved') {
          updated.auctionScheduledTime = new Date(Date.now() + 10 * 60 * 1000); // 10분 후
          updated.startPrice = d.price; // 시작가를 최저수락가로 설정
          
          // 10분 후 경매 상태 변경 (실제 구현에서는 백엔드 처리 필요)
          setTimeout(() => {
            console.log(`경매 등록: ${d.productInfo} - 시작가: ${d.price}`);
            // 여기서 경매 등록 API 호출
            alert(`상품 "${d.productInfo.split('\n')[0]}"이(가) 경매에 등록되었습니다.\n시작가: ${d.price}`);
          }, 10 * 60 * 1000);
        }
        
        return updated;
      }
      return d;
    });
    
    setReviewData(updatedData);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">승인</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">승인거부</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">검토요청</span>;
      default:
        return null;
    }
  };

  const getProgressBarColor = (value) => {
    if (value >= 20) return 'bg-green-500';
    return 'bg-red-500';
  };

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
              <span className="text-sm text-gray-600">관리자님</span>
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
        {/* 검토요청 처리 탭 */}
        {activeTab === 'review' && (
          <div>
            {/* 헤더 섹션 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">검토 요청 처리</h2>
                  <p className="text-gray-600">등록 요청된 상품을 확인하고, 승인 또는 반려를 처리하세요.</p>
                </div>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
                  selectedFilter === 'all' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm text-gray-600">전체보기</span>
                <span className="text-2xl font-bold text-gray-900">{stats.total}건</span>
              </button>
              
              <button
                onClick={() => setSelectedFilter('pending')}
                className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
                  selectedFilter === 'pending' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">검토 요청</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.pending}건</span>
              </button>

              <button
                onClick={() => setSelectedFilter('approved')}
                className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
                  selectedFilter === 'approved' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">승인 완료</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.approved}건</span>
              </button>

              <button
                onClick={() => setSelectedFilter('rejected')}
                className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
                  selectedFilter === 'rejected' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">승인 거부</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.rejected}건</span>
              </button>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        수산물 정보
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        검사 결과
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        최저 수락가
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        생산자
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        승인 현황
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록 상세
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.productInfo.split('\n')[0]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.productInfo.split('\n')[1]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <div className="relative w-24">
                              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(item.inspectionStatus)}`}
                                  style={{ width: `${item.inspectionStatus}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 min-w-[30px] text-right">{item.inspectionStatus}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm font-medium text-gray-900">{item.price}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-900">{item.producer}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.status === 'pending' ? (
                            <button
                              onClick={() => handleDetailClick(item)}
                              className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                              검토하기
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDetailClick(item)}
                              className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              상세보기
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t flex items-center justify-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 10) {
                      pageNum = i + 1;
                    } else if (currentPage <= 6) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 4) {
                      pageNum = totalPages - 9 + i;
                    } else {
                      pageNum = currentPage - 5 + i;
                    }
                    
                    if (i === 9 && totalPages > 10) {
                      return (
                        <span key="ellipsis" className="px-2 text-gray-400">...</span>
                      );
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 10 && currentPage < totalPages - 5 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 rounded text-gray-600 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 실시간 경매 탭 */}
        {activeTab === 'auction' && (
          <AdminAuctionView />
        )}

        {/* 수령 확인 탭 */}
        {activeTab === 'receipt' && (
          <ReceiptConfirmation />
        )}
      </div>

      {/* 상세보기 모달 */}
      <ReviewDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}