# Junho Choi Portfolio

비전공자도 서비스의 목적과 개발자의 작업 범위를 이해할 수 있도록 구성한 개인 포트폴리오입니다.
React 19 · TypeScript · Vite 기반을 유지하고 React Three Fiber / Three.js, GSAP, React Router를 추가했습니다.

## 실행

```bash
npm ci
npm run dev
```

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

빌드 결과물은 `dist/`입니다. Cloudflare Pages의 기존 빌드 명령 `npm run build`와 출력 폴더 `dist`를 사용할 수 있습니다.
커밋·push·실제 배포는 자동 실행하지 않습니다.

## 화면

- `/`: 입자 오프닝, 담당 범위 소개, 대표 프로젝트 4개, AI 도구 활용 사례, 소개와 연락처
- `/work`: 프로젝트 8개와 분야별 필터
- `/work/:slug`: 문제, 동작, 구현 범위, 기술적 선택과 배운 점
- 없는 주소: 404 안내

카드 덱의 휠 가로채기를 제거하고 일반 문서 스크롤을 사용합니다.
주요 내용은 HTML이며 WebGL 유무와 관계없이 접근할 수 있습니다.

## 콘텐츠와 코드

- `src/data/content.ts`: 프로필, 모든 프로젝트, 미확정 프로젝트 TODO
- `src/data/aiUsage.ts`: ChatGPT·Codex 활용 범위, 프로젝트별 구현 목록과 구체적인 작업·검증 사례
- `src/Portfolio.tsx`: 페이지와 탐색, 프로젝트 상세, 메타데이터 갱신
- `src/components/ProjectCard.tsx`: 프로젝트 카드, 담당 작업과 사용자 결과, 실제 화면/흐름도 구분
- `src/components/AIUsage.tsx`: 결과물 우선의 사례 선택, 구현 범위, 작업 조건·구현·확인 항목과 도구별 상세
- `src/components/LandingHero.tsx`: 캔버스 우선 오프닝, 소개 전환과 건너뛰기
- `src/components/HeroArt.tsx`: 지연 로딩, WebGL 지원 확인과 정적 폴백
- `src/components/ParticleCanvas.tsx`: 포인터·스크롤에 반응하는 입자 셰이더
- `src/lib/motion.tsx`: 모션 설정과 GSAP ScrollTrigger 등장 효과
- `src/styles.css`: 디자인 토큰과 320px까지의 반응형 스타일
- `scripts/prerender.mjs`: 홈·목록·프로젝트 8개의 HTML과 404, 사이트맵 생성

## 확인된 자료

기존 포트폴리오의 6개 프로젝트 기록을 유지하고 WHICH와 데일리 브리프를 추가했습니다.
WHICH와 데일리 브리프는 사용자 확인에 따라 기획·디자인·개발·배포·운영을 맡은 1인 프로젝트로 표시합니다.
코드 구현에 Codex를 활용했다는 점을 담당 범위 설명과 함께 명시합니다.
WHICH의 기술은 로컬 README, 기능은 공개 서비스와 README에서 확인했습니다.
데일리 브리프의 일반 프로젝트 소개는 공개 화면에서 확인한 기능을 기준으로 합니다.
AI 활용 사례는 보관된 `C:/Users/skyho/Documents/Codex/2026-09-14/x20/work/ai-tech-daily-trends-20261020`의 README, `publishing/notion-magazine.md`, 상세 패널 소스와 테스트를 추가 확인해 보강했습니다.
`public/projects/which.png`, `daily-brief.png`는 2026-10-24 공개 서비스에서 직접 캡처한 화면입니다.
실제 화면이 없는 작업의 시각 요소는 명시적으로 '구현 기능을 설명하는 흐름도'로 표시합니다.

MMKorea와 Hack-n-Learn의 현재 URL은 접속 확인이 되지 않아 '공개 서비스' 표시를 붙이지 않았습니다.
기존 제공 URL은 기록으로 유지했습니다. 서비스의 장기 운영 여부를 실시간으로 감시하지는 않습니다.
LOOFIO와 Life Helper는 공개 범위·담당 역할·화면 확인 전까지 `pendingProjects`에만 남기고 사이트에 노출하지 않습니다.
확인되지 않은 방문자·성과 수치나 숙련도 점수는 표시하지 않습니다.

AI 활용 범위는 사용자가 확인한 ChatGPT의 아이디어·기획·자료 정리와 Codex의 구현·오류 수정·테스트를 기준으로 합니다.
Limi는 `C:/workspace/vscode/Limi/curiosity-lab/README.md`, LLM은 `C:/workspace/vscode/LLM/README.md`와 `story-chat/README.md`의 구현 범위를 확인했습니다.
LLM은 로컬 실행 프로젝트로 소개하며 자체 모델 학습이나 공개 서비스로 표시하지 않습니다. 개인 대화·음성·설정 원문은 옮기지 않습니다.
WHICH는 웹·모바일·API·DB와 중복 투표 처리, 데일리 브리프는 발행 연결과 늦은 응답 방어, Limi는 공식 자료와 공유 정보 보호, LLM은 채팅·장기기억·이미지·TTS 환경을 구체적인 구현 범위로 소개합니다.
기존 ComfyUI·SOYA 도구를 자체 개발했다고 하지 않으며, TTS 생성 성공과 청취 품질 검증을 구분합니다. 앱 구현과 스토어 출시, 원고 저장과 공개 배포도 구분합니다.
근거는 각 저장소의 구현 문서·소스·테스트 기록입니다. 이 포트폴리오 수정에서 다른 프로젝트를 실행하거나 재배포하지는 않습니다.
이 사례들은 AI 활용 섹션에만 추가하며 기존 프로젝트 8개의 상세 페이지와는 구분합니다. 기존 `#engineering` 링크는 새 AI 활용 섹션으로 이어집니다.

## 모션과 성능

데스크톱 입자 6,000개, 일반 모바일/낮은 코어 수에서는 1,600개를 사용합니다.
첫 진입에서는 입자가 구름 → 구 → 파동 → 매듭으로 변한 뒤 약 5.6초에 소개 문구가 나타납니다.
스크롤 또는 '건너뛰기'로 바로 건너뛸 수 있고, 렌더러 지연 시에도 최대 9초 안에 본문을 표시합니다.
모션 감소 설정, 직접 섹션 링크 진입, WebGL 미지원 시에는 오프닝 대기 없이 본문으로 이어집니다.
화면을 벗어나거나 브라우저 탭이 숨겨지면 렌더 루프를 멈춥니다.
WebGL 미지원, 컨텍스트 손실, 데이터 절약 모드에는 정적 아트워크를 표시합니다.
시스템의 모션 감소 설정과 헤더의 MOTION 토글을 지원합니다.

3D 렌더러는 별도로 지연 로딩됩니다. 현재 3D 청크는 gzip 약 244 kB이며 빌드에서 크기 경고가 발생합니다.
실제 저사양 기기 FPS, Safari 및 Lighthouse/Core Web Vitals 실측은 추가 검증이 필요합니다.

## 도메인과 SEO

대표 도메인은 `https://최준호포트폴리오.site/`이며 메타데이터에는 Punycode 주소를 사용합니다.
빌드 시 각 경로의 실제 HTML, 고유 title/description/canonical/Open Graph, 사이트맵을 생성합니다.
JavaScript가 시작되기 전에도 프로젝트 본문을 읽을 수 있습니다.
로컬 미리보기의 확장자 없는 경로를 위해 각 상세의 `.html` 파일도 함께 생성합니다.

DNS, Cloudflare Custom domains, 리다이렉트 규칙과 실제 배포 상태는 이 코드 변경에서 수정하지 않습니다.
