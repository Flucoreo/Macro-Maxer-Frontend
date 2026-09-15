# Macro Maxer — Frontend

FastAPI backend for **Macro Maxer**, an AI-powered nutrition analysis application that converts recipes and collections of foods written in natural language into structured nutritional information.

Built with Next.js and React, the frontend provides the user interface for authentication, nutrition analysis, visualization, and personalized nutrition targets.

> **Backend:** [Macro Maxer Backend](https://github.com/Flucoreo/Macro-Maxer-Backend)

---

## Overview

Macro Maxer is designed to make detailed nutrition analysis accessible without requiring users to manually enter every ingredient into a traditional nutrition database.

A user can enter something as simple as:

```text
2 slices of toast with 2 tbsp peanut butter,
a banana, and a glass of soy milk
```

The Frontend sends the description to the backend, which processes it with Gemini Flash and returns structured nutrition data. This data is converted into a clean visual presentation of the meal's nutritional profile.

Authenticated users can also enter their biometric information and nutrition targets, allowing the application to personalize their nutrition goals.

---

## Key Features

### AI Nutrition Analysis

Enter a recipe or collection of foods in natural language and receive a complete nutrient breakdown.

The frontend handles:

1. User input
2. Submission to the backend
3. Background-job status/result handling
4. Structured nutrition data
5. Visual presentation of the results

### User Authentication

The application provides:

* User registration
* Login
* Logout
* Persistent authenticated sessions
* Account deletion

Authentication is handled through the backend using JWT access and refresh tokens stored in HttpOnly cookies.

### Nutrition Visualization

Nutrition results are presented visually rather than as a raw JSON response.

This makes the information easier to scan and allows users to quickly understand the nutritional composition of their food.

### Personalized Nutrition Targets

Users can enter their biometric information and configure nutrition targets through the settings interface.

These targets allow the application to provide nutrition information in the context of the user's goals rather than treating every user identically.

---

## Application Structure

The frontend is organized around the major user flows of the application:

```text
Macro-Maxer-Frontend/
├── app/
│   ├── account/
│   └── components/
│   └── dashboard/
│   └── login/
│   └── settings/
│   └── auth.js
│   └── page.jsx
│   └── utils.js/
│   └── ...
├── components/
├── public/
├── Dockerfile
├── package.json
```

The application separates reusable UI components from page-level functionality and communicates with the FastAPI backend through HTTP requests.

---

## User Flow

The primary application flow is:

```text
┌───────────────────┐
│      Sign Up      │
│       / Login     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│     Dashboard     │
│                   │
│ Enter recipe /    │
│ collection of     │
│ foods             │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│      FastAPI     │
│      Backend      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Background AI    │
│       Job         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Gemini Flash     │
│                   │
│ Structured JSON   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Nutrition Results │
│                   │
│ Visual breakdown  │
└───────────────────┘
```

Users can also navigate to the settings page to update their nutrition targets.

---

## Pages

### Login / Signup

Provides account creation and authentication.

Only authenticated users can use the nutrition-analysis functionality.

### Dashboard

The primary application interface.

Users can:

* Enter recipes or collections of foods
* Submit nutrition-analysis requests
* View the resulting nutrient breakdown

### Settings

Allows users to update their personal nutrition information and targets.

---

## Architecture

The frontend communicates with the FastAPI backend rather than interacting directly with Gemini or the database.

```text
                    ┌─────────────────┐
                    │    Next.js      │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                          Axios
                             │
                             ▼
                    ┌─────────────────┐
                    │     FastAPI     │
                    │     Backend     │
                    └────────┬────────┘
                             │
                         Background
                            Job
                             │
                             ▼
                    ┌─────────────────┐
                    │  Gemini Flash   │
                    └─────────────────┘
```

This separation keeps the AI API key and backend infrastructure away from the client. The browser only communicates with the application's backend API.

---

## Technology Stack

| Technology              | Purpose                 |
| ----------------------- | ----------------------- |
| Next.js 15              | Frontend framework      |
| React 19                | UI library              |
| JavaScript / TypeScript | Application development |
| Axios                   | HTTP communication      |
| Docker                  | Containerization        |
| FastAPI                 | Backend API             |
| Gemini Flash            | AI nutrition analysis   |

---

## Backend Communication

The frontend uses Axios to communicate with the FastAPI backend creating a clear boundary between presentation and application/business logic.

The backend is responsible for:

* Authentication
* User management
* Nutrition-analysis requests
* AI processing
* Nutrition-target persistence

The frontend is responsible for:

* User interaction
* Form handling
* Application state
* Loading/error states
* Nutrition-result visualization
* Navigation
* Presenting personalized targets

---

## Authentication

Authentication is implemented by the backend using JWT access and refresh tokens.

The tokens are stored as **HttpOnly cookies**, meaning the frontend does not need to directly access or manage the raw token values.

The frontend instead relies on authenticated requests to the backend.

---

## Asynchronous AI Requests

One of the main frontend/backend integration challenges was handling the latency of AI requests.

A conventional request would look like:

```text
Frontend
   │
   │ POST /analyze
   ▼
FastAPI
   │
   │ Wait for Gemini
   ▼
Gemini
   │
   │ Response
   ▼
FastAPI
   │
   ▼
Frontend
```

The problem is that Gemini can take long enough to process a request that the frontend's HTTP connection may time out before the backend returns the result.

Macro Maxer uses a background job architecture:

```text
Frontend
   │
   │ Submit analysis
   ▼
FastAPI
   │
   │ Queue job
   ▼
Redis / RQ
   │
   │ Process asynchronously
   ▼
Gemini Flash
   │
   │ Structured result
   ▼
Backend
   │
   ▼
Frontend
```

The frontend is designed to work with an asynchronous processing model rather than assuming that every nutrition-analysis request will complete within a normal HTTP request lifecycle.

---

## Getting Started

### Prerequisites

You will need:

* Node.js
* npm

You will also need a running instance of the Macro Maxer backend.

### Clone the Repository

```bash
git clone https://github.com/Flucoreo/Macro-Maxer-Frontend.git
cd Macro-Maxer-Frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

The frontent needs the url the backend is listening on.

For example:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will then be available through the local Next.js development server.

The FastAPI backend must also be running for authentication and nutrition-analysis functionality to work.

---

## Docker

The repository includes a `Dockerfile` for containerization.

Containerizing the frontend provides a consistent Node.js runtime and makes it easier to deploy the application alongside the backend.

The frontend and backend are maintained as separate repositories and can therefore be built and deployed independently.

---

## Development

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

---

## Design Goals

Macro Maxer's frontend is designed around three primary goals.

### 1. Simplicity

Nutrition information can become overwhelming quickly.

The interface therefore focuses on presenting the most useful information clearly rather than exposing users to raw nutritional data or complex configuration.

### 2. Natural-language interaction

The user shouldn't need to understand the underlying nutrition database or AI system.

They simply describe what they ate, and the application handles the translation from natural language into structured nutritional information.

### 3. Personalized information

Nutrition targets are highly dependent on the individual.

The application therefore allows users to provide biometric information and configure nutrition targets rather than presenting the same targets to every user.

---

## Future Improvements

Potential future improvements include:

* Automated frontend tests
* Improved loading and job-status UX
* Persistent nutrition history
* Saved recipes
* Improved AI validation
* Nutrition database integration
* Accessibility improvements

---

## Related Repository

The FastAPI backend is maintained separately:

**Macro Maxer Backend**
https://github.com/Flucoreo/Macro-Maxer-Backend

---

## License

This project is currently a portfolio project.