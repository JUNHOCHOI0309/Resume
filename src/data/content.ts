export const siteUrl = 'https://xn--oy2b21uy8bstgb2h1zbwb320a.site'

export const profile = {
  name: '최준호',
  englishName: 'CHOI JUN HO',
  role: 'Software Developer',
  email: 'chlwnsgh3141592@gmail.com',
  secondaryEmail: 'skyho0309@naver.com',
  phone: '010-5944-5841',
  github: 'https://github.com/JUNHOCHOI0309',
  location: 'Seoul, South Korea',
  introduction: '웹 개발자 최준호입니다. 웹사이트와 앱을 개발하고 있습니다.',
}

export type Project = {
  slug: string
  name: string
  category: '서비스' | '웹사이트' | '게임 · 앱'
  eyebrow: string
  headline: string
  description: string
  contribution: string
  responsibilities: string[]
  result: string
  solo?: boolean
  developmentNote?: string
  role?: string
  period?: string
  stack: string[]
  status: 'live' | 'documented'
  featured: boolean
  demoUrl?: string
  image?: string
  imageAlt?: string
  art: 'which' | 'brief' | 'payment' | 'security' | 'game' | 'chat' | 'medical'
  flow: string[]
  problem: string
  approach: string
  highlights: { title: string; description: string }[]
  decisions?: { title: string; description: string }[]
  takeaway: string
  evidence: string
}

export const projects: Project[] = [
  {
    slug: 'which',
    name: 'WHICH',
    solo: true,
    role: '1인 프로젝트 · 기획 · 디자인 · 개발 · 배포 · 운영',
    developmentNote:
      '코드 구현에는 Codex의 도움을 받았습니다. 서비스의 방향, 기능 구성, 결과 확인과 개선, 배포·운영은 제가 맡았습니다.',
    contribution:
      '질문과 투표로 의견을 나누는 서비스를 기획하고, 화면·서버·데이터베이스를 연결해 공개하고 운영했습니다.',
    responsibilities: [
      '질문 피드, A/B 투표, 결과 확인과 댓글 화면을 개발했습니다.',
      '로그인, 서버 API와 데이터베이스를 연결하고 중복 투표·재시도 보호를 구현했습니다.',
      '콘텐츠 게시와 신고 관리 기능부터 서비스 배포·운영까지 맡았습니다.',
    ],
    result: '질문에 투표하고, 다른 사람들의 선택과 이유까지 한곳에서 확인할 수 있습니다.',
    category: '서비스',
    eyebrow: '투표 서비스',
    headline: 'A/B 투표와 의견 공유 서비스',
    description:
      '일상 속 질문에 A와 B로 답하고, 다른 사람들의 생각과 이유를 살펴보는 의견 공유 서비스입니다.',
    stack: ['Next.js', 'Fastify', 'PostgreSQL', 'Drizzle', 'Expo'],
    status: 'live',
    featured: true,
    demoUrl: 'https://whichone.site/',
    image: '/projects/which.png',
    imageAlt: 'WHICH의 질문과 A/B 선택지가 표시된 실제 공개 서비스 화면',
    art: 'which',
    flow: ['질문 발견', 'A / B 선택', '결과 확인', '의견 나누기'],
    problem:
      '질문을 읽고, 내 의견을 고르고, 다른 사람들의 생각과 이유까지 한 흐름으로 살펴볼 수 있는 공간을 만들었습니다.',
    approach:
      '질문 피드에서 투표와 결과, 댓글, 다음 질문으로 자연스럽게 이어지도록 구성했습니다. 방문자는 비회원으로 핵심 흐름을 경험하고, 계정을 통해 관심사를 설정할 수 있습니다.',
    highlights: [
      {
        title: '투표와 댓글',
        description:
          '질문을 고르고 투표한 뒤 결과를 확인할 수 있습니다. 댓글로 선택한 이유를 남길 수 있습니다.',
      },
      {
        title: '중복 투표 방지',
        description: '중복 입력과 재시도를 보호하는 투표 처리 구조를 갖췄습니다.',
      },
      {
        title: '운영 관리',
        description:
          '질문 게시, 댓글 신고와 관리, 서비스 상태 확인을 위한 운영 흐름을 구성했습니다.',
      },
    ],
    decisions: [
      {
        title: '화면과 데이터 처리의 역할을 분리',
        description:
          'Next.js 웹과 Fastify API, PostgreSQL 저장소를 구분해 기능을 확장하고 검증할 수 있도록 구성했습니다.',
      },
      {
        title: '웹에서 시작해 모바일로 확장',
        description:
          'Expo 기반 모바일 앱에서도 비회원의 질문·투표·결과 핵심 흐름을 구현했습니다. 스토어 출시 여부와는 구분되는 구현 범위입니다.',
      },
    ],
    takeaway:
      '기능을 하나씩 만드는 것에서 나아가, 참여부터 결과·운영까지 연결된 제품을 설계하는 프로젝트입니다.',
    evidence: '공개 서비스 및 로컬 WHICH README의 구현 범위 확인 · 화면 캡처 2026.10.24',
  },
  {
    slug: 'daily-brief',
    name: '데일리 브리프',
    solo: true,
    role: '1인 프로젝트 · 기획 · 디자인 · 개발 · 배포 · 운영',
    developmentNote:
      '코드 구현에는 Codex의 도움을 받았습니다. 주제와 화면 구성, 기능 확인과 개선, 배포·운영은 제가 맡았습니다.',
    contribution:
      '흩어진 뉴스를 분야별로 읽는 웹사이트를 기획하고, 디자인·기능 구현·배포와 콘텐츠 운영까지 맡았습니다.',
    responsibilities: [
      '분야별 기사 화면과 탐색 메뉴를 설계하고, 읽기 쉬운 정보 구조를 만들었습니다.',
      '뉴스 검색, 날짜별 아카이브와 원문 출처로 이어지는 경로를 구현했습니다.',
      '사이트를 배포하고, 콘텐츠 게시와 서비스 관리를 맡았습니다.',
    ],
    result: '여러 분야의 소식을 읽고 검색하며, 지난 기사와 원문 근거를 다시 찾아볼 수 있습니다.',
    category: '서비스',
    eyebrow: '뉴스 사이트',
    headline: '분야별 뉴스 브리핑 사이트',
    description:
      '분야별 뉴스의 핵심과 배경, 원문 출처를 함께 살펴볼 수 있는 브리핑 웹사이트입니다.',
    stack: ['분야별 탐색', '검색', '날짜별 아카이브'],
    status: 'live',
    featured: true,
    demoUrl: 'https://ai-tech-daily-9po.pages.dev/',
    image: '/projects/daily-brief.png',
    imageAlt: '분야별 기사와 원문 출처를 제공하는 데일리 브리프의 실제 공개 화면',
    art: 'brief',
    flow: ['분야 선택', '핵심 읽기', '원문 확인', '지난 소식 탐색'],
    problem:
      '여러 분야의 뉴스를 일일이 찾아다니는 수고를 줄이고, 중요한 내용과 그 근거를 함께 읽을 수 있게 구성했습니다.',
    approach:
      '테크·과학부터 경제·금융, 문화·콘텐츠까지 주제별로 내용을 나누고, 전체 검색과 날짜별 아카이브로 다시 찾아볼 수 있도록 했습니다.',
    highlights: [
      {
        title: '분야별 기사',
        description: '분야별 탐색 메뉴를 통해 읽고 싶은 주제의 소식으로 바로 이동합니다.',
      },
      {
        title: '기사 요약과 출처',
        description: '기사에 출처를 함께 표시해 핵심을 읽은 뒤 원문 근거를 확인할 수 있습니다.',
      },
      {
        title: '검색과 아카이브',
        description: '검색과 날짜별 브리핑 아카이브로 이전 소식을 찾아볼 수 있습니다.',
      },
    ],
    takeaway:
      '정보를 많이 모으는 것만큼, 읽기 쉬운 구조와 근거를 확인할 수 있는 경로를 만드는 데 초점을 둔 서비스입니다.',
    evidence: '공개 서비스에서 분야·검색·아카이브·출처 링크 확인 · 화면 캡처 2026.10.24',
  },
  {
    slug: 'mmkorea',
    name: 'MMKorea',
    contribution:
      '대회 참가 신청과 결제, 신청 조회·환불·관리자 기능까지 기획하고 화면과 서버를 구현했습니다.',
    responsibilities: [
      '종목·부문 선택, 참가 신청과 내역 조회 화면을 만들었습니다.',
      'TossPayments 결제 위젯과 API·데이터베이스를 연결했습니다.',
      '관리자 대시보드, 환불 흐름과 다국어 안내를 구현했습니다.',
    ],
    result: '참가자는 온라인으로 신청·결제하고, 운영자는 같은 내역을 확인하고 관리할 수 있습니다.',
    category: '서비스',
    eyebrow: '대회 신청·결제',
    headline: '대회 참가 신청·결제 웹사이트',
    description:
      '참가자는 온라인으로 신청하고 결제하며, 운영자는 신청 내역과 환불을 관리하는 대회 서비스입니다.',
    role: '기획 · 프론트엔드 · 백엔드',
    period: '2026.04 — 2026.06',
    stack: ['React', 'Vite', 'Express', 'TossPayments'],
    status: 'documented',
    featured: true,
    demoUrl: 'https://mmkorea.com',
    art: 'payment',
    flow: ['종목 선택', '참가 신청', '온라인 결제', '운영자 확인'],
    problem:
      '대회 참가에는 종목 선택과 신청, 결제, 내역 조회가 필요합니다. 참가자와 운영자 양쪽의 절차를 하나의 웹서비스로 연결했습니다.',
    approach:
      '화면을 만드는 것부터 결제 연동, 신청 데이터를 처리하는 서버와 관리자 기능까지 직접 설계하고 구현했습니다.',
    highlights: [
      {
        title: '참가 신청',
        description:
          '부문별 참가 신청과 부가 서비스 선택, 결제와 신청 내역 조회 흐름을 구현했습니다.',
      },
      {
        title: '결제 연동',
        description: 'TossPayments 결제 위젯을 연동해 신청과 결제를 하나의 과정으로 구성했습니다.',
      },
      {
        title: '관리자 기능',
        description: '관리자 대시보드, 신청 확인과 환불 흐름, 다국어 안내를 포함했습니다.',
      },
    ],
    decisions: [
      {
        title: '참가자와 운영자의 화면 분리',
        description:
          '신청하는 사람과 확인하는 사람의 업무를 구분해, 같은 신청 데이터가 각 역할에 필요한 형태로 보이도록 구성했습니다.',
      },
    ],
    takeaway:
      '하나의 버튼 뒤에 화면, 서버, 데이터, 외부 결제 서비스가 어떻게 연결되어야 하는지 경험한 프로젝트입니다.',
    evidence:
      '기존 포트폴리오의 역할·기간·구현 기록 기준. 현재 서비스 접속 여부는 재확인이 필요합니다.',
  },
  {
    slug: 'hack-n-learn',
    name: 'Hack-n-Learn',
    contribution:
      '3인 팀에서 서버 API와 데이터베이스를 설계·구현하고, 빌드·배포와 서버 운영을 담당했습니다.',
    responsibilities: [
      '팀원이 만든 화면이 작동하도록 데이터를 처리하는 API를 설계하고 구현했습니다.',
      '서비스에 필요한 데이터베이스 구조를 만들고 서버와 연결했습니다.',
      'CI/CD 배포 흐름을 구성하고 서버를 운영했습니다.',
    ],
    result:
      '화면의 요청이 서버와 저장소로 이어지고, 수정한 기능을 배포할 수 있는 기반을 만들었습니다.',
    category: '서비스',
    eyebrow: '웹 보안 실습',
    headline: '웹 보안 실습 사이트',
    description:
      '웹 보안을 직접 실습하며 배울 수 있도록 만든 팀 프로젝트입니다. 서버와 데이터, 배포를 담당했습니다.',
    role: '3인 팀 · 백엔드 · 빌드 및 배포',
    period: '2025.09 — 2025.12',
    stack: ['Backend', 'API', 'Database', 'CI/CD'],
    status: 'documented',
    featured: true,
    demoUrl: 'https://www.hacknlearn.site/',
    art: 'security',
    flow: ['실습 선택', '직접 도전', '서버 처리', '학습 이어가기'],
    problem:
      '보안 지식을 직접 실습할 수 있는 웹 환경을 만들기 위해, 사용자의 요청을 처리하고 데이터를 보관하는 기반이 필요했습니다.',
    approach:
      'API와 데이터베이스를 설계하고 백엔드를 구현했습니다. 빌드와 배포 절차, 서버 운영까지 담당하며 팀원들의 화면과 기능을 연결했습니다.',
    highlights: [
      {
        title: '서버 API',
        description:
          '프론트엔드가 요청한 데이터를 처리할 수 있도록 API를 설계하고 서버 기능을 구현했습니다.',
      },
      {
        title: '데이터베이스',
        description: '서비스에 필요한 데이터베이스를 설계하고 서버와 연결했습니다.',
      },
      {
        title: 'CI/CD와 서버 운영',
        description:
          'CI/CD 흐름과 서버 운영을 담당해 개발한 기능이 배포까지 이어지도록 구성했습니다.',
      },
    ],
    takeaway:
      '팀원이 만든 화면을 작동하는 서비스로 연결하고, 반복 배포할 수 있는 기반을 만드는 경험을 쌓았습니다.',
    evidence:
      '기존 포트폴리오의 팀 구성·역할·구현 기록 기준. 현재 서비스 접속 여부는 재확인이 필요합니다.',
  },
  {
    slug: 'project-suika',
    name: 'Project_suika',
    contribution:
      'React로 게임 규칙을 구현하고, Express·MongoDB 백엔드와 클라우드 배포 환경을 구성했습니다.',
    responsibilities: [
      '브라우저에서 게임이 진행되도록 과일을 합치는 게임 로직을 구현했습니다.',
      'Express와 MongoDB를 이용해 백엔드를 구성했습니다.',
      'Vercel에 화면을 배포하고 OCI 서버 환경과 연결했습니다.',
    ],
    result: '별도 설치 없이 웹 주소로 접속해 게임을 시작할 수 있습니다.',
    category: '게임 · 앱',
    eyebrow: '웹 게임',
    headline: '브라우저 수박 게임',
    description: '과일을 합치는 웹 게임의 로직부터 서버와 배포 환경까지 구성한 프로젝트입니다.',
    role: '게임 로직 · 백엔드 구성',
    period: '2025.08 —',
    stack: ['React', 'Express', 'MongoDB', 'OCI', 'Vercel'],
    status: 'live',
    featured: false,
    demoUrl: 'https://project-suika-que8.vercel.app/',
    art: 'game',
    flow: ['게임 시작', '과일 떨어뜨리기', '합치기', '점수 확인'],
    problem:
      '설치 없이 브라우저에서 즐길 수 있는 게임을 만들며, 화면의 움직임과 게임 규칙을 직접 구현했습니다.',
    approach:
      'React에서 게임 로직을 구현하고, Express와 MongoDB로 백엔드를 구성했습니다. Vercel 프론트엔드와 OCI 서버 환경을 연결했습니다.',
    highlights: [
      {
        title: '게임 로직',
        description: '게임의 진행과 과일을 합치는 로직을 React로 구현했습니다.',
      },
      {
        title: '백엔드 구성',
        description: 'Express와 MongoDB를 활용해 백엔드를 구성했습니다.',
      },
      {
        title: '클라우드 배포',
        description:
          'Vercel과 Oracle Cloud Infrastructure를 활용해 프론트엔드와 서버를 배포했습니다.',
      },
    ],
    takeaway: '게임의 상호작용뿐 아니라 이를 공개하는 서버와 배포 환경을 함께 다룬 프로젝트입니다.',
    evidence: '기존 포트폴리오 기록 및 공개 시작·게임 화면 확인 · 2026.10.24',
  },
  {
    slug: 'multi-fc',
    name: 'Multi_FC',
    contribution:
      '6인 팀의 백엔드 팀장으로 실시간 채팅을 구현하고, Git·PR을 통한 코드 통합을 관리했습니다.',
    responsibilities: [
      'Spring과 MyBatis 기반의 백엔드 개발에 참여했습니다.',
      'WebSocket을 이용한 실시간 채팅 기능을 구현했습니다.',
      'Git과 PR을 관리하며 팀원들의 코드를 통합했습니다.',
    ],
    result:
      '사용자끼리 실시간으로 대화하는 기능을 만들고, 팀의 개발 결과가 하나의 서비스로 합쳐지도록 도왔습니다.',
    category: '웹사이트',
    eyebrow: '풋살 웹사이트',
    headline: '풋살 웹사이트 팀 프로젝트',
    description:
      '6명이 함께 개발한 풋살 웹사이트에서 백엔드 팀장과 Git 관리, 실시간 채팅을 맡았습니다.',
    role: '6인 팀 · 백엔드 팀장 · Git 관리',
    period: '2025.11 — 2025.12',
    stack: ['Spring', 'MyBatis', 'WebSocket', 'Git'],
    status: 'documented',
    featured: false,
    art: 'chat',
    flow: ['팀으로 기획', '역할 분담', '실시간 채팅', '코드 통합'],
    problem:
      '여러 사람이 함께 만드는 웹사이트에서 개별 기능뿐 아니라 코드가 하나의 서비스로 합쳐지는 과정이 필요했습니다.',
    approach:
      'Spring과 MyBatis 기반 백엔드에 참여하고 WebSocket 실시간 채팅을 구현했습니다. 팀의 PR을 중심으로 코드 방향성과 통합 흐름을 관리했습니다.',
    highlights: [
      {
        title: '실시간 채팅',
        description: 'WebSocket을 활용한 실시간 채팅 기능을 담당했습니다.',
      },
      {
        title: '코드 통합',
        description: 'Git 관리와 PR 기반의 코드 통합 흐름을 맡았습니다.',
      },
    ],
    takeaway:
      '기능 구현과 협업 과정의 정리가 함께 있어야 팀의 결과물이 완성된다는 점을 경험했습니다.',
    evidence: '기존 포트폴리오의 프로젝트 기록 기준',
  },
  {
    slug: 'girlfriend-privacy-talk',
    name: 'Girlfriend Privacy Talk',
    contribution:
      'AI 캐릭터와 대화하는 앱을 기획하고, Kotlin으로 화면과 외부 API 연결을 구현했습니다.',
    responsibilities: [
      '대화할 캐릭터의 페르소나와 앱 이용 흐름을 기획했습니다.',
      'Android Studio와 Kotlin으로 메신저 형태의 화면을 만들었습니다.',
      '외부 API를 연결해 입력과 응답이 대화로 이어지게 했습니다.',
    ],
    result: '사용자가 메시지를 입력하고 AI 캐릭터의 답변을 모바일 화면에서 읽을 수 있습니다.',
    category: '게임 · 앱',
    eyebrow: 'Android 앱',
    headline: 'AI 캐릭터 대화 앱',
    description: '성격을 가진 AI 캐릭터와 메신저처럼 대화하는 Android 애플리케이션입니다.',
    role: '기획 · Android 개발',
    period: '2024.05 — 2024.06',
    stack: ['Kotlin', 'Android Studio', 'External API'],
    status: 'documented',
    featured: false,
    art: 'chat',
    flow: ['캐릭터 기획', '메시지 입력', '외부 API 연결', '대화 표시'],
    problem:
      '캐릭터의 성격과 대화 기능을 결합해, 사용자가 메신저처럼 친숙하게 대화할 수 있는 경험을 기획했습니다.',
    approach:
      'Kotlin으로 Android 앱을 개발하고 외부 API를 연결해 대화 상대와 메신저형 인터페이스를 구성했습니다.',
    highlights: [
      {
        title: '캐릭터와 대화 화면',
        description: '캐릭터의 페르소나와 대화 경험을 기획하고 구현했습니다.',
      },
      {
        title: '외부 API 연동',
        description: '외부 API의 응답을 모바일 대화 화면으로 연결했습니다.',
      },
    ],
    takeaway: '기술을 연결하는 것과 사용자가 느끼는 대화 경험을 함께 고민한 프로젝트입니다.',
    evidence: '기존 포트폴리오의 프로젝트 기록 기준',
  },
  {
    slug: 'nowon-medical',
    name: 'NowonMedical',
    contribution:
      '2인 외주 프로젝트에서 요구 분석, 디자인과 프로토타입 제작, 프론트엔드 구현에 참여했습니다.',
    responsibilities: [
      '병원 측의 요구를 확인하고 웹사이트에 필요한 내용을 정리했습니다.',
      '디자인 컨셉과 프로토타입을 만들었습니다.',
      '기획한 디자인을 실제 웹 화면으로 구현했습니다.',
    ],
    result: '고객의 요구를 방문자가 읽고 사용할 수 있는 홈페이지 화면으로 옮겼습니다.',
    category: '웹사이트',
    eyebrow: '홈페이지 외주 제작',
    headline: '병원 홈페이지 제작',
    description:
      '병원 홈페이지 외주 제작에서 요구 분석, 디자인과 프로토타입, 프론트엔드 구현에 참여했습니다.',
    role: '2인 프로젝트 · 기획 · 디자인 · 프론트엔드',
    period: '2023.12 — 2024.01',
    stack: ['Planning', 'Design', 'Frontend'],
    status: 'documented',
    featured: false,
    art: 'medical',
    flow: ['요구사항 확인', '디자인 구상', '프로토타입', '웹 구현'],
    problem:
      '고객의 요구를 이해하고, 병원에 필요한 정보를 방문자가 읽을 수 있는 웹 화면으로 정리하는 작업이었습니다.',
    approach:
      '2인 프로젝트에서 초기 요구 분석부터 디자인 컨셉, 프로토타입 제작과 프론트엔드 구현까지 참여했습니다.',
    highlights: [
      {
        title: '요구 분석',
        description: '초기 요구 분석에 참여해 사이트의 방향을 정리했습니다.',
      },
      {
        title: '디자인과 화면 구현',
        description: '디자인 컨셉과 프로토타입을 웹 화면 구현으로 연결했습니다.',
      },
    ],
    takeaway:
      '기획과 디자인, 구현이 하나의 과정으로 연결되는 것을 경험한 첫 실무형 프로젝트입니다.',
    evidence: '기존 포트폴리오의 프로젝트 기록 기준',
  },
]

// TODO: confirm public scope, role, implementation and screenshots before publishing these projects.
export const pendingProjects = [
  { name: 'LOOFIO', missing: ['공개 가능한 구현 범위', '담당 역할', '서비스 URL 및 화면'] },
  { name: 'Life Helper', missing: ['구현 자료', '공개 범위', '서비스 URL 및 화면'] },
]
