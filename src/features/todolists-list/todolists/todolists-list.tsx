import React, {FC, useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {todolistsThunks,} from "features/todolists-list/todolists/model/todolists.reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Todolist} from "../../TodolistsList/Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTodolists} from "features/todolists-list/todolists/model/todolists.selectors";
import {useActions} from "common/hooks";


type PropsType = {
    demo?: boolean;
};

export const TodolistsList: FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const {addTodolist: addTodolistThunk, fetchTodolists} = useActions(todolistsThunks)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists();
        debugger
    }, []);

    const addTodolist = useCallback(
        (title: string) => {
            addTodolistThunk(title);
        },
        [dispatch]
    );

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>;
    }

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolist={tl}
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
