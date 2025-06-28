# 🏋️‍♂️ Next.js AI Fitness App

An **AI-powered Fitness Application** built with **Next.js**, **TypeScript**, and **Tailwind CSS**.
This app allows users to:

✅ Sign up, sign in, and authenticate with Google & GitHub

✅ Verify email via OTP

✅ Reset forgotten passwords

✅ Upload a profile image

✅ Generate personalized fitness plans with the Gemini API

✅ Manage workout data and plans

✅ Receive workout plans via email

---

## ✨ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwind-css\&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?logo=framer\&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-000000?logo=next-auth\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-yellowgreen)
![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?logo=google\&logoColor=white)
![GitHub OAuth](https://img.shields.io/badge/GitHub%20OAuth-181717?logo=github\&logoColor=white)
![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google\&logoColor=white)

---

## 🌟 Features

* **Authentication**

  * Email/password signup and login
  * OAuth login with Google and GitHub
  * Email verification via OTP
  * Password reset via email

* **User Profile**

  * Upload a profile avatar using Cloudinary

* **AI Fitness Planner**

  * Generate personalized workout plans with the Google Gemini API
  * Save and manage workout data
  * Send workout plans to the user's email

---

## 📂 Folder Structure

```
fitness/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── register/route.ts
│   │   ├── forgot-password/route.ts
│   │   ├── resend-otp/route.ts
│   │   └── user/
│   │       ├── avatar/route.ts
│   │       ├── generate-plan/route.ts
│   │       ├── send-plan/route.ts
│   │       ├── workout-data/route.ts
│   │       ├── workout-plan/route.ts
│   │       └── verify-otp/route.ts
│   ├── forgot-password/page.tsx
│   ├── signup/page.tsx
│   ├── login/page.tsx
│   ├── workout-planner/page.tsx
│   ├── verify-otp/page.tsx
│   └── workout-plan/page.tsx
│
├── lib/
│   ├── cloudinary.ts
│   ├── mongodb.ts
│   └── send-email.ts
│
├── models/
│   └── User.ts
│
├── types/
│   └── next-auth.d.ts
│
├── public/
│   └── (static assets, icons, images)
│
├── styles/
│   └── (global styles, Tailwind config)
│
├── .env
├── .gitignore
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/syedomer17/Next.js-AI-fitness-App.git
cd Next.js-AI-fitness-App
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```ini
MONGODB_URI=

EMAIL_USER=
EMAIL_PASS=

NEXTAUTH_SECRET=
RESET_SECRET=

NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GOOGLE_GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

✅ **Note:** Never commit `.env` files to public repositories.

---

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).

---

## 📧 Contact

If you have questions, suggestions, or feedback, feel free to reach out!

---

**Enjoy building your AI Fitness journey! 💪**

---
