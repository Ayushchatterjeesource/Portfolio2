// Application State
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');

// ==================== CRUD Operations ====================

// Create - Add new task
function addTask(text) {
    const task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    saveToLocalStorage();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Read - Get all tasks
function getTasks() {
    return tasks;
}

// Update - Edit task text
function updateTask(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = newText.trim();
        saveToLocalStorage();
        renderTasks();
    }
}

// Update - Toggle task completion
function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveToLocalStorage();
        renderTasks();
    }
}

// Delete - Remove task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTasks();
}

// Delete - Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(t => !t.completed);
    saveToLocalStorage();
    renderTasks();
}

// ==================== Filtering Logic ====================

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// ==================== Rendering ====================

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <span class="emoji">📭</span>
                <p>No tasks ${currentFilter !== 'all' ? currentFilter : ''} found</p>
            </div>
        `;
    } else {
        taskList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
    }
    
    updateTaskCount();
    updateClearButtonState();
}

function createTaskHTML(task) {
    const isCompleted = task.completed ? 'completed' : '';
    const isChecked = task.completed ? 'checked' : '';
    
    return `
        <li class="task-item ${isCompleted}" data-id="${task.id}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${isChecked}
                aria-label="Toggle task completion"
            />
            <span class="task-text">${escapeHtml(task.text)}</span>
            <input 
                type="text" 
                class="edit-input" 
                value="${escapeHtml(task.text)}"
                aria-label="Edit task"
            />
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task">✏️</button>
                <button class="save-edit-btn" aria-label="Save edit">💾</button>
                <button class="delete-btn" aria-label="Delete task">🗑️</button>
            </div>
        </li>
    `;
}

// Helper to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Event Handling (Delegated) ====================

// Task List Event Delegation
taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    
    // Toggle completion
    if (e.target.classList.contains('task-checkbox')) {
        toggleTaskCompletion(taskId);
        return;
    }
    
    // Delete task
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
        }
        return;
    }
    
    // Edit task - show edit mode
    if (e.target.classList.contains('edit-btn')) {
        enterEditMode(taskItem);
        return;
    }
    
    // Save edited task
    if (e.target.classList.contains('save-edit-btn')) {
        saveEditMode(taskItem, taskId);
        return;
    }
});

// Handle Enter key in edit input
taskList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const editInput = taskItem.querySelector('.edit-input');
        if (editInput && editInput.classList.contains('active')) {
            const taskId = parseInt(taskItem.dataset.id);
            saveEditMode(taskItem, taskId);
        }
    }
    
    if (e.key === 'Escape') {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        cancelEditMode(taskItem);
    }
});

function enterEditMode(taskItem) {
    const taskText = taskItem.querySelector('.task-text');
    const editInput = taskItem.querySelector('.edit-input');
    const editBtn = taskItem.querySelector('.edit-btn');
    const saveBtn = taskItem.querySelector('.save-edit-btn');
    
    taskText.classList.add('editing');
    editInput.classList.add('active');
    saveBtn.classList.add('active');
    editBtn.style.display = 'none';
    
    editInput.focus();
    editInput.select();
}

function saveEditMode(taskItem, taskId) {
    const editInput = taskItem.querySelector('.edit-input');
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }
    
    updateTask(taskId, newText);
    cancelEditMode(taskItem);
}

function cancelEditMode(taskItem) {
    const taskText = taskItem.querySelector('.task-text');
    const editInput = taskItem.querySelector('.edit-input');
    const editBtn = taskItem.querySelector('.edit-btn');
    const saveBtn = taskItem.querySelector('.save-edit-btn');
    
    taskText.classList.remove('editing');
    editInput.classList.remove('active');
    saveBtn.classList.remove('active');
    editBtn.style.display = 'inline-block';
}

// ==================== Filter Handling ====================

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current filter
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// ==================== Task Count ====================

function updateTaskCount() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    
    taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

// ==================== Clear Completed Button ====================

function updateClearButtonState() {
    const hasCompleted = tasks.some(t => t.completed);
    clearCompletedBtn.disabled = !hasCompleted;
}

clearCompletedBtn.addEventListener('click', () => {
    if (tasks.some(t => t.completed)) {
        if (confirm('Delete all completed tasks?')) {
            clearCompletedTasks();
        }
    }
});

// ==================== Form Submission ====================

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    addTask(text);
});

// ==================== Local Storage ====================

function saveToLocalStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('tasks');
        if (data) {
            tasks = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        tasks = [];
    }
}

// ==================== Initialization ====================

function init() {
    loadFromLocalStorage();
    renderTasks();
    
    // Set initial filter
    document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
}

// Start the application
init();

// ==================== Keyboard Shortcuts ====================

document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+N or Cmd+Shift+N to focus input
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        taskInput.focus();
    }
});

// ==================== Performance Optimization ====================

// Debounce function for future use
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

console.log('📋 TaskMaster loaded successfully!');
console.log(`📊 ${tasks.length} tasks loaded from localStorage`);
