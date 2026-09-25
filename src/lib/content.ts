/* ─── 사이트 전체 콘텐츠 관리 파일 ────────────────────────────
   CLAUDE.md 2장: 대표님이 코드 몰라도 문구만 고칠 수 있게 분리
   [대표님 확인] 표시 항목은 실제 정보로 교체 필요
──────────────────────────────────────────────────────────── */

/* ── 회사 기본 정보 ──────────────────────────────────────── */
export const siteConfig = {
  name: "(주)153시온건축사사무소",
  nameShort: "153시온건축사사무소",
  ceo: "김승호",
  address: "경기도 안성시 보개원삼로 166",
  phone: "031-673-0153",
  fax: "031-673-0154",
  email: "zion15321@hanmail.net",
  businessNumber: "803-81-03569",
  corporateNumber: "134611-0142286",
  /** [대표님 확인] 건축사사무소 등록번호 */
  licenseNumber: "경기-0000",
  businessHours: "평일 09:00 – 18:00",
} as const;

/* ── 메인 페이지 히어로 섹션 ─────────────────────────────── */
export const heroContent = {
  headline: "짓기 전에,\n막히지 않게.",
  subheadline:
    "공장·창고부터 교회, 주택까지. 안성에서 인허가와 사용승인을 끝까지 책임지는 (주)153시온건축사사무소입니다.",
  ctaPrimary: { label: "우리 땅 무료로 검토받기", href: "/contact" },
  ctaSecondary: { label: `${siteConfig.phone} 전화 상담`, href: `tel:${siteConfig.phone}` },
  label: "Architecture · Supervision · Permit",
  /** 히어로 슬라이드 이미지 (5장 이미지 가이드 참고) */
  slides: [
    { src: "/images/placeholder/hero-01-factory.jpg", alt: "판넬 공장 외관 — 해 질 녘" },
    { src: "/images/placeholder/hero-02-warehouse.jpg", alt: "대형 창고 — 흐린 날 은은한 빛" },
    { src: "/images/placeholder/hero-03-church.jpg", alt: "소도시 교회 — 저녁 조명" },
  ],
} as const;

/* ── 문제 제기 섹션 ──────────────────────────────────────── */
export const problemContent = {
  title: "건축주님, 혹시 이런 걱정 하고 계신가요?",
  cards: [
    {
      icon: "🏗️",
      text: "이 땅에 공장을 지을 수 있는지 모르겠다",
    },
    {
      icon: "🚧",
      text: "진입로·지목 때문에 허가가 안 난다고 한다",
    },
    {
      icon: "📋",
      text: "다 지었는데 사용승인이 안 나올까 봐 불안하다",
    },
    {
      icon: "💸",
      text: "설계비만 보고 맡겼다가 공사 중에 계속 바뀐다",
    },
  ],
  closing: "이 문제들의 대부분은 설계 전 검토 단계에서 막을 수 있습니다.",
} as const;

/* ── 스토리(에피파니) 섹션 ───────────────────────────────── */
export const storyContent = {
  /** [대표님 확인] 실제 익명화 사례 1개로 교체 */
  story: `한 건축주님이 계셨습니다.
이미 다른 곳에서 설계를 마쳤는데, 인허가 단계에서 진입로 문제로 막혀버렸습니다.
저희가 부지 조건부터 다시 검토해 개발행위허가 방향을 바꿨고,
결국 ○개월 만에 허가와 사용승인까지 마쳤습니다.`,
  closing: "그래서 저희는 도면보다 땅과 법규부터 봅니다.",
  cta: { label: "저희 이야기 더 보기 →", href: "/about" },
} as const;

/* ── 분야(서비스) 섹션 ───────────────────────────────────── */
export const servicesContent = {
  title: "저희가 가장 잘하는 일",
  items: [
    {
      id: "factory",
      label: "01 — INDUSTRIAL",
      title: "공장 · 창고",
      description: "판넬 건물, 인허가부터 준공까지",
      image: "/images/placeholder/service-industrial.jpg",
      alt: "공장 철골 구조",
      href: "/contact?type=factory",
    },
    {
      id: "neighborhood",
      label: "02 — COMMERCIAL",
      title: "근린생활시설",
      description: "소규모 상가·사무소, 용도변경 포함",
      image: "/images/placeholder/service-neighborhood.jpg",
      alt: "소규모 근린생활시설",
      href: "/contact?type=neighborhood",
    },
    {
      id: "church",
      label: "03 — CHURCH",
      title: "교회",
      description: "공동체가 오래 머무는 공간",
      image: "/images/placeholder/service-church.jpg",
      alt: "교회 예배당 내부",
      href: "/contact?type=church",
    },
    {
      id: "house",
      label: "04 — RESIDENTIAL",
      title: "주택 · 모듈러하우스",
      description: "합리적인 비용의 전원 주택",
      image: "/images/placeholder/service-house.jpg",
      alt: "전원 단독주택",
      href: "/contact?type=house",
    },
    {
      id: "interior",
      label: "05 — PUBLIC",
      title: "관급 실내건축 설계",
      description: "공공 공간 리모델링",
      image: "/images/placeholder/service-interior.jpg",
      alt: "공공기관 리모델링 실내",
      href: "/contact?type=interior",
    },
    {
      id: "supervision",
      label: "06 — SUPERVISION",
      title: "감리 · 사용승인 대행",
      description: "짓는 과정과 마무리까지",
      image: "/images/placeholder/service-supervision.jpg",
      alt: "감리자 현장 도면 검토",
      href: "/contact?type=supervision",
    },
  ],
} as const;

/* ── 프로세스 섹션 ───────────────────────────────────────── */
export const processContent = {
  title: "저희와 함께하는 과정",
  steps: [
    {
      number: "01",
      title: "무료 부지검토",
      description: "토지이용계획, 진입로, 지목, 개발행위 허가 가능 여부 사전 확인",
      badge: "무료",
    },
    {
      number: "02",
      title: "계획·설계",
      description: "건축주님의 요구사항과 법규를 반영한 기본설계·실시설계",
      badge: undefined,
    },
    {
      number: "03",
      title: "인허가",
      description: "건축허가·개발행위허가·관련 인허가 신청 및 진행",
      badge: undefined,
    },
    {
      number: "04",
      title: "감리",
      description: "착공부터 준공까지 설계 의도대로 시공되는지 확인",
      badge: undefined,
    },
    {
      number: "05",
      title: "사용승인",
      description: "사용승인 신청 및 업무대행까지 끝까지 책임",
      badge: undefined,
    },
  ],
} as const;

/* ── 숫자 증거 섹션 ──────────────────────────────────────── */
export const statsContent = {
  /** [대표님 확인] 실제 수치로 교체 */
  items: [
    { value: 0, suffix: "+", label: "누적 설계 건수", note: "[대표님 확인]" },
    { value: 0, suffix: "+", label: "공장·창고 수행", note: "[대표님 확인]" },
    { value: 0, suffix: "개", label: "교회 설계", note: "[대표님 확인]" },
    { value: 0, suffix: "년+", label: "설계 경력", note: "[대표님 확인]" },
  ],
} as const;

/* ── 리드 마그넷 섹션 ────────────────────────────────────── */
export const leadMagnetContent = {
  title: "공장·창고 짓기 전, 꼭 확인해야 할 체크리스트",
  description:
    "인허가에서 자주 막히는 항목을 한 장에 정리했습니다. 지번만 알아도 바로 활용할 수 있습니다.",
  ctaLabel: "체크리스트 무료로 받기",
  /** [대표님 확인] 실제 PDF 파일 경로 */
  pdfPath: "/downloads/factory-checklist.pdf",
} as const;

/* ── 메인 제안(CTA) 섹션 ─────────────────────────────────── */
export const offerContent = {
  headline: "이 땅에, 무엇을 지을 수 있을까요?",
  subheadline:
    "지번만 알려주시면 건축 가능 여부와 주의할 점을 먼저 검토해 드립니다. 비용은 받지 않습니다.",
  bullets: [
    "토지이용계획 확인",
    "진입로·지목·개발행위허가 필요 여부 검토",
    "예상 인허가 절차와 기간 안내",
    "대표 건축사 직접 상담",
  ],
  ctaPrimary: { label: "무료 부지검토 신청하기", href: "/contact" },
  ctaPhone: { label: `전화 ${siteConfig.phone}`, href: `tel:${siteConfig.phone}` },
  /** [대표님 확인] 사실일 때만 사용 */
  scarcityNote:
    "소규모 사무소라 한 달에 검토 가능한 건수가 정해져 있습니다.",
  backgroundImage: "/images/placeholder/cta-land.jpg",
} as const;

/* ── 기업소개 페이지 ─────────────────────────────────────── */
export const aboutContent = {
  heroTitle: "크게 보이는 것보다,\n끝까지 책임지는 것",
  ceoMessage: `안녕하세요. (주)153시온건축사사무소 대표 건축사 김승호입니다.

2021년 3월, 코로나로 세상이 온통 멈춰있던 때에 저는 오히려 새로운 문을 열었습니다. 오랜 직장생활을 뒤로하고, 또 다른 인생을 시작해보고 싶어 모험하듯 개업을 결심했습니다.

그렇게 여러 건축주님을 만나며 지금까지도 마음에 걸리는 부분이 하나 있습니다. 건축주님들은 대부분 건축이 처음이시다 보니, 지금 내 건물이 어디쯤 진행되고 있는지, 지금 이게 맞게 가고 있는 건지 알기가 어렵습니다. 도면을 실무자처럼 볼 줄 아는 분은 많지 않으니까요. 솔직히 말씀드리면, 이 막막함을 아직 완전히 풀어드리지는 못했습니다. 지금도 어떻게 하면 건축주님이 더 편하게, 더 잘 이해하시면서 함께 지어갈 수 있을지 계속 고민하고 있습니다.

그래서 저는 도면보다 먼저 건축주님의 이야기를 듣고, 땅과 법규부터 살피는 것을 원칙으로 삼고 있습니다. 완벽한 답을 드리기보다, 끝까지 함께 걸어가는 건축사가 되겠습니다.

(주)153시온건축사사무소
대표 건축사 김승호 드림`,
  /** [대표님 확인] 사명 "153"의 의미와 유래 스토리 */
  nameMeaning: "[대표님 확인: 사명 '153'의 의미와 창업 스토리]",
  principles: [
    {
      title: "땅부터 봅니다",
      description: "설계보다 먼저 법규와 부지 조건을 검토합니다.",
    },
    {
      title: "건축주님 언어로 설명합니다",
      description: "어려운 용어는 괄호 안에 풀어서 함께 결정합니다.",
    },
    {
      title: "사용승인까지 갑니다",
      description: "도면 납품으로 끝내지 않고 준공까지 함께합니다.",
    },
    {
      title: "지역을 압니다",
      description: "안성·평택·용인 등 경기 남부 인허가 경험을 갖습니다.",
    },
  ],
  /** [대표님 확인] 추가 연혁이 있다면 이어서 추가 */
  history: [
    { year: "2021.03", event: "(주)153시온건축사사무소 개업" },
  ],
} as const;

/* ── 문의하기 페이지 ─────────────────────────────────────── */
export const contactContent = {
  title: "무엇을 지으려고 하시나요?",
  reassurance:
    "상담은 무료이며, 계약을 강요하지 않습니다. 접수 후 영업일 기준 1일 안에 연락드립니다.",
  /** [대표님 확인] 실제 회신 기준 확인 */
  inquiryTypes: [
    { id: "factory", label: "공장", icon: "🏭" },
    { id: "warehouse", label: "창고", icon: "🏢" },
    { id: "neighborhood", label: "근린생활시설", icon: "🏪" },
    { id: "church", label: "교회", icon: "⛪" },
    { id: "house", label: "주택·모듈러", icon: "🏠" },
    { id: "interior", label: "실내건축", icon: "🏛️" },
    { id: "supervision", label: "감리만", icon: "📋" },
    { id: "permit", label: "용도변경·사용승인", icon: "📄" },
    { id: "other", label: "기타", icon: "💬" },
  ],
} as const;

/* ── Q&A FAQ 고정 항목 ───────────────────────────────────── */
export const faqItems = [
  {
    question: "설계비는 어떻게 산정되나요?",
    /** [대표님 확인] 실제 답변으로 교체 */
    answer: "[대표님 확인]",
  },
  {
    question: "인허가에는 보통 얼마나 걸리나요?",
    answer: "[대표님 확인]",
  },
  {
    question: "감리는 반드시 받아야 하나요?",
    answer: "[대표님 확인]",
  },
  {
    question: "모듈러하우스도 인허가가 필요한가요?",
    answer: "[대표님 확인]",
  },
  {
    question: "무료 부지검토는 어떤 내용을 알려주시나요?",
    answer:
      "지번 또는 주소를 바탕으로 토지이용계획 확인, 개발행위허가 필요 여부, 진입로·지목 현황, 예상 인허가 절차를 안내해 드립니다. 비용은 받지 않습니다.",
  },
];
