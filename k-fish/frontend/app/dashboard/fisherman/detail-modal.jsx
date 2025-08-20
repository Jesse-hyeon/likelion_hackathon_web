'use client';

import { X } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  // 상태별 제목
  const getTitle = () => {
    switch(item.status) {
      case 'pending': return '상품 상세 검토';
      case 'approved': return '상품 상세 검토';
      case 'rejected': return '상품 상세 검토';
      default: return '상품 상세';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6">
          {/* 검토중 상태 */}
          {item.status === 'pending' && (
            <>
              {/* 기본 정보와 가격 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 기본 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">기본 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어종</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.fishType === 'live' ? '(활)' : item.fishType === 'frozen' ? '(냉)' : '(선)'}{item.species || '갈치'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">포장단위</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitType === 'weight' 
                          ? `${item.specification ? `마리당 ${item.specification}kg` : ''} | ${item.quantity}마리`
                          : `${item.packagingType} ${item.quantity}개`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획일</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchDate || '2025.08.14'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획지역</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchLocation || '동해/포항 앞바다'}</span>
                    </div>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">가격정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어제 낙찰가</span>
                      <span className="text-sm font-medium text-gray-900">₩28,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최근 7일 평균</span>
                      <span className="text-sm font-medium text-gray-900">₩33,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">등급 최고가</span>
                      <span className="text-sm font-medium text-gray-900">₩31,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최저 수락가</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitPrice ? `₩${parseInt(item.unitPrice.replace(/,/g, '') || 0).toLocaleString()}` : '₩31,500'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 분석결과(정량) + AI 판정 근거 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* AI 분석결과(정량) */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">AI 분석결과</h3>
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    <p>분석 중...</p>
                  </div>
                </div>

                {/* AI 판정 근거 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">AI 판정 근거</h3>
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    <p>분석 중...</p>
                  </div>
                </div>
              </div>

              {/* 상품 사진 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-4">상품 사진</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.images && item.images.length > 0 ? (
                      item.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={typeof image === 'string' ? image : image.url} 
                            alt={`상품 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      [1, 2, 3].map((index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">이미지 {index}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 승인완료 상태 */}
          {item.status === 'approved' && (
            <>
              {/* 기본 정보와 가격 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 기본 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">기본 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어종</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.fishType === 'live' ? '(활)' : item.fishType === 'frozen' ? '(냉)' : '(선)'}{item.species || '갈치'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">포장단위</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitType === 'weight' 
                          ? `${item.specification ? `마리당 ${item.specification}kg` : ''} | ${item.quantity}마리`
                          : `${item.packagingType} ${item.quantity}개`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획일</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchDate || '2025.08.14'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획지역</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchLocation || '동해/포항 앞바다'}</span>
                    </div>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">가격정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어제 낙찰가</span>
                      <span className="text-sm font-medium text-gray-900">₩28,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최근 7일 평균</span>
                      <span className="text-sm font-medium text-gray-900">₩33,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">등급 최고가</span>
                      <span className="text-sm font-medium text-gray-900">₩31,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최저 수락가</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitPrice ? `₩${parseInt(item.unitPrice.replace(/,/g, '') || 0).toLocaleString()}` : '₩31,500'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 분석결과(정량) + AI 판정 근거 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* AI 분석결과(정량) */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">AI 분석결과</h3>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-1">정상</p>
                      <p className="text-5xl font-bold text-green-600 mb-2">
                        {item.aiAnalysis?.score || 91.3}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${item.aiAnalysis?.score || 91.3}%`}}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI 판정 근거 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">AI 판정 근거</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium mb-2">
                      {item.aiAnalysis?.judgmentTitle || '품질 패턴과 거리가 멀어 정상으로 판정'}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {item.aiAnalysis?.judgmentDescription || 
                        '학습된 질병 데이터와 특징이 91.3점의 큰 차이를 보여 정상으로 판정했습니다. 질병에서 일반적으로 관찰되는 변색이나 손상이 없어 건강한 상태일 가능성이 높습니다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 상품 사진 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-4">상품 사진</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.images && item.images.length > 0 ? (
                      item.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={typeof image === 'string' ? image : image.url} 
                            alt={`상품 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      [1, 2, 3].map((index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">이미지 {index}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 승인거부 상태 */}
          {item.status === 'rejected' && (
            <>
              {/* 기본 정보와 가격 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 기본 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">기본 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어종</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.fishType === 'live' ? '(활)' : item.fishType === 'frozen' ? '(냉)' : '(선)'}{item.species || '갈치'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">포장단위</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitType === 'weight' 
                          ? `${item.specification ? `마리당 ${item.specification}kg` : ''} | ${item.quantity}마리`
                          : `${item.packagingType} ${item.quantity}개`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획일</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchDate || '2025.08.14'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획지역</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchLocation || '동해/포항 앞바다'}</span>
                    </div>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">가격정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어제 낙찰가</span>
                      <span className="text-sm font-medium text-gray-900">₩28,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최근 7일 평균</span>
                      <span className="text-sm font-medium text-gray-900">₩33,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">등급 최고가</span>
                      <span className="text-sm font-medium text-gray-900">₩31,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최저 수락가</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitPrice ? `₩${parseInt(item.unitPrice.replace(/,/g, '') || 0).toLocaleString()}` : '₩31,500'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 분석결과 + AI 판정 근거 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* AI 분석결과 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">AI 분석결과</h3>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-1">질병 감지</p>
                      <p className="text-5xl font-bold text-red-600 mb-2">
                        {item.aiAnalysis?.score || 13.0}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: `${item.aiAnalysis?.score || 13}%`}}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI 판정 근거 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">AI 판정 근거</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium mb-2">
                      {item.aiAnalysis?.judgmentTitle || '병변한 질병 패턴 감지'}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {item.aiAnalysis?.judgmentDescription || 
                        '학습된 질병 패턴과 13.0점으로 매우 가까워, AI가 69.74% 확률로 질병으로 판정했습니다. 정밀 검사가 필요합니다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 상품 사진 */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-600 mb-4">상품 사진</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.images && item.images.length > 0 ? (
                      item.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={typeof image === 'string' ? image : image.url} 
                            alt={`상품 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      [1, 2, 3].map((index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">이미지 {index}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 반려 사유 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-4">반려 사유</h3>
                <div className="bg-red-50 rounded-lg p-6">
                  <p className="text-sm text-red-900 font-medium mb-2">품질 기준 미달</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• 신선도 기준치 이하</li>
                    <li>• 질병 의심 패턴 검출</li>
                    <li>• 재검사 필요</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}