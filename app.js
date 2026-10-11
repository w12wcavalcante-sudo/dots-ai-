(() => {
  "use strict";
  const TASKS_KEY = "dots.tasks.v1";
  const NOTES_KEY = "dots.notes.v1";
  const $ = (selector) => document.querySelector(selector);
  const taskForm = $("#task-form");
  const taskInput = $("#task-input");
  const taskList = $("#task-list");
  const emptyTasks = $("#empty-tasks");
  const notes = $("#notes");
  const notesCount = $("#notes-count");
  const notesMessage = $("#notes-message");
  const status = $("#status");

  let tasks = readJSON(TASKS_KEY, []);
  if (!Array.isArray(tasks)) tasks = [];
  tasks = tasks.filter(t => t && typeof t.id === "string" && typeof t.text === "string");
  notes.value = localStorage.getItem(NOTES_KEY) || "";
  updateNotesCount();
  renderTasks();
  $("#year").textContent = new Date().getFullYear();

  function readJSON(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch { return fallback; }
  }
  function persistTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    renderTasks();
  }
  function renderTasks() {
    taskList.replaceChildren();
    emptyTasks.hidden = tasks.length > 0;
    for (const task of tasks) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(task.done);
      checkbox.setAttribute("aria-label", "Marcar tarefa como concluída");
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        persistTasks();
      });
      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-task";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Apagar tarefa");
      remove.addEventListener("click", () => {
        tasks = tasks.filter(item => item.id !== task.id);
        persistTasks();
      });
      li.append(checkbox, text, remove);
      taskList.append(li);
    }
  }
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), text, done: false, createdAt: new Date().toISOString() });
    try { persistTasks(); taskInput.value = ""; status.textContent = "Guardado"; }
    catch { status.textContent = "Erro ao guardar"; alert("Não foi possível guardar. Verifica o espaço disponível no navegador."); }
  });
  function updateNotesCount() { notesCount.textContent = `${notes.value.length} / 5000`; }
  notes.addEventListener("input", updateNotesCount);
  $("#save-notes").addEventListener("click", () => {
    try {
      localStorage.setItem(NOTES_KEY, notes.value);
      notesMessage.textContent = "Notas guardadas neste dispositivo.";
      status.textContent = "Guardado";
    } catch {
      notesMessage.textContent = "Não foi possível guardar as notas.";
      status.textContent = "Erro";
    }
  });
  $("#export-data").addEventListener("click", () => {
    const data = { exportedAt: new Date().toISOString(), tasks, notes: notes.value, app: "DOTS AI", schemaVersion: 1 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dots-ai-backup.json";
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {
      status.textContent = "Modo web";
    }));
  }
})();
