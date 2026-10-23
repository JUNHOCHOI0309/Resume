export const aiTools = [
  {
    name: 'ChatGPT',
    role: '아이디어 · 기획 · 자료 정리',
    description:
      '만들고 싶은 서비스의 아이디어를 구체화하고, 필요한 기능과 화면 구성을 정리하는 데 활용합니다. 조사한 자료를 요약하고 분류할 때도 사용합니다.',
    tasks: ['아이디어 구체화', '기능과 화면 기획', '자료 요약·정리'],
  },
  {
    name: 'Codex',
    role: '코드 구현 · 오류 수정 · 테스트',
    description:
      '정리한 기획을 실제 코드로 구현하는 데 활용합니다. 기능을 수정하거나 오류의 원인을 찾고, 테스트로 동작을 확인할 때도 사용합니다.',
    tasks: ['화면·서버 구현', '오류 원인 확인과 수정', '기능 테스트'],
  },
]

type AIUsageCase = {
  id: string
  name: string
  category: string
  description: string
  reach: string
  outcome: string
  builds: { title: string; description: string }[]
  example: {
    title: string
    requirement: string
    implementation: string
    verification: string
  }
  chatgpt: string
  codex: string
  detailPath?: string
  siteUrl?: string
  note?: string
}

export const aiUsageCases: AIUsageCase[] = [
  {
    id: 'which',
    name: 'WHICH',
    category: '투표·의견 공유 서비스',
    description: '질문에 A와 B로 투표하고, 결과와 댓글을 확인하는 서비스입니다.',
    reach: '웹 · 모바일 · 서버 · DB',
    outcome: '웹·모바일 클라이언트와 투표·회원·운영 기능',
    builds: [
      {
        title: '웹과 모바일 클라이언트',
        description:
          'Next.js 웹과 Expo 모바일 앱에서 질문 피드, 투표, 결과 확인 등 핵심 이용 흐름을 구현했습니다.',
      },
      {
        title: '서버와 데이터베이스',
        description:
          'Fastify API와 PostgreSQL을 연결하고, 투표 저장·집계·이전 선택 복원과 중복 요청 처리를 구현했습니다.',
      },
      {
        title: '회원·운영 기능과 개발 검사',
        description:
          '로그인, 댓글·신고 관리, 콘텐츠 게시 기능을 만들고 타입 검사·테스트·빌드를 확인하는 CI를 구성했습니다.',
      },
    ],
    example: {
      title: '버튼을 여러 번 눌러도 투표는 한 번만',
      requirement:
        '연속 클릭이나 네트워크 재시도가 발생해도 같은 투표가 중복 집계되지 않아야 합니다.',
      implementation:
        'Codex를 활용해 요청 식별, 중복 투표 검사와 서버 기준 집계 처리를 구현했습니다.',
      verification:
        '정상 투표와 중복 요청을 구분하는 테스트를 작성하고, 이전 선택을 다시 보여주는 동작도 확인했습니다.',
    },
    chatgpt: '서비스 아이디어와 기능 목록, 회원·비회원의 이용 방식을 정리하는 데 활용했습니다.',
    codex: '웹·앱과 서버 구현, 데이터 구조 수정, 오류 분석과 테스트 작성에 활용했습니다.',
    detailPath: '/work/which',
    note: '웹 서비스와 모바일 앱의 구현 기록입니다. 앱스토어 출시 여부는 별도입니다.',
  },
  {
    id: 'daily-brief',
    name: '데일리 브리프',
    category: '뉴스 브리핑 사이트',
    description: '분야별 뉴스와 원문 출처를 읽고, 검색과 날짜별 아카이브로 다시 찾는 사이트입니다.',
    reach: '브리핑 · 편집 · 발행 구조',
    outcome: '브리핑 수신·편집·웹 발행을 연결한 운영 구조',
    builds: [
      {
        title: 'ChatGPT 브리핑과 편집 자료 연결',
        description:
          '예약 브리핑과 취재 자료를 Notion에 모으고, 편집·검토 기록을 거쳐 기사 묶음을 송고하는 구조를 구성했습니다.',
      },
      {
        title: '원고에서 웹페이지 생성',
        description:
          '수신 원고를 검사하고 GitHub 저장과 Cloudflare 배포로 연결했습니다. 기사 HTML, 검색 자료, 사이트맵과 RSS를 생성합니다.',
      },
      {
        title: '검색·아카이브와 트렌드 상세',
        description:
          '분야·날짜별 탐색과 본문 검색을 만들고, 트렌드 목록에서 화면을 떠나지 않고 근거를 읽는 상세 패널을 구현했습니다.',
      },
    ],
    example: {
      title: '느린 이전 응답이 새 선택을 덮지 않도록',
      requirement:
        '트렌드 항목을 빠르게 바꾸거나 패널을 닫았을 때, 뒤늦게 도착한 이전 설명이 다시 나타나지 않아야 합니다.',
      implementation:
        'Codex와 요청 취소 및 요청별 식별 처리를 넣어 현재 선택에 해당하는 응답만 화면에 반영하도록 수정했습니다.',
      verification:
        '응답 순서가 뒤바뀌는 경우, 패널 닫기, 404·요청 제한·잘못된 응답을 테스트하는 코드를 작성했습니다.',
    },
    chatgpt: '분야별 브리핑, 기사 기획과 자료 정리, 편집 기준을 만드는 데 활용했습니다.',
    codex: '원고 수신·검사, 웹페이지 생성, 송고 연결과 화면 오류 수정·회귀 테스트에 활용했습니다.',
    detailPath: '/work/daily-brief',
    note: '원고 저장·공개 배포·내용 검토를 구분합니다. 기사 이미지 제작은 로컬 후속 작업으로 진행합니다.',
  },
  {
    id: 'limi',
    name: 'Limi',
    category: '콘텐츠·생활 정보 서비스',
    description:
      '조선사연록, 월세 평행세계, 우리 동네 48시간 등 서로 다른 주제의 서비스를 모은 프로젝트입니다.',
    reach: '실제 자료 · 콘텐츠 · 체험 서비스',
    outcome: '역사 콘텐츠와 실제 자료를 활용한 비교·체험 서비스',
    builds: [
      {
        title: '출처가 있는 역사 콘텐츠',
        description:
          '실제 기록 30편과 창작 20편을 구분해 제공하고, 선택 후 해설·출처를 확인하는 읽기·퀴즈 화면을 구현했습니다.',
      },
      {
        title: '공식 자료를 활용한 월세 비교',
        description:
          '해외 13개 도시의 계약·공식 통계를 가공해 비교하고, 환율·면적 기준·출처와 자료가 없는 상태를 구분해 표시했습니다.',
      },
      {
        title: '진행 저장과 비공개 정보 보호',
        description:
          '선택형 체험의 진행 복원과 결과 공유를 구현했습니다. 공유할 정보와 숨길 입력값을 구분했습니다.',
      },
    ],
    example: {
      title: '결과를 공유해도 입력 예산은 비공개로',
      requirement:
        '월세 비교 결과를 공유하면서 입력한 예산과 세부 조건까지 의도치 않게 공개하지 않아야 합니다.',
      implementation:
        'Codex를 활용해 공개용 데이터 구조를 분리하고, 공유 응답에는 허용한 정보만 포함하도록 구현했습니다.',
      verification:
        '공유 응답의 비공개 필드 누출, 공유 취소와 이전 주소 호환을 확인하는 테스트를 구성했습니다.',
    },
    chatgpt:
      '서비스별 아이디어와 이용 방식을 기획하고, 역사·생활 정보 등 필요한 자료를 정리했습니다.',
    codex: '공식 자료 가공, 콘텐츠 구조, 화면·서버·저장·공유 기능 구현과 검증에 활용했습니다.',
    siteUrl: 'https://limi.pages.dev/',
    note: '실제 자료와 데모 데이터를 구분해 안내합니다. 자료 출처와 체험 범위는 각 서비스에서 확인할 수 있습니다.',
  },
  {
    id: 'llm',
    name: 'LLM',
    category: '로컬 AI 프로젝트',
    description:
      '개인 PC에서 기존 AI 모델과 도구를 실행하고, 필요한 채팅·설정·저장 기능을 추가한 프로젝트입니다.',
    reach: '로컬 추론 · 장기기억 · 생성 도구',
    outcome: '로컬 채팅·장기기억과 이미지·음성 생성 환경',
    builds: [
      {
        title: '로컬 모델을 연결한 채팅 앱',
        description:
          'Ollama 모델을 연결하고, 답변 스트리밍·중지·재생성, 대화 분기와 JSON 백업·복원을 구현했습니다.',
      },
      {
        title: '이전 대화를 참고하는 장기기억',
        description:
          '누적 요약과 임베딩 검색으로 관련 대화를 찾아 참고하도록 구현하고, 다른 분기의 기억이 섞이지 않게 처리했습니다.',
      },
      {
        title: '로컬 이미지 생성 환경',
        description:
          '기존 ComfyUI·SOYA 도구와 모델을 설치·연결해 이미지 생성 워크플로를 실행하는 환경을 구성했습니다.',
      },
      {
        title: '한국어 음성 생성 실험',
        description:
          'Qwen3-TTS를 별도 환경에서 실행해 한국어 WAV 생성과 발음 치환을 시험했습니다. 음성 품질은 추가 확인이 필요합니다.',
      },
    ],
    example: {
      title: '설정은 함께 쓰고, 대화와 기억은 따로',
      requirement:
        '여러 대화에서 같은 설정을 사용하되, 각 대화의 원문과 장기기억이 서로 섞이지 않아야 합니다.',
      implementation:
        'Codex와 공통 설정·대화별 저장 구조를 분리하고, 새 대화·분기·가져오기 기능이 이 기준을 따르도록 수정했습니다.',
      verification:
        '새 대화·분기·임시 대화의 설정 공유, 새로고침 후 복원, 대화별 기억 분리를 테스트했습니다.',
    },
    chatgpt: '로컬 AI 도구의 활용 방법을 구상하고, 필요한 기능과 설정 자료를 정리했습니다.',
    codex:
      '로컬 실행 환경 구성과 채팅 앱 개발, 저장 구조 변경, 모델 연결 오류 수정·테스트에 활용했습니다.',
    note: '기존 모델·오픈소스 도구를 활용한 로컬 구현입니다. 자체 기반 모델 학습이나 외부 공개 서비스와는 구분하며, 개인 대화·음성 원본은 공개하지 않습니다.',
  },
]
