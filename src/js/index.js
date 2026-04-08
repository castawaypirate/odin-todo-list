import "../css/styles.css";
import Todo from "./todo.js";
import Project from "./project.js";

// project list and default project init
function initView() {
  let tempList = getListFromLocalStorage();
  if (!tempList) {
    const defaultProject = new Project(
      "47becbd0-3a1c-4ab4-80f6-bbc81a2e2d24",
      "Default",
      [],
    );
    tempList = [];
    tempList.push(defaultProject);
    updateListOnLocalStorage(tempList);
  }
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
function addTodoToProject(todo) {
  const tempList = getListFromLocalStorage();

  const listProjectIndex = tempList.findIndex((x) => x._id === todo.projectId);

  const tempProject = new Project(
    tempList[listProjectIndex]._id,
    tempList[listProjectIndex]._title,
    tempList[listProjectIndex]._todos,
  );

  tempProject.addTodo(todo);

  addProjectToList(tempProject);
}

const todoDialog = document.querySelector("#todo-dialog");

document.querySelector("#add-todo").addEventListener("click", () => {
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
  document.querySelector("#todo-form").reset();
  todoDialog.showModal();
});

document.querySelector("#close-todo-dialog").addEventListener("click", () => {
  todoDialog.close();
});

document
  .querySelector("#todo-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    const newTodo = new Todo(
      crypto.randomUUID(),
      formData.get("todo-title"),
      formData.get("todo-description"),
      formData.get("todo-dueDate"),
      formData.get("todo-priority"),
      formData.get("todo-completed"),
      formData.get("todo-project"),
    );

    addTodoToProject(newTodo);

    // if (submitButton.dataset.function === "add") {

    // } else {
    //   let modified = odinLibrary.bookList.findIndex(
    //     (x) => x.id === formData.get("id"),
    //   );

    // for ([key, value] of formData.entries()) {
    //   odinLibrary.bookList[modified][`${key}`] = value;
    // }
    // }
    const dialog = document.querySelector("#todo-dialog");
    dialog.close();

    // renderTable();
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
    const title = document.createElement("span");
    title.textContent = todo._title;
    upper.appendChild(check);
    upper.appendChild(title);

    const lower = document.createElement("div");
    const dueDate = document.createElement("span");
    dueDate.textContent = todo._dueDate;
    const priority = document.createElement("span");
    console.log(todo);

    // <span class="material-symbols-outlined">keyboard_double_arrow_down</span>
    // <span class="material-symbols-outlined">keyboard_double_arrow_up</span>
    // <span class="material-symbols-outlined">horizontal_rule</span>

    todoList.appendChild(el);
  }

  projectContent.appendChild(projectTitle);
  projectContent.appendChild(todoList);
  renderMain(projectContent);
}

// project
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

document.querySelector("#project-list").addEventListener("click", showProjects);

function showProjects() {
  const projectContent = document.createElement("div");
  projectContent.innerHTML = `<div id="add-project" title="add project"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80Zm221.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg><span>add project</span></div>`;

  const mainProjectList = document.createElement("ul");
  mainProjectList.classList.add("main-project-list");

  const tempList = getListFromLocalStorage();

  for (let project of tempList) {
    const el = document.createElement("li");
    el.textContent = project._title;
    el.dataset.uuid = project._id;
    mainProjectList.appendChild(el);
  }
  projectContent.appendChild(mainProjectList);
  renderMain(projectContent);

  document.querySelector("#add-project").addEventListener("click", () => {
    document.querySelector("#project-form").reset();
    document.querySelector("#project-dialog").showModal();
  });
}

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

    // const submitProject = document.querySelector("#submit-project");

    // if (submitButton.dataset.function === "add") {

    const newProject = new Project(
      crypto.randomUUID(),
      formData.get("project-title"),
      [],
    );

    addProjectToList(newProject);

    // } else {
    //   let modified = odinLibrary.bookList.findIndex(
    //     (x) => x.id === formData.get("id"),
    //   );

    // for ([key, value] of formData.entries()) {
    //   odinLibrary.bookList[modified][`${key}`] = value;
    // }
    // }
    // const dialog = document.querySelector("#book-form-dialog");
    // dialog.close();
    // renderTable();

    document.querySelector("#project-dialog").close();

    showProjects();
  });

function addProjectToList(project) {
  let tempList = getListFromLocalStorage();
  const listProjectIndex = tempList.findIndex((x) => x._id === project.id);

  if (listProjectIndex !== -1) {
    tempList[listProjectIndex] = project;
  } else {
    tempList.push(project);
  }

  updateListOnLocalStorage(tempList);
  showProjectsNav();
}

// main
function renderMain(el) {
  const main = document.querySelector("#content");
  main.innerHTML = "";
  main.appendChild(el);
}
