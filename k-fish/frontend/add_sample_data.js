// 브라우저 콘솔에서 실행할 샘플 데이터 추가 스크립트
// 
// 사용 방법:
// 1. 브라우저에서 http://localhost:3000/dashboard/fisherman 열기
// 2. F12를 눌러 개발자 도구 열기
// 3. Console 탭 클릭
// 4. 아래 코드 전체를 복사하여 콘솔에 붙여넣고 Enter
//

const sampleData = [
  {
    id: Date.now() + 1,
    species: '광어',
    fishType: 'live',
    unitType: 'weight',
    specification: '2',
    quantity: '10',
    packagingType: null,
    unitPrice: '35000',
    catchDate: '2025.08.18',
    catchLocation: '제주도',
    producer: '김철수',
    status: 'approved',
    statusLabel: '승인완료',
    registerDate: '2025.08.18'
  },
  {
    id: Date.now() + 2,
    species: '고등어',
    fishType: 'frozen',
    unitType: 'box',
    specification: null,
    quantity: '20',
    packagingType: '박스',
    unitPrice: '15000',
    catchDate: '2025.08.17',
    catchLocation: '부산',
    producer: '김철수',
    status: 'approved',
    statusLabel: '승인완료',
    registerDate: '2025.08.18'
  },
  {
    id: Date.now() + 3,
    species: '갈치',
    fishType: 'fresh',
    unitType: 'weight',
    specification: '0.5',
    quantity: '30',
    packagingType: null,
    unitPrice: '25000',
    catchDate: '2025.08.18',
    catchLocation: '포항',
    producer: '김철수',
    status: 'pending',
    statusLabel: '검토중',
    registerDate: '2025.08.18'
  },
  {
    id: Date.now() + 4,
    species: '참돔',
    fishType: 'live',
    unitType: 'weight',
    specification: '1.5',
    quantity: '15',
    packagingType: null,
    unitPrice: '45000',
    catchDate: '2025.08.17',
    catchLocation: '통영',
    producer: '김철수',
    status: 'approved',
    statusLabel: '승인완료',
    registerDate: '2025.08.17'
  },
  {
    id: Date.now() + 5,
    species: '오징어',
    fishType: 'fresh',
    unitType: 'box',
    specification: null,
    quantity: '10',
    packagingType: 'S/P',
    unitPrice: '18000',
    catchDate: '2025.08.18',
    catchLocation: '울릉도',
    producer: '김철수',
    status: 'pending',
    statusLabel: '검토중',
    registerDate: '2025.08.18'
  },
  {
    id: Date.now() + 6,
    species: '전어',
    fishType: 'fresh',
    unitType: 'box',
    specification: null,
    quantity: '25',
    packagingType: '박스',
    unitPrice: '12000',
    catchDate: '2025.08.18',
    catchLocation: '여수',
    producer: '김철수',
    status: 'rejected',
    statusLabel: '승인거부',
    registerDate: '2025.08.17'
  },
  {
    id: Date.now() + 7,
    species: '대게',
    fishType: 'live',
    unitType: 'weight',
    specification: '1',
    quantity: '8',
    packagingType: null,
    unitPrice: '55000',
    catchDate: '2025.08.18',
    catchLocation: '동해',
    producer: '김철수',
    status: 'approved',
    statusLabel: '승인완료',
    registerDate: '2025.08.18'
  },
  {
    id: Date.now() + 8,
    species: '꽃게',
    fishType: 'live',
    unitType: 'box',
    specification: null,
    quantity: '12',
    packagingType: '박스',
    unitPrice: '22000',
    catchDate: '2025.08.17',
    catchLocation: '태안',
    producer: '김철수',
    status: 'pending',
    statusLabel: '검토중',
    registerDate: '2025.08.17'
  },
  {
    id: Date.now() + 9,
    species: '도미',
    fishType: 'live',
    unitType: 'weight',
    specification: '1.2',
    quantity: '20',
    packagingType: null,
    unitPrice: '28000',
    catchDate: '2025.08.18',
    catchLocation: '여수',
    producer: '김철수',
    status: 'approved',
    statusLabel: '승인완료',
    registerDate: '2025.08.18'
  },
  {
    id: Date.now() + 10,
    species: '방어',
    fishType: 'fresh',
    unitType: 'weight',
    specification: '3',
    quantity: '5',
    packagingType: null,
    unitPrice: '65000',
    catchDate: '2025.08.17',
    catchLocation: '제주도',
    producer: '김철수',
    status: 'approved',
    statusLabel: '승인완료',
    registerDate: '2025.08.17'
  }
];

// localStorage에 저장
localStorage.setItem('fishRegistrations', JSON.stringify(sampleData));

console.log('%c✅ 샘플 데이터 추가 완료!', 'color: green; font-size: 16px; font-weight: bold');
console.log(`총 ${sampleData.length}개의 데이터가 추가되었습니다:`);
console.log(`- 승인완료: ${sampleData.filter(d => d.status === 'approved').length}개`);
console.log(`- 검토중: ${sampleData.filter(d => d.status === 'pending').length}개`);
console.log(`- 승인거부: ${sampleData.filter(d => d.status === 'rejected').length}개`);
console.log('');
console.log('페이지를 새로고침하면 데이터를 확인할 수 있습니다.');

// 자동 새로고침 (원하지 않으면 이 줄을 제거)
setTimeout(() => {
  location.reload();
}, 1000);