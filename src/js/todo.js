export default class Todo {
  constructor(id, title, description, dueDate, priority, completed, projectId) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._completed = completed;
    this._projectId = projectId;
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

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(dueDate) {
    this._dueDate = dueDate;
  }

  get priority() {
    return this._priority;
  }

  set priority(priority) {
    this._priority = priority;
  }

  get completed() {
    return this._completed;
  }

  set completed(completed) {
    this._completed = completed;
  }

  get projectId() {
    return this._projectId;
  }

  set projectId(projectId) {
    this._projectId = projectId;
  }
}
