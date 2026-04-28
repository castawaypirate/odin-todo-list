import {
  getListFromLocalStorage,
  getListOptionsFromLocalStorage,
  updateListOptionsOnLocalStorage,
} from "./localStorage.js";
import { showProjectTodos } from "./todoView.js";
import { deleteProject, addUpdateProjectToList } from "./projectController.js";
import { renderMain } from "./mainRenderer.js";
import { defaultProjectId } from "./index.js";
import Project from "./project.js";

document.querySelector("#project-list").addEventListener("click", showProjects);

document
  .querySelector("#close-project-dialog")
  .addEventListener("click", () => {
    const projectDialog = document.querySelector("#project-dialog");
    projectDialog.close();
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
        (x) => x.id === formData.get("project-id"),
      );
      tempProj = new Project(
        formData.get("project-id"),
        formData.get("project-title"),
        listProject.todos,
      );
    } else {
      tempProj = new Project(
        crypto.randomUUID(),
        formData.get("project-title"),
        [],
      );

      let tempListOptions = getListOptionsFromLocalStorage(tempProj.id);
      if (!tempListOptions) {
        let tempProjectOptions = {
          visibility: "on",
          priority: "off",
          dueDate: "off",
        };

        updateListOptionsOnLocalStorage(tempProjectOptions, tempProj.id);
      }
    }

    addUpdateProjectToList(tempProj);

    document.querySelector("#project-dialog").close();

    showProjects();
    showProjectsNav();
  });

function showProjects() {
  const projectContent = document.createElement("div");
  projectContent.innerHTML = `<div id="add-project" title="add project"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80Zm221.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg><h2>add project</h2></div>`;

  const mainProjectList = document.createElement("ul");
  mainProjectList.classList.add("main-project-list");

  const tempList = getListFromLocalStorage();

  for (let project of tempList) {
    const el = document.createElement("li");
    const title = document.createElement("h3");
    title.textContent = project.title;
    title.addEventListener("click", function () {
      showProjectTodos(project.id);
    });

    el.appendChild(title);
    el.dataset.uuid = project.id;
    // default project cannot be deleted
    if (project.id !== defaultProjectId) {
      el.insertAdjacentHTML(
        "beforeend",
        `<svg class="is-invisible edit" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`,
      );

      el.insertAdjacentHTML(
        "beforeend",
        `<svg class="is-invisible delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`,
      );

      el.addEventListener("mouseover", function () {
        this.querySelectorAll("svg").forEach((el) =>
          el.classList.remove("is-invisible"),
        );
      });

      el.addEventListener("mouseout", function () {
        this.querySelectorAll("svg").forEach((el) =>
          el.classList.add("is-invisible"),
        );
      });

      el.querySelector(".edit").addEventListener("click", function () {
        const projectForm = document.querySelector("#project-form");
        projectForm.reset();
        const pairs = Object.entries(project);

        for (let [key, value] of pairs) {
          let field = projectForm.querySelector(`#project-${key}`);
          if (field) {
            field.value = value;
          }
        }

        const projectDialog = document.querySelector("#project-dialog");
        projectDialog.showModal();
      });

      el.querySelector(".delete").addEventListener("click", function () {
        deleteProject(project.id);
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

export function showProjectsNav() {
  const tempList = getListFromLocalStorage();
  const navProjectList = document.querySelector("#nav-project-list");
  navProjectList.innerHTML = "";
  for (let project of tempList) {
    const el = document.createElement("li");
    el.textContent = project.title;
    el.dataset.uuid = project.id;
    el.addEventListener("click", function () {
      showProjectTodos(project.id);
    });
    navProjectList.appendChild(el);
  }
}
