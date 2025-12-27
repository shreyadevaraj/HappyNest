# 🏡 HappyNest - AI-Powered Residential Architecture Platform

**HappyNest** is an intelligent full-stack web application that revolutionizes home design by generating personalized residential floor plans using cutting-edge AI technology. Users can input their requirements and instantly receive three professionally designed architectural plans with AI-generated visualizations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot)

---

## 🎯 What Does HappyNest Do?

HappyNest transforms the complex process of residential architecture planning into a simple, AI-powered experience:

1. **Input Your Requirements**: Specify plot size, budget, house type (1BHK to Villa), facing direction, floors, and Vaastu preferences
2. **AI Generates 3 Plans**: Receive three competing design options:
   - **Plan A**: Budget-Optimized (matches your exact budget)
   - **Plan B**: Balanced Modern (15-20% above budget with premium features)
   - **Plan C**: Premium Luxury (50%+ above budget with high-end finishes)
3. **Visualize Your Dream Home**: Each plan includes:
   - AI-generated exterior architectural renders
   - Interior room visualizations (Living Room, Kitchen, Bedroom)
   - Detailed specifications (dimensions, materials, Vaastu compliance)
   - Light & ventilation strategies
   - Budget breakdown
4. **Save & Manage**: Select your favorite plan, save it to your dashboard, and manage all your projects

---

## ✨ Key Features

### 🤖 **AI-Powered Architecture Engine**
- **Dynamic Floor Plans**: Three unique architectural designs generated per request
- **AI Image Generation**: Photorealistic exterior renders using Hugging Face Stable Diffusion XL
- **Intelligent Text Generation**: Detailed plan descriptions using Mistral-7B AI model
- **Interior Visualizations**: Curated interior images for Living Room, Kitchen, and Master Bedroom

### 🧭 **Vaastu Shastra Integration**
- Three compliance levels: Strict, Moderate, or None
- Automatic room placement based on traditional Vaastu principles
- Directional optimization for North, South, East, and West facing plots
- Entrance and room positioning recommendations

### 💰 **Smart Budget Planning**
- **Plan A**: Exact budget match with cost-effective materials
- **Plan B**: 15-20% premium with modern finishes
- **Plan C**: 50%+ luxury tier with high-end features
- Real-time budget calculations and material recommendations

### 🏗️ **Comprehensive Specifications**
- Plot size calculations and optimization
- Floor-wise room distribution
- Light & ventilation strategies based on facing direction
- Material recommendations (flooring, walls, roofing)
- Construction timeline estimates

### 👤 **User Management System**
- Secure authentication (Login/Signup)
- Personal dashboard for saved projects
- Project history tracking
- Selective plan saving (choose only your favorite design)
- Delete and manage saved projects

### 🏢 **Architect Directory**
- Browse verified architects
- Filter by specialization and location
- Contact information and portfolios
- Direct consultation booking

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2.0** - Modern UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool

### **Backend**
- **Spring Boot 3.x** - Enterprise Java framework
- **Spring WebFlux** - Reactive programming for async AI calls
- **PostgreSQL** - Relational database
- **Maven** - Dependency management

### **AI Services**
- **Hugging Face Inference API** - AI model hosting
- **Stable Diffusion XL** - Image generation
- **Mistral-7B-Instruct** - Text generation
- **OpenAI API** - Alternative AI provider (configurable)

---

## 🚀 Getting Started

### **Prerequisites**
- Java 17 or higher
- Node.js 18+ and npm
- PostgreSQL database
- Hugging Face API key (free tier available)

### **Backend Setup**

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure application properties**:
   Create `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/happynest
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   huggingface.api.key=your_huggingface_api_key
   huggingface.api.url=https://api-inference.huggingface.co/models
   ```

3. **Run the backend**:
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### **Frontend Setup**

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

### **Database Setup**

Create PostgreSQL database:
```sql
CREATE DATABASE happynest;
```

Tables will be auto-created by Spring Boot on first run.

---

## 📱 Application Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with AI plan generator form |
| **Login** | `/login` | User authentication |
| **Signup** | `/signup` | New user registration |
| **Dashboard** | `/dashboard` | User's saved projects overview |
| **Projects** | `/projects` | Detailed project management |
| **Project View** | `/projects/:id` | Individual project details |
| **Architects** | `/architects` | Browse verified architects |
| **About** | `/about` | Platform information |

---

## 🎨 How It Works

### **1. User Input Collection**
The `ArchitectForm.jsx` component collects:
- Plot dimensions (length × width)
- Budget (₹)
- House type (1BHK, 2BHK, 3BHK, 4BHK, Villa)
- Facing direction (North, South, East, West)
- Number of floors (1-3)
- Vaastu compliance level

### **2. AI Processing Pipeline**

**Backend Controller** (`ArchitectController.java`):
```
User Request → HuggingFaceTextService → Generate 3 Plans
                                      ↓
                            HuggingFaceImageService → Generate Images
                                      ↓
                            Combine Plans + Images → Return JSON
```

### **3. Plan Generation**
- **Text Service**: Calls Mistral-7B to generate detailed plan specifications
- **Image Service**: Calls Stable Diffusion XL to create architectural renders
- **Parallel Processing**: All 3 plan images generated simultaneously using reactive programming

### **4. Frontend Display**
- `PlanResults.jsx` displays all 3 plans in a beautiful card layout
- Each plan shows exterior image, interior gallery, and specifications
- Users can save their favorite plan to the database

---

## 🔑 API Endpoints

### **Architecture Generation**
```http
POST /api/architect/generate
Content-Type: application/json

{
  "plotSize": "30x40",
  "budget": 2500000,
  "houseType": "2BHK",
  "facing": "East",
  "floors": 2,
  "vaastu": "Moderate"
}
```

### **User Authentication**
```http
POST /api/auth/signup
POST /api/auth/login
```

### **Project Management**
```http
GET    /api/projects          # Get all user projects
POST   /api/projects          # Save a new project
GET    /api/projects/{id}     # Get project by ID
DELETE /api/projects/{id}     # Delete project
```

---

## 🎯 Future Enhancements

- [ ] PDF export of floor plans
- [ ] Cost calculator with detailed material breakdown
- [ ] Integration with real contractor databases
- [ ] Mobile app (React Native)
- [ ] AR visualization for on-site preview
- [ ] Social sharing of designs
- [ ] Multi-language support
- [ ] Payment gateway for premium features
- [ ] AI-powered furniture placement suggestions

---

## 📂 Project Structure

```
HappyNest/
├── backend/
│   ├── src/main/java/com/architect/app/
│   │   ├── controller/        # REST API endpoints
│   │   ├── service/           # Business logic & AI integration
│   │   ├── model/             # Entity classes
│   │   └── repository/        # Database access
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── context/           # React context (Auth)
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Hugging Face** - Free AI model hosting and inference API
- **Stable Diffusion XL** - High-quality image generation
- **Mistral AI** - Powerful open-source language model
- **Spring Boot** - Robust backend framework
- **React** - Modern frontend library
- **Tailwind CSS** - Beautiful utility-first CSS

---

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: [Your Email/Contact Info]

---

## 🌟 Why HappyNest?

Traditional architectural planning is:
- ❌ Expensive (₹50,000+ for basic plans)
- ❌ Time-consuming (weeks to months)
- ❌ Limited options (1-2 designs)
- ❌ Requires multiple consultations

**HappyNest makes it:**
- ✅ Affordable (Free AI-powered generation)
- ✅ Instant (Results in under 2 minutes)
- ✅ Multiple options (3 competing designs)
- ✅ Self-service (No appointments needed)

---

**Built with ❤️ to make home construction planning accessible to everyone**

*Empowering homeowners to visualize their dream homes before breaking ground*
