/* ====================================================
   WEDDING INVITATION CONFIGURATION (청첩장 종합 데이터 설정)
   HTML이나 코드를 몰라도 이 파일에서 텍스트만 고치시면 
   청첩장 전체 내용이 자동으로 업데이트됩니다!
==================================================== */
const WEDDING_CONFIG = {
  // 1. 신랑 & 신부 기본 정보
  groom: {
    name: '문의겸',
    relation: '장남',
    father: '문만표',
    mother: '김인희',
    phone: '010-8351-3530',
    quote: '"언제나 곁에서 따뜻하고 든든한 버팀목이 되어주는 사람"'
  },
  bride: {
    name: '김민정',
    relation: '삼녀',
    father: '김광기',
    mother: '김종순',
    phone: '010-5137-8218',
    quote: '"함께하는 모든 날들을 밝은 미소로 채워주는 사랑스러운 사람"'
  },

  // 2. 예식 일시
  wedding: {
    year: 2026,
    month: 11,
    day: 21,
    dayOfWeek: '토요일',
    time: '낮 12시 00분',
    targetDateIso: '2026-11-21T12:00:00'
  },

  // 3. 예식장 장소 정보
  venue: {
    name: '예닮교회 3층 예배당',
    address: '서울특별시 성북구 동소문로 47-23',
    tel: '02-926-0691',
    subway: '4호선 한성대입구역 7번 출구 도보 3분',
    bus: '성북03, 성북05, 100, 104, 107번 한성대입구역 하차',
    parking: '교회 내 주차장 이용 가능'
  },

  // 4. 초대의 글
  greeting: {
    title: '소중한 분들을 초대합니다',
    paragraphs: [
      '서로의 삶에 스며들어<br>하나가 되려 합니다.',
      '함께 걸어온 길을 바탕으로<br>더 따뜻하고 깊은 사랑을 지어가겠습니다.',
      '저희 두 사람이 만드는 새로운 출발의 자리에<br>귀한 걸음으로 축복해 주시면<br>큰 기쁨으로 간직하겠습니다.'
    ]
  },

  // 5. 마음 전하실 곳 (계좌번호 설정)
  accounts: {
    groom: [
      { label: '신랑', holder: '문의겸', bank: '새마을금고', number: '9003-2232-3607-4', payLink: '' },
      { label: '아버지', holder: '문만표', bank: '국민은행', number: '000-00-000000' },
      { label: '어머니', holder: '김인희', bank: '농협은행', number: '000-00-000000' }
    ],
    bride: [
      { label: '신부', holder: '김민정', bank: '카카오뱅크', number: '3333-00-0000000', payLink: '' },
      { label: '아버지', holder: '김광기', bank: '우리은행', number: '1002-000-000000' },
      { label: '어머니', holder: '김종순', bank: '하나은행', number: '000-000000-00000' }
    ]
  },

  // 6. 카카오톡 공유 API 키 (카카오 개발자센터에서 발급받은 JavaScript 키 입력)
  kakaoApiKey: '', // 예: '1234567890abcdef1234567890abcdef'

  // 7. RSVP 구글 스크립트 연결 URL
  rsvp: {
    googleScriptUrl: 'https://script.google.com/macros/s/AKfycbxTzQ6POmpQOfdCsrwtEz_gwUlhBOw2G7Adu7DwC0Mg8BJo4wN-Gs6svLB4WXOd2Tdq8A/exec'
  },

  // 8. 갤러리 사진 목록 (images/gallery/ 폴더 안의 파일명을 자유롭게 추가/삭제하세요)
  galleryImages: [
    './images/gallery/1.jpg',
    './images/gallery/2.jpg',
    './images/gallery/3.jpg',
    './images/gallery/4.jpg',
    './images/gallery/5.jpg',
    './images/gallery/6.jpg',
    './images/gallery/7.jpg',
    './images/gallery/8.jpg',
    './images/gallery/9.jpg',
    './images/gallery/10.jpg',
    './images/gallery/11.jpg',
    './images/gallery/12.jpg',
    './images/gallery/13.jpg',
    './images/gallery/14.jpg',
    './images/gallery/15.jpg',
    './images/gallery/16.jpg',
    './images/gallery/17.jpg',
    './images/gallery/18.jpg',
    './images/gallery/19.jpg',
    './images/gallery/20.jpg',
    './images/gallery/21.jpg',
    './images/gallery/22.jpg',
    './images/gallery/23.jpg'
  ]
};
