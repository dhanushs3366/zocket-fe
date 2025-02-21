"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "../api/api_service";
import { Task, TaskStatus } from "../api/dto";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto p-6 w-3/4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Task List</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-5 bg-gray-100 text-gray-700 uppercase text-sm font-semibold p-3 rounded-t-lg">
        <div>Title</div>
        <div>Description</div>
        <div>Status</div>
        <div>Assigned To</div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-white border border-gray-200 rounded-b-lg">
          No tasks available.
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.ID} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 items-center bg-white">
            <div className="break-words">{task.title}</div>
            <div className="break-words">{task.description}</div>
            <div>
              <select
                className="border rounded px-2 py-1 bg-white w-1/3"
                value={task.status}
                onChange={(e) => handleStatusChange(task.ID, e.target.value as TaskStatus)}
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status} className="px-auto">
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="break-words">
              {task.users?.map((user) => (
                <p key={user.ID} className="text-gray-700">{user.username}</p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TasksPage;
