'use client';

import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function ReviewDetailModal({ isOpen, onClose, item, onStatusUpdate }) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen || !item) return null;

  const handleApprove = () => {
    if (onStatusUpdate) {
      onStatusUpdate(item.id, 'approved');
    }
    alert('상품이 승인되었습니다.\n10분 후 자동으로 경매에 등록됩니다.');
    setShowRejectReason(false);
    setRejectReason('');
    onClose();
  };

  const handleReject = () => {
    if (!showRejectReason) {
      setShowRejectReason(true);
      return;
    }
    
    if (!rejectReason) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    if (onStatusUpdate) {
      onStatusUpdate(item.id, 'rejected', rejectReason);
    }
    alert('상품이 반려되었습니다.');
    setShowRejectReason(false);
    setRejectReason('');
    onClose();
  };

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
          {/* 검토요청 상태 */}
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
                        {item.fishType === 'live' ? '(활)' : '(선)'}{item.species || '갈치'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">포장단위</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.quantity || '스티로폼 15박스'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획일</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchDate || '2025.08.14'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획지역</span>
                      <span className="text-sm font-medium text-gray-900">{item.location || '동해/포항 앞바다'}</span>
                    </div>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">가격정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어제 낙찰가</span>
                      <span className="text-sm font-medium text-gray-900">₩33,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최근 7일 평균</span>
                      <span className="text-sm font-medium text-gray-900">₩31,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">등급 최고가</span>
                      <span className="text-sm font-medium text-gray-900">₩35,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최저 수락가</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.minPrice || '₩28,000'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 질병 감지 + 정상 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 질병 감지 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">질병 감지</h3>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">명확한 질병 패턴 감지</p>
                      <p className="text-xs leading-relaxed text-gray-600">
                        특정 거리가 13.0로 매우 가까우며, AI가 99.74% 확률로 질병으로 분류했습니다. 정밀 검사가 필요합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 정상 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">정상</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium mb-2">질병 패턴과 거리가 멀어 정상으로 판정</p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      학습된 질병 데이터의 황균 점검결과 91.3점 델어가 있으니다. 
                      일반적으로 질병성이 없습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 상품 사진 */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-600 mb-4">상품 사진</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">이미지 {index}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 반려 사유 입력 (반려 버튼 클릭 시에만 표시) */}
              {showRejectReason && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">반려 사유</h3>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    rows="4"
                    placeholder="반려 사유를 입력해주세요..."
                    autoFocus
                  />
                </div>
              )}
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
                        {item.fishType === 'live' ? '(활)' : '(선)'}{item.species || '갈치'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">포장단위</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.quantity || '스티로폼 15박스'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획일</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchDate || '2025.08.14'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획지역</span>
                      <span className="text-sm font-medium text-gray-900">{item.location || '동해/포항 앞바다'}</span>
                    </div>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">가격정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어제 낙찰가</span>
                      <span className="text-sm font-medium text-gray-900">₩33,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최근 7일 평균</span>
                      <span className="text-sm font-medium text-gray-900">₩31,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">등급 최고가</span>
                      <span className="text-sm font-medium text-gray-900">₩35,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최저 수락가</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.minPrice || '₩28,000'}
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
                      <p className="text-5xl font-bold text-green-600 mb-2">91.3</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '91.3%'}}></div>
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
                    <p className="font-medium mb-2">품질 패턴과 거리가 멀어 정상으로 판정</p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      학습된 질병 데이터와 특징이 91.3점의 큰 차이를 보여 정상으로 판정했습니다. 
                      질병에서 일반적으로 관찰되는 변색이나 손상이 없어 건강한 상태일 가능성이 높습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 상품 사진 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-4">상품 사진</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">이미지 {index}</span>
                      </div>
                    ))}
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
                        {item.fishType === 'live' ? '(활)' : '(선)'}{item.species || '대게'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">포장단위</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.quantity || '스티로폼 15박스'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획일</span>
                      <span className="text-sm font-medium text-gray-900">{item.catchDate || '2025.08.14'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어획지역</span>
                      <span className="text-sm font-medium text-gray-900">{item.location || '동해/포항 앞바다'}</span>
                    </div>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">가격정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">어제 낙찰가</span>
                      <span className="text-sm font-medium text-gray-900">₩33,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최근 7일 평균</span>
                      <span className="text-sm font-medium text-gray-900">₩31,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">등급 최고가</span>
                      <span className="text-sm font-medium text-gray-900">₩35,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">최저 수락가</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.minPrice || '₩28,000'}
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
                      <p className="text-5xl font-bold text-red-600 mb-2">13.0</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '13%'}}></div>
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
                    <p className="font-medium mb-2">병변한 질병 패턴 감지</p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      학습된 질병 패턴과 13.0점으로 매우 가까워, AI가 69.74% 확률로 질병으로 판정했습니다. 
                      세균성 질병 개연성 32%로 정밀 검사가 필요합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 상품 사진 */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-600 mb-4">상품 사진</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">이미지 {index}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 반려 사유 */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-4">반려 사유</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">반려 사유</h4>
                      <p className="text-sm text-gray-700">
                        {item.rejectReason || 'AI 분석 결과 세균성 질병 감지로 인해 품질 기준 미달'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-center">
            {/* 검토요청 상태: 승인/반려 버튼 */}
            {item.status === 'pending' && (
              <div className="flex gap-2 w-full max-w-md">
                {showRejectReason ? (
                  <>
                    <button
                      onClick={() => {
                        setShowRejectReason(false);
                        setRejectReason('');
                      }}
                      className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                    >
                      반려 확인
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleReject}
                      className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
                    >
                      반려
                    </button>
                    <button
                      onClick={handleApprove}
                      className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                    >
                      승인
                    </button>
                  </>
                )}
              </div>
            )}

            {/* 승인완료 상태: 닫기 버튼만 */}
            {item.status === 'approved' && (
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                닫기
              </button>
            )}

            {/* 승인거부 상태: 확인 버튼 */}
            {item.status === 'rejected' && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}