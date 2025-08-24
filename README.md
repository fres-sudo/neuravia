# 🧠 BOOST

BOOST is a precision cognitive care platform designed to empower families and healthcare providers.  
It provides tools to manage patients, caregivers, cognitive games, MRI analysis, and personalized settings, combining **Next.js**, **tRPC**, **Turso/libSQL**, and **OpenAI**.

---

## ✨ Features

- 👩‍⚕️ **Patient & Caregiver Management**  
  Add, update, and manage patients with detailed initial information.

- ⚙️ **Custom Settings**  
  Each patient has personalized settings (language, difficulty sensitivity, reminders, etc.).

- 🧩 **Cognitive Tools**  
  Support for cognitive games, Alzheimer scoring, and MRI analysis.

- 🤖 **AI-powered Enhancements**  
  Automatic emoji generation for patient jobs (via OpenAI API).

- 📂 **File Uploads**  
  MRI scans and patient images stored in `/public/uploads`.

- 🔐 **Authentication & Authorization**  
  Role-based access for caregivers and patients.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) + [React](https://reactjs.org/)  
- **API Layer**: [tRPC](https://trpc.io/) + [Zod](https://zod.dev/)  
- **Database**: [Turso (libSQL)](https://turso.tech/) with drizzle ORM  
- **AI Integration**: [OpenAI API](https://platform.openai.com/)  

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/fres-sudo/neuravia.git
cd neuravia
npm install
```
(try with `npm install --legacy-peer-deps` if you face issues)

Set up environment variables in a `.env` file:

```env
DATABASE_URL=...
DATABASE_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


#### 🖼️ Image Processing Setup
To enable image uploads and processing, we have a separate Python-based server that use FastAPI to expose an endpoint for MRI classification.

Clone the repository and install dependencies:

```bash
git clone https://github.com/glaucorampone/NeuraVia-Hacks.git
cd NeuraVia-Hacks
pip install -r requirements.txt
```

Launch the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 5000
```

Ensure that the `USE_MOCK_DATA` variable in the `src/app/patient/[id]/upload/page.tsx` file is set to `false` to enable real MRI classification.
