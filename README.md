# UniLens

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

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| 3D Rendering | React Three Fiber, drei, Three.js |
| Animation | Framer Motion |
| Authentication | NextAuth |
| Database | MongoDB (via Mongoose) |
| Password Hashing | bcryptjs |
| Schema Validation | Zod |
| Icons | lucide-react |
| Linting and Formatting | ESLint, Prettier |
| Deployment | Vercel |

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

## Getting Started

### Prerequisites

The following must be available on the local machine before setup.

| Requirement | Notes |
|---|---|
| Node.js | Version 18 or later |
| npm | Included with Node.js |
| MongoDB | A running instance or a hosted connection string |

### Installation

1. Clone the repository.

   ```
   git clone https://github.com/RMIN06/UniLens.git
   cd UniLens
   ```

2. Install the project dependencies.

   ```
   npm install
   ```

3. Create a local environment file and provide the required values.

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3002
   ```

4. Start the development server.

   ```
   npm run dev
   ```

5. Open the application in a browser at:

   ```
   http://localhost:3002
   ```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server on port 3002 |
| `npm run build` | Builds the application for production |
| `npm run start` | Runs the production build on port 3002 |
| `npm run lint` | Runs the Next.js linter against the codebase |

---

## Deployment

The application is deployed on Vercel and is configured to build automatically from the `main` branch. Any Next.js compatible hosting provider can also be used by running the build and start commands listed above, provided the required environment variables are configured on that platform.

---

## License

The package configuration declares an ISC license. No formal license file is currently included in the repository. Until a license file is added, all rights to the source code are reserved by the author.
