'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Building2, ArrowLeft, Check, MapPin } from 'lucide-react';

export default function AdminSignupPage() {
  const router = useRouter();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const setCurrentMode = useStore((state) => state.setCurrentMode);
  
  const [formData, setFormData] = useState({
    marketRegion: '',
    adminName: ''
  });
  
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const regions = {
    '경상도': [
      { value: 'pohang_jukdo', name: '포항 죽도시장', city: '포항' },
      { value: 'pohang_guryongpo', name: '포항 구룡포', city: '포항' },
      { value: 'busan_jagalchi', name: '부산 자갈치시장', city: '부산' },
      { value: 'busan_gijang', name: '부산 기장', city: '부산' },
      { value: 'tongyeong', name: '통영 중앙시장', city: '통영' },
      { value: 'geoje', name: '거제 외포항', city: '거제' },
      { value: 'ulsan', name: '울산 울진', city: '울산' }
    ],
    '전라도': [
      { value: 'yeosu', name: '여수 수산시장', city: '여수' },
      { value: 'wando', name: '완도 수산시장', city: '완도' },
      { value: 'mokpo', name: '목포 종합수산시장', city: '목포' },
      { value: 'gunsan', name: '군산 수산시장', city: '군산' }
    ],
    '강원도': [
      { value: 'sokcho', name: '속초 관광수산시장', city: '속초' },
      { value: 'gangneung', name: '강릉 주문진', city: '강릉' },
      { value: 'donghae', name: '동해 묵호항', city: '동해' },
      { value: 'samcheok', name: '삼척 정라항', city: '삼척' }
    ],
    '충청도': [
      { value: 'taean', name: '태안 안흥항', city: '태안' },
      { value: 'boryeong', name: '보령 대천항', city: '보령' },
      { value: 'seosan', name: '서산 간월도', city: '서산' }
    ],
    '제주도': [
      { value: 'jeju_dongmun', name: '제주 동문시장', city: '제주' },
      { value: 'jeju_seogwipo', name: '서귀포 올레시장', city: '서귀포' },
      { value: 'jeju_hanrim', name: '제주 한림항', city: '제주' }
    ],
    '경기/인천': [
      { value: 'incheon', name: '인천 종합어시장', city: '인천' },
      { value: 'ansan', name: '안산 대부도', city: '안산' }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 회원가입 처리 (실제로는 API 호출)
    setCurrentUser({
      id: 'admin_' + Date.now(),
      email: 'admin@oullim.kr',
      name: formData.adminName,
      userType: 'admin',
      companyName: formData.marketRegion
    });
    setCurrentMode('admin');
    
    // 대시보드로 이동
    router.push('/dashboard/admin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">위판장 관리자 회원가입</h1>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">어울림</span>
          </div>
        </div>
      </header>

      {/* 폼 컨테이너 */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">위판장 정보 입력</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 위판장 선택 섹션 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  위판장 지역 선택 *
                </label>
                
                {/* 지역 탭 */}
                <div className="flex flex-wrap gap-2 mb-6 border-b">
                  {Object.keys(regions).map(region => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => setSelectedRegion(region)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        selectedRegion === region
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
                
                {/* 위판장 카드 그리드 */}
                {selectedRegion && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {regions[selectedRegion].map(market => (
                      <button
                        key={market.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, marketRegion: market.value }))}
                        className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          formData.marketRegion === market.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className={`w-4 h-4 mt-0.5 ${
                            formData.marketRegion === market.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="text-left">
                            <div className={`font-medium ${
                              formData.marketRegion === market.value ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {market.name}
                            </div>
                            <div className="text-xs text-gray-500">{market.city}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {!selectedRegion && (
                  <div className="text-center py-8 text-gray-500">
                    위 지역 탭을 선택하여 위판장을 선택해주세요
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관리자명 *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="예: 홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </section>

          {/* 제출 버튼 */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              회원가입 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}