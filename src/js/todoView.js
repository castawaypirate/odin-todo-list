import {
  getListFromLocalStorage,
  getListOptionsFromLocalStorage,
  updateListOptionsOnLocalStorage,
} from "./localStorage.js";
import {
  addUpdateTodoToProject,
  deleteTodo,
  completeTodo,
} from "./todoController.js";
import { renderMain } from "./mainRenderer.js";
import Todo from "./todo.js";
import { icons } from "./icons.js";

document.querySelector("#add-todo").addEventListener("click", () => {
  populateProjectDropdown();
  document.querySelector("#todo-form").reset();
  document.querySelector("#delete-todo").classList.add("is-invisible");
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
        formData.get("todo-createdAt"),
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

function hideCompleted() {
  const todoList = document.querySelector(".todo-list");
  const todos = todoList.querySelectorAll("li");

  for (let to of todos) {
    const check = to.querySelector("input[type=checkbox]");
    if (check.checked) {
      to.classList.add("is-hidden");
    } else {
      to.classList.remove("is-hidden");
    }
  }
}

export function showProjectTodos(projectId) {
  const projectContent = document.createElement("div");
  const tempList = getListFromLocalStorage();
  const listProject = tempList.find((x) => x.id === projectId);

  const projectTitleContainer = document.createElement("div");
  projectTitleContainer.classList.add("project-title-container");

  const projectTitle = document.createElement("h2");
  projectTitle.textContent = listProject.title;
  projectTitleContainer.appendChild(projectTitle);

  const projectTitleIcons = document.createElement("div");
  projectTitleIcons.classList.add("project-title-icons");

  let options = getListOptionsFromLocalStorage(projectId);
  const visibilityIcons = document.createElement("div");
  visibilityIcons.title = "show/hide completed todos";

  if (options.visibility === "on") {
    visibilityIcons.insertAdjacentHTML("beforeend", `${icons.visibility}`);
  } else {
    visibilityIcons.insertAdjacentHTML("beforeend", `${icons.visibility_off}`);
  }

  visibilityIcons.addEventListener("click", function () {
    const todoList = document.querySelector(".todo-list");
    const todos = todoList.querySelectorAll("li");

    let icon = this.querySelector(".eye");

    if (icon.id === "visibility") {
      icon.outerHTML = icons.visibility_off;
      for (let to of todos) {
        const check = to.querySelector("input[type=checkbox]");
        if (check.checked) {
          to.classList.add("is-hidden");
        }
      }
      options.visibility = "off";
      updateListOptionsOnLocalStorage(options, projectId);
    } else {
      icon.outerHTML = icons.visibility;
      for (let to of todos) {
        const check = to.querySelector("input[type=checkbox]");
        if (check.checked) {
          to.classList.remove("is-hidden");
        }
      }
      options.visibility = "on";
      updateListOptionsOnLocalStorage(options, projectId);
    }
  });

  const priorityIcons = document.createElement("div");
  priorityIcons.title = "sort by priority";

  if (options.priority === "on") {
    priorityIcons.insertAdjacentHTML("beforeend", `${icons.filter}`);
  } else {
    priorityIcons.insertAdjacentHTML("beforeend", `${icons.filter_off}`);
  }

  priorityIcons.addEventListener("click", function () {
    let icon = this.querySelector(".filter");
    if (icon.id === "priority") {
      icon.outerHTML = icons.filter_off;
      options.priority = "off";
      options.lastTurnedOn = "";
      updateListOptionsOnLocalStorage(options, projectId);
    } else {
      if (options.dueDate === "on") {
        options.lastTurnedOn = "prio";
      }
      icon.outerHTML = icons.filter;
      options.priority = "on";
      updateListOptionsOnLocalStorage(options, projectId);
    }
    showProjectTodos(projectId);
  });

  const dueDateIcons = document.createElement("div");
  dueDateIcons.title = "sort by due date";

  if (options.dueDate === "on") {
    dueDateIcons.insertAdjacentHTML("beforeend", `${icons.timer}`);
  } else {
    dueDateIcons.insertAdjacentHTML("beforeend", `${icons.timer_off}`);
  }

  dueDateIcons.addEventListener("click", function () {
    let icon = this.querySelector(".timer");
    if (icon.id === "due_date") {
      icon.outerHTML = icons.timer_off;
      options.dueDate = "off";

      options.lastTurnedOn = "";
      updateListOptionsOnLocalStorage(options, projectId);
    } else {
      if (options.priority === "on") {
        options.lastTurnedOn = "due";
      }
      icon.outerHTML = icons.timer;
      options.dueDate = "on";
      updateListOptionsOnLocalStorage(options, projectId);
    }
    showProjectTodos(projectId);
  });

  projectTitleIcons.appendChild(visibilityIcons);
  projectTitleIcons.appendChild(priorityIcons);
  projectTitleIcons.appendChild(dueDateIcons);

  projectTitleContainer.appendChild(projectTitleIcons);

  const todoList = document.createElement("ul");
  todoList.classList.add("todo-list");

  listProject.todos = applyFilters(options, listProject.todos);

  for (let todo of listProject.todos) {
    const el = document.createElement("li");

    const upper = document.createElement("div");
    const check = document.createElement("input");
    check.type = "checkbox";
    if (todo.completed) {
      check.checked = true;
    }
    check.addEventListener("change", function () {
      completeTodo(todo);
      showProjectTodos(todo.projectId);
    });
    const title = document.createElement("span");
    title.classList.add("todo-title");
    title.textContent = todo.title;

    title.addEventListener("click", function () {
      const todoForm = document.querySelector("#todo-form");
      populateProjectDropdown();
      todoForm.reset();
      const pairs = Object.entries(todo);

      for (let [key, value] of pairs) {
        let field = todoForm.querySelector(`#todo-${key}`);
        if (field) {
          if (field.type === "checkbox") {
            if (value === "completed") {
              field.checked = true;
            }
          } else {
            field.value = value;
          }
        }
        if (key === "projectId") {
          todoForm.querySelector("#todo-project").value = value;
        }
      }

      document.querySelector("#delete-todo").classList.remove("is-invisible");
      document.querySelector("#todo-dialog").showModal();
    });

    upper.appendChild(check);
    upper.appendChild(title);

    const lower = document.createElement("div");
    if (todo.dueDate) {
      const dueDate = document.createElement("span");
      dueDate.textContent = todo.dueDate;
      lower.appendChild(dueDate);
    }

    const todoPriority = todo.priority;
    if (todoPriority !== "0") {
      if (todoPriority === "1") {
        lower.insertAdjacentHTML(
          "beforeend",
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/></svg>`,
        );
      } else if (todoPriority === "2") {
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

  projectContent.appendChild(projectTitleContainer);
  projectContent.appendChild(todoList);
  renderMain(projectContent);
  if (options.visibility === "off") {
    hideCompleted();
  }
}

function populateProjectDropdown() {
  let select = document.querySelector("#todo-project");
  select.innerHTML = "";
  const tempList = getListFromLocalStorage();
  for (let project of tempList) {
    let el = document.createElement("option");
    el.textContent = project.title;
    el.dataset.uuid = project.id;
    el.value = project.id;
    select.appendChild(el);
  }
}

// The idea is that the first filter applied persists, and the second filter acts as a complement to the already sorted list.
// So, applying both the due date and priority filters in a different order displays different results.
function applyFilters(opts, list) {
  if (opts.lastTurnedOn === "prio") {
    console.log("lastTurnedOn: prio");
    list.sort(function (a, b) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    const grouped = Object.groupBy(list, ({ dueDate }) => dueDate);

    list = nestedPrioritySort(Object.values(grouped).reverse());
  } else if (opts.lastTurnedOn === "due") {
    console.log("lastTurnedOn: due");
    const grouped = Object.groupBy(list, ({ priority }) => priority);
    list = nestedDueDateSort(Object.values(grouped));
  } else {
    if (opts.priority === "on") {
      console.log("sort by priority");
      const grouped = Object.groupBy(list, ({ priority }) => priority);
      list = nestedCreatedAtSort(Object.values(grouped));
    } else if (opts.dueDate === "on") {
      console.log("sort by due date");
      list.sort(function (a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      const grouped = Object.groupBy(list, ({ dueDate }) => dueDate);
      list = nestedCreatedAtSort(Object.values(grouped).reverse());
    } else {
      console.log("no filter");
      list.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
  }
  return list;
}

function nestedCreatedAtSort(list) {
  let newList = [];
  for (let el of list) {
    el.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    newList.unshift(...el);
  }
  return newList;
}

function nestedPrioritySort(list) {
  let newList = [];
  for (let el of list) {
    const grouped = Object.groupBy(el, ({ priority }) => priority);
    newList.unshift(...nestedCreatedAtSort(Object.values(grouped)));
  }
  return newList;
}

function nestedDueDateSort(list) {
  let newList = [];
  for (let el of list) {
    const grouped = Object.groupBy(el, ({ dueDate }) => dueDate);
    newList.unshift(...nestedCreatedAtSort(Object.values(grouped)));
  }
  return newList;
}
