import "../css/styles.css";
import {
  getListFromLocalStorage,
  getListOptionsFromLocalStorage,
  updateListOnLocalStorage,
  updateListOptionsOnLocalStorage,
} from "./localStorage.js";
import { showProjectsNav } from "./projectView.js";
import { showProjectTodos } from "./todoView.js";
import Project from "./project.js";

// project list and default project init
export const defaultProjectId = "47becbd0-3a1c-4ab4-80f6-bbc81a2e2d24";
function initView() {
  let tempList = getListFromLocalStorage();
  if (!tempList) {
    const defaultProject = new Project(defaultProjectId, "default", []);
    tempList = [];
    tempList.push(defaultProject);
    updateListOnLocalStorage(tempList);
  }

  let tempListOptions = getListOptionsFromLocalStorage(defaultProjectId);
  if (!tempListOptions) {
    let defaultProjectOptions = {
      visibility: "on",
      priority: "off",
      dueDate: "off",
    };

    updateListOptionsOnLocalStorage(defaultProjectOptions, defaultProjectId);
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
