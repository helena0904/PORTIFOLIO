async function getProfile() {
    try {
        console.log("Fetching profile data...");
        const response = await fetch("http://localhost:3000/api/profile");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const profile = await response.json();
        console.log("Profile data received:", profile);

        document.getElementById("name").textContent = profile.title || `Hi, I'm ${profile.name}`;
        document.getElementById("description").textContent = profile.description;
        document.getElementById("about-text").textContent = profile.about;
        const skillsList = document.getElementById("skills-list");
        skillsList.innerHTML = "";
        if (profile.skills && Array.isArray(profile.skills)) {
            profile.skills.forEach(skill => {
                const li = document.createElement("li");
                li.textContent = skill;
                skillsList.appendChild(li);
            });
            console.log("Loaded " + profile.skills.length + " skills");
        }

        const projectList = document.getElementById("project-list");
        projectList.innerHTML = "";
        if (profile.projects && Array.isArray(profile.projects)) {
            profile.projects.forEach(project => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                `;
                projectList.appendChild(card);
            });
            console.log("Loaded " + profile.projects.length + " projects");
        }
        document.getElementById("email").textContent = profile.email;
        document.getElementById("newName").value = profile.name || "";
        document.getElementById("newTitle").value = profile.title || "";
        document.getElementById("newDescription").value = profile.description || "";
        document.getElementById("newAbout").value = profile.about || "";
        document.getElementById("newEmail").value = profile.email || "";
    } catch (error) {
        console.error("Error fetching profile:", error);
        document.getElementById("name").textContent = "Hi, I'm Helen Tesfaye";
        document.getElementById("description").textContent = "A 2nd year Software Engineering student";
    }
}

async function updateBasicInfo() {
    const messageDiv = document.getElementById("basicMessage");
    messageDiv.textContent = "Updating...";
    messageDiv.style.color = "#d4af37";

    try {
        const name = document.getElementById("newName").value.trim();
        const title = document.getElementById("newTitle").value.trim();
        const description = document.getElementById("newDescription").value.trim();
        const about = document.getElementById("newAbout").value.trim();
        const email = document.getElementById("newEmail").value.trim();

        if (!name || !title || !description || !about || !email) {
            messageDiv.textContent = "Please fill in all fields!";
            messageDiv.style.color = "#ff6b6b";
            return;
        }
        const currentResponse = await fetch("http://localhost:3000/api/profile");
        const currentData = await currentResponse.json();

        const updatedData = {
            name: name,
            title: title,
            description: description,
            about: about,
            email: email,
            skills: currentData.skills || [],
            projects: currentData.projects || []
        };

        console.log("Updating basic info:", updatedData);

        const response = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        console.log("Server response:", result);

        if (result.success) {
            messageDiv.textContent = "Basic info updated successfully!";
            messageDiv.style.color = "#51cf66";
            await getProfile();
            setTimeout(() => { messageDiv.textContent = ""; }, 5000);
        } else {
            messageDiv.textContent = "error " + (result.message || "Error updating!");
            messageDiv.style.color = "#ff6b6b";
        }

    } catch (error) {
        console.error("Error:", error);
        messageDiv.textContent = "Server error: " + error.message;
        messageDiv.style.color = "#ff6b6b";
    }
}

async function addSkill() {
    const messageDiv = document.getElementById("skillMessage");
    const skillInput = document.getElementById("newSkill");
    const skill = skillInput.value.trim();

    if (!skill) {
        messageDiv.textContent = "Please enter a skill!";
        messageDiv.style.color = "#ff6b6b";
        return;
    }

    messageDiv.textContent = "Adding skill...";
    messageDiv.style.color = "#d4af37";

    try {
        console.log("Fetching current data for skill addition...");
        const currentResponse = await fetch("http://localhost:3000/api/profile");
        const currentData = await currentResponse.json();
        console.log("Current data:", currentData);
        const skills = currentData.skills || [];
        if (skills.includes(skill)) {
            messageDiv.textContent = skill + " already exists!";
            messageDiv.style.color = "#ff6b6b";
            return;
        }
        skills.push(skill);
        console.log("New skills list:", skills);

        const updatedData = {
            name: currentData.name,
            title: currentData.title,
            description: currentData.description,
            about: currentData.about,
            email: currentData.email,
            skills: skills,
            projects: currentData.projects || []
        };

        console.log("Sending updated data:", updatedData);

        const response = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        console.log("Server response:", result);

        if (result.success) {
            messageDiv.textContent = skill + " added successfully!";
            messageDiv.style.color = "#51cf66";
            skillInput.value = "";
            await getProfile();
            setTimeout(() => { messageDiv.textContent = ""; }, 5000);
        } else {
            messageDiv.textContent = "error " + (result.message || "Error adding skill!");
            messageDiv.style.color = "#ff6b6b";
        }

    } catch (error) {
        console.error("Error adding skill:", error);
        messageDiv.textContent = "Server error: " + error.message;
        messageDiv.style.color = "#ff6b6b";
    }
}

async function addProject() {
    const messageDiv = document.getElementById("projectMessage");
    const nameInput = document.getElementById("newProjectName");
    const descInput = document.getElementById("newProjectDesc");
    
    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name || !description) {
        messageDiv.textContent = "Please enter both project name and description!";
        messageDiv.style.color = "#ff6b6b";
        return;
    }

    messageDiv.textContent = "Adding project...";
    messageDiv.style.color = "#d4af37";

    try {
        console.log("Fetching current data for project addition...");
        const currentResponse = await fetch("http://localhost:3000/api/profile");
        const currentData = await currentResponse.json();
        console.log("Current data:", currentData);

        const projects = currentData.projects || [];
        projects.push({ name, description });
        console.log("New projects list:", projects);
        
        const updatedData = {
            name: currentData.name,
            title: currentData.title,
            description: currentData.description,
            about: currentData.about,
            email: currentData.email,
            skills: currentData.skills || [],
            projects: projects
        };

        console.log("Sending updated data:", updatedData);
        
        const response = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        console.log("Server response:", result);

        if (result.success) {
            messageDiv.textContent = name + " project added successfully!";
            messageDiv.style.color = "#51cf66";
            nameInput.value = "";
            descInput.value = "";
            await getProfile();
            setTimeout(() => { messageDiv.textContent = ""; }, 5000);
        } else {
            messageDiv.textContent = "error " + (result.message || "Error adding project!");
            messageDiv.style.color = "#ff6b6b";
        }

    } catch (error) {
        console.error("Error adding project:", error);
        messageDiv.textContent = "Server error: " + error.message;
        messageDiv.style.color = "#ff6b6b";
    }
}

window.addEventListener("DOMContentLoaded", getProfile);