const API_URL = "http://localhost:3000/students";

// Load students on startup
window.onload = loadStudents;

async function loadStudents() {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    data.forEach(s => {
    tbody.innerHTML += `
        <tr>
            <td>${s.studentId}</td>
            <td>${s.name}</td>
            <td>${s.age}</td>
            <td>
                <button onclick="editStudent('${s._id}')">Edit</button>
                <button onclick="deleteStudent('${s._id}')" style="background:red;color:white">Delete</button>
            </td>
        </tr>
    `;
});
}

// Add student
async function addStudent() {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();

    if (!name || !age) return alert("Name & Age required!");

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age })
    });

    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";

    loadStudents();
}

// Edit student
async function editStudent(id) {
    const newName = prompt("Enter new name:");
    const newAge = prompt("Enter new age:");

    if (!newName || !newAge) return;

    await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, age: newAge })
    });

    loadStudents();
}

// Delete student
async function deleteStudent(id) {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadStudents();
}
