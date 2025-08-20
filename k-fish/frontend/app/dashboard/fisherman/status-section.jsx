// 등록현황 섹션 컴포넌트
import { useState } from 'react';
import { CheckCircle, XCircle, Fish } from 'lucide-react';

export default function StatusSection({ activeTab, setActiveTab }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // 샘플 데이터
  const allData = [
    {
      id: '1',
      species: '대게',
      weight: '포항 | 25.5kg',
      qualityGrade: '김사중',
      price: 175750,
      producer: '김철수(어민 정보 추가)',
      status: 'pending',
      statusLabel: '검토중'
    },
    {
      id: '2',
      species: '대게',
      weight: '포항 | 25.5kg',
      qualityGrade: '정밀 검사 필요',
      price: 175750,
      producer: '김철수(어민 정보 추가)',
      status: 'rejected',
      statusLabel: '승인거부'
    },
    {
      id: '3',
      species: '대게',
      weight: '포항 | 25.5kg',
      qualityGrade: '정상',
      price: 175750,
      producer: '김철수(어민 정보 추가)',
      status: 'completed',
      statusLabel: '승인완료'
    },
    {
      id: '4',
      species: '대게',
      weight: '포항 | 25.5kg',
      qualityGrade: '김사중',
      price: 175750,
      producer: '김철수(어민 정보 추가)',
      status: 'pending',
      statusLabel: '검토중'
    }
  ];
  
  // 필터링된 데이터
  const filteredData = selectedFilter === 'all' 
    ? allData 
    : allData.filter(item => item.status === selectedFilter);
  
  // 카운트
  const counts = {
    all: allData.length,
    pending: allData.filter(item => item.status === 'pending').length,
    completed: allData.filter(item => item.status === 'completed').length,
    rejected: allData.filter(item => item.status === 'rejected').length
  };

  if (activeTab !== 'status') return null;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">등록 현황</h2>
        <p className="text-gray-600">내가 등록한 상품의 승인 여부를 확인하세요.</p>
      </div>

      {/* 상태 요약 카드 (필터 버튼) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`p-6 rounded-lg border-2 transition-all ${
            selectedFilter === 'all' 
              ? 'bg-blue-50 border-blue-500' 
              : 'bg-blue-50 border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="text-left">
            <p className="text-sm text-gray-600">전체보기</p>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {counts.all}건
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setSelectedFilter('pending')}
          className={`p-6 rounded-lg border-2 transition-all ${
            selectedFilter === 'pending' 
              ? 'bg-blue-50 border-blue-500' 
              : 'bg-blue-50 border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600">검토 중</p>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                {counts.pending || 233}건
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setSelectedFilter('completed')}
          className={`p-6 rounded-lg border-2 transition-all ${
            selectedFilter === 'completed' 
              ? 'bg-green-50 border-green-500' 
              : 'bg-green-50 border-green-200 hover:border-green-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600">승인 완료</p>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {counts.completed || 2}건
              </div>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setSelectedFilter('rejected')}
          className={`p-6 rounded-lg border-2 transition-all ${
            selectedFilter === 'rejected' 
              ? 'bg-red-50 border-red-500' 
              : 'bg-red-50 border-red-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600">승인 거부</p>
              <div className="text-3xl font-bold text-red-600 mt-2">
                {counts.rejected || 1}건
              </div>
            </div>
            <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          {/* 테이블 헤더 */}
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">수산물 정보</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">검사 결과</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">최저 수락가</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">생산자</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">승인 현황</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">등록 상세</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">상세보기</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{item.species}</span>
                        <span className="text-sm text-gray-500">{item.weight}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{item.qualityGrade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">₩ {item.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{item.producer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        item.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        상세보기
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Fish className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">해당 조건에 맞는 등록 상품이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* 페이지네이션 */}
          <div className="flex justify-center items-center py-6 gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">2</button>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">10</button>
            
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}