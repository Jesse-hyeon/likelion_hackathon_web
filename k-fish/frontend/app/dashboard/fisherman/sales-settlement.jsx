'use client';

import { useState, useEffect } from 'react';

export default function SalesSettlement() {
  const [salesFilter, setSalesFilter] = useState('all');
  const [selectedSales, setSelectedSales] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [salesData, setSalesData] = useState([]);

  // 판매 정산 데이터 로드
  useEffect(() => {
    // 로컬 스토리지에서 승인된 상품들을 판매 내역으로 변환
    const registrations = JSON.parse(localStorage.getItem('fishRegistrations') || '[]');
    const salesHistory = registrations.filter(item => item.status === 'approved').map((item, index) => ({
      id: item.id || index + 1,
      name: item.species,
      fishType: item.fishType,
      origin: '포항',
      quantity: item.quantity ? `${item.quantity}${item.unitType === 'weight' ? '마리' : '개'}` : '100마리',
      price: parseInt(item.unitPrice?.replace(/,/g, '') || 250000) + Math.floor(Math.random() * 50000),
      date: '2025. 8. ' + (9 + index) + '.'
    }));

    // 기본 판매 데이터 추가
    const defaultSales = [
      { id: 101, name: '대게', fishType: 'live', origin: '포항', quantity: '30마리', price: 250000, date: '2025. 8. 9.' },
      { id: 102, name: '대게', fishType: 'live', origin: '포항', quantity: '100마리', price: 85000, date: '2025. 8. 10.' },
      { id: 103, name: '대게', fishType: 'live', origin: '포항', quantity: '200마리', price: 120000, date: '2025. 8. 11.' },
      { id: 104, name: '포항 대게', fishType: 'live', origin: '포항', quantity: '80마리', price: 95000, date: '2025. 8. 12.' }
    ];

    setSalesData([...salesHistory, ...defaultSales]);
  }, []);

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSales([]);
    } else {
      setSelectedSales(salesData.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  // 개별 선택
  const handleSelectSale = (id) => {
    if (selectedSales.includes(id)) {
      setSelectedSales(selectedSales.filter(item => item !== id));
      setSelectAll(false);
    } else {
      const newSelection = [...selectedSales, id];
      setSelectedSales(newSelection);
      setSelectAll(newSelection.length === salesData.length);
    }
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (selectedSales.length === 0) {
      alert('다운로드할 항목을 선택해주세요.');
      return;
    }
    const downloadCount = selectedSales.length;
    alert(`${downloadCount}개 항목을 다운로드합니다.`);
  };

  return (
    <div>
      {/* 헤더 섹션 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">판매 정산</h2>
        <p className="text-gray-600 mt-1">판매한 상품 내역을 한눈에 보고, 액셀파일로 쉽게 관리하세요.</p>
      </div>
      
      {/* 엑셀 다운로드 바 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          {selectedSales.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedSales.length}개 선택됨
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
      
      {/* 판매 정산 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* 필터 탭 */}
        <div className="px-6 py-3 border-b flex gap-2">
          <button 
            onClick={() => setSalesFilter('all')}
            className={`px-4 py-1.5 text-sm rounded ${
              salesFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 border hover:bg-gray-50'
            }`}>
            전체
          </button>
          <button 
            onClick={() => setSalesFilter('week')}
            className={`px-4 py-1.5 text-sm rounded ${
              salesFilter === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 border hover:bg-gray-50'
            }`}>
            최근 1주
          </button>
          <button 
            onClick={() => setSalesFilter('month')}
            className={`px-4 py-1.5 text-sm rounded ${
              salesFilter === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 border hover:bg-gray-50'
            }`}>
            최근 1개월
          </button>
          <button 
            onClick={() => setSalesFilter('quarter')}
            className={`px-4 py-1.5 text-sm rounded ${
              salesFilter === 'quarter' 
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
              {salesData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSales.includes(item.id)}
                      onChange={() => handleSelectSale(item.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.fishType === 'live' ? '(활)' : item.fishType === 'frozen' ? '(냉)' : '(선)'}{item.name}
                    </div>
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

        {/* 페이지네이션 (선택사항) */}
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