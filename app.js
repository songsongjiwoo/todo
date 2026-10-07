const STORAGE_KEY = 'todo-app-items';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const totalCount = document.getElementById('total-count');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');

let todos = loadTodos();

function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    const parsed = JSON.parse(savedTodos);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse todos from localStorage:', error);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const active = total - completed;

  totalCount.textContent = String(total);
  activeCount.textContent = String(active);
  completedCount.textContent = String(completed);
}

function renderTodos() {
  todoList.innerHTML = '';
  updateStats();

  if (todos.length === 0) {
    emptyMessage.classList.add('visible');
    return;
  }

  emptyMessage.classList.remove('visible');

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' is-complete' : ''}`;

    const main = document.createElement('div');
    main.className = 'todo-main';

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = `todo-toggle${todo.completed ? ' is-complete' : ''}`;
    toggleButton.setAttribute('aria-label', todo.completed ? '완료 취소' : '완료 처리');
    toggleButton.addEventListener('click', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'todo-delete';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `${todo.text} 삭제`);
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    main.append(toggleButton, text);
    item.append(main, deleteButton);
    todoList.appendChild(item);
  });
}

function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    todoInput.focus();
    return;
  }

  todos.unshift({
    id: Date.now(),
    text: trimmedText,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

renderTodos();
