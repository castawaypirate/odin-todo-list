import { getListFromLocalStorage } from "./localStorage.js";
import {
  addUpdateTodoToProject,
  deleteTodo,
  completeTodo,
} from "./todoController.js";
import { renderMain } from "./mainRenderer.js";
import Todo from "./todo.js";

document.querySelector("#add-todo").addEventListener("click", () => {
  populateProjectDropdown();
  document.querySelector("#todo-form").reset();
  document.querySelector("#delete-todo").classList.add("hide");
  document.querySelector("#todo-dialog").showModal();
});

document.querySelector("#close-todo-dialog").addEventListener("click", () => {
  document.querySelector("#todo-dialog").close();
});

document.querySelector("#delete-todo").addEventListener("click", () => {
  const todoForm = document.querySelector("#todo-form");
  const formData = new FormData(todoForm);
  const todoId = formData.get("todo-id");
  const projectId = formData.get("todo-project");
  deleteTodo(todoId);

  document.querySelector("#todo-dialog").close();
  showProjectTodos(projectId);
});

document
  .querySelector("#todo-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    let tempTodo;
    if (formData.get("todo-id")) {
      tempTodo = new Todo(
        formData.get("todo-id"),
        formData.get("todo-title"),
        formData.get("todo-description"),
        formData.get("todo-dueDate"),
        formData.get("todo-priority"),
        formData.get("todo-completed"),
        formData.get("todo-project"),
      );
    } else {
      tempTodo = new Todo(
        crypto.randomUUID(),
        formData.get("todo-title"),
        formData.get("todo-description"),
        formData.get("todo-dueDate"),
        formData.get("todo-priority"),
        formData.get("todo-completed"),
        formData.get("todo-project"),
      );
    }

    addUpdateTodoToProject(tempTodo);

    const dialog = document.querySelector("#todo-dialog");
    dialog.close();

    showProjectTodos(tempTodo.projectId);
  });

export function showProjectTodos(projectId) {
  const projectContent = document.createElement("div");
  const tempList = getListFromLocalStorage();
  const listProject = tempList.find((x) => x._id === projectId);
  const projectTitle = document.createElement("h2");
  projectTitle.textContent = listProject._title;

  const todoList = document.createElement("ul");
  for (let todo of listProject._todos) {
    const el = document.createElement("li");

    const upper = document.createElement("div");
    const check = document.createElement("input");
    check.type = "checkbox";
    if (todo._completed) {
      check.checked = true;
    }
    check.addEventListener("change", function () {
      completeTodo(todo);
      showProjectTodos(todo._projectId);
    });
    const title = document.createElement("span");
    title.classList.add("todo-title");
    title.textContent = todo._title;

    title.addEventListener("click", function () {
      const todoForm = document.querySelector("#todo-form");
      populateProjectDropdown();
      todoForm.reset();
      const pairs = Object.entries(todo);

      for (let [key, value] of pairs) {
        let field = todoForm.querySelector(`#todo-${key.slice(1)}`);
        if (field) {
          if (field.type === "checkbox") {
            if (value === "completed") {
              field.checked = true;
            }
          } else {
            field.value = value;
          }
        }
        if (key === "_projectId") {
          todoForm.querySelector("#todo-project").value = value;
        }
      }

      document.querySelector("#delete-todo").classList.remove("hide");
      document.querySelector("#todo-dialog").showModal();
    });

    upper.appendChild(check);
    upper.appendChild(title);

    const lower = document.createElement("div");
    if (todo._dueDate) {
      const dueDate = document.createElement("span");
      dueDate.textContent = todo._dueDate;
      lower.appendChild(dueDate);
    }

    const todoPriority = todo._priority;
    if (todoPriority) {
      if (todoPriority === "low") {
        lower.insertAdjacentHTML(
          "beforeend",
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/></svg>`,
        );
      } else if (todoPriority === "medium") {
        lower.insertAdjacentHTML(
          "beforeend",
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-440v-80h640v80H160Z"/></svg>`,
        );
      } else {
        lower.insertAdjacentHTML(
          "beforeend",
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/></svg>`,
        );
      }
    }

    if (check.checked) {
      upper.style.textDecoration = "line-through";
      lower.style.opacity = "0.4";
    }

    el.appendChild(upper);
    el.appendChild(lower);

    todoList.appendChild(el);
  }

  projectContent.appendChild(projectTitle);
  projectContent.appendChild(todoList);
  renderMain(projectContent);
}

function populateProjectDropdown() {
  let select = document.querySelector("#todo-project");
  select.innerHTML = "";
  const tempList = getListFromLocalStorage();
  for (let project of tempList) {
    let el = document.createElement("option");
    el.textContent = project._title;
    el.dataset.uuid = project._id;
    el.value = project._id;
    select.appendChild(el);
  }
}
