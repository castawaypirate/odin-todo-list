import { getListFromLocalStorage } from "./localStorage.js";
import { addUpdateProjectToList } from "./projectController.js";
import Project from "./project.js";
import Todo from "./todo.js";

export function addUpdateTodoToProject(todo) {
  deleteTodo(todo.id);

  const tempList = getListFromLocalStorage();

  const listProjectIndex = tempList.findIndex((x) => x.id === todo.projectId);

  const tempProject = new Project(
    tempList[listProjectIndex].id,
    tempList[listProjectIndex].title,
    tempList[listProjectIndex].todos,
  );

  const todoIndex = tempProject.todos.findIndex((x) => x.id === todo.id);

  if (todoIndex === -1) {
    tempProject.addTodo(todo);
  } else {
    tempProject.updateTodo(todo);
  }

  addUpdateProjectToList(tempProject);
}

export function completeTodo(todo) {
  const tempList = getListFromLocalStorage();
  const project = tempList.find((x) => x.id === todo.projectId);
  const todoIndex = project.todos.findIndex((x) => x.id === todo.id);

  let completed = project.todos[todoIndex].completed;
  if (completed) {
    completed = null;
  } else {
    completed = "completed";
  }

  const tempTodo = new Todo(
    project.todos[todoIndex].id,
    project.todos[todoIndex].title,
    project.todos[todoIndex].description,
    project.todos[todoIndex].dueDate,
    project.todos[todoIndex].priority,
    completed,
    project.todos[todoIndex].projectId,
    project.todos[todoIndex].createdAt,
  );

  addUpdateTodoToProject(tempTodo);
}

export function deleteTodo(todoId) {
  const tempList = getListFromLocalStorage();

  for (let project of tempList) {
    let todoIndex = project.todos.findIndex((x) => x.id === todoId);

    if (todoIndex !== -1) {
      project.todos.splice(todoIndex, 1);

      const tempProject = new Project(project.id, project.title, project.todos);

      addUpdateProjectToList(tempProject);
      break;
    }
  }
}
