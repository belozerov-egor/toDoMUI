import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { ResponseType } from "common/types/common.types";


/**
 * Обрабатывает ошибки, полученные от сервера.
 *
 * @template D Тип данных, возвращаемых сервером.
 * @param {ResponseType<D>} data - Данные, полученные от сервера.
 * @param {Dispatch} dispatch - Функция для отправки действий в Redux-хранилище.
 * @param {boolean} [showError=true] - Флаг, указывающий, нужно ли показывать ошибку пользователю.
 * @returns {void}
 */
export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }

  dispatch(appActions.setAppStatus({ status: "failed" }));
};
