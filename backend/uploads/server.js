const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../frontend")); // Save to frontend folder
    },
    filename: (req, file, cb) => {
        // Keep the original filename or use helen.jpg
        const ext = path.extname(file.originalname);
        cb(null, "helen" + ext); // Always save as helen.jpg or helen.png
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Allow Express to access frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Path to portfolio data file
const DATA_FILE = path.join(__dirname, "portfolio-data.json");

// Read portfolio data from file or use default
function getPortfolioData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log("Error reading data file, using default");
    }
    
    // Default data
    return {
        name: "Helen Tesfaye",
        title: "Hi, I'm Helen Tesfaye",
        description: "A 2nd year Software Engineering student",
        about: "Hello, I'm Helen Tesfaye, a Software Engineering student at Addis Ababa science and technology university. I am currently developing my skills in web development, programming, and software design. I enjoy learning new technologies and creating projects that improve my problem-solving skills. I have experience working with HTML, CSS, and C++. Now I started on learning fullstack development and also am trying to solve different problems and improving my knowledge in software development. My goal is to become a skilled software engineer who can create reliable and innovative applications that solve real-world problems.",
        image: "helen.jpg",
        email: "helentesfaye9421@gmail.com",
        skills: [
            "HTML",
            "CSS",
            "C++",
            "MySQL",
            "git and github"
        ],
        projects: [
            {
                name: "Movie Search Website",
                description: "A capstone project built with a team at GDG. A website that lets users search for movies using a public API. Built with HTML, CSS, and JavaScript."
            },
            {
                name: "Meal Recommendation App",
                description: "A hackathon project built with a team at GDG. Helps users find meals with budget tracking, fasting and non-fasting options, and a restaurant locator."
            },
            {
                name: "Restaurant Website",
                description: "A frontend restaurant website built using HTML and CSS. The website includes a home page, menu section, gallery, and contact section with a responsive and user-friendly design."
            },
            {
                name: "Asash Tour - Tour Agent Website",
                description: "A tour agent website developed using HTML and CSS to showcase Ethiopian travel destinations, tour services, and travel information with an attractive and simple user interface."
            },
            {
                name: "Digital PC Management System",
                description: "A team project developed using C++ and MySQL to digitalize PC management. The system helps manage computer information, track PC usage, and organize data efficiently using a database-based solution."
            },
            {
                name: "Digitalized Cafeteria System",
                description: "A team project that digitalized cafeteria services using C++ and MySQL. The system manages cafeteria data and helps improve food ordering and management processes through a database-based solution."
            }
        ]
    };
}

// Save portfolio data to file
function savePortfolioData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialize portfolio data
let portfolio = getPortfolioData();

// GET profile
app.get("/api/profile", (req, res) => {
    res.json(portfolio);
});

// UPDATE profile (POST) - with image upload
app.post("/api/profile", upload.single("image"), (req, res) => {
    try {
        const updatedData = req.body;
        
        // Update text fields
        if (updatedData.name) portfolio.name = updatedData.name;
        if (updatedData.title) portfolio.title = updatedData.title;
        if (updatedData.description) portfolio.description = updatedData.description;
        if (updatedData.about) portfolio.about = updatedData.about;
        if (updatedData.email) portfolio.email = updatedData.email;
        if (updatedData.skills) portfolio.skills = updatedData.skills;
        if (updatedData.projects) portfolio.projects = updatedData.projects;
        
        // Handle image upload
        if (req.file) {
            // Get the filename of the uploaded image
            const ext = path.extname(req.file.originalname);
            const filename = "helen" + ext;
            portfolio.image = filename;
            
            // Delete old image if it exists and is different
            const oldImagePath = path.join(__dirname, "../frontend", portfolio.image);
            if (fs.existsSync(oldImagePath) && portfolio.image !== filename) {
                try {
                    fs.unlinkSync(oldImagePath);
                } catch (err) {
                    console.log("Could not delete old image:", err);
                }
            }
        }
        
        // Save to file
        savePortfolioData(portfolio);
        
        res.json({ 
            success: true, 
            message: "Profile updated successfully!",
            profile: portfolio 
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error updating profile" 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});