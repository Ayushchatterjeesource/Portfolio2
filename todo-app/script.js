```javascript
/* =================================
   Portfolio3 - To-Do List
   JavaScript Logic & State Management
   ================================= */

// ================================
// State
// ================================

let tasks = [];
let currentFilter = "all";

const STORAGE_KEY = "portfolio3-tasks";

// ================================
// DOM Elements
// ================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");

// ================================
// Load State
// ================================

function loadTasks() {

    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
        tasks = [];
        return;
    }

    try {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks;
        } else {
            tasks = [];
        }

    } catch (error) {
        tasks = [];
    }
}

// ================================
// Save State
// ================================

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

// ================================
// Create Task
// ================================

function addTask() {

    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// ================================
// Read / Render Tasks
// ================================

function getFilteredTasks() {

    if (currentFilter === "active") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);
    });

    updateEmptyState(filteredTasks);
    updateTaskCount();
}

// ================================
// Dynamic DOM Creation
// ================================

function createTaskElement(task) {

    const article = document.createElement("article");

    article.className = "task-item";

    if (task.completed) {
        article.classList.add("completed");
    }

    article.dataset.id = task.id;

    const checkButton =
        document.createElement("button");

    checkButton.className = "task-check";
    checkButton.type = "button";
    checkButton.dataset.action = "toggle";
    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as active"
            : "Mark task as completed"
    );

    checkButton.textContent =
        task.completed ? "✓" : "";

    const content =
        document.createElement("div");

    content.className = "task-content";

    const text =
        document.createElement("p");

    text.className = "task-text";
    text.textContent = task.text;

    const actions =
        document.createElement("div");

    actions.className = "task-actions";

    const editButton =
        document.createElement("button");

    editButton.type = "button";
    editButton.className = "task-action";
    editButton.dataset.action = "edit";
    editButton.textContent = "Edit";

    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className =
        "task-action delete";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    content.appendChild(text);
    content.appendChild(actions);

    article.appendChild(checkButton);
    article.appendChild(content);

    return article;
}

// ================================
// Update Task
// ================================

function updateTask(id, newText) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }

    const cleanText = newText.trim();

    if (!cleanText) {
        return;
    }

    task.text = cleanText;

    saveTasks();
    renderTasks();
}

// ================================
// Toggle Completed
// ================================

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

// ================================
// Delete Task
// ================================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

// ================================
// Edit Task UI
// ================================

function editTask(taskElement) {

    const id =
        Number(taskElement.dataset.id);

    const task =
        tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const content =
        taskElement.querySelector(".task-content");

    content.innerHTML = "";

    const input =
        document.createElement("input");

    input.type = "text";
    input.className = "task-edit-input";
    input.value = task.text;
    input.maxLength = 150;

    const actions =
        document.createElement("div");

    actions.className = "task-actions";

    const saveButton =
        document.createElement("button");

    saveButton.type = "button";
    saveButton.className = "task-action";
    saveButton.dataset.action = "save";
    saveButton.textContent = "Save";

    const cancelButton =
        document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className = "task-action";
    cancelButton.dataset.action = "cancel";
    cancelButton.textContent = "Cancel";

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    content.appendChild(input);
    content.appendChild(actions);

    input.focus();
    input.select();
}

// ================================
// Clear Completed
// ================================

function clearCompleted() {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();
    renderTasks();
}

// ================================
// Clear All
// ================================

function clearAll() {

    if (tasks.length === 0) {
        return;
    }

    tasks = [];

    saveTasks();
    renderTasks();
}

// ================================
// Filter
// ================================

function setFilter(filter) {

    currentFilter = filter;

    filterButtons.forEach(button => {

        const isActive =
            button.dataset.filter === filter;

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            isActive
        );
    });

    renderTasks();
}

// ================================
// Empty State
// ================================

function updateEmptyState(filteredTasks) {

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

// ================================
// Task Counter
// ================================

function updateTaskCount() {

    const remaining =
        tasks.filter(
            task => !task.completed
        ).length;

    if (remaining === 1) {
        taskCount.textContent =
            "1 task remaining";
    } else {
        taskCount.textContent =
            `${remaining} tasks remaining`;
    }
}

// ================================
// Event: Add Task
// ================================

addTaskBtn.addEventListener(
    "click",
    addTask
);

// Enter key support

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            addTask();
        }
    }
);

// ================================
// Event Delegation
// ================================

taskList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");

        if (!button) {
            return;
        }

        const taskElement =
            button.closest(".task-item");

        if (!taskElement) {
            return;
        }

        const id =
            Number(taskElement.dataset.id);

        const action =
            button.dataset.action;

        if (action === "toggle") {

            toggleTask(id);

        } else if (action === "edit") {

            editTask(taskElement);

        } else if (action === "delete") {

            deleteTask(id);

        } else if (action === "save") {

            const input =
                taskElement.querySelector(
                    ".task-edit-input"
                );

            if (input) {
                updateTask(id, input.value);
            }

        } else if (action === "cancel") {

            renderTasks();
        }
    }
);

// ================================
// Edit with Enter / Escape
// ================================

taskList.addEventListener(
    "keydown",
    event => {

        const input =
            event.target.closest(
                ".task-edit-input"
            );

        if (!input) {
            return;
        }

        const taskElement =
            input.closest(".task-item");

        if (!taskElement) {
            return;
        }

        const id =
            Number(taskElement.dataset.id);

        if (event.key === "Enter") {

            updateTask(id, input.value);

        } else if (event.key === "Escape") {

            renderTasks();
        }
    }
);

// ================================
// Filter Events
// ================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {
            setFilter(
                button.dataset.filter
            );
        }
    );
});

// ================================
// Clear Buttons
// ================================

clearCompletedBtn.addEventListener(
    "click",
    clearCompleted
);

clearAllBtn.addEventListener(
    "click",
    clearAll
);

// ================================
// Initialize Application
// ================================

loadTasks();
renderTasks();

filterButtons.forEach(button => {

    button.setAttribute(
        "aria-pressed",
        button.classList.contains("active")
    );
});
```

