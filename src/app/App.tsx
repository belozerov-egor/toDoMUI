import React, {useCallback, useEffect} from "react";
import "./App.css";
import {TodolistsList} from "features/todolists-list/todolists-list";
import {ErrorSnackbar} from "common/components/ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/auth/Login/Login";
import {authThunks} from "features/auth/auth.reducer";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectAppStatus, selectIsInitialized} from "app/app.selectors";
import {useActions} from "../common/hooks/useActions";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const status = useSelector(selectAppStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {initializeApp,logout} = useActions(authThunks)

  useEffect(() => {
  initializeApp({});
  }, []);

  const logoutHandler = useCallback(() => {
  logout({});
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">ToDo</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={demo} />} />
            <Route path={"/login"} element={<Login />} />
            <Route path="/todoMUI" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
