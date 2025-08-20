'use client';

import { useState } from 'react';
import { X, User } from 'lucide-react';

export default function ReceiptConfirmModal({ isOpen, onClose, onConfirm, productInfo }) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [error, setError] = useState('');

  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '');
    
    // 11자리를 초과하면 자르기
    const limited = numbers.slice(0, 11);
    
    // 포맷팅
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setBuyerPhone(formatted);
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!buyerName || !buyerPhone) {
      setError('모든 정보를 입력해주세요.');
      return;
    }
    
    // 전화번호가 정확히 13자리인지 확인 (010-0000-0000)
    if (buyerPhone.length !== 13) {
      setError('올바른 전화번호 형식이 아닙니다. (010-0000-0000)');
      return;
    }
    
    onConfirm({
      buyerName,
      buyerPhone,
      timestamp: new Date().toISOString()
    });
    
    // 초기화
    setBuyerName('');
    setBuyerPhone('');
    setError('');
  };

  const handleClose = () => {
    setBuyerName('');
    setBuyerPhone('');
    setError('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">수령 확인</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {productInfo && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">기본 정보</div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">어종</span>
                <span className="text-sm font-medium text-gray-900">{productInfo.species}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">포장단위</span>
                <span className="text-sm font-medium text-gray-900">{productInfo.packagingUnit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">어획일</span>
                <span className="text-sm font-medium text-gray-900">{productInfo.catchDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">어획지역</span>
                <span className="text-sm font-medium text-gray-900">{productInfo.location}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">낙찰 금액</span>
                  <span className="text-lg font-bold text-blue-600">{productInfo.winningPrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              구매자 정보
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="구매자 이름"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <input
              type="tel"
              value={buyerPhone}
              onChange={handlePhoneChange}
              placeholder="구매자 연락처"
              maxLength="13"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}