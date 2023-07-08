import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/todolists.reducer";
import {removeTaskTC, tasksThunks} from "features/TodolistsList/tasks.reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTasks} from "./tasks.selectors";
import {selectTodolists} from "features/TodolistsList/todolists.selectors";
import {TaskStatuses} from "common/enums";
import {useActions} from "../../common/hooks/useActions";


type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {addTodolist: addTodolistThunk} = useActions(todolistsThunks)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    const thunk = fetchTodolistsTC();
    dispatch(thunk);
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ todolistId, title }));
  }, []);


  const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
    dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
  }, []);


  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodolistTitleTC(id, title);
    dispatch(thunk);
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      addTodolistThunk(title);
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
