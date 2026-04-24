export function getListFromLocalStorage() {
  return JSON.parse(localStorage.getItem("projectList"));
}

export function updateListOnLocalStorage(list) {
  localStorage.setItem("projectList", JSON.stringify(list));
}

export function getListOptionsFromLocalStorage(projectId) {
  let options = JSON.parse(localStorage.getItem("projectListOptions"));
  if (options) {
    if (Object.hasOwn(options, projectId)) {
      return options[projectId];
    }
  }
}

export function updateListOptionsOnLocalStorage(opts, projectId) {
  let options = JSON.parse(localStorage.getItem("projectListOptions"));
  if (options) {
    options[projectId] = opts;
    localStorage.setItem("projectListOptions", JSON.stringify(options));
  } else {
    options = {};
    options[projectId] = opts;
    localStorage.setItem("projectListOptions", JSON.stringify(options));
  }
}
