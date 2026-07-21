export type Metric = {
  label: string
  value: string
}

export type Principle = {
  title: string
  description: string
}

export type Experience = {
  name: string
  url?: string
  urlLabel?: string
  period: string
  role: string
  summary: string
  bullets: string[]
  tags: string[]
}

export type Skill = {
  name: string
  level: number
}

export type SkillGroup = {
  category: string
  description: string
  items: Skill[]
}

export const portfolio = {
  name: '최준호',
  englishName: 'CHOI JUN HO',
  role: 'Full-Stack Web Developer',
  location: 'Seoul, South Korea',
  phone: '010-5944-5841',
  email: 'chlwnsgh3141592@gmail.com',
  github: 'https://github.com/JUNHOCHOI0309',
  heroLines: ['사용자 흐름을', '끝까지 구현하는', '개발자 최준호'],
  summary:
    '프론트엔드에서 멈추지 않고 API, 데이터베이스, 배포 환경까지 연결해 실제 서비스 흐름을 구현합니다.',
  metrics: [
    { label: 'Projects Built', value: '6+' },
    { label: 'Core Stack', value: 'React / Express / Spring' },
    { label: 'Working Style', value: 'Planning to Deployment' },
  ] satisfies Metric[],
  about: [
    '저는 사용자가 실제로 서비스를 이용하는 흐름을 이해하고 구현하는 개발자를 목표로 하고 있습니다.',
    '병원 웹사이트 외주 제작을 시작으로 AI 대화 애플리케이션, 해킹 실습 웹사이트, 포트폴리오 사이트, 대회 결제 웹사이트 등 다양한 프로젝트를 진행하며 웹 서비스 개발 경험을 쌓았습니다.',
    '특히 대회 결제 웹사이트 프로젝트에서는 참가 신청, 결제, 관리자 확인 기능, API 서버, 데이터베이스, 배포 환경까지 직접 설계하고 구현하며 실제 서비스에 가까운 개발 흐름을 경험했습니다.',
    '이 과정에서 단순히 기능을 만드는 것을 넘어 사용자 경험, 데이터 관리, 보안, 운영 편의성을 함께 고려하는 것이 중요하다는 점을 배웠고, 앞으로도 안정적인 서비스를 만드는 개발자로 성장하고 싶습니다.',
  ],
  principles: [
    {
      title: '사용자 흐름 중심',
      description:
        '기능 하나보다 신청, 결제, 조회, 운영처럼 사용자가 실제로 겪는 흐름 전체를 먼저 설계합니다.',
    },
    {
      title: '끝까지 추적하는 태도',
      description:
        '문제가 생기면 UI, API, 데이터, 배포 환경까지 경로를 따라가며 원인을 찾고 해결합니다.',
    },
    {
      title: '운영을 고려한 구현',
      description:
        '관리자 기능, 데이터 구조, 배포 방식, 보안과 같은 운영 관점까지 함께 보며 코드를 만듭니다.',
    },
  ] satisfies Principle[],
  overview: [
    'NowonMedical / 병원 웹사이트 외주 제작',
    'Girlfriend Privacy Talk / 생성형 AI 대화 앱 제작',
    'Project_suika / 웹 기반 수박 게임 제작',
    'Hack-n-Learn / 해킹 실습 웹사이트 구축',
    'Multi_FC / 풋살 웹사이트 팀 프로젝트',
    'MMKorea / 대회 결제 웹사이트 설계 및 구현',
  ],
}

export const experiences: Experience[] = [
  {
    name: 'MMKorea',
    url: 'https://mmkorea.com',
    urlLabel: 'mmkorea.com',
    period: '2026.04 - 2026.06',
    role: '대회 결제 웹 사이트 / 기획 및 풀스택',
    summary:
      '참가 신청부터 결제, 신청 조회, 환불, 관리자 운영까지 하나의 흐름으로 제공한 웹서비스입니다.',
    bullets: [
      'React와 Vite, Express 기반으로 프론트엔드와 백엔드를 구현했습니다.',
      'TossPayments 결제 위젯을 연동하고 부문별 신청 및 부가 서비스 결제를 지원했습니다.',
      '다국어 안내와 관리자 대시보드까지 포함해 실제 운영 흐름에 맞춘 기능을 설계했습니다.',
    ],
    tags: ['React', 'Vite', 'Express', 'TossPayments', 'Admin'],
  },
  {
    name: 'Multi_FC',
    period: '2025.11 - 2025.12',
    role: '풋살 웹 사이트 / Git 관리 및 백엔드 팀장, 채팅 기능 구현',
    summary:
      '6인 협업 프로젝트로 진행한 풋살 웹사이트이며, 백엔드 리드와 Git 흐름 정리를 맡았습니다.',
    bullets: [
      'Spring Framework와 MyBatis 기반으로 프로젝트를 구성했습니다.',
      'WebSocket을 사용한 실시간 채팅 기능 구현을 담당했습니다.',
      '팀원들의 PR을 중심으로 코드 방향성과 통합 흐름을 관리했습니다.',
    ],
    tags: ['Spring', 'MyBatis', 'WebSocket', 'Git', 'Team Lead'],
  },
  {
    name: 'Hack-n-Learn',
    url: 'https://hacknlearn.site',
    urlLabel: 'hacknlearn.site',
    period: '2025.09 - 2025.12',
    role: '해킹 실습 웹 사이트 / 백엔드 담당, 빌드 및 배포',
    summary:
      '3인 프로젝트로 API 설계부터 배포, 서버 운영까지 백엔드 전반을 맡아 진행한 실습형 서비스입니다.',
    bullets: [
      'API 설계, 백엔드 구현, 데이터베이스 설계, 서버 운영을 담당했습니다.',
      'CI/CD 흐름을 설계해 배포 단계를 정리했습니다.',
      '스크럼 방식으로 역할을 명확히 나눠 실제 프로젝트에 가까운 협업 경험을 쌓았습니다.',
    ],
    tags: ['Backend', 'CI/CD', 'Database', 'Deployment', 'Scrum'],
  },
  {
    name: 'Project_suika',
    url: 'https://project-suika-que8.vercel.app',
    urlLabel: 'project-suika-que8.vercel.app',
    period: '2025.08 - 현재',
    role: '웹 기반 수박 게임 / 게임 로직 구현 및 백엔드 구성',
    summary:
      '브라우저에서 즐길 수 있는 게임 경험을 구현하면서 프론트엔드와 서버 인프라를 함께 구성한 프로젝트입니다.',
    bullets: [
      'React로 게임 로직을 구현하고 Express와 MongoDB로 백엔드를 구성했습니다.',
      'Oracle Cloud Infrastructure 기반의 VM 환경에 서버를 구축했습니다.',
      '프론트엔드는 Vercel로 배포하고 외부 서버와 연동했습니다.',
    ],
    tags: ['React', 'Express', 'MongoDB', 'OCI', 'Vercel'],
  },
  {
    name: 'Girlfriend Privacy Talk',
    period: '2024.05 - 2024.06',
    role: '생성형 AI 대화 앱 / 기획 및 개발',
    summary:
      '미소녀 컨셉의 페르소나를 가진 AI와 대화하는 모바일 애플리케이션을 기획하고 구현했습니다.',
    bullets: [
      'Android Studio 환경에서 Kotlin으로 개발했습니다.',
      '외부 API를 연결해 대화 대상과 메신저형 UI를 구성했습니다.',
      '기획과 구현을 함께 진행하며 캐릭터 중심 UX를 실험했습니다.',
    ],
    tags: ['Kotlin', 'Android Studio', 'External API', 'UX'],
  },
  {
    name: 'NowonMedical',
    period: '2023.12 - 2024.01',
    role: '병원 홈페이지 외주 / 기획 및 디자인 담당, 프론트엔드',
    summary:
      '요구 분석부터 디자인 컨셉 구상, 프로토타입 제작과 구현까지 전반에 참여한 외주 프로젝트입니다.',
    bullets: [
      '2인 프로젝트로 진행하며 초반 요구 분석 단계부터 참여했습니다.',
      '디자인 컨셉을 잡고 실제 프로토타입을 만든 뒤 구현까지 연결했습니다.',
      '기획, 디자인, 개발을 하나의 흐름으로 묶어본 첫 실무형 경험이었습니다.',
    ],
    tags: ['Client Work', 'Planning', 'Design', 'Frontend'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    description: '사용자 경험을 빠르게 구현하고 구조화하는 영역',
    items: [
      { name: 'React', level: 78 },
      { name: 'HTML / CSS', level: 82 },
      { name: 'Vite', level: 75 },
    ],
  },
  {
    category: 'Backend',
    description: 'API, 서버 구조, 데이터 흐름을 다루는 영역',
    items: [
      { name: 'Express', level: 76 },
      { name: 'Spring', level: 67 },
      { name: 'MyBatis', level: 60 },
      { name: 'MongoDB / SQL', level: 70 },
    ],
  },
  {
    category: 'Languages',
    description: '프로젝트 성격에 따라 선택해 사용하는 언어 스택',
    items: [
      { name: 'Java', level: 72 },
      { name: 'Kotlin', level: 74 },
      { name: 'Python', level: 68 },
      { name: 'C', level: 46 },
    ],
  },
  {
    category: 'Operations',
    description: '배포와 협업, 운영 관점에서 다루는 영역',
    items: [
      { name: 'Git / PR Flow', level: 78 },
      { name: 'CI / CD', level: 64 },
      { name: 'Vercel / OCI', level: 66 },
      { name: 'WebSocket', level: 62 },
    ],
  },
]
