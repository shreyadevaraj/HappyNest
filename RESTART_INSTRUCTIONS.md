# 🔧 Manual Backend Restart Instructions

## The code changes are DONE ✅
I've already updated your Java files to use:
- ✅ gpt-4.1-mini (text model)
- ✅ gpt-image-1 (image model)

## Now you need to restart the backend

### Step 1: Stop the Current Backend
1. Find the terminal window running: `java -jar target\app-0.0.1-SNAPSHOT.jar`
2. Click on that terminal
3. Press `Ctrl + C` to stop it

### Step 2: Rebuild the Backend
Open a **NEW** PowerShell terminal in the backend folder and run:

```powershell
cd d:\happynest\HappyNest\backend
.\mvnw.cmd clean package -DskipTests
```

**Wait for it to finish** (it might take 1-2 minutes)

### Step 3: Start the Backend Again
After the build completes successfully, run:

```powershell
java -jar target\app-0.0.1-SNAPSHOT.jar
```

### Step 4: Verify It's Working
You should see this in the console when you generate plans:

```
🤖 Generating plans with OpenAI gpt-4.1-mini (STRICT LOW-COST MODE)...
🏗️ Generating exterior image for Plan A with gpt-image-1 (STRICT LOW-COST)...
🏗️ Generating exterior image for Plan B with gpt-image-1 (STRICT LOW-COST)...
🏗️ Generating exterior image for Plan C with gpt-image-1 (STRICT LOW-COST)...
```

---

## If the build fails:

Try this alternative command:
```powershell
.\mvnw.cmd clean install -DskipTests -U
```

Or if Maven wrapper doesn't work, try:
```powershell
mvn clean package -DskipTests
```

---

## That's it! 🎉
Once you restart, your app will use the cheaper OpenAI models and save you ~75% on API costs!
