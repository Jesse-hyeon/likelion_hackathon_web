'use client';

import { useState } from 'react';
import { Upload, AlertCircle, Check, X } from 'lucide-react';

export default function RegisterForm({ onRegistrationComplete }) {
  const [formData, setFormData] = useState({
    species: '',
    searchQuery: '',
    fishType: 'live', // 'live' or 'fresh'
    unitType: 'weight',
    packagingType: 'S/P',
    specType: 'perKg', // 'perKg' or 'perFish'
    sizeUnit: '',
    specification: '',
    quantity: '',
    unitPrice: '',
    totalPrice: ''
  });

  const [selectedFish, setSelectedFish] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 전체 어종 목록
  const allFishSpecies = [
    '광어', '광어가자미', '광어대구', '갈치', '고등어', '고등어참치', 
    '굴비', '김', '농어', '넙치', '대구', '도다리', '돔', '멸치', 
    '명태', '문어', '민어', '방어', '병어', '복어', '볼락', '삼치', 
    '새우', '숭어', '아귀', '연어', '오징어', '우럭', '전복', '전어', 
    '조기', '주꾸미', '참돔', '참치', '청어', '홍어'
  ];
  
  const categories = ['갈치', '고등어', '오징어', '명태', '조기'];
  
  // 검색어에 따른 어종 필터링
  const getFilteredFish = (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return allFishSpecies.filter(fish => 
      fish.toLowerCase().startsWith(lowerQuery)
    );
  };
  
  const priceInfo = {
    yesterday: 28000,
    weekAvg: 33000,
    gradeMax: 31500
  };

  const packagingOptions = [
    { value: 'S/P', label: 'S/P', needsSpec: true },
    { value: 'box', label: 'Box', needsSpec: true },
    { value: '그물망', label: '그물망', needsSpec: false }
  ];

  const sizeOptions = ['대', '중', '소'];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">수산물 등록</h2>
        <p className="text-gray-600">내가 잡은 수산물을 등록해 경매에 참여하세요.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽 열 */}
            <div>
              {/* 어종 선택 섹션 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  어종 선택 <span className="text-red-500">*</span>
                </h3>
                
                {/* 선택된 어종 표시 */}
                {selectedFish && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {selectedFish}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedFish(null);
                        setFormData({...formData, species: '', searchQuery: ''});
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* 검색 입력창 (선택된 어종이 없을 때만 표시) */}
                {!selectedFish && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="어종명을 입력하세요"
                      value={formData.searchQuery}
                      onChange={(e) => {
                        const query = e.target.value;
                        setFormData({...formData, searchQuery: query});
                        const filtered = getFilteredFish(query);
                        setSearchResults(filtered);
                        setShowSearchResults(filtered.length > 0 && query.length > 0);
                        setHighlightedIndex(0); // 검색어 변경시 하이라이트 초기화
                      }}
                      onKeyDown={(e) => {
                        if (searchResults.length > 0) {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setHighlightedIndex(prev => 
                              prev < searchResults.length - 1 ? prev + 1 : prev
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const selectedResult = searchResults[highlightedIndex];
                            setSelectedFish(selectedResult);
                            setFormData({...formData, species: selectedResult, searchQuery: ''});
                            setShowSearchResults(false);
                            setHighlightedIndex(0);
                          } else if (e.key === 'Escape') {
                            setShowSearchResults(false);
                            setHighlightedIndex(0);
                          }
                        }
                      }}
                      onFocus={() => {
                        const filtered = getFilteredFish(formData.searchQuery);
                        setSearchResults(filtered);
                        setShowSearchResults(filtered.length > 0 && formData.searchQuery.length > 0);
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSearchResults(false), 200);
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.species ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    
                    {/* 검색 결과 드롭다운 */}
                    {showSearchResults && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {searchResults.map((fish, index) => (
                          <button
                            key={fish}
                            onClick={() => {
                              setSelectedFish(fish);
                              setFormData({...formData, species: fish, searchQuery: ''});
                              setShowSearchResults(false);
                              setHighlightedIndex(0);
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`w-full px-4 py-2 text-left text-sm border-b last:border-b-0 transition-colors ${
                              index === highlightedIndex 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {fish}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* 인기 어종 (선택된 어종이 없을 때만 표시) */}
                {!selectedFish && (
                  <div className="mt-4">
                    {errors.species && (
                      <p className="text-xs text-red-500 mb-2">{errors.species}</p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">인기 어종</p>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedFish(category);
                            setFormData({...formData, species: category, searchQuery: ''});
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 활어/선어/냉동 선택 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">상태 선택</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFormData({...formData, fishType: 'live'})}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.fishType === 'live'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-sm">활어</span>
                    <p className="text-xs text-gray-500 mt-1">살아있는 상태</p>
                  </button>
                  
                  <button
                    onClick={() => setFormData({...formData, fishType: 'fresh'})}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.fishType === 'fresh'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-sm">선어</span>
                    <p className="text-xs text-gray-500 mt-1">신선 냉장 상태</p>
                  </button>

                  <button
                    onClick={() => setFormData({...formData, fishType: 'frozen'})}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.fishType === 'frozen'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-sm">냉동</span>
                    <p className="text-xs text-gray-500 mt-1">급속 냉동 상태</p>
                  </button>
                </div>
              </div>

              {/* 판매 정보 섹션 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">판매 정보</h3>
                
                {/* 판매 방식 */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600">판매 방식</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => setFormData({...formData, unitType: 'weight'})}
                      className={`p-4 rounded-lg border-2 ${
                        formData.unitType === 'weight'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="font-medium text-sm">중량 판매</span>
                      <p className="text-xs text-gray-500">kg 단위로 판매</p>
                    </button>
                    
                    <button
                      onClick={() => setFormData({...formData, unitType: 'package'})}
                      className={`p-4 rounded-lg border-2 ${
                        formData.unitType === 'package'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="font-medium text-sm">포장 판매</span>
                      <p className="text-xs text-gray-500">박스/S/P 단위</p>
                    </button>
                  </div>
                </div>

                {/* 포장 방식 선택 (포장 판매시) */}
                {formData.unitType === 'package' && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-600 mb-2 block">포장 단위</label>
                    <div className="grid grid-cols-3 gap-2">
                      {packagingOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({...formData, packagingType: option.value, specification: ''})}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            formData.packagingType === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 규격 입력 */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-1 block">
                    {formData.unitType === 'weight' ? '규격 (마리당 kg)' :
                     formData.packagingType === 'S/P' ? 'S/P (스티로폼)' :
                     formData.packagingType === 'box' ? 'Box' : '크기 단위'}
                  </label>
                  
                  {formData.unitType === 'weight' ? (
                    <input
                      type="text"
                      placeholder="예: 4 (마리당 4kg)"
                      value={formData.specification}
                      onChange={(e) => setFormData({...formData, specification: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : formData.packagingType === '그물망' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          onClick={() => setFormData({...formData, sizeUnit: size})}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            formData.sizeUnit === size
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* 숫자 입력 또는 크기 선택 - 하나만 표시 */}
                      {!formData.sizeUnit ? (
                        <>
                          <input
                            type="text"
                            placeholder={formData.packagingType === 'S/P' ? "예: 3 (3미)" : "예: 10 (10봉)"}
                            value={formData.specification}
                            onChange={(e) => setFormData({...formData, specification: e.target.value, sizeUnit: ''})}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {!formData.specification && (
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">또는 크기 단위 선택</label>
                              <div className="grid grid-cols-3 gap-2">
                                {sizeOptions.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setFormData({...formData, sizeUnit: size, specification: ''})}
                                    className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors border-gray-200 text-gray-600 hover:bg-gray-50"
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gray-600">크기 단위</label>
                            <button
                              onClick={() => setFormData({...formData, sizeUnit: '', specification: ''})}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              변경
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {sizeOptions.map((size) => (
                              <button
                                key={size}
                                onClick={() => setFormData({...formData, sizeUnit: size})}
                                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                  formData.sizeUnit === size
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 수량 입력 */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    총 수량 {formData.unitType === 'package' && (
                            formData.packagingType === 'S/P' ? '(S/P)' :
                            formData.packagingType === 'box' ? '(box)' : '(그물망)')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.quantity || ''}
                      onChange={(e) => {
                        // 정수만 허용
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({...formData, quantity: value});
                      }}
                      className="w-full pl-4 pr-14 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    
                    {/* 증감 버튼 */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = Number(formData.quantity) || 0;
                          if (currentValue > 0) {
                            const newValue = Math.max(0, currentValue - 1);
                            setFormData({...formData, quantity: String(newValue)});
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-l"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <div className="h-5 w-px bg-gray-300"></div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = Number(formData.quantity) || 0;
                          const newValue = currentValue + 1;
                          setFormData({...formData, quantity: String(newValue)});
                        }}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-r"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 열 */}
            <div>
              {/* 시장 가격 참고 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">시장 가격 참고</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">어제 낙찰가</span>
                    <span className="text-sm font-medium">₩{priceInfo.yesterday.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">최근 7일 평균</span>
                    <span className="text-sm font-medium">₩{priceInfo.weekAvg.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">등급 최고가</span>
                    <span className="text-sm font-medium">₩{priceInfo.gradeMax.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 최저 수락가 설정 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">최저 수락가 설정</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={(() => {
                      if (formData.unitType === 'weight') {
                        return "kg당 최저 수락가";
                      } else {
                        // 포장판매인 경우
                        if (formData.packagingType === 'S/P') {
                          return "S/P당 최저 수락가";
                        } else if (formData.packagingType === 'box') {
                          return "박스당 최저 수락가";
                        } else if (formData.packagingType === '그물망') {
                          return "그물망당 최저 수락가";
                        }
                        return "개당 최저 수락가";
                      }
                    })()}
                    value={formData.unitPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      const formattedValue = value ? Number(value).toLocaleString() : '';
                      setFormData({...formData, unitPrice: formattedValue});
                    }}
                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    원
                  </span>
                </div>
                
                {/* 금액 추가 버튼들 */}
                <div className="flex gap-2 mt-2">
                  {[
                    { label: '+1천원', value: 1000 },
                    { label: '+1만원', value: 10000 },
                    { label: '+5만원', value: 50000 },
                    { label: '+10만원', value: 100000 }
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        const currentValue = Number(formData.unitPrice.replace(/,/g, '')) || 0;
                        const newValue = currentValue + value;
                        setFormData({...formData, unitPrice: newValue.toLocaleString()});
                      }}
                      className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 사진 업로드 */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">사진 업로드</h3>
            <p className="text-xs text-gray-500 mb-4">
              ※ 등록하려는 모든 상품을 촬영하여 업로드해주세요. 구매자가 상품 상태를 정확히 파악할 수 있도록 다양한 각도에서 촬영하는 것을 권장합니다.
            </p>
            
            {/* 업로드된 이미지 표시 */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => {
                        setUploadedImages(uploadedImages.filter(img => img.id !== image.id));
                        URL.revokeObjectURL(image.url);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
                
                {/* 추가 업로드 버튼 */}
                {uploadedImages.length < 6 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 hover:border-blue-400 transition-colors">
                    <label htmlFor="image-upload-add" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-gray-500">추가 업로드</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        const newImages = await Promise.all(files.map(async (file) => {
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              resolve({
                                id: Date.now() + Math.random(),
                                name: file.name,
                                url: reader.result
                              });
                            };
                            reader.readAsDataURL(file);
                          });
                        }));
                        setUploadedImages([...uploadedImages, ...newImages].slice(0, 6));
                      }}
                      className="hidden"
                      id="image-upload-add"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* 초기 업로드 영역 (이미지가 없을 때) */}
            {uploadedImages.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    수산물 이미지를 드래그하여 놓거나 클릭하여 업로드하세요
                  </p>
                  <p className="text-xs text-gray-500 mb-4">JPG, PNG 파일만 업로드 가능합니다(최대 10MB, 최대 6장)</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const newImages = files.map(file => ({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        url: URL.createObjectURL(file)
                      }));
                      setUploadedImages(newImages.slice(0, 6));
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    파일 선택하기
                  </label>
                </div>
              </div>
            )}
            
            {/* 업로드 개수 표시 */}
            {uploadedImages.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {uploadedImages.length}/6 장 업로드됨
              </p>
            )}
          </div>

        </div>

        {/* 하단 버튼 */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex gap-3">
            <button 
              className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={() => {
                setFormData({
                  species: '',
                  searchQuery: '',
                  fishType: 'live',
                  unitType: 'weight',
                  packagingType: 'S/P',
                  sizeUnit: '',
                  specification: '',
                  quantity: '',
                  unitPrice: '',
                  totalPrice: ''
                });
                setUploadedImages([]);
                setSelectedFish(null);
                setSearchResults([]);
                setShowSearchResults(false);
              }}
            >
              취소
            </button>
            <button 
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                // 필수 항목 검증
                const newErrors = {};
                if (!selectedFish) {
                  newErrors.species = '어종을 선택해주세요';
                }
                if (!formData.specification && !formData.sizeUnit) {
                  newErrors.specification = '규격을 입력해주세요';
                }
                if (!formData.quantity) {
                  newErrors.quantity = '수량을 입력해주세요';
                }
                
                setErrors(newErrors);
                
                if (Object.keys(newErrors).length === 0) {
                  setShowConfirmModal(true);
                }
              }}
            >
              등록 신청
            </button>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">등록 정보 확인</h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  {(() => {
                    const fishTypeMap = {
                      'live': '활',
                      'fresh': '선',
                      'frozen': '냉동'
                    };
                    const fishType = fishTypeMap[formData.fishType] || '선';
                    const fishName = selectedFish;
                    const fullFishName = `(${fishType})${fishName}`;
                    
                    if (formData.unitType === 'weight') {
                      // 중량판매
                      const spec = formData.specification;
                      const qty = formData.quantity;
                      return `등록하려는 어종은 ${fullFishName}이고, 마리당 ${spec}kg짜리 ${fishName} ${qty}마리를 경매에 등록합니다.`;
                    } else {
                      // 포장판매
                      const packType = formData.packagingType;
                      const qty = formData.quantity;
                      
                      if (packType === 'S/P') {
                        if (formData.specification) {
                          return `등록하려는 어종은 ${fullFishName}이고, ${formData.specification}미 규격의 S/P ${qty}개를 경매에 등록합니다.`;
                        } else if (formData.sizeUnit) {
                          return `등록하려는 어종은 ${fullFishName}이고, ${formData.sizeUnit} 크기의 S/P ${qty}개를 경매에 등록합니다.`;
                        }
                      } else if (packType === 'box') {
                        if (formData.specification) {
                          return `등록하려는 어종은 ${fullFishName}이고, ${formData.specification}봉 규격의 박스 ${qty}개를 경매에 등록합니다.`;
                        } else if (formData.sizeUnit) {
                          return `등록하려는 어종은 ${fullFishName}이고, ${formData.sizeUnit} 크기의 박스 ${qty}개를 경매에 등록합니다.`;
                        }
                      } else if (packType === '그물망') {
                        return `등록하려는 어종은 ${fullFishName}이고, ${formData.sizeUnit} 크기의 그물망 ${qty}개를 경매에 등록합니다.`;
                      }
                      
                      return `등록하려는 어종은 ${fullFishName}이고, ${packType} ${qty}개를 경매에 등록합니다.`;
                    }
                  })()}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                위 내용이 맞으면 확인을 눌러주세요.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    // 등록 데이터 생성
                    const newRegistration = {
                      id: Date.now().toString(),
                      species: selectedFish,
                      fishType: formData.fishType,
                      unitType: formData.unitType,
                      packagingType: formData.packagingType,
                      specification: formData.specification,
                      sizeUnit: formData.sizeUnit,
                      quantity: formData.quantity,
                      unitPrice: formData.unitPrice,
                      totalPrice: formData.totalPrice,
                      images: uploadedImages,
                      status: 'pending',
                      statusLabel: '검토중',
                      registerDate: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
                      producer: '김철수' // 실제로는 로그인한 사용자 정보
                    };
                    
                    // 로컬 스토리지에 저장
                    const existingData = JSON.parse(localStorage.getItem('fishRegistrations') || '[]');
                    existingData.unshift(newRegistration);
                    localStorage.setItem('fishRegistrations', JSON.stringify(existingData));
                    
                    setShowConfirmModal(false);
                    setTimeout(() => setShowSuccessModal(true), 300);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">등록 완료</h3>
              <p className="text-sm text-gray-600 mb-6">
                수산물이 성공적으로 등록되었습니다.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setFormData({
                    species: '',
                    searchQuery: '',
                    fishType: 'live',
                    unitType: 'weight',
                    packagingType: 'S/P',
                    sizeUnit: '',
                    specification: '',
                    quantity: '',
                    unitPrice: '',
                    totalPrice: ''
                  });
                  setUploadedImages([]);
                  setSelectedFish(null);
                  setSearchResults([]);
                  setShowSearchResults(false);
                  
                  // 등록현황 페이지로 이동
                  if (onRegistrationComplete) {
                    onRegistrationComplete();
                  }
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}