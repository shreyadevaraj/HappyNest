# 🏡 HappyNest - AI-Powered Residential Architecture Platform

**HappyNest** is a full-stack application that generates personalized, residential floor plans using AI. Built with React, Spring Boot, and Hugging Face AI models.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🎨 **AI-Powered Design Generation**
- **Dynamic Floor Plans**: Generate 3 optimized plans (Budget, Modern, Luxury) based on user requirements
- **Custom Architectural Visualizations**: AI-generated images using Stable Diffusion XL
- **Intelligent Text Generation**: Plan descriptions using Mistral-7B

### 🧭 **Vaastu Compliance**
- Strict, Moderate, or No Vaastu options
- Automatic room placement based on Vaastu principles
- Directional optimization (North, South, East, West facing)

### 💰 **Budget-Aware Planning**
- **Plan A**: Exact budget match with standard materials
- **Plan B**: 15-20% above budget with premium finishes
- **Plan C**: 50%+ luxury tier with high-end features

### 📊 **Smart Features**
- Real-time plot size calculations
- Light & ventilation strategies based on facing direction
- Contractor recommendations with contact details
- Project history tracking (H2 database)
- Verified architect directory

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Pastel color palette** for professional UI

### **Backend**
- **Java 11** with Spring Boot 2.7.18
- **Spring WebFlux** for reactive programming
- **H2 Database** for local data storage
- **Maven** for dependency management

### **AI Integration**
- **Hugging Face Inference API**
  - Stable Diffusion XL (image generation)
  - Mistral-7B (text generation)
- **100% FREE** with Hugging Face token

---

## 🚀 Quick Start

### **Prerequisites**
- Java 11 or higher
- Node.js 16+ and npm
- Hugging Face account (free)

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd project
```

### **2. Backend Setup**

#### Install Maven Dependencies
```bash
cd backend
..\maven\apache-maven-3.9.6\bin\mvn clean install
```

#### Configure Hugging Face Token
1. Get your FREE token from [Hugging Face](https://huggingface.co/settings/tokens)
2. Edit `backend/src/main/resources/application.properties`:
```properties
huggingface.api.token=hf_YOUR_TOKEN_HERE
```

#### Run Backend
```bash
java -jar target/app-0.0.1-SNAPSHOT.jar
```
Backend runs on: **http://localhost:8080**

### **3. Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## 📖 Usage

### **Generate Floor Plans**

1. **Open** http://localhost:5173
2. **Fill out the form**:
   - Plot Size (e.g., 40x60 ft)
   - Number of Floors (Single/G+1/G+2)
   - House Type (1BHK/2BHK/3BHK/Villa)
   - Facing Direction (North/South/East/West)
   - Budget Range (in INR)
   - Special Requirements
   - Vaastu Preference

3. **Click** "Generate Blueprints"
4. **Wait** 30-60 seconds (first time - model warm-up)
5. **View** 3 personalized plans with:
   - Custom architectural visualizations
   - Detailed room dimensions
   - Light & ventilation strategies
   - Vaastu compliance details
   - Budget estimates
   - Contractor recommendations

### **Navigate Pages**

- **Projects**: View history of generated plans
- **Architects**: Browse verified architect profiles with ratings
- **About**: Learn about HappyNest

---

## 🏗️ Project Structure

```
project/
├── backend/
│   ├── src/main/java/com/architect/app/
│   │   ├── controller/          # REST API endpoints
│   │   ├── model/                # Data models
│   │   ├── repository/           # JPA repositories
│   │   └── service/              # Business logic
│   │       ├── HuggingFaceTextService.java
│   │       └── HuggingFaceImageService.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── App.jsx               # Main app
│   │   └── index.css             # Tailwind styles
│   └── public/                   # Static assets
└── README.md
```

---

## 🔧 Configuration

### **Backend Configuration** (`application.properties`)

```properties
# Server
server.port=8080

# Hugging Face API
huggingface.api.token=YOUR_TOKEN_HERE

# H2 Database
spring.datasource.url=jdbc:h2:mem:happynest
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

### **Frontend Configuration**

API endpoint is configured in components to call `http://localhost:8080/api/architect/generate`

---

## 🎨 UI Features

### **Door Opening Animation**
- Elegant green door animation on page load
- Reveals "HappyNest" branding

### **Pastel Professional Theme**
- Stone, Emerald, and White color palette
- Clean borders and subtle shadows
- Responsive design for all devices

### **Interactive Plan Results**
- Tabbed interface for 3 plans
- Hover effects and animations
- Visual plan representations
- Contractor contact cards

---

## 💡 How It Works

### **1. User Input Processing**
```
User fills form → Backend receives ArchitectRequest
```

### **2. AI Text Generation**
```
HuggingFaceTextService → Mistral-7B API
→ Generates 3 floor plan descriptions
→ Customized based on plot size, facing, budget
```

### **3. AI Image Generation**
```
HuggingFaceImageService → Stable Diffusion XL API
→ Generates 3 architectural visualizations
→ Budget/Modern/Luxury styles
```

### **4. Response Assembly**
```
Controller combines text + images
→ Returns JSON to frontend
→ Frontend displays in beautiful UI
```

---

## 🔒 Security Notes

- **API Tokens**: Never commit `application.properties` with real tokens
- **CORS**: Configured for localhost development only
- **H2 Console**: Disabled in production (currently enabled for dev)

---

## 🐛 Troubleshooting

### **Images not generating?**
- Check Hugging Face token is valid
- First generation takes 30-60 seconds (model warm-up)
- Check backend logs for errors

### **Backend won't start?**
- Verify Java 11 is installed: `java -version`
- Check port 8080 is not in use
- Run `mvn clean install` again

### **Frontend errors?**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and run `npm install` again
- Check backend is running on port 8080

---

## 📊 API Endpoints

### **Generate Plans**
```
POST /api/architect/generate
Content-Type: application/json

{
  "plotSize": "40x60",
  "floors": "G+1",
  "houseType": "3BHK",
  "facing": "North",
  "budget": "70 Lakhs",
  "mandatoryRooms": "Parking, Pooja",
  "vaastu": "Strict"
}
```

### **Get Architects**
```
GET /api/data/architects
```

### **Get Projects**
```
GET /api/data/projects
```

---

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Save/export plans as PDF
- [ ] 3D walkthrough generation
- [ ] Cost calculator with material breakdown
- [ ] Integration with real contractor databases
- [ ] Mobile app (React Native)

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Hugging Face** for free AI model hosting
- **Stable Diffusion XL** for image generation
- **Mistral AI** for text generation
- **Spring Boot** and **React** communities

---

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for making home construction planning accessible to everyone**
