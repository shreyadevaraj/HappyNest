# 🏡 HappyNest - AI-Powered Residential Architecture Platform

**HappyNest** is an intelligent full-stack web application that revolutionizes home design by generating personalized residential floor plans using advanced OpenAI integration. Users can input their requirements and instantly receive three professionally designed architectural plans with AI-generated visualizations tailored to their plot, budget, and lifestyle.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot)
![OpenAI](https://img.shields.io/badge/AI-OpenAI%20gpt--4o--mini-orange)

---

## 🎯 What Does HappyNest Do?

HappyNest transforms the complex process of residential architecture planning into a simple, AI-powered experience:

1. **Discovery Assistant**: Use our "✨ Let AI Help" mode if you're not sure about your requirements. The assistant asks about your lifestyle, family size, and preferences to suggest the best configuration.
2. **Project Requirements**: Directly input plot size, budget, number of floors, facing direction, and custom needs.
3. **AI Generates 3 Plans**: Receive three competing design realities:
   - **Plan A**: Budget-Optimized (Maximizing value within your exact budget)
   - **Plan B**: Enhanced Comfort (Balanced design with smart lifestyle features)
   - **Plan C**: Luxury Tier (Premium layout with high-end architectural concepts)
4. **Visualize & Export**: View high-quality architectural renders, detailed room dimensions, and download your chosen floor plan as an image.
5. **Save & Manage**: Save selected plans to your profile and manage your project history from your dashboard.

---

## ✨ Key Features

### 🤖 **AI Architecture Engine (Powered by OpenAI)**
- **STRICT LOW-COST Mode**: Optimized for high-quality results using `gpt-4o-mini` to minimize API latency and cost.
- **Dynamic Feature Generation**: AI brainstorms premium room features and architectural highlights tailored to each specific plan.
- **Robust Layout Analysis**: Detailed insights into Light & Ventilation for every generated design.

### 🧭 **AI Discovery Assistant**
- **Lifestyle-Driven Design**: Asks intuitive questions about "The Entertainer", "The Professional", or "The Minimalist" lifestyles.
- **Automated Configuration**: Suggests optimal floor counts and BHK types based on family size and budget.

### 💰 **Smart Budgeting**
- Three-tier pricing strategy (Plan A, B, and C) helps users understand what they can build at different budget levels.
- AI-generated cost-effective material recommendations.

### 🏗️ **Professional Visualization**
- **Side-by-Side Viewer**: View the 2D Blueprint and 3D Exterior render together.
- **Instant Downloads**: Export generated plans to share with contractors or architects.

### 👤 **User Dashboard**
- Persistent project storage using LocalStorage (Session) and Database backup.
- Manage multiple properties and design versions in one place.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.x** - Modern UI with Hooks and Context API.
- **Tailwind CSS** - Premium, responsive design system.
- **Vite** - High-performance build tooling.
- **Health-Check & Error Handling**: Robust API parsing to handle diverse AI response formats.

### **Backend**
- **Spring Boot 3.x** - Robust enterprise Java backend.
- **Spring WebFlux** - Reactive architecture for non-blocking AI API calls.
- **PostgreSQL** - Relational data storage for user profiles and projects.
- **Maven** - Dependency and build management.

### **AI Core**
- **OpenAI API** - Using `gpt-4o-mini` for fast, intelligent architectural planning.
- **Dynamic Image Prompts**: AI-generated prompts for photorealistic architectural visualization.

---

## 🚀 Getting Started

### **Prerequisites**
- Java 17+ (LTS recommended)
- Node.js 18+ and npm
- PostgreSQL running locally or on cloud
- OpenAI API Key

### **Backend Configuration**
1. Navigate to `backend/src/main/resources/application.properties`.
2. Configure your database and OpenAI key:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/happynest
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   
   openai.api.key=sk-your-openai-api-key
   ```
3. Run using Maven:
   ```powershell
   ./mvnw spring-boot:run
   ```

### **Frontend Configuration**
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```
HappyNest/
├── backend/
│   ├── src/main/java/com/architect/app/
│   │   ├── controller/        # REST Endpoints (CostOptimized Controller)
│   │   ├── service/           # OpenAI Integration & JSON Cleaning logic
│   │   ├── model/             # Architect & Project Entity models
│   │   └── repository/        # Spring Data JPA Repositories
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/        # ArchitectForm, PlanResults, FloorPlanViewer
│   │   ├── pages/             # Home, Discovery, Dashboard, Architects
│   │   ├── context/           # AuthContext (User session management)
│   │   └── App.jsx            # Routing and protected routes
│   └── package.json
└── README.md
```

---

## 🎯 Recent Cleanup & Optimizations
- **Removed Legacy Services**: Cleaned up HuggingFace and older Mistral integrations to focus on superior OpenAI performance.
- **Improved Parsing**: Implemented robust JSON cleaning to handle conversational AI output without crashing the frontend.
- **Performance**: Switched to a reactive backend model to handle multiple concurrent AI requests efficiently.

---

**Built with ❤️ by the HappyNest Team**
*Empowering homeowners to visualize their dream homes before breaking ground*
