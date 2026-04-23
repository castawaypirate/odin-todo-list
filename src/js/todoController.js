import { getListFromLocalStorage } from "./localStorage.js";
import { addUpdateProjectToList } from "./projectController.js";
import Project from "./project.js";
import Todo from "./todo.js";

export function addUpdateTodoToProject(todo) {
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

export function completeTodo(todo) {
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

export function deleteTodo(todoId) {
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
