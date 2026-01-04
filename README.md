# 🏡 HappyNest: AI-Powered Residential Architecture Platform

**HappyNest** is a cutting-edge full-stack application that democratizes architectural design through artificial intelligence. By combining a robust Spring Boot backend with a high-performance React 19 frontend, HappyNest allows users to visualize their dream homes instantly with precision, style, and professional insight.

![HappyNest Banner](https://img.shields.io/badge/Architecture-AI--Driven-emerald?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o--mini-orange?style=for-the-badge&logo=openai&logoColor=white)

---

## ✨ The HappyNest Experience

HappyNest transforms the traditional, often expensive, architectural planning process into a seamless, interactive experience.

### 🤖 **Intelligent Discovery Assistant**
Not sure where to start? Our **Discovery Assistant** asks intuitive questions about your lifestyle, family dynamics, and design preferences to suggest the optimal home configuration before you even enter your plot details.

### 📐 **Precision Requirements Engine**
Input your specific constraints to get reality-ready results:
- **Plot Dimensions**: Specify size in feet (e.g., 40x60).
- **Multi-Floor Support**: Design up to 5 floors with custom BHK configurations for each level.
- **Vastu & Facing**: Choose from North, South, East, or West orientations.
- **Budget-Aware Design**: AI generates material and layout suggestions tailored to your specific INR budget.
- **Custom Mandatories**: Add specific needs like a "Prayer Room", "Home Office", or "Open Kitchen".

### 🏛️ **Triple-Reality Generation**
Receive three distinct architectural directions for every project:
1.  **Plan A: Budget Optimized** — Maximizing utility and space efficiency within your core budget.
2.  **Plan B: Enhanced Comfort** — Adding premium lifestyle features and improved material specifications.
3.  **Plan C: Luxury Tier** — A "no-compromise" vision with high-end architectural highlights and expansive layouts.

### 📥 **Professional Architectural Viewer**
- **Side-by-Side Visualization**: View the **2D Floor Plan Blueprint** and the **3D Exterior Render** simultaneously.
- **Rich Technical Details**: Get AI-generated insights into **Light & Ventilation**, room-by-room dimensions, and overall project highlights.
- **High-Res Export**: Download your chosen plan as a high-quality PNG image via the built-in export tool.

---

## 🛠️ Technical Architecture

### **Frontend (The Visual Core)**
- **Framework**: React 19 (using modern Hooks and Context API).
- **Styling**: Tailwind CSS for a premium, responsive UI.
- **Build Tool**: Vite for lightning-fast development and optimized production builds.
- **Visualization**: `html2canvas` for high-fidelity plan export.

### **Backend (The Intelligent Brain)**
- **Framework**: Spring Boot 3.x.
- **Execution Model**: Reactive Spring WebFlux for non-blocking AI orchestration.
- **AI Integration**: Custom OpenAI Architecture Engine optimized for `gpt-4o-mini`.
- **Logic**: Intelligent JSON cleansing and structured data parsing for robust UI rendering.

### **Database & Persistence**
- **PostgreSQL**: Reliable storage for user profiles and project history.
- **Session Support**: Integrated LocalStorage management for instant design retrieval.

---

## 🚀 Getting Started

### **Prerequisites**
- **Java 17+** (LTS recommended)
- **Node.js 18+** & npm
- **PostgreSQL** Instance
- **OpenAI API Key**

### **Installation**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/shadevaraj/HappyNest.git
    cd HappyNest
    ```

2.  **Backend Setup**
    - Navigate to `backend/src/main/resources/application.properties`.
    - Configure your database and OpenAI key:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/happynest
    spring.datasource.username=postgres
    spring.datasource.password=your_password
    openai.api.key=sk-your-openai-api-key
    ```
    - Run the backend:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

3.  **Frontend Setup**
    - Navigate to the `frontend` directory:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    - Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
HappyNest/
├── backend/
│   ├── src/main/java/com/architect/app/
│   │   ├── controller/        # REST Endpoints
│   │   ├── service/           # OpenAI Logic & Business Rules
│   │   ├── model/             # Entities
│   │   └── repository/        # Data Access
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/        # UI Components (Form, Results, Viewer)
│   │   ├── pages/             # Dashboard, Discovery, Home
│   │   └── context/           # State Management
│   └── package.json
└── README.md
```

---

**Built with ❤️ by the HappyNest Team**
*Empowering you to visualize home, before it's built.*
