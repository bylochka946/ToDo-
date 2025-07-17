document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');

    let currentFilter = 'all';
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Загрузка задач при старте
    renderTasks();
    updateStats();
    
    // Добавление задачи
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Пожалуйста, введите текст задачи');
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
        updateStats();
        
        taskInput.value = '';
        taskInput.focus();
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        getFilteredTasks().forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.dataset.id = task.id;
            
            taskElement.innerHTML = `
                <button class="complete-btn" title="Отметить как выполненное">
                    <i class="fas fa-${task.completed ? 'check-circle' : 'circle'}"></i>
                </button>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="delete-btn" title="Удалить задачу">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskElement);
            
            // Обработчики событий
            taskElement.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task.id));
            taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        });
    }
    
    function toggleComplete(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
            updateStats();
        }
    }
    
    function deleteTask(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
            updateStats();
        }
    }
    
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        
        totalTasksSpan.textContent = `Всего задач: ${total}`;
        completedTasksSpan.textContent = `Выполнено: ${completed}`;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function applyFilter(filter) {
    currentFilter = filter;
    renderTasks();
    updateActiveFilterButton();
    }

    function updateActiveFilterButton() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === currentFilter);
        });
    }

    function getFilteredTasks() {
        switch(currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });
});

