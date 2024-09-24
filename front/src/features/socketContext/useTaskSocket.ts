import React from "react";
import { useSocket } from ".";
import type { Task } from "./types";
import type { CreateTask } from "./models";

// Hook to handle task-related socket events
export const useTaskSocket = () => {
  const { socket } = useSocket();
  const [tasks, setTasks] = React.useState<Array<Task>>([]);

  const updateTask = (task: Task) => {
    if (!socket) return;

    socket.emit("task:update", task);
  };

  const createTask = (createTask: CreateTask) => {
    if (!socket) return;

    socket.emit("task:new", createTask);
  };

  const deleteTask = (id: number) => {
    if (!socket) return;

    socket.emit("task:delete", id);
  };

  // Listen to task events
  React.useEffect(() => {
    if (!socket) return;

    socket.on("tasks:get", (tasks: Array<Task>) => {
      console.log("Tasks received from server:", tasks);
      setTasks(tasks);
    });

    socket.on("task:updated", (task: Task) => {
      console.log("Task updated from server:", task);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? task : t)),
      );
    });

    socket.on("task:created", (task: Task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    socket.on("task:deleted", (id: number) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    });

    // Clean up
    return () => {
      socket.off("tasks:get");
      socket.off("task:updated");
      socket.off("task:created");
      socket.off("task:deleted");
    };
  }, [socket]);

  return {
    updateTask,
    createTask,
    deleteTask,
    tasks,
  };
};
