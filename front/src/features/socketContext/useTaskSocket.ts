import React from "react";
import { useSocket } from "./SocketContext";
import type { Task } from "./types";

// Hook to handle task-related socket events
export const useTaskSocket = () => {
  const { socket } = useSocket();
  const [tasks, setTasks] = React.useState<Array<Task>>([]);

  const updateTask = (task: Task) => {
    if (socket) {
      socket.emit("task:update", task);
    }
  };

  // Listen to task events
  React.useEffect(() => {
    if (socket) {
      const handleTasksGet = (tasks: Array<Task>) => {
        console.log("Tasks received from server:", tasks);
        setTasks(tasks);
      };

      const handleTaskUpdated = (task: Task) => {
        console.log("Task updated from server:", task);
        const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(updatedTasks);
      };

      socket.on("tasks:get", handleTasksGet);
      socket.on("task:updated", handleTaskUpdated);

      // Clean up
      return () => {
        socket.off("tasks:get", handleTasksGet);
        socket.off("task:updated", handleTaskUpdated);
      };
    }
  }, [socket]);

  return {
    updateTask,
    tasks,
  };
};
