# Resume Portfolio

React와 Vite로 만든 개인 포트폴리오 웹사이트입니다.  
Notion에 정리한 자기소개서와 프로젝트 이력을 바탕으로, 소개 페이지 형태의 단일 웹사이트로 구성했습니다.

## Stack

- React 19
- TypeScript
- Vite
- CSS

## Sections

- Hero / Profile
- About
- Experience Overview
- Project Timeline
- Skills
- Contact

## Local Development

```bash
npm install
npm run dev
```

기본 개발 서버는 Vite를 사용합니다.

## Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  App.tsx               # 페이지 전체 레이아웃
  main.tsx              # React 엔트리
  style.css             # 전체 스타일
  data/portfolio.ts     # 자기소개/프로젝트/스킬 데이터
  assets/choijunho.jpg  # 프로필 이미지
```

## Notes

- 주요 텍스트 콘텐츠는 `src/data/portfolio.ts`에서 관리합니다.
- 화면 구조와 섹션 배치는 `src/App.tsx`에서 조정할 수 있습니다.
- 전체 톤과 반응형 스타일은 `src/style.css`에 정리되어 있습니다.
