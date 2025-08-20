'use client';

import { useState } from 'react';
import { 
  Package, Clock, CheckCircle, 
  Calendar, MapPin, User
} from 'lucide-react';
import ReceiptConfirmModal from './receipt-confirm-modal';

export default function ReceiptConfirmation() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 10;

  const [receiptData, setReceiptData] = useState([
    {
      id: 1,
      productInfo: '광어\n통영 | 15.5kg',
      auctionDate: '2024-11-20',
      winningPrice: '₩275,000',
      buyer: '부산수산',
      buyerPhone: '010-1234-5678',
      seller: '김철수',
      status: 'waiting',
      receiptLocation: '포항수협 죽도위판장 2층',
      receiptDeadline: '2024-11-22 18:00',
      requestDate: '2024-11-20',
    },
    {
      id: 2,
      productInfo: '우럭\n거제 | 8.2kg',
      auctionDate: '2024-11-19',
      winningPrice: '₩156,000',
      buyer: '서울수산',
      buyerPhone: '010-2345-6789',
      seller: '이영희',
      status: 'waiting',
      receiptLocation: '포항수협 죽도위판장 2층',
      receiptDeadline: '2024-11-21 17:00',
      requestDate: '2024-11-19',
    },
    {
      id: 3,
      productInfo: '참돔\n통영 | 12.3kg',
      auctionDate: '2024-11-18',
      winningPrice: '₩345,000',
      buyer: '대구유통',
      buyerPhone: '010-3456-7890',
      seller: '박민수',
      status: 'confirmed',
      receiptLocation: '포항수협 죽도위판장 2층',
      receiptDate: '2024-11-19 15:30',
      confirmDate: '2024-11-19',
      buyerInfo: {
        buyerName: '대구유통',
        buyerPhone: '010-1111-2222'
      }
    },
    {
      id: 4,
      productInfo: '농어\n여수 | 6.8kg',
      auctionDate: '2024-11-17',
      winningPrice: '₩198,000',
      buyer: '광주도매',
      buyerPhone: '010-4567-8901',
      seller: '정수진',
      status: 'confirmed',
      receiptLocation: '포항수협 죽도위판장 2층',
      receiptDate: '2024-11-18 10:20',
      confirmDate: '2024-11-18',
      buyerInfo: {
        buyerName: '광주도매',
        buyerPhone: '010-3333-4444'
      }
    },
    {
      id: 5,
      productInfo: '도미\n남해 | 9.5kg',
      auctionDate: '2024-11-20',
      winningPrice: '₩225,000',
      buyer: '인천수산',
      buyerPhone: '010-5678-9012',
      seller: '최준호',
      status: 'waiting',
      receiptLocation: '포항수협 죽도위판장 2층',
      receiptDeadline: '2024-11-22 18:00',
      requestDate: '2024-11-20',
    }
  ]);

  const stats = {
    total: receiptData.length,
    waiting: receiptData.filter(item => item.status === 'waiting').length,
    confirmed: receiptData.filter(item => item.status === 'confirmed').length
  };

  const filteredData = receiptData.filter(item => {
    if (selectedFilter !== 'all' && item.status !== selectedFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReceiptClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmReceipt = (buyerInfo) => {
    setReceiptData(prevData => 
      prevData.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              status: 'confirmed',
              confirmDate: new Date().toISOString().split('T')[0],
              receiptDate: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5),
              buyerInfo: buyerInfo
            }
          : item
      )
    );
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'waiting':
        return (
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
            수령대기
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            수령완료
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">수령 확인</h2>
            <p className="text-gray-600">오늘 진행된 경매 상품의 수령 현황을 확인하고 관리하세요.</p>
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
          <span className="text-sm text-gray-600">수령 대기</span>
          <span className="text-2xl font-bold text-gray-900">{stats.waiting}건</span>
        </button>

        <button
          onClick={() => setSelectedFilter('confirmed')}
          className={`flex items-center justify-between px-5 py-4 rounded-lg border-2 transition-all ${
            selectedFilter === 'confirmed' 
              ? 'bg-blue-50 border-blue-500' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="text-sm text-gray-600">수령 완료</span>
          <span className="text-2xl font-bold text-gray-900">{stats.confirmed}건</span>
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
                  낙찰 금액
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구매자
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  판매자
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수령 장소
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수령 기한
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수령 상태
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
                    <div className="text-sm font-semibold text-gray-900">{item.winningPrice}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-gray-900">{item.buyer}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-gray-900">{item.seller}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-gray-900">{item.receiptLocation}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'waiting' ? (
                      <div>
                        <div className="text-sm text-gray-900">{item.receiptDeadline.split(' ')[0]}</div>
                        <div className="text-sm text-gray-500">{item.receiptDeadline.split(' ')[1]}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-900">{item.receiptDate.split(' ')[0]}</div>
                        <div className="text-sm text-gray-500">{item.receiptDate.split(' ')[1]}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'waiting' ? (
                      <button
                        onClick={() => handleReceiptClick(item)}
                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
                      >
                        수령대기
                      </button>
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                          수령완료
                        </span>
                        {item.buyerInfo && (
                          <>
                            <div className="text-sm text-gray-700 font-medium">{item.buyerInfo.buyerName}</div>
                            <div className="text-xs text-gray-500">{item.confirmDate}</div>
                          </>
                        )}
                      </div>
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

      <ReceiptConfirmModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmReceipt}
        productInfo={selectedItem ? {
          species: selectedItem.productInfo.split('\n')[0],
          packagingUnit: selectedItem.productInfo.split('\n')[1].split(' | ')[1],
          catchDate: '2025.08.14',
          location: selectedItem.productInfo.split('\n')[1].split(' | ')[0],
          winningPrice: selectedItem.winningPrice
        } : null}
      />
    </div>
  );
}