const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_PATH = path.join(__dirname, "database.json");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Helper function to initialize the database file
async function initializeDatabase() {
  try {
    await fs.access(DATABASE_PATH);
  } catch (error) {
    // File doesn't exist, create it with initial structure
    const initialData = {
      users: [],
      members: [],
      classes: [],
      trainers: [],
    };
    await fs.writeFile(DATABASE_PATH, JSON.stringify(initialData, null, 2), "utf8");
    console.log("Initialized database.json with default structure");
  }
}

// Helper function to read the database
async function readDatabase() {
  try {
    await initializeDatabase(); // Ensure database file exists
    const data = await fs.readFile(DATABASE_PATH, "utf8");
    const database = JSON.parse(data);

    // Ensure all required arrays exist
    return {
      users: database.users || [],
      members: database.members || [],
      classes: database.classes || [],
      trainers: database.trainers || [],
    };
  } catch (error) {
    console.error("Error reading database:", error);
    throw error;
  }
}

// Helper function to write to the database
async function writeDatabase(data) {
  try {
    await fs.writeFile(DATABASE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to database:", error);
    throw error;
  }
}

// API Routes

// Health check
app.get("/", (req, res) => {
  res.send("Gym Management API is running");
});

// ==================== AUTH API ====================

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const database = await readDatabase();

    // Check if user already exists
    const existingUser = database.users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: "admin", // Default role for now
      createdAt: new Date().toISOString(),
    };

    database.users.push(newUser);
    await writeDatabase(database);

    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const database = await readDatabase();

    // Find user
    const user = database.users.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create and assign token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const user = database.users.find((user) => user.id === req.user.id); // Use req.user.id
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user information" });
  }
});

// ==================== MEMBERS API ====================

// Get all members
app.get("/api/members", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    res.json(database.members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Get member by ID
app.get("/api/members/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const member = database.members.find((m) => m.id === req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch member" });
  }
});

// Create new member
app.post("/api/members", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const newMember = {
      id: `M${String(database.members.length + 1).padStart(3, "0")}`,
      ...req.body,
      joinDate: new Date().toISOString().split("T")[0],
      lastVisit: new Date().toISOString().split("T")[0],
    };

    database.members.push(newMember);
    await writeDatabase(database);

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to create member" });
  }
});

// Update member
app.put("/api/members/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const memberIndex = database.members.findIndex((m) => m.id === req.params.id);

    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    database.members[memberIndex] = {
      ...database.members[memberIndex],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
    };

    await writeDatabase(database);
    res.json(database.members[memberIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update member" });
  }
});

// Delete member
app.delete("/api/members/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const memberIndex = database.members.findIndex((m) => m.id === req.params.id);

    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }

    database.members.splice(memberIndex, 1);
    await writeDatabase(database);

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// ==================== CLASSES API ====================

// Get all classes
app.get("/api/classes", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    res.json(database.classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// Get class by ID
app.get("/api/classes/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const classItem = database.classes.find((c) => c.id === req.params.id);

    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch class" });
  }
});

// Create new class
app.post("/api/classes", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const newClass = {
      id: `C${String(database.classes.length + 1).padStart(3, "0")}`,
      ...req.body,
      enrolled: 0,
      attendees: [],
    };

    database.classes.push(newClass);
    await writeDatabase(database);

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: "Failed to create class" });
  }
});

// Update class
app.put("/api/classes/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const classIndex = database.classes.findIndex((c) => c.id === req.params.id);

    if (classIndex === -1) {
      return res.status(404).json({ error: "Class not found" });
    }

    database.classes[classIndex] = {
      ...database.classes[classIndex],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
    };

    await writeDatabase(database);
    res.json(database.classes[classIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update class" });
  }
});

// Delete class
app.delete("/api/classes/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const classIndex = database.classes.findIndex((c) => c.id === req.params.id);

    if (classIndex === -1) {
      return res.status(404).json({ error: "Class not found" });
    }

    database.classes.splice(classIndex, 1);
    await writeDatabase(database);

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete class" });
  }
});

// ========================== Analytics API ==========================
app.get("/api/analytics", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();

    // Calculate member growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const memberGrowth = database.members
      .filter((m) => new Date(m.joinDate) >= thirtyDaysAgo)
      .map((m) => ({
        date: m.joinDate,
        count: 1,
      }));

    // Aggregate by date
    const memberGrowthByDate = memberGrowth.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + curr.count;
      return acc;
    }, {});
    const memberGrowthData = Object.entries(memberGrowthByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // Class attendance (average attendance percentage per class)
    const classAttendance = database.classes.map((cls) => ({
      name: cls.name,
      attendance: cls.capacity > 0 ? (cls.enrolled / cls.capacity) * 100 : 0,
    }));

    // Trainer performance (number of classes per trainer)
    const trainerPerformance = database.trainers.map((trainer) => ({
      name: trainer.name,
      classCount: database.classes.filter((cls) => cls.instructorId === trainer.id).length,
    }));

    res.json({
      totalMembers: database.members.length,
      totalClasses: database.classes.length,
      totalTrainers: database.trainers.length,
      memberGrowth: memberGrowthData,
      classAttendance,
      trainerPerformance,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});
// ==================== TRAINERS API ====================

// Get all trainers
app.get("/api/trainers", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    res.json(database.trainers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

// Get trainer by ID
app.get("/api/trainers/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const trainer = database.trainers.find((t) => t.id === req.params.id);

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trainer" });
  }
});

// Create new trainer
app.post("/api/trainers", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const newTrainer = {
      id: `T${String(database.trainers.length + 1).padStart(3, "0")}`,
      ...req.body,
      classes: 0,
      clients: 0,
    };

    database.trainers.push(newTrainer);
    await writeDatabase(database);

    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create trainer" });
  }
});

// Update trainer
app.put("/api/trainers/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const trainerIndex = database.trainers.findIndex((t) => t.id === req.params.id);

    if (trainerIndex === -1) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    database.trainers[trainerIndex] = {
      ...database.trainers[trainerIndex],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
    };

    await writeDatabase(database);
    res.json(database.trainers[trainerIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update trainer" });
  }
});

// Delete trainer
app.delete("/api/trainers/:id", authenticateToken, async (req, res) => {
  try {
    const database = await readDatabase();
    const trainerIndex = database.trainers.findIndex((t) => t.id === req.params.id);

    if (trainerIndex === -1) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    database.trainers.splice(trainerIndex, 1);
    await writeDatabase(database);

    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete trainer" });
  }
});

// Start the server
app.listen(PORT, async () => {
  try {
    await initializeDatabase();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
});