/* ── State ──────────────────────────────────────────────── */
let tasks = [];
let currentFilter = 'all';

/* ── DOM refs ────────────────────────────────────────────── */
const taskInput  = document.getElementById('taskInput');
const addBtn     = document.getElementById('addBtn');
const taskList   = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount  = document.getElementById('taskCount');
const clearBtn   = document.getElementById('clearBtn');
const subtitle   = document.getElementById('subtitle');
const filterBtns = document.querySelectorAll('.filter-btn');

/* ── Persistence ─────────────────────────────────────────── */
function save() {
  localStorage.setItem('tasks_v1', JSON.stringify(tasks));
}

function load() {
  try {
    tasks = JSON.parse(localStorage.getItem('tasks_v1')) || [];
  } catch {
    tasks = [];
  }
}

/* ── Core actions ────────────────────────────────────────── */
function addTask(text) {
  text = text.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, done: false });
  save();
  taskInput.value = '';
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    save();
    render();
  }
}

function deleteTask(id) {
  const li = document.querySelector(`[data-id="${id}"]`);
  if (li) {
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }, { once: true });
  }
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
}

/* ── Filter ──────────────────────────────────────────────── */
function filteredTasks() {
  if (currentFilter === 'active')    return tasks.filter(t => !t.done);
  if (currentFilter === 'completed') return tasks.filter(t => t.done);
  return tasks;
}

/* ── Render ──────────────────────────────────────────────── */
function render() {
  const visible = filteredTasks();
  const active  = tasks.filter(t => !t.done).length;
  const hasDone = tasks.some(t => t.done);

  /* Subtitle */
  if (tasks.length === 0) {
    subtitle.textContent = 'Adicione sua primeira tarefa!';
  } else if (active === 0) {
    subtitle.textContent = 'Tudo pronto! Ótimo trabalho 🎉';
  } else {
    subtitle.textContent = `${active} ${active === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;
  }

  /* Counter */
  taskCount.textContent =
    active === 0 ? 'Sem pendências' :
    `${active} ${active === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;

  /* Clear button e footer */
  const cardFooter = document.getElementById('cardFooter');
  if (tasks.length === 0) {
    cardFooter.classList.add('hidden');
  } else {
    cardFooter.classList.remove('hidden');
  }
  if (hasDone) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }

  /* Empty state */
  if (visible.length === 0) {
    taskList.innerHTML = '';
    emptyState.classList.add('visible');
    return;
  }
  emptyState.classList.remove('visible');

  /* Diff render: avoid full re-render to keep animations */
  const existingIds = new Set(
    [...taskList.querySelectorAll('.task-item')].map(el => Number(el.dataset.id))
  );
  const visibleIds = new Set(visible.map(t => t.id));

  /* Remove items no longer visible */
  taskList.querySelectorAll('.task-item').forEach(el => {
    if (!visibleIds.has(Number(el.dataset.id))) el.remove();
  });

  /* Add or update items */
  visible.forEach((task, index) => {
    let li = taskList.querySelector(`[data-id="${task.id}"]`);

    if (!li) {
      li = createTaskElement(task);
      /* Insert at correct position */
      const children = [...taskList.children];
      if (index >= children.length) {
        taskList.appendChild(li);
      } else {
        taskList.insertBefore(li, children[index]);
      }
    } else {
      /* Update existing */
      li.className = `task-item${task.done ? ' done' : ''}`;
      li.querySelector('.task-text').textContent = task.text;
      li.querySelector('input[type="checkbox"]').checked = task.done;
    }
  });
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  li.innerHTML = `
    <label class="checkbox-wrapper">
      <input type="checkbox" ${task.done ? 'checked' : ''} />
      <span class="checkbox-custom">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
             stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="2,6 5,9 10,3"></polyline>
        </svg>
      </span>
    </label>
    <span class="task-text">${escapeHtml(task.text)}</span>
    <button class="delete-btn" aria-label="Deletar tarefa">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
    </button>
  `;

  li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTask(task.id));
  li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

  return li;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ── Event listeners ─────────────────────────────────────── */
addBtn.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask(taskInput.value);
});

clearBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

/* ── Init ─────────────────────────────────────────────────── */
load();
render();
