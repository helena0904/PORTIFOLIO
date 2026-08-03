const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const DATA_FILE = path.join(__dirname, "portfolio-data.json");

function getPortfolioData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log("Error reading data file, using default");
    }
    
    return {
        name: "Helen Tesfaye",
        title: "Hi, I'm Helen Tesfaye",
        description: "A 2nd year Software Engineering student",
        about: "Hello, I'm Helen Tesfaye, a Software Engineering student at Addis Ababa science and technology university. I am currently developing my skills in web development, programming, and software design. I enjoy learning new technologies and creating projects that improve my problem-solving skills. I have experience working with HTML, CSS, and C++. Now I started on learning fullstack development and also am trying to solve different problems and improving my knowledge in software development. My goal is to become a skilled software engineer who can create reliable and innovative applications that solve real-world problems.",
        image: "helen.jpg",
        email: "helentesfaye9421@gmail.com",
        skills: ["HTML", "CSS", "C++", "MySQL", "git and github"],
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

function savePortfolioData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log("Data saved successfully!");
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        return false;
    }
}

let portfolio = getPortfolioData();

app.get("/api/profile", (req, res) => {
    console.log("GET request received");
    res.json(portfolio);
});

app.post("/api/profile", (req, res) => {
    try {
        console.log("POST request received");
        console.log("Received data:", req.body);
        
        const updatedData = req.body;
        
        if (updatedData.name !== undefined) portfolio.name = updatedData.name;
        if (updatedData.title !== undefined) portfolio.title = updatedData.title;
        if (updatedData.description !== undefined) portfolio.description = updatedData.description;
        if (updatedData.about !== undefined) portfolio.about = updatedData.about;
        if (updatedData.email !== undefined) portfolio.email = updatedData.email;
        if (updatedData.skills !== undefined) {
            portfolio.skills = updatedData.skills;
            console.log("Skills updated:", portfolio.skills);
        }
        if (updatedData.projects !== undefined) {
            portfolio.projects = updatedData.projects;
            console.log("Projects updated:", portfolio.projects);
        }
        
        const saved = savePortfolioData(portfolio);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: "Profile updated successfully!",
                profile: portfolio 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Failed to save data" 
            });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error updating profile: " + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
});