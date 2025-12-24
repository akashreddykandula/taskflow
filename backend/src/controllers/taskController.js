const Task = require ('../models/Task');

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create ({
      ...req.body,
      user: req.user._id,
    });

    res.status (201).json (task);
  } catch (error) {
    res.status (500).json ({message: 'Task creation failed'});
  }
};

// GET ALL USER TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find ({user: req.user._id}).sort ('-createdAt');
    res.json (tasks);
  } catch (error) {
    res.status (500).json ({message: 'Fetching tasks failed'});
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById (req.params.id);

    if (!task) return res.status (404).json ({message: 'Task not found'});

    if (task.user.toString () !== req.user._id.toString ())
      return res.status (401).json ({message: 'Not authorized'});

    const updatedTask = await Task.findByIdAndUpdate (req.params.id, req.body, {
      new: true,
    });

    res.json (updatedTask);
  } catch (error) {
    res.status (500).json ({message: 'Task update failed'});
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById (req.params.id);

    if (!task) return res.status (404).json ({message: 'Task not found'});

    if (task.user.toString () !== req.user._id.toString ())
      return res.status (401).json ({message: 'Not authorized'});

    await task.deleteOne ();
    res.json ({message: 'Task deleted'});
  } catch (error) {
    res.status (500).json ({message: 'Task deletion failed'});
  }
};
