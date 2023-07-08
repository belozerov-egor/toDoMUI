import React, {FC, memo, useCallback, useEffect} from "react";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";
import {TodolistDomainType, todolistsActions, todolistsThunks} from "features/TodolistsList/todolists.reducer";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {tasksThunks} from "../tasks.reducer";
import {TaskStatuses} from "common/enums";
import {useSelector} from "react-redux";
import {selectTasks} from "../tasks.selectors";
import {useActions} from "../../../common/hooks/useActions";


type PropsType = {
    todolist: TodolistDomainType;
    demo?: boolean;
};

export const Todolist: FC<PropsType> = memo(function (props) {
    const {demo = false, todolist} = props;
    const {
        removeTodolist: removeTodolistThunk,
        changeTodolistTitle: changeTodolistTitleThunk,
        changeTodolistFilter,
    } = useActions({...todolistsThunks, ...todolistsActions})
    const {fetchTasks, addTask: addTaskThunk} = useActions(tasksThunks)
    const tasks = useSelector(selectTasks);
    useEffect(() => {
        if (demo) {
            return;
        }
        fetchTasks(todolist.id);
    }, []);

    const addTask = useCallback(
        (title: string) => {
            addTaskThunk({title, todolistId: todolist.id});
        },
        [todolist.id]
    );

    const removeTodolist = () => {
        removeTodolistThunk(todolist.id);
    };

    const changeTodolistTitle = useCallback(
        (title: string) => {
            changeTodolistTitleThunk({id: todolist.id, title});
        },
        [todolist.id]
    );

    const onAllClickHandler = useCallback(
        () => changeTodolistFilter({filter: "all", id: todolist.id}),
        [todolist.id]
    );
    const onActiveClickHandler = useCallback(
        () => changeTodolistFilter({filter: "active", id: todolist.id}),
        [todolist.id]
    );
    const onCompletedClickHandler = useCallback(
        () => changeTodolistFilter({filter: "completed", id: todolist.id}),
        [todolist.id]
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
                <EditableSpan value={todolist.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"}/>
            <div>
                {tasksForTodolist.map((t) => (
                    <Task
                        key={t.id}
                        todolistId={todolist.id}
                        task={t}
                    />
                ))}
            </div>
            <div style={{paddingTop: "10px"}}>
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
