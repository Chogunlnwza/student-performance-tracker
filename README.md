# Student Performance Tracker 🎓

A modern, responsive web application designed for tracking student assignments, performance, and grades. Built with a React (Vite) frontend and an Express.js backend, featuring a premium UI with glassmorphism and smooth animations.

## 🌟 Features

- **Modern UI/UX**: Premium, responsive design utilizing Tailwind CSS v4 with glassmorphism effects, modern typography, and interactive hover animations.
- **Role-Based Workflows**:
  - **Teachers**: Can create new assignments, view all student submissions, grade assignments with feedback notes, and track overall student performance.
  - **Students**: Can view their pending tasks, submit homework with personal notes, and track their scores.
- **Interactive Dashboards**: Real-time data visualization using Recharts to display student performance metrics and progress.
- **RESTful API**: Custom backend built with Node.js and Express.js for managing the assignment lifecycle (Create, Submit, Grade, Delete).

## 🛠️ Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Recharts (Data Visualization)
- Axios & React Hot Toast

**Backend**
- Node.js
- Express.js
- CORS

**Deployment & Infrastructure**
- Vercel (Static Frontend + Serverless API Functions)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chogunlnwza/student-performance-tracker.git
   cd student-performance-tracker
   ```

2. **Start the Backend API**
   ```bash
   # Open a new terminal
   npm install   # (Run this in the root directory if dependencies are there, or inside backend folder)
   npm start     # Starts the Express server on port 3000
   ```

3. **Start the Frontend Application**
   ```bash
   # Open another terminal
   cd frontend
   npm install
   npm run dev   # Starts the Vite development server
   ```

## 🌐 Deployment on Vercel

This project is pre-configured for seamless deployment on **Vercel**. 
The included `vercel.json` handles the routing, ensuring that the React SPA (Single Page Application) works perfectly alongside the Express API.

- The frontend is built using `@vercel/static-build`.
- The backend API (`api/index.js`) is automatically deployed as Vercel Serverless Functions and accessible via the `/api/*` endpoint.
- All routing and fallback rules are handled automatically for React Router.

---
*Developed by Panuwit*

<br />

---

# Student Performance Tracker 🎓 (ภาษาไทย)

แอปพลิเคชันบนเว็บที่ออกแบบมาให้มีความทันสมัยและตอบสนองได้ดีเยี่ยม สำหรับการติดตามงานที่มอบหมาย ผลการเรียน และคะแนนของนักเรียน สร้างขึ้นด้วย Frontend จาก React (Vite) และ Backend จาก Express.js โดดเด่นด้วย UI ระดับพรีเมียมพร้อมเอฟเฟกต์ Glassmorphism และแอนิเมชันที่ลื่นไหล

## 🌟 ฟีเจอร์หลัก

- **UI/UX ทันสมัย**: ดีไซน์ระดับพรีเมียมและรองรับทุกขนาดหน้าจอ (Responsive) พัฒนาด้วย Tailwind CSS v4 พร้อมเอฟเฟกต์ Glassmorphism รูปแบบตัวอักษรที่สวยงาม และแอนิเมชันแบบ Interactive
- **ระบบตามบทบาทผู้ใช้**:
  - **คุณครู**: สามารถสร้างงานใหม่, ดูการส่งงานของนักเรียนทุกคน, ตรวจให้คะแนนพร้อมข้อความแนะนำ และติดตามผลการเรียนรวมของนักเรียนได้
  - **นักเรียน**: สามารถดูงานที่ต้องทำ, ส่งการบ้านพร้อมข้อความส่วนตัว และตรวจสอบคะแนนของตนเองได้
- **แดชบอร์ดแบบ Interactive**: นำเสนอข้อมูลแบบเรียลไทม์ด้วย Recharts เพื่อแสดงตัวชี้วัดประสิทธิภาพและความก้าวหน้าของนักเรียน
- **RESTful API**: ระบบ Backend เฉพาะกิจที่สร้างด้วย Node.js และ Express.js สำหรับจัดการวงจรชีวิตของงาน (สร้าง, ส่ง, ให้คะแนน, ลบ)

## 🛠️ เทคโนโลยีที่ใช้

**ฝั่งหน้าบ้าน (Frontend)**
- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Recharts (สำหรับการสร้างกราฟ)
- Axios & React Hot Toast

**ฝั่งหลังบ้าน (Backend)**
- Node.js
- Express.js
- CORS

**การนำระบบขึ้นเซิร์ฟเวอร์ (Deployment)**
- Vercel (ไฟล์ Static สำหรับ Frontend + Serverless API Functions สำหรับ Backend)

## 🚀 การเริ่มต้นใช้งาน

### สิ่งที่ต้องมี
- [Node.js](https://nodejs.org/) ติดตั้งบนเครื่องของคุณ

### สำหรับนักพัฒนา (Local Development)

1. **โคลน Repository**
   ```bash
   git clone https://github.com/Chogunlnwza/student-performance-tracker.git
   cd student-performance-tracker
   ```

2. **เปิดการทำงาน Backend API**
   ```bash
   # เปิดหน้าต่าง Terminal ขึ้นมาใหม่
   npm install   # (รันคำสั่งนี้เพื่อติดตั้งเครื่องมือที่จำเป็น)
   npm start     # เริ่มการทำงาน Express server บนพอร์ต 3000
   ```

3. **เปิดการทำงาน Frontend Application**
   ```bash
   # เปิดหน้าต่าง Terminal อีกอันขึ้นมา
   cd frontend
   npm install
   npm run dev   # เริ่มการทำงาน Vite development server
   ```

## 🌐 การนำระบบขึ้น Vercel

โปรเจกต์นี้ได้รับการตั้งค่าล่วงหน้าเพื่อให้พร้อมสำหรับการ Deploy ขึ้น **Vercel** อย่างราบรื่น
ไฟล์ `vercel.json` จะรับหน้าที่จัดการเรื่อง Routing เพื่อให้ React SPA (Single Page Application) สามารถทำงานควบคู่กับ Express API ได้อย่างสมบูรณ์

- Frontend จะถูก Build ด้วยคำสั่ง `@vercel/static-build`
- Backend API (`api/index.js`) จะถูก Deploy เป็น Vercel Serverless Functions โดยอัตโนมัติ และเรียกใช้งานผ่าน Endpoint `/api/*`
- กฎของ Routing และหน้า Fallback ทั้งหมดจะถูกจัดการโดยอัตโนมัติเพื่อให้ทำงานร่วมกับ React Router ได้อย่างไร้รอยต่อ

---
*พัฒนาโดย Panuwit*
