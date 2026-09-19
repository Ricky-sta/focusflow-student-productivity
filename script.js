const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const progressTextElement = document.getElementById("progressText");
const progressLabelElement = document.getElementById("progressLabel");
const progressFillElement = document.getElementById("progressFill");
const emptyState = document.getElementById("emptyState");

const STORAGE_KEY = "focusflowTasks";

let tasks = loadTasks();

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        return JSON.parse(savedTasks);
    } catch (error) {
        console.error("Could not load tasks:", error);
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function toggleTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    emptyState.style.display = tasks.length === 0 ? "block" : "none";

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        if (task.completed) {
            taskContent.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        listItem.appendChild(taskContent);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });

    updateStats();
}

function updateStats() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    const progress =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    progressTextElement.textContent = `${progress}%`;
    progressLabelElement.textContent = `${progress}%`;
    progressFillElement.style.width = `${progress}%`;
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();