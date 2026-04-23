import "../css/styles.css";
import {
  getListFromLocalStorage,
  updateListOnLocalStorage,
} from "./localStorage.js";
import { showProjectsNav } from "./projectView.js";
import { showProjectTodos } from "./todoView.js";
import Project from "./project.js";

// project list and default project init
export const defaultProjectId = "47becbd0-3a1c-4ab4-80f6-bbc81a2e2d24";
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
