import {
  getListFromLocalStorage,
  updateListOnLocalStorage,
} from "./localStorage.js";

export function addUpdateProjectToList(project) {
  let tempList = getListFromLocalStorage();
  const listProjectIndex = tempList.findIndex((x) => x.id === project.id);

  if (listProjectIndex !== -1) {
    tempList[listProjectIndex] = project;
  } else {
    tempList.push(project);
  }

  updateListOnLocalStorage(tempList);
}

export function deleteProject(projectId) {
  let tempList = getListFromLocalStorage();
  const listProjectIndex = tempList.findIndex((x) => x.id === projectId);

  if (listProjectIndex > -1) {
    tempList.splice(listProjectIndex, 1);
  }
  updateListOnLocalStorage(tempList);
}
