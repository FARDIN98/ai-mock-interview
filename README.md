<div align="center">
  
  
  <div>
    <img src="https://img.shields.io/badge/-Next.JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-Vapi-white?style=for-the-badge&color=5dfeca" alt="vapi" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logoColor=white&logo=firebase&color=DD2C00" alt="firebase" />
  </div>

  <h3 align="center">Prepwise: A job interview preparation platform powered by Vapi AI Voice agents</h3>

   
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🔄 [Data Flow](#data-flow)
5. 🧪 [Testing Strategy & Results](#testing)
6. ⚡ [Performance Optimization](#performance)
7. 🤸 [Quick Start](#quick-start)
8. 🕸️ [Snippets](#snippets)
9. 🔗 [Assets](#links)

## <a name="introduction">🤖 Introduction</a>

Built with Next.js for the user interface and backend logic, Firebase for authentication and data storage, styled with TailwindCSS and using Vapi's voice agents, Prepwise is a website project designed to integrate AI models with web/mobile apps. The platform offers a sleek and modern experience for job interview preparation.




## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- Firebase
- Tailwind CSS
- Vapi AI
- shadcn/ui
- Google Gemeni
- Zod

## <a name="features">🔋 Features</a>

👉 **Authentication**: Sign Up and Sign In using password/email & Google authentication handled by Firebase.

👉 **Create Interviews**: Easily generate job interviews with help of Vapi voice assistants and Google Gemini.

👉 **Get feedback from AI**: Take the interview with AI voice agent, and receive instant feedback based on your conversation.

👉 **Modern UI/UX**: A sleek and user-friendly interface designed for a great experience.

👉 **Interview Page**: Conduct AI-driven interviews with real-time feedback and detailed transcripts.

👉 **Progressive Web App (PWA)**: Install the app on your device for offline access, faster loading times, and a native-like experience.

👉 **Dashboard**: Manage and track all your interviews with easy navigation.

👉 **Responsiveness**: Fully responsive design that works seamlessly across devices.

and many more, including code architecture and reusability

## <a name="data-flow">🔄 Data Flow</a>

Prepwise's architecture follows a streamlined data flow that enables seamless interview preparation and feedback:

### User Authentication Flow
- **Sign Up/Sign In**: Firebase Authentication handles user credentials and session management
- **User Data Storage**: User profiles and preferences are stored in Firebase Firestore
- **Session Management**: Next.js server-side authentication maintains secure user sessions

### Interview Creation Flow
1. **User Input**: User selects job role, experience level, tech stack, and interview type
2. **Question Generation**: 
   - Request sent to Google Gemini AI via API
   - AI generates relevant interview questions based on parameters
   - Questions are formatted and stored in Firebase

### Interview Execution Flow
1. **Voice Interaction**:
   - Vapi AI voice agent retrieves questions from Firebase
   - Real-time voice conversation between user and AI interviewer
   - Speech-to-text conversion of user responses

2. **Transcript Processing**:
   - Voice responses converted to text
   - Complete interview transcript stored in Firebase

### Feedback Generation Flow
1. **Analysis**:
   - Interview transcript sent to Google Gemini AI
   - AI analyzes responses across multiple categories

2. **Scoring and Recommendations**:
   - AI generates scores for communication, technical knowledge, problem-solving, etc.
   - Provides detailed feedback with strengths and areas for improvement
   - Feedback stored in Firebase and linked to the interview

### Data Persistence
- All user data, interviews, and feedback are stored in Firebase Firestore
- Secure access controls ensure users only access their own interview data

## <a name="testing">🧪 Testing Strategy & Results</a>

Prepwise implements comprehensive testing to ensure reliability, performance, and code quality across all components and features.

### Testing Approach

#### **Unit Testing**
- **Component Testing**: Individual React components tested in isolation
- **Function Testing**: Utility functions and helper methods validation
- **Mock Implementation**: External dependencies mocked for controlled testing
- **Type Safety**: TypeScript integration ensures proper type checking

#### **Integration Testing**
- **Workflow Testing**: End-to-end user journey validation
- **API Integration**: Backend service integration verification
- **Authentication Flow**: Complete sign-in/sign-up process testing
- **Error Handling**: Comprehensive error scenario coverage

#### **Test Coverage Areas**
- ✅ **Frontend Components**: Agent, InterviewCard, AuthForm, UI Components
- ✅ **Backend Logic**: Authentication, Interview Management, Feedback Generation
- ✅ **Utility Functions**: Class utilities, Date formatting, Validation
- ✅ **API Routes**: VAPI integration, AI service endpoints
- ✅ **Database Operations**: Firebase Firestore CRUD operations

### Test Results Summary

| **Test Category** | **Test Suites** | **Total Tests** | **Pass Rate** | **Coverage** |
|-------------------|-----------------|-----------------|---------------|---------------|
| **Unit Tests** | 4 | 65 | 100% ✅ | Components, Utils |
| **Integration Tests** | 1 | 12 | 100% ✅ | User Workflows |
| **API Tests** | 1 | 3 | 100% ✅ | VAPI Integration |
| **Total** | **6** | **80** | **100%** | **Full Coverage** |

### Test Suite Breakdown

| **Test Suite** | **File** | **Tests** | **Focus Area** | **Status** |
|----------------|----------|-----------|----------------|------------|
| **Agent Component** | `Agent.test.tsx` | 8 | Voice AI Interface | ✅ Pass |
| **InterviewCard Component** | `InterviewCard.test.tsx` | 8 | Interview Display | ✅ Pass |
| **General Actions** | `general.action.test.ts` | 25 | Backend Logic | ✅ Pass |
| **Utils Functions** | `utils.test.ts` | 24 | Utility Functions | ✅ Pass |
| **Integration Workflow** | `interview-workflow.test.tsx` | 12 | End-to-End Flow | ✅ Pass |
| **VAPI Integration** | `vapi/generate/route.test.ts` | 3 | AI API Integration | ✅ Pass |

### Quality Metrics

- **TypeScript Compliance**: 100% - No `any` types, proper type safety
- **ESLint Compliance**: 100% - Code quality standards maintained
- **Test Execution Time**: ~1.3 seconds average
- **Mock Coverage**: External dependencies properly mocked
- **Error Scenarios**: Comprehensive error handling tested

### Testing Tools & Configuration

- **Framework**: Jest with Next.js integration
- **Testing Library**: React Testing Library for component testing
- **Environment**: jsdom for browser simulation
- **Mocking**: Jest mocks for external services
- **Coverage**: Automated coverage collection
- **CI/CD**: Automated testing on code changes

## <a name="performance">⚡ Performance Optimization</a>

Prepwise implements several performance optimization techniques to ensure a fast, responsive user experience:

### Code Splitting & Lazy Loading
- **Dynamic Imports**: Components like `InterviewCard` and `DisplayTechIcons` are loaded dynamically using Next.js's dynamic import functionality
- **Suspense Boundaries**: React Suspense is used throughout the application to provide smooth loading states while components or data are being fetched

### Image Optimization
- **Next.js Image Component**: All images use the optimized Image component with proper sizing, formats, and loading priorities
- **Priority Loading**: Critical above-the-fold images use the `priority` attribute to ensure they load first
- **Eager Loading**: Important UI elements use `loading="eager"` to improve perceived performance

### Data Fetching
- **Parallel Data Fetching**: `Promise.all` is used to fetch multiple data sources simultaneously (e.g., user interviews and latest interviews)
- **Data Caching**: Functions like `getCachedFeedback` implement caching to prevent redundant API calls

### Component Optimization
- **Skeleton Loading**: Custom skeleton loaders provide visual feedback during component loading
- **Conditional Rendering**: Components only render when necessary based on data availability
- **Optimized Rendering**: Careful management of component re-renders with proper key usage in lists

### Resource Prioritization
- **Critical CSS**: Important styles are inlined to reduce render-blocking resources
- **Asset Preloading**: Key assets are preloaded to improve initial page load performance

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/FARDIN98/ai-mock-interview
cd ai_mock_interviews
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

GOOGLE_GENERATIVE_AI_API_KEY=

NEXT_PUBLIC_BASE_URL=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Replace the placeholder values with your actual **[Firebase](https://firebase.google.com/)**, **[Vapi](https://vapi.ai/?utm_source=youtube&utm_medium=video&utm_campaign=jsmastery_recruitingpractice&utm_content=paid_partner&utm_term=recruitingpractice)** credentials.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>globals.css</code></summary>

```css
@import "tailwindcss";

@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-success-100: #49de50;
  --color-success-200: #42c748;
  --color-destructive-100: #f75353;
  --color-destructive-200: #c44141;

  --color-primary-100: #dddfff;
  --color-primary-200: #cac5fe;

  --color-light-100: #d6e0ff;
  --color-light-400: #6870a6;
  --color-light-600: #4f557d;
  --color-light-800: #24273a;

  --color-dark-100: #020408;
  --color-dark-200: #27282f;
  --color-dark-300: #242633;

  --font-mona-sans: "Mona Sans", sans-serif;

  --bg-pattern: url("/pattern.png");
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: var(--light-100);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  p {
    @apply text-light-100;
  }
  h2 {
    @apply text-3xl font-semibold;
  }
  h3 {
    @apply text-2xl font-semibold;
  }
  ul {
    @apply list-disc list-inside;
  }
  li {
    @apply text-light-100;
  }
}

@layer components {
  .btn-call {
    @apply inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible;

    .span {
      @apply bg-success-100 h-[85%] w-[65%];
    }
  }

  .btn-disconnect {
    @apply inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28;
  }

  .btn-upload {
    @apply flex min-h-14 w-full items-center justify-center gap-1.5 rounded-md;
  }
  .btn-primary {
    @apply w-fit !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10;
  }
  .btn-secondary {
    @apply w-fit !bg-dark-200 !text-primary-200 hover:!bg-dark-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10;
  }

  .btn-upload {
    @apply bg-dark-200 rounded-full min-h-12 px-5 cursor-pointer border border-input  overflow-hidden;
  }

  .card-border {
    @apply border-gradient p-0.5 rounded-2xl w-fit;
  }

  .card {
    @apply dark-gradient rounded-2xl min-h-full;
  }

  .form {
    @apply w-full;

    .label {
      @apply !text-light-100 !font-normal;
    }

    .input {
      @apply !bg-dark-200 !rounded-full !min-h-12 !px-5 placeholder:!text-light-100;
    }

    .btn {
      @apply !w-full !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer;
    }
  }

  .call-view {
    @apply flex sm:flex-row flex-col gap-10 items-center justify-between w-full;

    h3 {
      @apply text-center text-primary-100 mt-5;
    }

    .card-interviewer {
      @apply flex-center flex-col gap-2 p-7 h-[400px] blue-gradient-dark rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-1/2 w-full;
    }

    .avatar {
      @apply z-10 flex items-center justify-center blue-gradient rounded-full size-[120px] relative;

      .animate-speak {
        @apply absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75;
      }
    }

    .card-border {
      @apply border-gradient p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-md:hidden;
    }

    .card-content {
      @apply flex flex-col gap-2 justify-center items-center p-7 dark-gradient rounded-2xl min-h-full;
    }
  }

  .transcript-border {
    @apply border-gradient p-0.5 rounded-2xl w-full;

    .transcript {
      @apply dark-gradient rounded-2xl  min-h-12 px-5 py-3 flex items-center justify-center;

      p {
        @apply text-lg text-center text-white;
      }
    }
  }

  .section-feedback {
    @apply flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7;

    .buttons {
      @apply flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center;
    }
  }

  .auth-layout {
    @apply flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4 max-sm:py-8;
  }

  .root-layout {
    @apply flex mx-auto max-w-7xl flex-col gap-12 my-12 px-16 max-sm:px-4 max-sm:my-8;
  }

  .card-cta {
    @apply flex flex-row blue-gradient-dark rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4;
  }

  .interviews-section {
    @apply flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch;
  }

  .interview-text {
    @apply text-lg text-center text-white;
  }

  .progress {
    @apply h-1.5 text-[5px] font-bold bg-primary-200 rounded-full flex-center;
  }

  .tech-tooltip {
    @apply absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-md;
  }

  .card-interview {
    @apply dark-gradient rounded-2xl min-h-full flex flex-col p-6 relative overflow-hidden gap-10 justify-between;

    .badge-text {
      @apply text-sm font-semibold capitalize;
    }
  }
}

@utility dark-gradient {
  @apply bg-gradient-to-b from-[#1A1C20] to-[#08090D];
}

@utility border-gradient {
  @apply bg-gradient-to-b from-[#4B4D4F] to-[#4B4D4F33];
}

@utility pattern {
  @apply bg-[url('/pattern.png')] bg-top bg-no-repeat;
}

@utility blue-gradient-dark {
  @apply bg-gradient-to-b from-[#171532] to-[#08090D];
}

@utility blue-gradient {
  @apply bg-gradient-to-l from-[#FFFFFF] to-[#CAC5FE];
}

@utility flex-center {
  @apply flex items-center justify-center;
}

@utility animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

</details>

<details>
<summary><code>lib/utils.ts</code></summary>

```javascript
import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

```

</details>

<details>
<summary><code>Generate questions prompt (/app/api/vapi/generate/route.tsx):</code></summary>

```javascript
`Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `;
```

</details>

<details>
<summary><code>Generate feedback prompt (lib/actions/general.action.ts):</code></summary>

```javascript
prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
```

</details>

<details>
<summary><code>Display feedback (app/(root)/interview/[id]/feedback/page.tsx):</code></summary>

```javascript
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
```

</details>

<details>
<summary><code>Dummy Interviews:</code></summary>

```javascript
export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
```

</details>


## <a name="links">🔗 Assets</a>

Public assets used in the project can be found [here](https://drive.google.com/drive/folders/1DuQ9bHH3D3ZAN_CFKfBgsaB8DEhEdnog?usp=sharing)

