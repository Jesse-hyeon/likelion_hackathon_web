'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Gavel, DollarSign, CheckCircle, Clock, 
  XCircle, AlertCircle, Search, Filter, Calendar,
  ChevronRight, Package, TrendingUp, AlertTriangle
} from 'lucide-react';
import DetailModal from './detail-modal';
import RegisterForm from './register-form';
import AuctionStatus from './auction-status';
import SalesSettlement from './sales-settlement';

export default function FishermanDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('status');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState([]);

  // 탭 메뉴 항목
  const tabs = [
    { id: 'status', label: '등록현황', icon: FileText },
    { id: 'register', label: '수산물 등록', icon: Plus },
    { id: 'auction', label: '경매상태', icon: Gavel },
    { id: 'settlement', label: '판매정산', icon: DollarSign }
  ];

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('fishRegistrations');
      if (saved) {
        setRegistrationData(JSON.parse(saved));
      } else {
        // 초기 샘플 데이터
        const initialData = [
          {
            id: Date.now() + 1,
            species: '광어',
            fishType: 'live',
            unitType: 'weight',
            specification: '2',
            quantity: '10',
            packagingType: null,
            unitPrice: '35000',
            catchDate: '2025.08.18',
            catchLocation: '제주도',
            producer: '김철수',
            status: 'approved',
            statusLabel: '승인완료',
            registerDate: '2025.08.18'
          },
          {
            id: Date.now() + 2,
            species: '고등어',
            fishType: 'frozen',
            unitType: 'box',
            specification: null,
            quantity: '20',
            packagingType: '박스',
            unitPrice: '15000',
            catchDate: '2025.08.17',
            catchLocation: '부산',
            producer: '김철수',
            status: 'approved',
            statusLabel: '승인완료',
            registerDate: '2025.08.18'
          },
          {
            id: Date.now() + 3,
            species: '갈치',
            fishType: 'fresh',
            unitType: 'weight',
            specification: '0.5',
            quantity: '30',
            packagingType: null,
            unitPrice: '25000',
            catchDate: '2025.08.18',
            catchLocation: '포항',
            producer: '김철수',
            status: 'pending',
            statusLabel: '검토중',
            registerDate: '2025.08.18'
          },
          {
            id: Date.now() + 4,
            species: '참돔',
            fishType: 'live',
            unitType: 'weight',
            specification: '1.5',
            quantity: '15',
            packagingType: null,
            unitPrice: '45000',
            catchDate: '2025.08.17',
            catchLocation: '통영',
            producer: '김철수',
            status: 'approved',
            statusLabel: '승인완료',
            registerDate: '2025.08.17'
          },
          {
            id: Date.now() + 5,
            species: '오징어',
            fishType: 'fresh',
            unitType: 'box',
            specification: null,
            quantity: '10',
            packagingType: 'S/P',
            unitPrice: '18000',
            catchDate: '2025.08.18',
            catchLocation: '울릉도',
            producer: '김철수',
            status: 'pending',
            statusLabel: '검토중',
            registerDate: '2025.08.18'
          },
          {
            id: Date.now() + 6,
            species: '전어',
            fishType: 'fresh',
            unitType: 'box',
            specification: null,
            quantity: '25',
            packagingType: '박스',
            unitPrice: '12000',
            catchDate: '2025.08.18',
            catchLocation: '여수',
            producer: '김철수',
            status: 'rejected',
            statusLabel: '승인거부',
            registerDate: '2025.08.17'
          },
          {
            id: Date.now() + 7,
            species: '대게',
            fishType: 'live',
            unitType: 'weight',
            specification: '1',
            quantity: '8',
            packagingType: null,
            unitPrice: '55000',
            catchDate: '2025.08.18',
            catchLocation: '동해',
            producer: '김철수',
            status: 'approved',
            statusLabel: '승인완료',
            registerDate: '2025.08.18'
          },
          {
            id: Date.now() + 8,
            species: '꽃게',
            fishType: 'live',
            unitType: 'box',
            specification: null,
            quantity: '12',
            packagingType: '박스',
            unitPrice: '22000',
            catchDate: '2025.08.17',
            catchLocation: '태안',
            producer: '김철수',
            status: 'pending',
            statusLabel: '검토중',
            registerDate: '2025.08.17'
          }
        ];
        setRegistrationData(initialData);
        localStorage.setItem('fishRegistrations', JSON.stringify(initialData));
      }
    };
    
    loadData();
    
    // 탭 변경 시 데이터 새로고침
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 주기적으로 데이터 확인 (같은 창에서 변경사항 감지)
    const interval = setInterval(loadData, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 필터링된 데이터
  const filteredData = registrationData.filter(item => {
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    if (searchTerm && !item.species.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 필터나 검색어 변경 시 첫 페이지로 리셋
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // 카운트
  const counts = {
    all: registrationData.length,
    pending: registrationData.filter(item => item.status === 'pending').length,
    approved: registrationData.filter(item => item.status === 'approved').length,
    rejected: registrationData.filter(item => item.status === 'rejected').length
  };

  // 상태별 색상 클래스
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // 상태별 아이콘
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // 상태별 검사 결과 텍스트
  const getInspectionResult = (status) => {
    switch(status) {
      case 'pending': return '검사중';
      case 'approved': return '정상';
      case 'rejected': return '정밀 검사 필요';
      default: return '';
    }
  };

  // 상세보기 클릭 핸들러
  const handleDetailClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
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
              <span className="text-sm text-gray-600">김철수님</span>
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
        {/* 등록현황 탭 */}
        {activeTab === 'status' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">등록 현황</h2>
              <p className="text-gray-600">내가 등록한 상품의 승인 여부를 확인하세요.</p>
            </div>

            {/* 필터 버튼들 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => handleFilterChange('all')}
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
                onClick={() => handleFilterChange('pending')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedFilter === 'pending' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-600">검토중</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{counts.pending}건</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleFilterChange('approved')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedFilter === 'approved' 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-gray-600">승인완료</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{counts.approved}건</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleFilterChange('rejected')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedFilter === 'rejected' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-gray-600">승인거부</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{counts.rejected}건</p>
                  </div>
                </div>
              </button>
            </div>

            {/* 검색 및 필터 바 */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="수산물 검색..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Calendar className="w-4 h-4" />
                    기간 선택
                  </button>
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
                        최저 수락가
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        생산자
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        승인 현황
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록일
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상세보기
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.fishType === 'live' ? '(활)' : item.fishType === 'frozen' ? '(냉)' : '(선)'}{item.species}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.unitType === 'weight' 
                                ? `${item.specification ? `마리당 ${item.specification}kg` : ''} | ${item.quantity}마리`
                                : `${item.packagingType} ${item.quantity}개`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.unitPrice ? `₩${parseInt(item.unitPrice.replace(/,/g, '') || 0).toLocaleString()}` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.producer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.registerDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => handleDetailClick(item)}
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

              {/* 페이지네이션 */}
              <div className="px-6 py-3 border-t">
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 수산물 등록 탭 */}
        {activeTab === 'register' && (
          <RegisterForm 
            onRegistrationComplete={() => {
              setActiveTab('status');
            }}
          />
        )}

        {/* 경매상태 탭 */}
        {activeTab === 'auction' && (
          <AuctionStatus />
        )}

        {/* 판매정산 탭 */}
        {activeTab === 'settlement' && (
          <SalesSettlement />
        )}
      </div>

      {/* 상세보기 모달 */}
      <DetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </div>
  );
}