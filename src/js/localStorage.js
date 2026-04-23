export function getListFromLocalStorage() {
  return JSON.parse(localStorage.getItem("projectList"));
}

export function updateListOnLocalStorage(list) {
  localStorage.setItem("projectList", JSON.stringify(list));
}
