export default class Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    priority,
    completed,
    projectId,
    createdAt = null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
    this.projectId = projectId;
    this.createdAt = createdAt;
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

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(createdAt) {
    if (createdAt) {
      this._createdAt = createdAt;
    } else {
      this._createdAt = new Date();
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      completed: this.completed,
      projectId: this.projectId,
      createdAt: this.createdAt,
    };
  }
}
