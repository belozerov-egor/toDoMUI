import { AppDispatch, AppRootStateType } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseType } from "../types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | ResponseType;
}>();
