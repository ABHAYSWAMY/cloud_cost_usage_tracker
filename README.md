# Cloud Cost Usage Analyzer

A full-stack web application that analyzes cloud billing CSV files and provides clear, actionable insights on cost usage across services and regions.

This project was built to understand how real-world cloud cost analytics systems ingest data, process it reliably, and expose meaningful insights through APIs and dashboards.

---

## 🚀 Features

- Upload and parse large cloud billing CSV files
- Cost breakdown by service and region
- Trend analysis and spike detection
- Automatically generated cost insights
- Secure authentication using GitHub OAuth
- Production-ready API routes and database integration

---

## 🧠 Why This Project

Cloud billing data is noisy, repetitive, and hard to interpret.  
This project focuses on **backend correctness, data handling, and system design**, rather than just UI.

It explores:
- reliable CSV ingestion
- API design for analytics
- database modeling for time-series cost data
- cloud deployment constraints (serverless, cold starts, caching)

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth (GitHub OAuth)
- **Deployment**: Vercel

---

## 📊 Sample Data

This repository includes generated sample cloud billing CSV files for demo and testing purposes.

You can find them in: /cloudcost/public/samples


These files can be uploaded directly to explore analytics and insights without using real billing data.

---

## 🌍 Live Demo

The application is deployed and accessible here:

👉 https://cloud-cost-usage-tracker.vercel.app

---

## ⚠️ Notes & Limitations

- File uploads are handled in-memory due to serverless constraints
- This project is designed for analytics exploration, not billing enforcement
- Background job processing is intentionally kept out of scope

---

## 📌 Future Ideas (Optional)

- Background processing for large uploads
- Cost forecasting using historical trends
- Multi-cloud billing normalization
- Role-based access control

---

## 📄 License

This project is for learning and demonstration purposes.

