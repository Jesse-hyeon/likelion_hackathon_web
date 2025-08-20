'use client';

import { useState } from 'react';
import { 
  Fish, Camera, Shield, Gavel, Truck, CheckCircle2,
  ArrowRight, Clock, Smartphone, FileCheck, CreditCard,
  AlertCircle, TrendingUp, Users, Zap, ChevronDown,
  Building2, Package, UserCheck
} from 'lucide-react';

export default function ProcessPage() {
  const [activeStep, setActiveStep] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const digitalProcess = [
    {
      step: 1,
      title: '어획물 촬영·등록',
      icon: Fish,
      duration: '3분',
      description: '현장에서 촬영한 어획물 사진과 기본 정보를 입력해 온라인 경매에 손쉽게 등록하세요',
      details: [
        '스마트폰으로 현장 사진 촬영',
        '어종, 중량, 어획지 간편 입력',
        '등록 즉시 품질 검사 진행',
        '예상 가격 범위 자동 산출'
      ],
      role: 'fisherman'
    },
    {
      step: 2,
      title: 'AI 품질 검사',
      icon: Camera,
      duration: '즉시',
      description: '등록된 어획물은 AI가 자동으로 품질을 검사하고 등급을 판정합니다',
      details: [
        '사진 기반 신선도 자동 분석',
        '크기 및 중량 자동 측정',
        '품질 등급 자동 판정 (특상/상/중)',
        '시장 가격 기반 예상가 제시'
      ],
      role: 'system'
    },
    {
      step: 3,
      title: '자동 등록 & 경매 진행',
      icon: Gavel,
      duration: '10분',
      description: '품질 검사를 통과한 상품은 온라인 경매장에 자동으로 올라가며, 지정된 시간에 경매가 시작됩니다',
      details: [
        '검사 통과 즉시 경매장 자동 등록',
        '실시간 모바일 입찰 진행',
        '입찰 현황 실시간 업데이트',
        '최고가 자동 낙찰 처리'
      ],
      role: 'system'
    },
    {
      step: 4,
      title: '낙찰·정산·수령',
      icon: CheckCircle2,
      duration: '당일',
      description: '경매 종료 후 최고가로 낙찰된 상품은 자동 정산이 이루어지고, 수령까지 한번에 처리됩니다',
      details: [
        '낙찰 즉시 구매자/판매자 알림',
        '자동 정산 및 대금 이체',
        'QR코드 발급으로 간편 수령',
        '수령 완료 시 거래 자동 종료'
      ],
      role: 'system'
    }
  ];

  const traditionalVsDigital = [
    {
      category: '등록 시간',
      traditional: '30분~1시간 (현장 대기)',
      digital: '3분 (모바일)',
      improvement: '90% 단축'
    },
    {
      category: '품질 검사',
      traditional: '수동 육안 검사',
      digital: 'AI 자동 분석',
      improvement: '정확도 95%'
    },
    {
      category: '경매 참여',
      traditional: '현장 출석 필수',
      digital: '어디서나 모바일',
      improvement: '24시간 가능'
    },
    {
      category: '입찰 방식',
      traditional: '수기 또는 구두',
      digital: '원터치 입찰',
      improvement: '실시간 자동'
    },
    {
      category: '결제 처리',
      traditional: '현금/수표 위주',
      digital: '다양한 전자결제',
      improvement: '즉시 처리'
    },
    {
      category: '정산 시간',
      traditional: '2~3일 소요',
      digital: '당일 자동 정산',
      improvement: '95% 단축'
    }
  ];

  const roleColors = {
    fisherman: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    admin: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    buyer: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    system: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' }
  };

  const getRoleLabel = (role) => {
    const labels = {
      fisherman: '어민/생산자',
      admin: '위판장 관리자',
      buyer: '중도매인',
      system: '자동 시스템'
    };
    return labels[role];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">어울림</span>
              </a>
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                BETA
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm text-gray-600 hover:text-gray-900">홈</a>
              <a href="/process" className="text-sm text-blue-600 font-medium">경매 프로세스</a>
              <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                시작하기
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            단 15분만에 완료되는<br />
            스마트 수산물 경매
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            복잡했던 전통 경매를 디지털로 혁신했습니다
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">4단계</div>
              <div className="text-sm text-blue-100">간소화된 프로세스</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">언제든 참여</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-blue-100">모바일 지원</div>
            </div>
          </div>
        </div>
      </section>

      {/* 프로세스 타임라인 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              어울림 경매 프로세스
            </h2>
            <p className="text-lg text-gray-600">
              등록부터 수령까지, 모든 과정이 디지털로 간편해집니다
            </p>
          </div>

          <div className="relative">
            {/* 타임라인 라인 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

            {/* 프로세스 단계 */}
            <div className="space-y-8">
              {digitalProcess.map((process, index) => {
                const Icon = process.icon;
                const colors = roleColors[process.role];
                const isActive = activeStep === index;

                return (
                  <div key={index} className="relative flex items-start gap-6">
                    {/* 아이콘 */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}>
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-700 border-2 border-gray-300">
                        {process.step}
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1">
                      <div 
                        className={`bg-white rounded-xl border-2 ${isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200'} p-6 cursor-pointer transition-all`}
                        onClick={() => setActiveStep(isActive ? null : index)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{process.title}</h3>
                            <span className={`inline-block px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded mt-2`}>
                              {getRoleLabel(process.role)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{process.duration}</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{process.description}</p>
                        
                        {isActive && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                              {process.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-gray-700">{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 총 소요시간 */}
            <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">총 15분 이내 완료</div>
                  <div className="text-blue-700">등록부터 낙찰까지 초스피드 처리</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 비교 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              전통 경매 vs 디지털 경매
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              어울림이 만드는 차이를 확인하세요
            </p>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {showComparison ? '비교표 닫기' : '상세 비교 보기'}
            </button>
          </div>

          {showComparison && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">구분</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        전통 경매
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        어울림 디지털 경매
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">개선 효과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {traditionalVsDigital.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        <span className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded">
                          {item.traditional}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded">
                          {item.digital}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded font-medium">
                          <TrendingUp className="w-4 h-4" />
                          {item.improvement}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 주요 이점 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 어울림인가?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fish className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">어민을 위한</h3>
              <p className="text-gray-600">
                현장에서 바로 스마트폰으로 등록. 
                복잡한 서류 작업 없이 3분이면 충분합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">중도매인을 위한</h3>
              <p className="text-gray-600">
                새벽 위판장 출근은 이제 그만. 
                침대에서도 모바일로 입찰 참여가 가능합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">위판장을 위한</h3>
              <p className="text-gray-600">
                모든 거래가 자동으로 기록되고 정산됩니다. 
                투명하고 효율적인 위판장 운영이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 경험해보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            복잡한 가입 절차 없이 바로 체험 가능합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium text-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2"
            >
              무료 체험 시작하기
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#"
              className="px-8 py-4 bg-blue-700 text-white rounded-xl font-medium text-lg hover:bg-blue-800 transition-all"
            >
              프로세스 가이드 다운로드
            </a>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">어울림</span>
            </div>
            <p className="text-gray-400 mb-4">
              수산물 경매의 디지털 혁신
            </p>
            <p className="text-sm text-gray-500">
              © 2025 포항죽도위판장. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}