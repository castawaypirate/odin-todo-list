export default class Project {
  constructor(id, title, todos) {
    this.id = id;
    this.title = title;
    this.todos = todos;
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

  updateTodo(todo) {
    let currentIndex = this._todos.findIndex((x) => x.id === todo.id);
    this._todos[currentIndex] = todo;
  }

  findTodo(todoId) {
    return this._todos.findIndex((x) => x.id === todoId);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      todos: this.todos,
    };
  }
}
