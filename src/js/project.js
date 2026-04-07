export default class Project {
  constructor(id, title, todos) {
    this._id = id;
    this._title = title;
    this._todos = todos;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = title;
  }

  get todos() {
    return this._todos;
  }

  set todos(todos) {
    this._todos = todos;
  }

  addTodo(todo) {
    this._todos.push(todo);
  }
}
