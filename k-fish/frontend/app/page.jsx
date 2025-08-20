'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Building2, Users, Fish, CheckCircle, Globe, Bot, FileSpreadsheet, Timer, BarChart3, Users2, X, Mail } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const setCurrentMode = useStore((state) => state.setCurrentMode);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const userModes = [
    {
      type: 'admin',
      title: '위판장 관리자',
      subtitle: '포항죽도시장',
      icon: Building2,
      path: '/dashboard/admin',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      type: 'buyer',
      title: '구매업체',
      subtitle: '도매/소매업체',
      icon: Users,
      path: '/dashboard/buyer',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      type: 'fisherman',
      title: '어민/생산자',
      subtitle: '포항지역 어민',
      icon: Fish,
      path: '/dashboard/fisherman',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const loginCredentials = {
    admin: { email: 'admin@pohang-market.kr', name: '김위판', id: 'admin1', companyName: '포항죽도위판장' },
    buyer: { email: 'purchase@busan.co.kr', name: '부산수산', id: 'buyer1', companyName: '부산수산' },
    fisherman: { email: 'captain@fishing.kr', name: '김철수', id: 'fisher1', companyName: '대게잡이 1호' }
  };

  const handleLogin = (mode, path) => {
    setSelectedUserType({ mode, path });
    setShowLoginModal(true);
  };

  const handleGoogleLogin = async () => {
    // 구글 로그인 처리 (실제로는 OAuth 인증 필요)
    const credentials = loginCredentials[selectedUserType.mode];
    
    setCurrentUser({
      id: credentials.id,
      email: credentials.email,
      name: credentials.name,
      userType: selectedUserType.mode,
      companyName: credentials.companyName
    });
    setCurrentMode(selectedUserType.mode);
    setShowLoginModal(false);
    router.push(selectedUserType.path);
  };

  return (
    <div className="min-h-screen relative bg-white">
      {/* 전체 그라데이션 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full filter blur-3xl opacity-20"></div>
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-blue-200 to-sky-200 rounded-full filter blur-3xl opacity-20"></div>
      
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b px-6 py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            어울림
          </button>
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('intro')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              서비스 소개
            </button>
            <button 
              onClick={() => scrollToSection('process')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              이용 방법
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              주요 기능
            </button>
          </nav>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            통합 로그인
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="pt-8 relative z-10">
        {/* 히어로 섹션 */}
        <section className="min-h-screen flex items-center justify-center px-6 relative">
          {/* 그라데이션 배경 제거 - 전체 배경과 통합 */}
          
          <div className="w-full max-w-4xl text-center relative z-10">
            {/* 서브 타이틀 */}
            <div className="text-blue-600 font-medium mb-4">수산물 유통의 새로운 기준</div>
            
            {/* 타이틀 섹션 */}
            <div className="mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                투명하고 신속한<br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">온라인 경매 플랫폼</span>, 어울림
              </h1>
              <p className="text-xl text-gray-600">
                생산자, 중도매인, 위판장을 하나로 연결하여 수산물 경매의 모든 과정을 디지털로 전환합니다.<br />
                어민과 중도매인 모두 신뢰할 수 있는 온라인 경매 시스템을 경험하세요.
              </p>
            </div>

            {/* 사용자 선택 카드 */}
            <div id="guide" className="grid md:grid-cols-3 gap-8">
              {userModes.map((mode) => {
                const Icon = mode.icon;
                
                return (
                  <div
                    key={mode.type}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleLogin(mode.type, mode.path)}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{mode.title}</h3>
                    <p className="text-gray-600">{mode.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 서비스 소개 섹션 */}
        <section id="intro" className="py-12 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                어울림이 만드는 변화
              </h2>
              <p className="text-lg text-gray-600">
                복잡하고 번거로웠던 수산물 경매, 이제 어울림으로 스마트하게 해결하세요.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  기존 경매의 문제점
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs">1</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">현장 참여 필수</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">새벽 시간 위판장 직접 방문 필요</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs">2</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">불투명한 가격 형성 과정</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">누가 얼마에 입찰하는지 알 수 없어 답답하고 불리한 경매</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs">3</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">시세 정보 부족</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">이전 거래 내역이나 평균 단가를 확인하기 어려움</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs">4</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">복잡한 정산 과정</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">거래내역 수기작성으로 관리 어려움</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  어울림의 해결 방안
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs">1</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">편리한 온라인 경매</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">언제 어디서나 온라인으로 입찰 가능</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs">2</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">신뢰할 수 있는 가격 정보</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">실시간 입찰 현황과 낙찰가 공개</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs">3</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">합리적인 입찰 기준 제시</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">과거 낙찰가, 평균가를 참고해 합리적 입찰 가능</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs">4</span>
                    </div>
                    <div className="flex-1 text-left">
                      <strong className="text-gray-900 block mb-1">수기 작성 없는 거래내역</strong>
                      <p className="text-gray-600 text-sm leading-relaxed">거래내역 자동 저장과 엑셀 추출로 편리한 관리</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 간편해진 경매 프로세스 섹션 */}
        <section id="process" className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                간편해진 경매 프로세스
              </h2>
              <p className="text-lg text-gray-600">
                단 4단계로 끝나는 어울림의 스마트 경매 과정을 경험해보세요.
              </p>
            </div>
            
            <div className="relative max-w-6xl mx-auto">
              {/* 점선 연결선 */}
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-5/6 hidden lg:block">
                <div className="border-t-2 border-dashed border-blue-300"></div>
              </div>
              
              {/* 프로세스 단계 */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 relative z-10 shadow-lg">
                    1
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">어획물 촬영 · 등록</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    현장에서 촬영한 어획물 사진과 기본 정보를 입력해 온라인 경매에 손쉽게 등록하세요.
                  </p>
                </div>
                
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 relative z-10 shadow-lg">
                    2
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">AI 품질 검사</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    등록된 어획물은 AI가 자동으로 품질을 검사하고 등급을 판정합니다.
                  </p>
                </div>
                
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 relative z-10 shadow-lg">
                    3
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">자동 등록 & 경매 진행</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    품질 검사를 통과한 상품은 온라인 경매장에 자동으로 올라가며, 지정된 시간에 경매가 시작됩니다.
                  </p>
                </div>
                
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 relative z-10 shadow-lg">
                    4
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">낙찰 · 수령</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    경매 종료 후 최고가로 낙찰된 상품은 위판장에서 안전하게 전달받을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 기능 섹션 */}
        <section id="features" className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                주요 기능
              </h2>
              <p className="text-lg text-gray-600">
                스마트 기술로 수산물 경매의 기준을 새롭게 제시합니다.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* 첫 번째 행 - 3개 */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">온라인 경매</h3>
                <p className="text-gray-600">
                  온라인으로 실시간 입찰 참여 및 낙찰 확인
                </p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI 품질 검사</h3>
                <p className="text-gray-600">
                  인공지능 기반 자동 등급 판정 시스템
                </p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">거래 내역 관리</h3>
                <p className="text-gray-600">
                  모든 거래 내역 자동 저장 및 엑셀파일로 추출
                </p>
              </div>
              
              {/* 두 번째 행 - 2개 중앙 정렬 */}
              <div className="bg-white p-6 rounded-xl md:col-start-1 lg:col-start-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">데이터 분석</h3>
                <p className="text-gray-600">
                  과거 낙찰 데이터를 기반으로 평균가, 최고가 등 시세 정보 제공
                </p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">통합 관리</h3>
                <p className="text-gray-600">
                  어민, 중도매인, 위판장 통합 관리 시스템
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-16 text-center shadow-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                지금 바로 시작하세요
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                어울림의 온라인 수산물 경매 플랫폼으로 더 투명하고 효율적인 거래를 경험하세요. 
                지금 바로 회원가입하고 스마트한 경매에 참여해보세요.
              </p>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                회원가입
              </button>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-8 px-6 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* 회사 정보 */}
              <div>
                <h3 className="text-2xl font-bold mb-4">어울림</h3>
                <p className="text-gray-400 mb-4">
                  온라인 수산물 경매 플랫폼
                </p>
                <p className="text-sm text-gray-500">
                  어민과 중도매인을 연결하는 투명한 경매 시스템
                </p>
              </div>
              
              {/* 연락처 */}
              <div>
                <h4 className="font-semibold mb-4">문의</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>전화: 010-5833-0151</li>
                  <li>이메일: rejames01@handong.ac.kr</li>
                  <li>주소: 경상북도 포항시 북구 흥해읍 한동로 558</li>
                </ul>
              </div>
            </div>
            
            {/* 하단 구분선 */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  © 2025 어울림. All rights reserved.
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <button className="text-sm text-gray-500 hover:text-white transition-colors">
                    이용약관
                  </button>
                  <button className="text-sm text-gray-500 hover:text-white transition-colors">
                    개인정보처리방침
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">어울림 로그인</h2>
              <p className="text-gray-600">
                {selectedUserType ? 
                  `${userModes.find(m => m.type === selectedUserType.mode)?.title}로 로그인` : 
                  '계정에 로그인하세요'
                }
              </p>
            </div>

            {/* 구글 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Google로 계속하기</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 이메일 로그인 폼 */}
            <form onSubmit={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <button 
                  onClick={() => {
                    if (selectedUserType) {
                      // 각 사용자 타입별 회원가입 페이지로 이동
                      const signupPaths = {
                        admin: '/signup/admin',
                        buyer: '/signup/buyer', 
                        fisherman: '/signup/fisherman'
                      };
                      setShowLoginModal(false);
                      router.push(signupPaths[selectedUserType.mode]);
                    }
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}