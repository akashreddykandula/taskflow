import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";





import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function Dashboard() {
  const navigate = useNavigate();
  const [deleteTaskId, setDeleteTaskId] = useState (null);


  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");

  const [searchText, setSearchText] = useState ('');
const [priorityFilter, setPriorityFilter] = useState ('All');

const user = JSON.parse(localStorage.getItem("user"));

const getInitials = (name = "") => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const initials = getInitials(user?.name || user?.username);



  /* ================= API ================= */

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", {
        title,
        description,
        status,
        priority,
      });

      toast.success("Task created");
      setShowModal(false);
      setTitle("");
      setDescription("");
      setStatus("Todo");
      setPriority("Medium");
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    }
  };

  const confirmDeleteTask = (id) => {
  setDeleteTaskId(id);
};

const handleDeleteTask = async () => {
  try {
    await api.delete(`/tasks/${deleteTaskId}`);
    toast.success("Task deleted");
    setDeleteTaskId(null);
    fetchTasks();
  } catch {
    toast.error("Failed to delete task");
  }
};


  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/tasks/${editTask._id}`, {
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
        priority: editTask.priority,
      });

      toast.success("Task updated");
      setEditTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  /* ================= DRAG & DROP ================= */

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updatedStatus = destination.droppableId;

    try {
      await api.put(`/tasks/${draggableId}`, {
        status: updatedStatus,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === draggableId
            ? { ...task, status: updatedStatus }
            : task
        )
      );
    } catch {
      toast.error("Failed to update task status");
    }
  };

  /* ================= COLUMNS ================= */

  const filteredTasks = tasks.filter (task => {
  const matchesText =
    task.title.toLowerCase ().includes (searchText.toLowerCase ()) ||
    (task.description || '')
      .toLowerCase ()
      .includes (searchText.toLowerCase ());

  const matchesPriority =
    priorityFilter === 'All' || task.priority === priorityFilter;

  return matchesText && matchesPriority;
});


 const columns = {
  Todo: {
    title: 'Todo',
    color: 'bg-blue-500',
    tasks: filteredTasks.filter (t => t.status === 'Todo'),
  },
  'In Progress': {
    title: 'In Progress',
    color: 'bg-yellow-500',
    tasks: filteredTasks.filter (t => t.status === 'In Progress'),
  },
  Done: {
    title: 'Done',
    color: 'bg-green-500',
    tasks: filteredTasks.filter (t => t.status === 'Done'),
  },
};

const totalTasks = tasks.length;
const todoCount = tasks.filter (t => t.status === 'Todo').length;
const inProgressCount = tasks.filter (t => t.status === 'In Progress').length;
const doneCount = tasks.filter (t => t.status === 'Done').length;

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">

      {/* NAVBAR */}
      <motion.div
  initial={{y: -30, opacity: 0}}
  animate={{y: 0, opacity: 1}}
  transition={{duration: 0.5}}
  className="flex justify-between items-center px-6 py-4
             bg-white/20 backdrop-blur-xl
             shadow-lg text-white
             sticky top-0 z-40"
>
  {/* Logo */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 flex items-center justify-center
                 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600
                 font-bold text-lg shadow-md">
      TF
    </div>

    <h1 className="text-2xl font-extrabold tracking-wide">
      Task<span className="text-blue-300">Flow</span>
    </h1>
  </div>

  {/* Logout */}
  <button
    onClick={handleLogout}
    className="px-4 py-2 rounded-lg font-semibold
               bg-gradient-to-r from-red-500 to-red-600
               hover:from-red-600 hover:to-red-700
               transition shadow-md"
  >
    Logout
  </button>
</motion.div>


      {/* CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
  <h2 className="text-2xl font-semibold text-white">
    Your Tasks
  </h2>

  <div className="flex flex-col sm:flex-row gap-3">
    {/* Search */}
    <input
      type="text"
      placeholder="Search tasks..."
      value={searchText}
      onChange={e => setSearchText (e.target.value)}
      className="px-4 py-2 rounded-lg outline-none w-full sm:w-64"
    />

    {/* Priority Filter */}
    <select
      value={priorityFilter}
      onChange={e => setPriorityFilter (e.target.value)}
      className="px-4 py-2 rounded-lg outline-none"
    >
      <option value="All">All Priorities</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>

    {/* Add Task */}
    <button
      onClick={() => setShowModal (true)}
      className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
    >
      + Add Task
    </button>
  </div>
</div>


        {loading && (
          <p className="text-blue-100">Loading tasks...</p>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([key, col]) => (
              <Droppable droppableId={key} key={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white/10 rounded-2xl p-4 min-h-[500px]"
                  >
                    <div
                      className={`text-white px-4 py-2 rounded-xl font-semibold mb-4 ${col.color}`}
                    >
                      {col.title} ({col.tasks.length})
                    </div>

                    <div className="space-y-4">
                      {col.tasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white/15 backdrop-blur-lg p-4 rounded-xl text-white shadow-lg"
                            >
                              <div className="flex justify-between mb-2">
                                <h3 className="font-bold">
                                  {task.title}
                                </h3>
                                <div className="flex gap-2">
                                  <button
  onClick={() => setEditTask (task)}
  className="text-yellow-300 hover:text-yellow-400 transition"
  title="Edit Task"
>
  ✏️
</button>

                                  <button
  onClick={() => confirmDeleteTask (task._id)}
  className="text-red-400 hover:text-red-500"
>
  🗑️
</button>

                                </div>
                              </div>

                              <p className="text-sm text-blue-100 mb-2">
                                {task.description ||
                                  "No description"}
                              </p>

                              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/70">
                                {task.priority}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* ADD & EDIT MODALS (UNCHANGED — SAME AS BEFORE) */}
      <AnimatePresence>
  {showModal &&
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm
                 flex items-center justify-center z-50"
    >
      <motion.form
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}
        onSubmit={handleCreateTask}
        className="bg-white rounded-3xl shadow-2xl
                   w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600
                        px-6 py-5 text-white">
          <h3 className="text-xl font-bold">
            Create New Task
          </h3>
          <p className="text-sm text-blue-100">
            Organize your work efficiently
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Finish dashboard UI"
              className="w-full px-4 py-3 rounded-xl border
                         focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              value={title}
              onChange={e => setTitle (e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Optional details about the task"
              className="w-full px-4 py-3 rounded-xl border
                         focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              value={description}
              onChange={e => setDescription (e.target.value)}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-blue-500"
                value={status}
                onChange={e => setStatus (e.target.value)}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-blue-500"
                value={priority}
                onChange={e => setPriority (e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
          <button
            type="button"
            onClick={() => setShowModal (false)}
            className="px-4 py-2 rounded-xl bg-gray-200
                       hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-white font-semibold
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       hover:from-blue-700 hover:to-indigo-700
                       transition shadow-md"
          >
            Create Task
          </button>
        </div>
      </motion.form>
    </motion.div>}
</AnimatePresence>

<AnimatePresence>
  {deleteTaskId &&
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}
        className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 text-center"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Delete Task?
        </h3>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this task?
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setDeleteTaskId (null)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>}
</AnimatePresence>
<AnimatePresence>
  {editTask &&
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm
                 flex items-center justify-center z-50"
    >
      <motion.form
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}
        onSubmit={handleUpdateTask}
        className="bg-white rounded-3xl shadow-2xl
                   w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600
                        px-6 py-5 text-white">
          <h3 className="text-xl font-bold">
            Edit Task
          </h3>
          <p className="text-sm text-blue-100">
            Update task details and status
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Task Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500"
              value={editTask.title}
              onChange={e => setEditTask ({...editTask, title: e.target.value})}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-3 rounded-xl border
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500"
              value={editTask.description}
              onChange={e =>
                setEditTask ({
                  ...editTask,
                  description: e.target.value,
                })}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                value={editTask.status}
                onChange={e =>
                  setEditTask ({
                    ...editTask,
                    status: e.target.value,
                  })}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                value={editTask.priority}
                onChange={e =>
                  setEditTask ({
                    ...editTask,
                    priority: e.target.value,
                  })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
          <button
            type="button"
            onClick={() => setEditTask (null)}
            className="px-4 py-2 rounded-xl bg-gray-200
                       hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-white font-semibold
                       bg-gradient-to-r from-indigo-600 to-blue-600
                       hover:from-indigo-700 hover:to-blue-700
                       transition shadow-md"
          >
            Update Task
          </button>
        </div>
      </motion.form>
    </motion.div>}
</AnimatePresence>




      {/* Keep your existing Add Task + Edit Task modals here */}
     <footer className="mt-24 border-t border-white/20 
                   pt-12 pb-8 px-6
                   text-blue-100">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

    {/* Brand */}
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-3">
        Task<span className="text-blue-300">Flow</span>
      </h2>
      <p className="text-sm leading-relaxed">
        TaskFlow is a modern task management platform designed to help
        individuals and teams organize work efficiently, stay focused,
        and improve productivity through a clean and intuitive interface.
      </p>
    </div>

    {/* Features */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        Features
      </h3>
      <ul className="space-y-2 text-sm">
        <li>✔ Secure JWT Authentication</li>
        <li>✔ Trello-style Kanban Board</li>
        <li>✔ Drag & Drop Task Management</li>
        <li>✔ Task Priority & Status Tracking</li>
        <li>✔ Responsive & Animated UI</li>
      </ul>
    </div>

    {/* Tech Stack */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        Built With
      </h3>
      <ul className="space-y-2 text-sm">
        <li>⚛️ React & Vite</li>
        <li>🎨 Tailwind CSS</li>
        <li>🎞️ Framer Motion</li>
        <li>🟢 Node.js & Express</li>
        <li>🍃 MongoDB</li>
      </ul>
    </div>

  </div>

  {/* Divider */}
  <div className="my-8 border-t border-white/20" />

  {/* Bottom Bar */}
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
    <p>
      © {new Date ().getFullYear ()} TaskFlow. All rights reserved.
    </p>

    <p className="text-blue-200">
      Crafted By AR using the MERN Stack
    </p>
  </div>
</footer>

    </div>
    
  );
  
}

export default Dashboard;
