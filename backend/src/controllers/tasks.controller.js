const tasks = [
  { id: 1, title: "Follow up with Pramila Shakya", description: "Send university options", assignedTo: "Hemraj Ji", dueDate: "2026-05-10", priority: "High", status: "Pending" },
  { id: 2, title: "Prepare proposal for Rajesh Kumar", description: "Include pricing details", assignedTo: "Jitendra Sharma", dueDate: "2026-05-08", priority: "Urgent", status: "In Progress" },
];

export const getTasks = (req, res) => {
  res.json(tasks);
};

export const createTask = (req, res) => {
  const { title, description, assignedTo, dueDate, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || "",
    assignedTo: assignedTo || "Hemraj Ji",
    dueDate: dueDate || "",
    priority: priority || "Medium",
    status: "Pending",
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, description, assignedTo, dueDate, priority, status } = req.body;
  Object.assign(task, { title, description, assignedTo, dueDate, priority, status });
  res.json(task);
};

export const deleteTask = (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  const removed = tasks.splice(index, 1);
  res.json({ message: "Task deleted", task: removed[0] });
};
