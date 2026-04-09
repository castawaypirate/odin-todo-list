import "../css/styles.css";
import Todo from "./todo.js";
import Project from "./project.js";

// project list and default project init
const defaultProjectId = "47becbd0-3a1c-4ab4-80f6-bbc81a2e2d24";
function initView() {
  let tempList = getListFromLocalStorage();
  if (!tempList) {
    const defaultProject = new Project(defaultProjectId, "Default", []);
    tempList = [];
    tempList.push(defaultProject);
    updateListOnLocalStorage(tempList);
  }
  showProjectTodos(defaultProjectId);
  showProjectsNav();
}

initView();

// toggle nav
document.querySelector(".toggle").addEventListener("click", toggleNav);

function toggleNav() {
  document.querySelector("#sidebar").classList.toggle("min");
}

// localStorage functions
function getListFromLocalStorage() {
  return JSON.parse(localStorage.getItem("projectList"));
}

function updateListOnLocalStorage(list) {
  localStorage.setItem("projectList", JSON.stringify(list));
}

// todo
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

function showProjectTodos(projectId) {
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

function addUpdateTodoToProject(todo) {
  deleteTodo(todo._id);

  const tempList = getListFromLocalStorage();

  const listProjectIndex = tempList.findIndex((x) => x._id === todo.projectId);

  const tempProject = new Project(
    tempList[listProjectIndex]._id,
    tempList[listProjectIndex]._title,
    tempList[listProjectIndex]._todos,
  );

  const todoIndex = tempProject._todos.findIndex((x) => x._id === todo.id);

  if (todoIndex === -1) {
    tempProject.addTodo(todo);
  } else {
    tempProject.updateTodo(todo);
  }

  addUpdateProjectToList(tempProject);
}

function completeTodo(todo) {
  const tempList = getListFromLocalStorage();
  const project = tempList.find((x) => x._id === todo._projectId);
  const todoIndex = project._todos.findIndex((x) => x._id === todo._id);

  let completed = project._todos[todoIndex]._completed;
  if (completed) {
    completed = null;
  } else {
    completed = "completed";
  }

  const tempTodo = new Todo(
    project._todos[todoIndex]._id,
    project._todos[todoIndex]._title,
    project._todos[todoIndex]._description,
    project._todos[todoIndex]._dueDate,
    project._todos[todoIndex]._priority,
    completed,
    project._todos[todoIndex]._projectId,
  );

  addUpdateTodoToProject(tempTodo);
}

function deleteTodo(todoId) {
  const tempList = getListFromLocalStorage();

  for (let project of tempList) {
    let todoIndex = project._todos.findIndex((x) => x._id === todoId);

    if (todoIndex !== -1) {
      project._todos.splice(todoIndex, 1);

      const tempProject = new Project(
        project._id,
        project._title,
        project._todos,
      );

      addUpdateProjectToList(tempProject);
      break;
    }
  }
}

// project
document.querySelector("#project-list").addEventListener("click", showProjects);

document
  .querySelector("#close-project-dialog")
  .addEventListener("click", () => {
    document.querySelector("#project-dialog").close();
  });

document
  .querySelector("#project-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    let tempProj;
    if (formData.get("project-id")) {
      let tempList = getListFromLocalStorage();
      const listProject = tempList.find(
        (x) => x._id === formData.get("project-id"),
      );
      tempProj = new Project(
        formData.get("project-id"),
        formData.get("project-title"),
        listProject._todos,
      );
    } else {
      tempProj = new Project(
        crypto.randomUUID(),
        formData.get("project-title"),
        [],
      );
    }

    addUpdateProjectToList(tempProj);

    document.querySelector("#project-dialog").close();

    showProjects();
    showProjectsNav();
  });

function showProjects() {
  const projectContent = document.createElement("div");
  projectContent.innerHTML = `<div id="add-project" title="add project"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80Zm221.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg><span>add project</span></div>`;

  const mainProjectList = document.createElement("ul");
  mainProjectList.classList.add("main-project-list");

  const tempList = getListFromLocalStorage();

  for (let project of tempList) {
    const el = document.createElement("li");
    const title = document.createElement("span");
    title.textContent = project._title;
    title.addEventListener("click", function () {
      showProjectTodos(project._id);
    });

    el.appendChild(title);
    el.dataset.uuid = project._id;
    // default project cannot be deleted
    if (project._id !== defaultProjectId) {
      el.insertAdjacentHTML(
        "beforeend",
        `<svg class="hide edit" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`,
      );

      el.insertAdjacentHTML(
        "beforeend",
        `<svg class="hide delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`,
      );

      el.addEventListener("mouseover", function () {
        this.querySelectorAll("svg").forEach((el) =>
          el.classList.remove("hide"),
        );
      });

      el.addEventListener("mouseout", function () {
        this.querySelectorAll("svg").forEach((el) => el.classList.add("hide"));
      });

      el.querySelector(".edit").addEventListener("click", function () {
        const projectForm = document.querySelector("#project-form");
        projectForm.reset();
        const pairs = Object.entries(project);

        for (let [key, value] of pairs) {
          let field = projectForm.querySelector(`#project-${key.slice(1)}`);
          if (field) {
            field.value = value;
          }
        }

        document.querySelector("#project-dialog").showModal();
      });

      el.querySelector(".delete").addEventListener("click", function () {
        deleteProject(project._id);
        showProjects();
        showProjectsNav();
      });
    }

    mainProjectList.appendChild(el);
  }
  projectContent.appendChild(mainProjectList);
  renderMain(projectContent);

  document.querySelector("#add-project").addEventListener("click", () => {
    document.querySelector("#project-form").reset();
    document.querySelector("#project-dialog").showModal();
  });
}

function showProjectsNav() {
  const tempList = getListFromLocalStorage();
  const navProjectList = document.querySelector("#nav-project-list");
  navProjectList.innerHTML = "";
  for (let project of tempList) {
    const el = document.createElement("li");
    el.textContent = project._title;
    el.dataset.uuid = project._id;
    el.addEventListener("click", function () {
      showProjectTodos(project._id);
    });
    navProjectList.appendChild(el);
  }
}

function addUpdateProjectToList(project) {
  let tempList = getListFromLocalStorage();
  const listProjectIndex = tempList.findIndex((x) => x._id === project.id);

  if (listProjectIndex !== -1) {
    tempList[listProjectIndex] = project;
  } else {
    tempList.push(project);
  }

  updateListOnLocalStorage(tempList);
}

function deleteProject(projectId) {
  let tempList = getListFromLocalStorage();
  const listProjectIndex = tempList.findIndex((x) => x._id === projectId);

  if (listProjectIndex > -1) {
    tempList.splice(listProjectIndex, 1);
  }
  updateListOnLocalStorage(tempList);
}

// main
function renderMain(el) {
  const main = document.querySelector("#content");
  main.innerHTML = "";
  main.appendChild(el);
}
