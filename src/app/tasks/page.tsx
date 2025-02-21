"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "../api/api_service";
import { Task, TaskStatus } from "../api/dto";
import { Trash, Pencil, Play, Plus } from "lucide-react";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    status: TaskStatus;
  }>({
    title: "",
    description: "",
    status: TaskStatus.Todo,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await apiService.getAllTasks();
      if (!res.success) {
        setError(res.err || "Failed to fetch tasks");
        return;
      }
      setTasks(res.result);
      setError(null);
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error fetching tasks:", error);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    await apiService.updateTask(taskId, { ID: taskId, status: newStatus });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.ID === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task.ID ? task.ID : 0);
    setEditedTask({
      title: task.title || "",
      description: task.description || "",
    });
  };

  const handleSubmit = async (taskId: number) => {
    await apiService.updateTask(taskId, {
      title: editedTask.title,
      description: editedTask.description,
    });
    setEditingTask(null);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.ID === taskId
          ? {
              ...task,
              title: editedTask.title,
              description: editedTask.description,
            }
          : task
      )
    );
  };

  const handleAddTask = async () => {
    const res = await apiService.createTask({ ...newTask });
    if (res.success) {
      fetchTasks();
    } else {
      console.error("Failed to create task:", res.err);
    }

    setIsAddingTask(false);
    setNewTask({ title: "", description: "", status: TaskStatus.Todo });
  };

  const handleDelete = async (taskId: number) => {
    try {
      const res = await apiService.deleteTask(taskId);
      if (res.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.ID !== taskId));
      } else {
        console.error("Failed to delete task:", res.err);
        alert("Failed to delete the task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An unexpected error occurred while deleting the task.");
    }
  };

  return (
    <div className="container mx-auto p-6 w-3/4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-center">Task List</h1>
        <Plus
          className="text-blue-600 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setIsAddingTask(true)}
        />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-6 bg-gray-100 text-gray-700 uppercase text-sm font-semibold p-3 rounded-t-lg px-3 justify-center">
        <div>Title</div>
        <div>Description</div>
        <div>Status</div>
        <div>Assigned To</div>
        <div>Actions</div>
      </div>

      {/* Add Task Row */}
      {isAddingTask && (
        <div className="grid grid-cols-6 gap-4 p-3 border-b border-gray-200 items-center bg-white">
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea
            className="border rounded px-2 py-1 w-full"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <select
            className="border rounded px-2 py-1 bg-white w-2/3"
            value={newTask.status}
            onChange={(e) =>
              setNewTask({ ...newTask, status: e.target.value as TaskStatus })
            }
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div />
          <div className="flex gap-2">
            <Play
              className="text-green-600 cursor-pointer hover:scale-110 transition-transform"
              onClick={handleAddTask}
            />
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-white border border-gray-200 rounded-b-lg">
          No tasks available.
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.ID}
            className="grid grid-cols-6 gap-4 p-3 border-b border-gray-200 items-center bg-white"
          >
            <div>
              {editingTask === task.ID ? (
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={editedTask.title}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                />
              ) : (
                <span className="break-words">{task.title}</span>
              )}
            </div>
            <div>
              {editingTask === task.ID ? (
                <textarea
                  className="border rounded px-2 py-1 w-full"
                  value={editedTask.description}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                />
              ) : (
                <span className="break-words">{task.description}</span>
              )}
            </div>
            <div>
              <select
                className="border rounded px-2 py-1 bg-white w-full"
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(
                    task.ID ? task.ID : 0,
                    e.target.value as TaskStatus
                  )
                }
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="break-words">
              {task.users?.map((user) => (
                <p key={user.ID} className="text-gray-700">
                  {user.username}
                </p>
              ))}
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              {editingTask === task.ID ? (
                <Play
                  className="text-green-600 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleSubmit(task.ID ? task.ID : 0)}
                />
              ) : (
                <>
                  <Pencil
                    className="text-gray-600 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleEdit(task)}
                  />
                  {/* Delete Icon */}
                  <Trash
                    className="text-red-600 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleDelete(task.ID ?? 0)}
                  />
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TasksPage;
