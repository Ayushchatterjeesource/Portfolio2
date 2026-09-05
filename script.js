/* ==========================================
   Portfolio2
   Navigation + Task State Management
   ========================================== */


/* =================================
   Mobile Navigation
   ================================= */

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");


if (menuToggle && mainNav) {

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }
    );


    mainNav.querySelectorAll("a").forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuToggle.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }

        }
    );

}


/* =================================
   To-Do Application
   ================================= */

const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const taskCount =
    document.getElementById("taskCount");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/*
   The To-Do application is only
   initialized on index.html.
*/

if (
    taskInput &&
    addTaskBtn &&
    taskList
) {


    /* ===============================
       State
       =============================== */

    let tasks = [];

    let currentFilter = "all";

    const STORAGE_KEY =
        "portfolio2-tasks";


    /* ===============================
       Load State
       =============================== */

    function loadTasks() {

        const savedTasks =
            window.localStorage.getItem(
                STORAGE_KEY
            );


        if (!savedTasks) {

            tasks = [];

            return;
        }


        try {

            const parsed =
                JSON.parse(savedTasks);


            if (Array.isArray(parsed)) {

                tasks = parsed;

            } else {

                tasks = [];

            }

        } catch (error) {

            tasks = [];

        }

    }


    /* ===============================
       Save State
       =============================== */

    function saveTasks() {

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    }


    /* ===============================
       CREATE
       =============================== */

    function addTask() {

        const text =
            taskInput.value.trim();


        if (!text) {

            taskInput.focus();

            return;
        }


        const newTask = {

            id:
                Date.now() +
                Math.random(),

            text: text,

            completed: false,

            createdAt:
                new Date().toISOString()

        };


        tasks.unshift(newTask);


        saveTasks();

        renderTasks();


        taskInput.value = "";

        taskInput.focus();

    }


    /* ===============================
       READ / FILTER
       =============================== */

    function getFilteredTasks() {

        if (
            currentFilter ===
            "active"
        ) {

            return tasks.filter(
                task => !task.completed
            );

        }


        if (
            currentFilter ===
            "completed"
        ) {

            return tasks.filter(
                task => task.completed
            );

        }


        return tasks;

    }


    /* ===============================
       DYNAMIC DOM
       =============================== */

    function createTaskElement(task) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "task-item";


        if (task.completed) {

            article.classList.add(
                "completed"
            );

        }


        article.dataset.id =
            task.id;


        /* Checkbox */

        const checkButton =
            document.createElement(
                "button"
            );


        checkButton.type =
            "button";


        checkButton.className =
            "task-check";


        checkButton.dataset.action =
            "toggle";


        checkButton.setAttribute(
            "aria-label",
            task.completed
                ? "Mark task as active"
                : "Mark task as completed"
        );


        checkButton.textContent =
            task.completed
                ? "✓"
                : "";


        /* Content */

        const content =
            document.createElement(
                "div"
            );


        content.className =
            "task-content";


        /* Text */

        const text =
            document.createElement(
                "p"
            );


        text.className =
            "task-text";


        text.textContent =
            task.text;


        /* Actions */

        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "task-actions";


        /* Edit */

        const editButton =
            document.createElement(
                "button"
            );


        editButton.type =
            "button";


        editButton.className =
            "task-action";


        editButton.dataset.action =
            "edit";


        editButton.textContent =
            "Edit";


        /* Delete */

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.type =
            "button";


        deleteButton.className =
            "task-action delete";


        deleteButton.dataset.action =
            "delete";


        deleteButton.textContent =
            "Delete";


        actions.appendChild(
            editButton
        );

        actions.appendChild(
            deleteButton
        );


        content.appendChild(
            text
        );

        content.appendChild(
            actions
        );


        article.appendChild(
            checkButton
        );

        article.appendChild(
            content
        );


        return article;

    }


    /* ===============================
       READ / RENDER
       =============================== */

    function renderTasks() {

        taskList.innerHTML = "";


        const filteredTasks =
            getFilteredTasks();


        filteredTasks.forEach(
            task => {

                const element =
                    createTaskElement(
                        task
                    );


                taskList.appendChild(
                    element
                );

            }
        );


        updateEmptyState(
            filteredTasks
        );


        updateTaskCount();

    }


    /* ===============================
       UPDATE
       =============================== */

    function updateTask(
        id,
        newText
    ) {

        const task =
            tasks.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!task) {
            return;
        }


        const cleanText =
            newText.trim();


        if (!cleanText) {
            return;
        }


        task.text =
            cleanText;


        saveTasks();

        renderTasks();

    }


    /* ===============================
       UPDATE STATUS
       =============================== */

    function toggleTask(id) {

        const task =
            tasks.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!task) {
            return;
        }


        task.completed =
            !task.completed;


        saveTasks();

        renderTasks();

    }


    /* ===============================
       DELETE
       =============================== */

    function deleteTask(id) {

        tasks =
            tasks.filter(
                task =>
                    String(task.id) !==
                    String(id)
            );


        saveTasks();

        renderTasks();

    }


    /* ===============================
       EDIT UI
       =============================== */

    function editTask(
        taskElement
    ) {

        const id =
            taskElement.dataset.id;


        const task =
            tasks.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!task) {
            return;
        }


        const content =
            taskElement.querySelector(
                ".task-content"
            );


        content.innerHTML = "";


        const input =
            document.createElement(
                "input"
            );


        input.type =
            "text";


        input.className =
            "task-edit-input";


        input.value =
            task.text;


        input.maxLength =
            150;


        const actions =
            document.createElement(
                "div"
            );


        actions.className =
            "task-actions";


        const saveButton =
            document.createElement(
                "button"
            );


        saveButton.type =
            "button";


        saveButton.className =
            "task-action";


        saveButton.dataset.action =
            "save";


        saveButton.textContent =
            "Save";


        const cancelButton =
            document.createElement(
                "button"
            );


        cancelButton.type =
            "button";


        cancelButton.className =
            "task-action";


        cancelButton.dataset.action =
            "cancel";


        cancelButton.textContent =
            "Cancel";


        actions.appendChild(
            saveButton
        );


        actions.appendChild(
            cancelButton
        );


        content.appendChild(
            input
        );


        content.appendChild(
            actions
        );


        input.focus();

        input.select();

    }


    /* ===============================
       CLEAR COMPLETED
       =============================== */

    function clearCompleted() {

        tasks =
            tasks.filter(
                task =>
                    !task.completed
            );


        saveTasks();

        renderTasks();

    }


    /* ===============================
       CLEAR ALL
       =============================== */

    function clearAll() {

        if (tasks.length === 0) {
            return;
        }


        tasks = [];


        saveTasks();

        renderTasks();

    }


    /* ===============================
       FILTER
       =============================== */

    function setFilter(
        filter
    ) {

        currentFilter =
            filter;


        filterButtons.forEach(
            button => {

                const active =
                    button.dataset.filter ===
                    filter;


                button.classList.toggle(
                    "active",
                    active
                );


                button.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            }
        );


        renderTasks();

    }


    /* ===============================
       EMPTY STATE
       =============================== */

    function updateEmptyState(
        filteredTasks
    ) {

        if (
            filteredTasks.length ===
            0
        ) {

            emptyState.style.display =
                "block";

        } else {

            emptyState.style.display =
                "none";

        }

    }


    /* ===============================
       COUNTER
       =============================== */

    function updateTaskCount() {

        const remaining =
            tasks.filter(
                task =>
                    !task.completed
            ).length;


        if (remaining === 1) {

            taskCount.textContent =
                "1 task remaining";

        } else {

            taskCount.textContent =
                `${remaining} tasks remaining`;

        }

    }


    /* ===============================
       ADD EVENT
       =============================== */

    addTaskBtn.addEventListener(
        "click",
        addTask
    );


    taskInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                addTask();

            }

        }
    );


    /* ===============================
       EVENT DELEGATION
       =============================== */

    taskList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {
                return;
            }


            const taskElement =
                button.closest(
                    ".task-item"
                );


            if (!taskElement) {
                return;
            }


            const id =
                taskElement.dataset.id;


            const action =
                button.dataset.action;


            if (
                action ===
                "toggle"
            ) {

                toggleTask(id);

            }


            else if (
                action ===
                "edit"
            ) {

                editTask(
                    taskElement
                );

            }


            else if (
                action ===
                "delete"
            ) {

                deleteTask(id);

            }


            else if (
                action ===
                "save"
            ) {

                const input =
                    taskElement.querySelector(
                        ".task-edit-input"
                    );


                if (input) {

                    updateTask(
                        id,
                        input.value
                    );

                }

            }


            else if (
                action ===
                "cancel"
            ) {

                renderTasks();

            }

        }
    );


    /* ===============================
       EDIT KEYBOARD EVENTS
       =============================== */

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
                input.closest(
                    ".task-item"
                );


            if (!taskElement) {
                return;
            }


            const id =
                taskElement.dataset.id;


            if (
                event.key ===
                "Enter"
            ) {

                updateTask(
                    id,
                    input.value
                );

            }


            else if (
                event.key ===
                "Escape"
            ) {

                renderTasks();

            }

        }
    );


    /* ===============================
       FILTER EVENTS
       =============================== */

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    setFilter(
                        button.dataset.filter
                    );

                }
            );

        }
    );


    /* ===============================
       CLEAR EVENTS
       =============================== */

    clearCompletedBtn.addEventListener(
        "click",
        clearCompleted
    );


    clearAllBtn.addEventListener(
        "click",
        clearAll
    );


    /* ===============================
       INITIALIZE
       =============================== */

    loadTasks();

    renderTasks();

}
