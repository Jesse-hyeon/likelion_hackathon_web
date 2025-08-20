'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, MapPin, Clock, CheckCircle, 
  Truck, Calendar, Phone, AlertCircle
} from 'lucide-react';

export default function WholesalerReceiptStatus() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = [
    { id: 'status', label: '수령 현황', icon: Package },
    { id: 'history', label: '수령 완료 내역', icon: CheckCircle }
  ];
  const [activeTab, setActiveTab] = useState('status');

  const [receiptData] = useState([
    {
      id: 1,
      productInfo: '광어\n통영 | 15.5kg',
      auctionDate: '2024-11-20',
      auctionTime: '14:30',
      winningPrice: '₩275,000',
      quantity: '15.5kg',
      seller: '김철수',
      sellerPhone: '010-1234-5678',
      status: 'waiting',
      receiptLocation: '포항수협 죽도위판장 1층 A구역',
      receiptDeadline: '2024-11-22 18:00',
      trackingNumber: null
    },
    {
      id: 2,
      productInfo: '우럭\n거제 | 8.2kg',
      auctionDate: '2024-11-19',
      auctionTime: '09:15',
      winningPrice: '₩156,000',
      quantity: '8.2kg',
      seller: '이영희',
      sellerPhone: '010-2345-6789',
      status: 'waiting',
      receiptLocation: '포항수협 죽도위판장 2층 B구역',
      receiptDeadline: '2024-11-21 18:00',
      trackingNumber: null
    },
    {
      id: 3,
      productInfo: '참돔\n통영 | 12.3kg',
      auctionDate: '2024-11-18',
      auctionTime: '11:00',
      winningPrice: '₩345,000',
      quantity: '12.3kg',
      seller: '박민수',
      sellerPhone: '010-3456-7890',
      status: 'completed',
      receiptLocation: '포항수협 죽도위판장 1층 C구역',
      receiptDate: '2024-11-19 15:30',
      trackingNumber: 'KF20241118001'
    },
    {
      id: 4,
      productInfo: '농어\n여수 | 6.8kg',
      auctionDate: '2024-11-17',
      auctionTime: '13:45',
      winningPrice: '₩198,000',
      quantity: '6.8kg',
      seller: '정수진',
      sellerPhone: '010-4567-8901',
      status: 'completed',
      receiptLocation: '포항수협 죽도위판장 3층 경매장',
      receiptDate: '2024-11-18 10:20',
      trackingNumber: 'KF20241117002'
    },
    {
      id: 5,
      productInfo: '도미\n남해 | 9.5kg',
      auctionDate: '2024-11-20',
      auctionTime: '10:00',
      winningPrice: '₩225,000',
      quantity: '9.5kg',
      seller: '최준호',
      sellerPhone: '010-5678-9012',
      status: 'waiting',
      receiptLocation: '포항수협 죽도위판장 1층 D구역',
      receiptDeadline: '2024-11-22 18:00',
      trackingNumber: null
    }
  ]);

  const stats = {
    total: receiptData.length,
    waiting: receiptData.filter(item => item.status === 'waiting').length,
    completed: receiptData.filter(item => item.status === 'completed').length
  };

  const filteredData = receiptData.filter(item => {
    if (activeTab === 'status' && item.status === 'completed') return false;
    if (activeTab === 'history' && item.status !== 'completed') return false;
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'waiting':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
            <Clock className="w-3 h-3" />
            수령대기
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            <CheckCircle className="w-3 h-3" />
            수령완료
          </span>
        );
      default:
        return null;
    }
  };

  const getRemainingTime = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff <= 0) return '기한 초과';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}일 ${hours % 24}시간 남음`;
    }
    return `${hours}시간 남음`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <span className="text-sm text-gray-600">중도매인님</span>
              <button className="text-sm text-gray-500 hover:text-gray-700">로그아웃</button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedFilter('all');
                    setCurrentPage(1);
                  }}
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'status' ? '수령 현황' : '수령 완료 내역'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'status' 
                  ? '낙찰받은 상품의 수령 정보를 확인하고 관리하세요.'
                  : '수령 완료된 상품 내역을 확인할 수 있습니다.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
              selectedFilter === 'all' 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-sm text-gray-600">전체</span>
            <span className="text-2xl font-bold text-gray-900">{stats.total}건</span>
          </button>
          
          <button
            onClick={() => setSelectedFilter('waiting')}
            className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
              selectedFilter === 'waiting' 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">수령 대기</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.waiting}건</span>
          </button>

          <button
            onClick={() => setSelectedFilter('completed')}
            className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
              selectedFilter === 'completed' 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">수령 완료</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completed}건</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수산물 정보
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    낙찰 일시
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    낙찰 금액
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    판매자
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수령 장소
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'status' ? '수령 기한' : '수령 일시'}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.productInfo.split('\n')[0]}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.productInfo.split('\n')[1]}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">{item.auctionDate}</div>
                      <div className="text-sm text-gray-500">{item.auctionTime}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-gray-900">{item.winningPrice}</div>
                      <div className="text-xs text-gray-500">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">{item.seller}</div>
                      <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1">
                        <Phone className="w-3 h-3" />
                        {item.sellerPhone}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-900">{item.receiptLocation}</div>
                          <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                            지도 보기
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.status === 'waiting' ? (
                        <div>
                          <div className="text-sm text-gray-900">{item.receiptDeadline.split(' ')[0]}</div>
                          <div className="text-sm text-gray-500">{item.receiptDeadline.split(' ')[1]}</div>
                          <div className="text-xs text-orange-600 font-medium mt-1">
                            {getRemainingTime(item.receiptDeadline)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-900">{item.receiptDate.split(' ')[0]}</div>
                          <div className="text-sm text-gray-500">{item.receiptDate.split(' ')[1]}</div>
                          {item.trackingNumber && (
                            <div className="text-xs text-gray-500 mt-1">
                              관리번호: {item.trackingNumber}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status)}
                      {item.status === 'waiting' && (
                        <button className="block mx-auto mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                          수령 확인
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                &lt;
              </button>
              
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((pageNum) => (
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
              ))}
              
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

        {activeTab === 'status' && filteredData.some(item => item.status === 'waiting') && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">수령 안내</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 수령 기한 내에 지정된 장소에서 상품을 수령해 주세요.</li>
                  <li>• 수령 시 신분증과 낙찰 확인서를 지참해 주세요.</li>
                  <li>• 문의사항은 판매자 연락처로 직접 연락 주시기 바랍니다.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}