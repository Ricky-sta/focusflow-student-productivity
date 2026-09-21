// ============================================================
// FOCUSFLOW
// COMPLETE TASK + GOAL + MILESTONE SYSTEM
// FINAL CORRECTED VERSION
// ============================================================

(function () {
    "use strict";

    // ============================================================
    // DOM ELEMENTS — TASKS
    // ============================================================

    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    const taskGoal = document.getElementById("taskGoal");
    const taskMilestone = document.getElementById("taskMilestone");

    const taskCategory = document.getElementById("taskCategory");
    const taskPriority = document.getElementById("taskPriority");

    const taskDate = document.getElementById("taskDate");
    const taskTime = document.getElementById("taskTime");

    const taskReminder = document.getElementById("taskReminder");
    const taskRepeat = document.getElementById("taskRepeat");

    const taskNotes = document.getElementById("taskNotes");


    // ============================================================
    // DOM ELEMENTS — TASK STATISTICS
    // ============================================================

    const totalTasksElement =
        document.getElementById("totalTasks");

    const completedTasksElement =
        document.getElementById("completedTasks");

    const progressTextElement =
        document.getElementById("progressText");

    const progressLabelElement =
        document.getElementById("progressLabel");

    const progressFillElement =
        document.getElementById("progressFill");

    const emptyState =
        document.getElementById("emptyState");


    // ============================================================
    // DOM ELEMENTS — GOALS
    // ============================================================

    const goalName =
        document.getElementById("goalName");

    const goalDescription =
        document.getElementById("goalDescription");

    const goalCategory =
        document.getElementById("goalCategory");

    const goalDeadline =
        document.getElementById("goalDeadline");

    const goalTime =
        document.getElementById("goalTime");

    const goalLevel =
        document.getElementById("goalLevel");

    const createGoalBtn =
        document.getElementById("createGoalBtn");

    const goalList =
        document.getElementById("goalList");

    const goalEmptyState =
        document.getElementById("goalEmptyState");


    // ============================================================
    // DOM ELEMENTS — MILESTONES
    // ============================================================

    const milestoneGoal =
        document.getElementById("milestoneGoal");

    const milestoneName =
        document.getElementById("milestoneName");

    const milestoneDescription =
        document.getElementById("milestoneDescription");

    const milestoneDeadline =
        document.getElementById("milestoneDeadline");

    const createMilestoneBtn =
        document.getElementById("createMilestoneBtn");

    const milestoneList =
        document.getElementById("milestoneList");

    const milestoneEmptyState =
        document.getElementById("milestoneEmptyState");


    // ============================================================
    // LOCAL STORAGE KEYS
    // ============================================================

    const STORAGE_KEY = "focusflowTasks";
    const GOAL_STORAGE_KEY = "focusflowGoals";
    const MILESTONE_STORAGE_KEY = "focusflowMilestones";


    // ============================================================
    // APPLICATION DATA
    // ============================================================

    let tasks = [];
    let goals = [];
    let milestones = [];


    // ============================================================
    // SAFE ID GENERATOR
    // ============================================================

    function createId() {
        return (
            Date.now().toString() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }


    // ============================================================
    // SAFE LOCAL STORAGE READ
    // ============================================================

    function readStorage(key, fallback = []) {
        try {
            const data = localStorage.getItem(key);

            if (!data) {
                return fallback;
            }

            const parsed = JSON.parse(data);

            return parsed;

        } catch (error) {
            console.error(
                `FocusFlow storage read error for ${key}:`,
                error
            );

            return fallback;
        }
    }


    // ============================================================
    // SAFE LOCAL STORAGE WRITE
    // ============================================================

    function writeStorage(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {
            console.error(
                `FocusFlow storage write error for ${key}:`,
                error
            );

            return false;
        }
    }


    // ============================================================
    // LOAD TASKS
    // ============================================================

    function loadTasks() {
        const data =
            readStorage(
                STORAGE_KEY,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }


    // ============================================================
    // SAVE TASKS
    // ============================================================

    function saveTasks() {
        return writeStorage(
            STORAGE_KEY,
            tasks
        );
    }


    // ============================================================
    // LOAD GOALS
    // ============================================================

    function loadGoals() {
        const data =
            readStorage(
                GOAL_STORAGE_KEY,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }


    // ============================================================
    // SAVE GOALS
    // ============================================================

    function saveGoals() {
        return writeStorage(
            GOAL_STORAGE_KEY,
            goals
        );
    }


    // ============================================================
    // LOAD MILESTONES
    // ============================================================

    function loadMilestones() {
        const data =
            readStorage(
                MILESTONE_STORAGE_KEY,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }


    // ============================================================
    // SAVE MILESTONES
    // ============================================================

    function saveMilestones() {
        return writeStorage(
            MILESTONE_STORAGE_KEY,
            milestones
        );
    }


    // ============================================================
    // NORMALIZE OLD TASK DATA
    // ============================================================

    function normalizeTasks() {
        tasks = tasks.map(function (task) {
            return {
                id:
                    task.id ??
                    createId(),

                text:
                    typeof task.text === "string"
                        ? task.text
                        : "",

                goalId:
                    task.goalId ??
                    "",

                milestoneId:
                    task.milestoneId ??
                    "",

                category:
                    task.category ??
                    "General",

                priority:
                    task.priority ??
                    "Medium",

                dueDate:
                    task.dueDate ??
                    "",

                dueTime:
                    task.dueTime ??
                    "",

                reminder:
                    task.reminder ??
                    "None",

                repeat:
                    task.repeat ??
                    "None",

                notes:
                    typeof task.notes === "string"
                        ? task.notes
                        : "",

                completed:
                    Boolean(task.completed),

                createdAt:
                    task.createdAt ??
                    new Date().toISOString(),

                completedAt:
                    task.completedAt ??
                    null,

                reminderSent:
                    Boolean(task.reminderSent)
            };
        });
    }


    // ============================================================
    // NORMALIZE OLD GOAL DATA
    // ============================================================

    function normalizeGoals() {
        goals = goals.map(function (goal) {
            return {
                id:
                    goal.id ??
                    createId(),

                name:
                    typeof goal.name === "string"
                        ? goal.name
                        : "",

                description:
                    typeof goal.description === "string"
                        ? goal.description
                        : "",

                category:
                    goal.category ??
                    "Study",

                deadline:
                    goal.deadline ??
                    "",

                availableTime:
                    goal.availableTime ??
                    "1 hour",

                level:
                    goal.level ??
                    "Beginner",

                preferredDays:
                    Array.isArray(goal.preferredDays)
                        ? goal.preferredDays
                        : [],

                createdAt:
                    goal.createdAt ??
                    new Date().toISOString()
            };
        });
    }


    // ============================================================
    // NORMALIZE OLD MILESTONE DATA
    // ============================================================

    function normalizeMilestones() {
        milestones = milestones.map(function (milestone) {
            return {
                id:
                    milestone.id ??
                    createId(),

                goalId:
                    milestone.goalId ??
                    "",

                name:
                    typeof milestone.name === "string"
                        ? milestone.name
                        : "",

                description:
                    typeof milestone.description === "string"
                        ? milestone.description
                        : "",

                deadline:
                    milestone.deadline ??
                    "",

                createdAt:
                    milestone.createdAt ??
                    new Date().toISOString()
            };
        });
    }


    // ============================================================
    // CLEAN INVALID RELATIONSHIPS
    // ============================================================

    function cleanRelationships() {

        // Remove milestones that reference
        // goals that no longer exist.
        milestones = milestones.filter(function (milestone) {
            return goals.some(function (goal) {
                return (
                    String(goal.id) ===
                    String(milestone.goalId)
                );
            });
        });


        // Fix task goal and milestone relationships.
        tasks = tasks.map(function (task) {

            let validGoalId = "";
            let validMilestoneId = "";

            if (task.goalId) {

                const goalExists =
                    goals.some(function (goal) {
                        return (
                            String(goal.id) ===
                            String(task.goalId)
                        );
                    });

                if (goalExists) {
                    validGoalId = task.goalId;
                }
            }


            if (task.milestoneId) {

                const milestoneExists =
                    milestones.find(function (milestone) {
                        return (
                            String(milestone.id) ===
                            String(task.milestoneId)
                        );
                    });

                if (
                    milestoneExists &&
                    String(milestoneExists.goalId) ===
                    String(validGoalId)
                ) {
                    validMilestoneId =
                        task.milestoneId;
                }
            }


            return {
                ...task,
                goalId: validGoalId,
                milestoneId: validMilestoneId
            };
        });
    }


    // ============================================================
    // GET PREFERRED DAYS
    // ============================================================

    function getPreferredDays() {

        const dayCheckboxes =
            document.querySelectorAll(
                ".day-options input[type='checkbox']"
            );

        const selectedDays = [];

        dayCheckboxes.forEach(function (checkbox) {

            if (checkbox.checked) {
                selectedDays.push(
                    checkbox.value
                );
            }

        });

        return selectedDays;
    }


    // ============================================================
    // ADD TASK
    // ============================================================

    function addTask() {

        const taskText =
            taskInput
                ? taskInput.value.trim()
                : "";


        if (!taskText) {

            alert(
                "Please enter a task."
            );

            if (taskInput) {
                taskInput.focus();
            }

            return;
        }


        const selectedGoalId =
            taskGoal
                ? taskGoal.value
                : "";


        const selectedMilestoneId =
            taskMilestone
                ? taskMilestone.value
                : "";


        let validMilestoneId = "";


        // Validate milestone belongs
        // to selected goal.
        if (selectedMilestoneId) {

            const linkedMilestone =
                milestones.find(function (milestone) {

                    return (
                        String(milestone.id) ===
                        String(selectedMilestoneId)
                    );

                });


            if (
                linkedMilestone &&
                String(linkedMilestone.goalId) ===
                String(selectedGoalId)
            ) {
                validMilestoneId =
                    selectedMilestoneId;
            }
        }


        const newTask = {

            id:
                createId(),

            text:
                taskText,

            goalId:
                selectedGoalId,

            milestoneId:
                validMilestoneId,

            category:
                taskCategory
                    ? taskCategory.value || "General"
                    : "General",

            priority:
                taskPriority
                    ? taskPriority.value || "Medium"
                    : "Medium",

            dueDate:
                taskDate
                    ? taskDate.value
                    : "",

            dueTime:
                taskTime
                    ? taskTime.value
                    : "",

            reminder:
                taskReminder
                    ? taskReminder.value || "None"
                    : "None",

            repeat:
                taskRepeat
                    ? taskRepeat.value || "None"
                    : "None",

            notes:
                taskNotes
                    ? taskNotes.value.trim()
                    : "",

            completed:
                false,

            createdAt:
                new Date().toISOString(),

            completedAt:
                null,

            reminderSent:
                false
        };


        tasks.push(newTask);

        saveTasks();

        // If reminders are being used,
        // request permission while this action
        // is still associated with a user click.
        if (
            newTask.reminder !== "None"
        ) {
            requestNotificationPermission();
        }

        renderAll();

        clearTaskForm();
    }


    // ============================================================
    // CLEAR TASK FORM
    // ============================================================

    function clearTaskForm() {

        if (taskInput) {
            taskInput.value = "";
        }

        if (taskGoal) {
            taskGoal.value = "";
        }

        if (taskMilestone) {
            taskMilestone.value = "";
        }

        if (taskCategory) {
            taskCategory.value =
                "General";
        }

        if (taskPriority) {
            taskPriority.value =
                "Medium";
        }

        if (taskDate) {
            taskDate.value = "";
        }

        if (taskTime) {
            taskTime.value = "";
        }

        if (taskReminder) {
            taskReminder.value =
                "None";
        }

        if (taskRepeat) {
            taskRepeat.value =
                "None";
        }

        if (taskNotes) {
            taskNotes.value = "";
        }


        updateTaskMilestoneOptions();


        if (taskInput) {
            taskInput.focus();
        }
    }


    // ============================================================
    // TOGGLE TASK
    // ============================================================

    function toggleTask(taskId) {

        let completedTask = null;


        tasks = tasks.map(function (task) {

            if (
                String(task.id) ===
                String(taskId)
            ) {

                const completed =
                    !task.completed;


                const updatedTask = {
                    ...task,

                    completed:
                        completed,

                    completedAt:
                        completed
                            ? new Date().toISOString()
                            : null,

                    reminderSent:
                        completed
                            ? true
                            : false
                };


                if (completed) {
                    completedTask =
                        updatedTask;
                }


                return updatedTask;
            }


            return task;
        });


        // Create the next occurrence
        // when a recurring task is completed.
        if (completedTask) {

            createNextRecurringTask(
                completedTask
            );
        }


        saveTasks();

        renderAll();
    }


    // ============================================================
    // DELETE TASK
    // ============================================================

    function deleteTask(taskId) {

        const confirmed =
            confirm(
                "Delete this task?"
            );


        if (!confirmed) {
            return;
        }


        tasks =
            tasks.filter(function (task) {

                return (
                    String(task.id) !==
                    String(taskId)
                );

            });


        saveTasks();

        renderAll();
    }


    // ============================================================
    // FORMAT DATE
    // ============================================================

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(
                dateString +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return dateString;
        }


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }


    // ============================================================
    // FORMAT TIME
    // ============================================================

    function formatTime(timeString) {

        if (!timeString) {
            return "";
        }


        const parts =
            timeString.split(":");


        if (parts.length < 2) {
            return timeString;
        }


        const hours =
            Number(parts[0]);

        const minutes =
            Number(parts[1]);


        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes)
        ) {
            return timeString;
        }


        const date =
            new Date();


        date.setHours(
            hours,
            minutes,
            0,
            0
        );


        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );
    }


    // ============================================================
    // RENDER TASKS
    // ============================================================

    function renderTasks() {

        if (!taskList) {
            return;
        }


        taskList.innerHTML = "";


        if (emptyState) {

            emptyState.style.display =
                tasks.length === 0
                    ? "block"
                    : "none";
        }


        tasks.forEach(function (task) {

            const listItem =
                document.createElement("li");


            listItem.className =
                "task-item";


            if (task.completed) {

                listItem.classList.add(
                    "completed"
                );
            }


            // ----------------------------------------------------
            // TASK CONTENT
            // ----------------------------------------------------

            const taskContent =
                document.createElement("div");


            taskContent.className =
                "task-content";


            if (task.completed) {

                taskContent.classList.add(
                    "completed"
                );
            }


            // ----------------------------------------------------
            // CHECKBOX
            // ----------------------------------------------------

            const checkbox =
                document.createElement("input");


            checkbox.type =
                "checkbox";


            checkbox.checked =
                Boolean(task.completed);


            checkbox.setAttribute(
                "aria-label",
                "Complete task"
            );


            checkbox.addEventListener(
                "change",
                function () {
                    toggleTask(task.id);
                }
            );


            // ----------------------------------------------------
            // TASK TEXT
            // ----------------------------------------------------

            const taskText =
                document.createElement("span");


            taskText.className =
                "task-text";


            taskText.textContent =
                task.text;


            taskContent.appendChild(
                checkbox
            );


            taskContent.appendChild(
                taskText
            );


            // ----------------------------------------------------
            // TASK INFORMATION
            // ----------------------------------------------------

            const taskInfo =
                document.createElement("div");


            taskInfo.className =
                "task-info";


            // Category
            if (task.category) {

                const category =
                    document.createElement("span");


                category.className =
                    "task-tag";


                category.textContent =
                    task.category;


                taskInfo.appendChild(
                    category
                );
            }


            // Priority
            if (task.priority) {

                const priority =
                    document.createElement("span");


                priority.className =
                    "task-tag priority-" +
                    String(
                        task.priority
                    ).toLowerCase();


                priority.textContent =
                    "Priority: " +
                    task.priority;


                taskInfo.appendChild(
                    priority
                );
            }


            // Goal
            if (task.goalId) {

                const linkedGoal =
                    findGoal(
                        task.goalId
                    );


                if (linkedGoal) {

                    const goalTag =
                        document.createElement(
                            "span"
                        );


                    goalTag.className =
                        "task-tag";


                    goalTag.textContent =
                        "🎯 " +
                        linkedGoal.name;


                    taskInfo.appendChild(
                        goalTag
                    );
                }
            }


            // Milestone
            if (task.milestoneId) {

                const linkedMilestone =
                    findMilestone(
                        task.milestoneId
                    );


                if (linkedMilestone) {

                    const milestoneTag =
                        document.createElement(
                            "span"
                        );


                    milestoneTag.className =
                        "task-tag";


                    milestoneTag.textContent =
                        "🏆 " +
                        linkedMilestone.name;


                    taskInfo.appendChild(
                        milestoneTag
                    );
                }
            }


            // Due Date
            if (task.dueDate) {

                const dateTag =
                    document.createElement(
                        "span"
                    );


                dateTag.className =
                    "task-tag";


                dateTag.textContent =
                    "📅 " +
                    formatDate(
                        task.dueDate
                    );


                taskInfo.appendChild(
                    dateTag
                );
            }


            // Due Time
            if (task.dueTime) {

                const timeTag =
                    document.createElement(
                        "span"
                    );


                timeTag.className =
                    "task-tag";


                timeTag.textContent =
                    "⏰ " +
                    formatTime(
                        task.dueTime
                    );


                taskInfo.appendChild(
                    timeTag
                );
            }


            // Reminder
            if (
                task.reminder &&
                task.reminder !== "None"
            ) {

                const reminderTag =
                    document.createElement(
                        "span"
                    );


                reminderTag.className =
                    "task-tag";


                reminderTag.textContent =
                    "🔔 " +
                    task.reminder;


                taskInfo.appendChild(
                    reminderTag
                );
            }


            // Repeat
            if (
                task.repeat &&
                task.repeat !== "None"
            ) {

                const repeatTag =
                    document.createElement(
                        "span"
                    );


                repeatTag.className =
                    "task-tag";


                repeatTag.textContent =
                    "🔁 " +
                    task.repeat;


                taskInfo.appendChild(
                    repeatTag
                );
            }


            taskContent.appendChild(
                taskInfo
            );


            // ----------------------------------------------------
            // NOTES
            // ----------------------------------------------------

            if (task.notes) {

                const notes =
                    document.createElement(
                        "p"
                    );


                notes.className =
                    "task-notes";


                notes.textContent =
                    task.notes;


                taskContent.appendChild(
                    notes
                );
            }


            // ----------------------------------------------------
            // DELETE BUTTON
            // ----------------------------------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "delete-btn";


            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function () {
                    deleteTask(task.id);
                }
            );


            // ----------------------------------------------------
            // BUILD TASK ITEM
            // ----------------------------------------------------

            listItem.appendChild(
                taskContent
            );


            listItem.appendChild(
                deleteButton
            );


            taskList.appendChild(
                listItem
            );

        });


        updateStats();
    }


    // ============================================================
    // UPDATE TASK STATISTICS
    // ============================================================

    function updateStats() {

        const total =
            tasks.length;


        const completed =
            tasks.filter(function (task) {
                return task.completed;
            }).length;


        const progress =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) *
                    100
                );


        if (totalTasksElement) {

            totalTasksElement.textContent =
                total;
        }


        if (completedTasksElement) {

            completedTasksElement.textContent =
                completed;
        }


        if (progressTextElement) {

            progressTextElement.textContent =
                `${progress}%`;
        }


        if (progressLabelElement) {

            progressLabelElement.textContent =
                `${progress}%`;
        }


        if (progressFillElement) {

            progressFillElement.style.width =
                `${progress}%`;
        }
    }


    // ============================================================
    // CREATE GOAL
    // ============================================================
async function createGoal() {

    const name =
        goalName
            ? goalName.value.trim()
            : "";

    const description =
        goalDescription
            ? goalDescription.value.trim()
            : "";

    if (!name) {

        alert(
            "Please enter a goal name."
        );

        if (goalName) {
            goalName.focus();
        }

        return;
    }

    const newGoal = {

        id:
            createId(),

        name:
            name,

        description:
            description,

        category:
            goalCategory
                ? goalCategory.value || "Study"
                : "Study",

        deadline:
            goalDeadline
                ? goalDeadline.value
                : "",

        availableTime:
            goalTime
                ? goalTime.value || "1 hour"
                : "1 hour",

        level:
            goalLevel
                ? goalLevel.value || "Beginner"
                : "Beginner",

        preferredDays:
            getPreferredDays(),

        createdAt:
            new Date().toISOString()
    };


    // =====================================================
    // SAVE GOAL TO SUPABASE
    // =====================================================

    if (
        window.FocusFlowCloud &&
        typeof window.FocusFlowCloud.createCloudGoal === "function"
    ) {

        const cloudGoal =
            await window.FocusFlowCloud.createCloudGoal(
                {
                    ...newGoal,
                    currentLevel: newGoal.level
                }
            );


        if (!cloudGoal) {

            alert(
                "The goal could not be saved to the cloud. Please check your connection and try again."
            );

            return;
        }


        // Replace the temporary local ID
        // with the real Supabase goal ID.

        newGoal.id =
            cloudGoal.id;


        console.log(
            "FocusFlow: Goal synced to Supabase.",
            cloudGoal
        );
    }


    // =====================================================
    // UPDATE LOCAL APP STATE
    // =====================================================

    goals.push(
        newGoal
    );


    saveGoals();

    renderAll();

    clearGoalForm();

}
   
    // ============================================================
    // CLEAR GOAL FORM
    // ============================================================

    function clearGoalForm() {

        if (goalName) {
            goalName.value = "";
        }

        if (goalDescription) {
            goalDescription.value = "";
        }

        if (goalCategory) {
            goalCategory.value =
                "Study";
        }

        if (goalDeadline) {
            goalDeadline.value = "";
        }

        if (goalTime) {
            goalTime.value =
                "1 hour";
        }

        if (goalLevel) {
            goalLevel.value =
                "Beginner";
        }


        const dayCheckboxes =
            document.querySelectorAll(
                ".day-options input[type='checkbox']"
            );


        dayCheckboxes.forEach(function (checkbox) {

            checkbox.checked =
                false;

        });


        if (goalName) {
            goalName.focus();
        }
    }


    // ============================================================
    // FORMAT GOAL DATE
    // ============================================================

    function formatGoalDate(dateString) {

        if (!dateString) {
            return "No deadline";
        }


        return formatDate(
            dateString
        );
    }


    // ============================================================
    // CALCULATE GOAL PROGRESS
    // ============================================================

    function calculateGoalProgress(goalId) {

        const goalTasks =
            tasks.filter(function (task) {

                return (
                    String(task.goalId) ===
                    String(goalId)
                );

            });


        if (goalTasks.length === 0) {
            return 0;
        }


        const completedTasks =
            goalTasks.filter(function (task) {

                return task.completed;

            }).length;


        return Math.round(
            (completedTasks /
                goalTasks.length) *
            100
        );
    }


    // ============================================================
    // RENDER GOALS
    // ============================================================

    function renderGoals() {

        if (!goalList) {
            return;
        }


        goalList.innerHTML = "";


        if (goalEmptyState) {

            goalEmptyState.style.display =
                goals.length === 0
                    ? "block"
                    : "none";
        }


        goals.forEach(function (goal) {

            const goalItem =
                document.createElement(
                    "div"
                );


            goalItem.className =
                "goal-item";


            // ----------------------------------------------------
            // TITLE
            // ----------------------------------------------------

            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                goal.name;


            goalItem.appendChild(
                title
            );


            // ----------------------------------------------------
            // DESCRIPTION
            // ----------------------------------------------------

            if (goal.description) {

                const description =
                    document.createElement(
                        "p"
                    );


                description.textContent =
                    goal.description;


                goalItem.appendChild(
                    description
                );
            }


            // ----------------------------------------------------
            // META
            // ----------------------------------------------------

            const meta =
                document.createElement(
                    "div"
                );


            meta.className =
                "goal-meta";


            // Category
            const category =
                document.createElement(
                    "span"
                );


            category.className =
                "goal-tag";


            category.textContent =
                goal.category ||
                "General";


            meta.appendChild(
                category
            );


            // Level
            const level =
                document.createElement(
                    "span"
                );


            level.className =
                "goal-tag";


            level.textContent =
                goal.level ||
                "Beginner";


            meta.appendChild(
                level
            );


            // Available time
            if (goal.availableTime) {

                const availableTime =
                    document.createElement(
                        "span"
                    );


                availableTime.className =
                    "goal-tag";


                availableTime.textContent =
                    goal.availableTime +
                    "/day";


                meta.appendChild(
                    availableTime
                );
            }


            // Deadline
            const deadline =
                document.createElement(
                    "span"
                );


            deadline.className =
                "goal-tag";


            deadline.textContent =
                "📅 " +
                formatGoalDate(
                    goal.deadline
                );


            meta.appendChild(
                deadline
            );


            goalItem.appendChild(
                meta
            );


            // ----------------------------------------------------
            // PREFERRED DAYS
            // ----------------------------------------------------

            if (
                Array.isArray(
                    goal.preferredDays
                ) &&
                goal.preferredDays.length > 0
            ) {

                const days =
                    document.createElement(
                        "p"
                    );


                days.textContent =
                    "Preferred days: " +
                    goal.preferredDays.join(
                        ", "
                    );


                goalItem.appendChild(
                    days
                );
            }


            // ----------------------------------------------------
            // GOAL PROGRESS
            // ----------------------------------------------------

            const progressContainer =
                document.createElement(
                    "div"
                );


            progressContainer.className =
                "goal-progress";


            const progressText =
                document.createElement(
                    "p"
                );


            const currentProgress =
                calculateGoalProgress(
                    goal.id
                );


            progressText.textContent =
                "Progress: " +
                currentProgress +
                "%";


            const progressBar =
                document.createElement(
                    "div"
                );


            progressBar.className =
                "goal-progress-bar";


            const progressFill =
                document.createElement(
                    "div"
                );


            progressFill.className =
                "goal-progress-fill";


            progressFill.style.width =
                currentProgress +
                "%";


            progressBar.appendChild(
                progressFill
            );


            progressContainer.appendChild(
                progressText
            );


            progressContainer.appendChild(
                progressBar
            );


            goalItem.appendChild(
                progressContainer
            );


            // ----------------------------------------------------
            // DELETE GOAL
            // ----------------------------------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "delete-btn";


            deleteButton.textContent =
                "Delete Goal";


            deleteButton.addEventListener(
                "click",
                function () {
                    deleteGoal(goal.id);
                }
            );


            goalItem.appendChild(
                deleteButton
            );


            goalList.appendChild(
                goalItem
            );

        });
    }


    // ============================================================
    // DELETE GOAL
    // ============================================================

    function deleteGoal(goalId) {

        const confirmed =
            confirm(
                "Delete this goal? Its linked milestones will also be removed."
            );


        if (!confirmed) {
            return;
        }


        // Find all milestones belonging
        // to this goal.
        const milestoneIds =
            milestones
                .filter(function (milestone) {

                    return (
                        String(
                            milestone.goalId
                        ) ===
                        String(goalId)
                    );

                })
                .map(function (milestone) {

                    return String(
                        milestone.id
                    );

                });


        // Remove goal.
        goals =
            goals.filter(function (goal) {

                return (
                    String(goal.id) !==
                    String(goalId)
                );

            });


        // Remove linked milestones.
        milestones =
            milestones.filter(function (milestone) {

                return (
                    String(
                        milestone.goalId
                    ) !==
                    String(goalId)
                );

            });


        // Remove goal/milestone references
        // from tasks.
        tasks =
            tasks.map(function (task) {

                if (
                    String(task.goalId) ===
                    String(goalId)
                ) {

                    return {
                        ...task,

                        goalId: "",

                        milestoneId: ""
                    };
                }


                if (
                    milestoneIds.includes(
                        String(
                            task.milestoneId
                        )
                    )
                ) {

                    return {
                        ...task,

                        milestoneId: ""
                    };
                }


                return task;
            });


        saveGoals();
        saveMilestones();
        saveTasks();

        renderAll();
    }


    // ============================================================
    // UPDATE TASK GOAL DROPDOWN
    // ============================================================

    function updateTaskGoalOptions() {

        if (!taskGoal) {
            return;
        }


        const currentValue =
            taskGoal.value;


        taskGoal.innerHTML = "";


        const noGoalOption =
            document.createElement(
                "option"
            );


        noGoalOption.value = "";

        noGoalOption.textContent =
            "No Goal";


        taskGoal.appendChild(
            noGoalOption
        );


        goals.forEach(function (goal) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                goal.id;


            option.textContent =
                goal.name;


            taskGoal.appendChild(
                option
            );

        });


        const goalStillExists =
            goals.some(function (goal) {

                return (
                    String(goal.id) ===
                    String(currentValue)
                );

            });


        taskGoal.value =
            goalStillExists
                ? currentValue
                : "";
    }


    // ============================================================
    // UPDATE MILESTONE GOAL DROPDOWN
    // ============================================================

    function updateMilestoneGoalOptions() {

        if (!milestoneGoal) {
            return;
        }


        const currentValue =
            milestoneGoal.value;


        milestoneGoal.innerHTML = "";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value = "";

        defaultOption.textContent =
            "Select a goal";


        milestoneGoal.appendChild(
            defaultOption
        );


        goals.forEach(function (goal) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                goal.id;


            option.textContent =
                goal.name;


            milestoneGoal.appendChild(
                option
            );

        });


        const goalStillExists =
            goals.some(function (goal) {

                return (
                    String(goal.id) ===
                    String(currentValue)
                );

            });


        milestoneGoal.value =
            goalStillExists
                ? currentValue
                : "";
    }


    // ============================================================
    // UPDATE TASK MILESTONE DROPDOWN
    // ============================================================

    function updateTaskMilestoneOptions() {

        if (!taskMilestone) {
            return;
        }


        const currentValue =
            taskMilestone.value;


        const selectedGoalId =
            taskGoal
                ? taskGoal.value
                : "";


        taskMilestone.innerHTML = "";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value = "";

        defaultOption.textContent =
            "No Milestone";


        taskMilestone.appendChild(
            defaultOption
        );


        if (!selectedGoalId) {

            taskMilestone.value =
                "";

            return;
        }


        const goalMilestones =
            milestones.filter(
                function (milestone) {

                    return (
                        String(
                            milestone.goalId
                        ) ===
                        String(
                            selectedGoalId
                        )
                    );

                }
            );


        goalMilestones.forEach(
            function (milestone) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    milestone.id;


                option.textContent =
                    milestone.name;


                taskMilestone.appendChild(
                    option
                );

            }
        );


        const milestoneStillExists =
            goalMilestones.some(
                function (milestone) {

                    return (
                        String(
                            milestone.id
                        ) ===
                        String(currentValue)
                    );

                }
            );


        taskMilestone.value =
            milestoneStillExists
                ? currentValue
                : "";
    }


    // ============================================================
    // CALCULATE MILESTONE PROGRESS
    // ============================================================

    function calculateMilestoneProgress(
        milestoneId
    ) {

        const milestoneTasks =
            tasks.filter(function (task) {

                return (
                    String(
                        task.milestoneId
                    ) ===
                    String(milestoneId)
                );

            });


        if (
            milestoneTasks.length === 0
        ) {
            return 0;
        }


        const completedTasks =
            milestoneTasks.filter(
                function (task) {

                    return task.completed;

                }
            ).length;


        return Math.round(
            (completedTasks /
                milestoneTasks.length) *
            100
        );
    }


    // ============================================================
    // CREATE MILESTONE
    // ============================================================

    function createMilestone() {

        const name =
            milestoneName
                ? milestoneName.value.trim()
                : "";


        const description =
            milestoneDescription
                ? milestoneDescription.value.trim()
                : "";


        const selectedGoalId =
            milestoneGoal
                ? milestoneGoal.value
                : "";


        if (!selectedGoalId) {

            alert(
                "Please select a goal."
            );


            if (milestoneGoal) {
                milestoneGoal.focus();
            }


            return;
        }


        if (!name) {

            alert(
                "Please enter a milestone name."
            );


            if (milestoneName) {
                milestoneName.focus();
            }


            return;
        }


        // Make sure the selected goal
        // actually exists.
        const goalExists =
            goals.some(function (goal) {

                return (
                    String(goal.id) ===
                    String(selectedGoalId)
                );

            });


        if (!goalExists) {

            alert(
                "The selected goal no longer exists. Please select another goal."
            );


            updateMilestoneGoalOptions();

            return;
        }


        const newMilestone = {

            id:
                createId(),

            goalId:
                selectedGoalId,

            name:
                name,

            description:
                description,

            deadline:
                milestoneDeadline
                    ? milestoneDeadline.value
                    : "",

            createdAt:
                new Date().toISOString()
        };


        milestones.push(
            newMilestone
        );


        saveMilestones();

        renderAll();

        clearMilestoneForm();
    }


    // ============================================================
    // CLEAR MILESTONE FORM
    // ============================================================

    function clearMilestoneForm() {

        if (milestoneName) {
            milestoneName.value = "";
        }

        if (milestoneDescription) {
            milestoneDescription.value = "";
        }

        if (milestoneDeadline) {
            milestoneDeadline.value = "";
        }

        if (milestoneGoal) {
            milestoneGoal.value = "";
        }


        updateTaskMilestoneOptions();


        if (milestoneName) {
            milestoneName.focus();
        }
    }


    // ============================================================
    // FORMAT MILESTONE DATE
    // ============================================================

    function formatMilestoneDate(
        dateString
    ) {

        if (!dateString) {
            return "No target date";
        }


        return formatDate(
            dateString
        );
    }


    // ============================================================
    // RENDER MILESTONES
    // ============================================================

    function renderMilestones() {

        if (!milestoneList) {
            return;
        }


        milestoneList.innerHTML = "";


        if (milestoneEmptyState) {

            milestoneEmptyState.style.display =
                milestones.length === 0
                    ? "block"
                    : "none";
        }


        milestones.forEach(
            function (milestone) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "milestone-item";


                // ------------------------------------------------
                // TITLE
                // ------------------------------------------------

                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    milestone.name;


                item.appendChild(
                    title
                );


                // ------------------------------------------------
                // DESCRIPTION
                // ------------------------------------------------

                if (milestone.description) {

                    const description =
                        document.createElement(
                            "p"
                        );


                    description.textContent =
                        milestone.description;


                    item.appendChild(
                        description
                    );
                }


                // ------------------------------------------------
                // META
                // ------------------------------------------------

                const meta =
                    document.createElement(
                        "div"
                    );


                meta.className =
                    "milestone-meta";


                // Goal
                const linkedGoal =
                    findGoal(
                        milestone.goalId
                    );


                const goalTag =
                    document.createElement(
                        "span"
                    );


                goalTag.className =
                    "milestone-tag";


                goalTag.textContent =
                    linkedGoal
                        ? "🎯 " +
                          linkedGoal.name
                        : "Goal unavailable";


                meta.appendChild(
                    goalTag
                );


                // Deadline
                const dateTag =
                    document.createElement(
                        "span"
                    );


                dateTag.className =
                    "milestone-tag";


                dateTag.textContent =
                    "📅 " +
                    formatMilestoneDate(
                        milestone.deadline
                    );


                meta.appendChild(
                    dateTag
                );


                item.appendChild(
                    meta
                );


                // ------------------------------------------------
                // PROGRESS
                // ------------------------------------------------

                const progressContainer =
                    document.createElement(
                        "div"
                    );


                progressContainer.className =
                    "milestone-progress";


                const progressText =
                    document.createElement(
                        "p"
                    );


                const currentProgress =
                    calculateMilestoneProgress(
                        milestone.id
                    );


                progressText.textContent =
                    "Progress: " +
                    currentProgress +
                    "%";


                const progressBar =
                    document.createElement(
                        "div"
                    );


                progressBar.className =
                    "milestone-progress-bar";


                const progressFill =
                    document.createElement(
                        "div"
                    );


                progressFill.className =
                    "milestone-progress-fill";


                progressFill.style.width =
                    currentProgress +
                    "%";


                progressBar.appendChild(
                    progressFill
                );


                progressContainer.appendChild(
                    progressText
                );


                progressContainer.appendChild(
                    progressBar
                );


                item.appendChild(
                    progressContainer
                );


                // ------------------------------------------------
                // DELETE BUTTON
                // ------------------------------------------------

                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "delete-btn";


                deleteButton.textContent =
                    "Delete Milestone";


                deleteButton.addEventListener(
                    "click",
                    function () {
                        deleteMilestone(
                            milestone.id
                        );
                    }
                );


                item.appendChild(
                    deleteButton
                );


                milestoneList.appendChild(
                    item
                );

            }
        );
    }


    // ============================================================
    // DELETE MILESTONE
    // ============================================================

    function deleteMilestone(
        milestoneId
    ) {

        const confirmed =
            confirm(
                "Delete this milestone? Tasks linked to it will become unlinked from the milestone."
            );


        if (!confirmed) {
            return;
        }


        milestones =
            milestones.filter(
                function (milestone) {

                    return (
                        String(
                            milestone.id
                        ) !==
                        String(milestoneId)
                    );

                }
            );


        tasks =
            tasks.map(function (task) {

                if (
                    String(
                        task.milestoneId
                    ) ===
                    String(milestoneId)
                ) {

                    return {
                        ...task,

                        milestoneId: ""
                    };
                }


                return task;
            });


        saveMilestones();
        saveTasks();

        renderAll();
    }


    // ============================================================
    // FIND TASK BY ID
    // ============================================================

    function findTask(taskId) {

        return tasks.find(
            function (task) {

                return (
                    String(task.id) ===
                    String(taskId)
                );

            }
        );
    }


    // ============================================================
    // FIND GOAL BY ID
    // ============================================================

    function findGoal(goalId) {

        return goals.find(
            function (goal) {

                return (
                    String(goal.id) ===
                    String(goalId)
                );

            }
        );
    }


    // ============================================================
    // FIND MILESTONE BY ID
    // ============================================================

    function findMilestone(
        milestoneId
    ) {

        return milestones.find(
            function (milestone) {

                return (
                    String(
                        milestone.id
                    ) ===
                    String(milestoneId)
                );

            }
        );
    }


    // ============================================================
    // GET TODAY STRING
    // ============================================================

    function getTodayString() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                now.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );
    }


    // ============================================================
    // CHECK IF TASK IS TODAY
    // ============================================================

    function isTaskToday(task) {

        return (
            task.dueDate ===
            getTodayString()
        );
    }


    // ============================================================
    // GET TODAY TASKS
    // ============================================================

    function getTodayTasks() {

        return tasks.filter(
            function (task) {

                return isTaskToday(
                    task
                );

            }
        );
    }


    // ============================================================
    // GET COMPLETED TODAY TASKS
    // ============================================================

    function getCompletedTodayTasks() {

        return tasks.filter(
            function (task) {

                return (
                    isTaskToday(task) &&
                    task.completed
                );

            }
        );
    }


    // ============================================================
    // GET TODAY PROGRESS
    // ============================================================

    function getTodayProgress() {

        const todayTasks =
            getTodayTasks();


        if (
            todayTasks.length === 0
        ) {
            return 0;
        }


        const completed =
            todayTasks.filter(
                function (task) {

                    return task.completed;

                }
            ).length;


        return Math.round(
            (completed /
                todayTasks.length) *
            100
        );
    }


    // ============================================================
    // GET NEXT REPEAT DATE
    // ============================================================

    function getNextRepeatDate(
        dateString,
        repeatType
    ) {

        if (
            !dateString ||
            !repeatType ||
            repeatType === "None"
        ) {
            return null;
        }


        const date =
            new Date(
                dateString +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return null;
        }


        // --------------------------------------------------------
        // DAILY
        // --------------------------------------------------------

        if (
            repeatType === "Daily"
        ) {

            date.setDate(
                date.getDate() + 1
            );
        }


        // --------------------------------------------------------
        // WEEKLY
        // --------------------------------------------------------

        else if (
            repeatType === "Weekly"
        ) {

            date.setDate(
                date.getDate() + 7
            );
        }


        // --------------------------------------------------------
        // WEEKDAYS
        // --------------------------------------------------------

        else if (
            repeatType === "Weekdays"
        ) {

            date.setDate(
                date.getDate() + 1
            );


            while (
                date.getDay() === 0 ||
                date.getDay() === 6
            ) {

                date.setDate(
                    date.getDate() + 1
                );
            }
        }


        // --------------------------------------------------------
        // MONTHLY
        // --------------------------------------------------------

        else if (
            repeatType === "Monthly"
        ) {

            const originalDay =
                date.getDate();


            date.setDate(1);

            date.setMonth(
                date.getMonth() + 1
            );


            const lastDayOfMonth =
                new Date(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    0
                ).getDate();


            date.setDate(
                Math.min(
                    originalDay,
                    lastDayOfMonth
                )
            );
        }


        else {
            return null;
        }


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );
    }


    // ============================================================
    // CREATE NEXT RECURRING TASK
    // ============================================================

    function createNextRecurringTask(
        completedTask
    ) {

        if (
            !completedTask ||
            completedTask.repeat === "None" ||
            !completedTask.dueDate
        ) {
            return null;
        }


        const nextDate =
            getNextRepeatDate(
                completedTask.dueDate,
                completedTask.repeat
            );


        if (!nextDate) {
            return null;
        }


        // Prevent duplicate recurring tasks.
        const alreadyExists =
            tasks.some(
                function (task) {

                    return (
                        task.text ===
                            completedTask.text &&

                        task.dueDate ===
                            nextDate &&

                        String(
                            task.goalId
                        ) ===
                            String(
                                completedTask.goalId
                            ) &&

                        String(
                            task.milestoneId
                        ) ===
                            String(
                                completedTask.milestoneId
                            )
                    );

                }
            );


        if (alreadyExists) {
            return null;
        }


        const nextTask = {

            ...completedTask,

            id:
                createId(),

            dueDate:
                nextDate,

            completed:
                false,

            completedAt:
                null,

            reminderSent:
                false,

            createdAt:
                new Date().toISOString()
        };


        tasks.push(
            nextTask
        );


        return nextTask;
    }


    // ============================================================
    // GET REMINDER MINUTES
    // ============================================================

    function getReminderMinutes(
        reminder
    ) {

        const normalized =
            String(
                reminder || ""
            ).toLowerCase();


        if (
            normalized.includes(
                "10 minutes"
            )
        ) {
            return 10;
        }


        if (
            normalized.includes(
                "30 minutes"
            )
        ) {
            return 30;
        }


        if (
            normalized.includes(
                "1 hour"
            )
        ) {
            return 60;
        }


        return 0;
    }


    // ============================================================
    // CHECK REMINDERS
    // ============================================================

    function checkReminders() {

        const now =
            new Date();


        let changed =
            false;


        tasks =
            tasks.map(function (task) {

                if (
                    task.completed ||
                    !task.dueDate ||
                    !task.dueTime ||
                    !task.reminder ||
                    task.reminder === "None" ||
                    task.reminderSent
                ) {
                    return task;
                }


                const dueDateTime =
                    new Date(
                        `${task.dueDate}T${task.dueTime}`
                    );


                if (
                    Number.isNaN(
                        dueDateTime.getTime()
                    )
                ) {
                    return task;
                }


                const reminderMinutes =
                    getReminderMinutes(
                        task.reminder
                    );


                if (
                    reminderMinutes <= 0
                ) {
                    return task;
                }


                const reminderTime =
                    new Date(
                        dueDateTime.getTime() -
                        (
                            reminderMinutes *
                            60 *
                            1000
                        )
                    );


                if (
                    now >= reminderTime &&
                    now < dueDateTime
                ) {

                    if (
                        "Notification" in window &&
                        Notification.permission ===
                            "granted"
                    ) {

                        try {

                            new Notification(
                                "FocusFlow Reminder",
                                {
                                    body:
                                        task.text
                                }
                            );

                        } catch (error) {

                            console.error(
                                "FocusFlow notification error:",
                                error
                            );
                        }
                    }


                    task.reminderSent =
                        true;


                    changed =
                        true;
                }


                return task;
            });


        if (changed) {

            saveTasks();

            renderAll();
        }
    }


    // ============================================================
    // REQUEST NOTIFICATION PERMISSION
    // ============================================================

    function requestNotificationPermission() {

        if (
            !("Notification" in window)
        ) {
            return;
        }


        if (
            Notification.permission ===
            "default"
        ) {

            Notification.requestPermission()
                .then(function (permission) {

                    console.log(
                        "FocusFlow notification permission:",
                        permission
                    );

                })
                .catch(function (error) {

                    console.error(
                        "FocusFlow notification permission error:",
                        error
                    );

                });
        }
    }


    // ============================================================
    // RESET REMINDER STATUS
    // ============================================================

    function resetReminderForTask(
        taskId
    ) {

        tasks =
            tasks.map(function (task) {

                if (
                    String(task.id) ===
                    String(taskId)
                ) {

                    return {
                        ...task,

                        reminderSent:
                            false
                    };
                }


                return task;
            });


        saveTasks();

        renderAll();
    }


    // ============================================================
    // GLOBAL RENDER
    // ============================================================

    function renderAll() {

        updateTaskGoalOptions();

        updateMilestoneGoalOptions();

        updateTaskMilestoneOptions();

        renderTasks();

        renderGoals();

        renderMilestones();
    }


    // ============================================================
    // EVENT LISTENERS
    // ============================================================

    // ------------------------------------------------------------
    // ADD TASK BUTTON
    // ------------------------------------------------------------

    if (addTaskBtn) {

        addTaskBtn.addEventListener(
            "click",
            addTask
        );
    }


    // ------------------------------------------------------------
    // ENTER KEY FOR TASK
    // ------------------------------------------------------------

    if (taskInput) {

        taskInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    addTask();
                }
            }
        );
    }


    // ------------------------------------------------------------
    // TASK GOAL CHANGE
    // ------------------------------------------------------------

    if (taskGoal) {

        taskGoal.addEventListener(
            "change",
            function () {

                updateTaskMilestoneOptions();

            }
        );
    }


    // ------------------------------------------------------------
    // CREATE GOAL
    // ------------------------------------------------------------

    if (createGoalBtn) {

        createGoalBtn.addEventListener(
            "click",
            createGoal
        );
    }


    // ------------------------------------------------------------
    // CREATE MILESTONE
    // ------------------------------------------------------------

    if (createMilestoneBtn) {

        createMilestoneBtn.addEventListener(
            "click",
            createMilestone
        );
    }


    // ============================================================
    // INITIALIZE APPLICATION DATA
    // ============================================================

    tasks =
        loadTasks();


    goals =
        loadGoals();


    milestones =
        loadMilestones();


    // ============================================================
    // NORMALIZE EXISTING DATA
    // ============================================================

    normalizeTasks();

    normalizeGoals();

    normalizeMilestones();

    cleanRelationships();


    // Save cleaned/normalized data.
    saveTasks();

    saveGoals();

    saveMilestones();


    // ============================================================
    // INITIAL APPLICATION DISPLAY
    // ============================================================

    renderAll();


    // ============================================================
    // START REMINDER SYSTEM
    // ============================================================

    checkReminders();


    // Check every 30 seconds.
    setInterval(
        checkReminders,
        30000
    );


    // ============================================================
    // OPTIONAL DEBUG / DEVELOPMENT API
    // ============================================================

    window.FocusFlow = {

        // Data
        getTasks:
            function () {
                return tasks;
            },

        getGoals:
            function () {
                return goals;
            },

        getMilestones:
            function () {
                return milestones;
            },


        // Today's data
        getTodayTasks:
            getTodayTasks,

        getCompletedTodayTasks:
            getCompletedTodayTasks,

        getTodayProgress:
            getTodayProgress,


        // Progress
        calculateGoalProgress:
            calculateGoalProgress,

        calculateMilestoneProgress:
            calculateMilestoneProgress,


        // Find records
        findTask:
            findTask,

        findGoal:
            findGoal,

        findMilestone:
            findMilestone,


        // Utility
        formatDate:
            formatDate,

        formatTime:
            formatTime,

        getNextRepeatDate:
            getNextRepeatDate,


        // Notifications
        requestNotificationPermission:
            requestNotificationPermission,


        // Reminder control
        resetReminderForTask:
            resetReminderForTask,


        // Force rendering
        renderAll:
            renderAll,


        // Storage
        saveTasks:
            saveTasks,

        saveGoals:
            saveGoals,

        saveMilestones:
            saveMilestones
    };

    // INITIALIZATION COMPLETE
    

    console.log(
        "FocusFlow initialized successfully."
);

})();