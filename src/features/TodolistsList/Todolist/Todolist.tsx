import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";
import {FilterValuesType, TodolistDomainType, todolistsThunks} from "features/TodolistsList/todolists.reducer";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {tasksThunks} from "../tasks.reducer";
import {TaskStatuses} from "common/enums";
import {useSelector} from "react-redux";
import {selectTasks} from "../tasks.selectors";
import {useActions} from "../../../common/hooks/useActions";


type PropsType = {
  todolist: TodolistDomainType;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void;
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void;
  removeTask: (taskId: string, todolistId: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, todolist, ...props }: PropsType) {
  const {removeTodolist: removeTodolistThunk}=useActions(todolistsThunks)
  const {fetchTasks}= useActions(tasksThunks)
  const tasks = useSelector(selectTasks);
  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(todolist.id);
  }, []);

  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, todolist.id);
    },
    [props.addTask, todolist.id]
  );

  const removeTodolist = () => {
    removeTodolistThunk(todolist.id);
  };

  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(todolist.id, title);
    },
    [todolist.id, props.changeTodolistTitle]
  );

  const onAllClickHandler = useCallback(
    () => props.changeFilter("all", todolist.id),
    [todolist.id, props.changeFilter]
  );
  const onActiveClickHandler = useCallback(
    () => props.changeFilter("active", todolist.id),
    [todolist.id, props.changeFilter]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeFilter("completed", todolist.id),
    [todolist.id, props.changeFilter]
  );

  let tasksForTodolist = tasks[todolist.id];

  if (todolist.filter === "active") {
    tasksForTodolist = tasks[todolist.id].filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks[todolist.id].filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={todolist.id}
            removeTask={props.removeTask}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
