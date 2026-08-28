```
██╗   ██╗███╗   ██╗██╗██╗     ███████╗███╗   ██╗███████╗
██║   ██║████╗  ██║██║██║     ██╔════╝████╗  ██║██╔════╝
██║   ██║██╔██╗ ██║██║██║     █████╗  ██╔██╗ ██║███████╗
██║   ██║██║╚██╗██║██║██║     ██╔══╝  ██║╚██╗██║╚════██║
╚██████╔╝██║ ╚████║██║███████╗███████╗██║ ╚████║███████║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝
```

Real student experience, real university choices.

Live Application: https://unilens-ten.vercel.app

---

## Overview

UniLens is a platform that connects pre-university students, undergraduates, and graduates from Pakistani universities. The goal is to help students choose a university and field of study based on verified, real world outcomes rather than marketing material or generic rankings.

The platform is built around three connected user groups:

| User Group | Role on the Platform |
|---|---|
| Pre-uni Students | Explore universities and fields of study matched to their academic background |
| Undergraduates | Confirm whether they made the right choice and share how their experience is progressing |
| Graduates | Rate their university and field of study, provide a recommendation level, and share their outcome after graduation |

Feedback from graduates and undergraduates feeds directly into the information shown to pre-university students, creating a continuous loop of verified, first hand insight.

---

## Core Features

- University and field of study directory tailored to Pakistani institutions
- Structured onboarding for three distinct user types, each with a separate contribution path
- A weighted ranking system for evaluating the credibility of shared experiences
- Interactive 3D hero section built with React Three Fiber
- Scroll driven page animations built with Framer Motion
- Authentication handled through NextAuth
- Persistent data storage using MongoDB

### Ranking Signals

The platform evaluates submitted experiences using the following signals before surfacing them to other users.

| Signal | Description |
|---|---|
| Verified Status | Confirmed enrollment or graduation rather than an anonymous claim |
| Recency | Newer experiences are weighted differently from older ones |
| Detail and Specificity | Detailed accounts carry more weight than vague, one line reviews |
| Consistency | Whether a review aligns with other reviews of the same program |
| Community Validation | Other users marking a review as genuinely helpful |
| Outcome Data | What happened after graduation, including further study or employment |

---

## Technology Stack

### Framework and Language

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Styling and Animation

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### 3D Rendering

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-61DAFB?style=for-the-badge&logo=react&logoColor=black)

### Authentication and Data

![NextAuth](https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=auth0&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

### Tooling

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Project Structure

```
UniLens/
├── app/                        Application routes and pages (Next.js App Router)
│   ├── layout.tsx              Root layout, metadata, and global fonts
│   └── page.tsx                Landing page composition
├── design-system/unilens/      Design tokens and design system assets
├── lib/                        Shared utilities, fonts, and configuration
├── public/                     Static assets
├── src/                        Application source components and logic
├── next.config.js              Next.js configuration
├── tailwind.config.ts          Tailwind CSS configuration
├── postcss.config.js           PostCSS configuration
├── package.json                Project dependencies and scripts
└── tsconfig.json               TypeScript configuration
```

---

## License and Usage Restrictions

This project is proprietary. It is not licensed under MIT, Apache, ISC, or any other open source license, regardless of what any placeholder value in the project configuration may state.

No permission is granted to any party to use, copy, modify, merge, publish, distribute, sublicense, deploy, or sell copies of this software, in whole or in part, for any purpose. Viewing the source code does not constitute a license to use it. All rights are reserved by the author.

Any use of this codebase requires prior written permission from the author.
