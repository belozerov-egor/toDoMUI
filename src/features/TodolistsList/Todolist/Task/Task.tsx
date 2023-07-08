import React, {ChangeEvent, FC, memo, useCallback} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from "common/enums";
import {TaskType} from "../../todolists.types";
import {useActions} from "../../../../common/hooks/useActions";
import {tasksActions, tasksThunks} from "../../tasks.reducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string;
};
export const Task: FC<TaskPropsType> = memo((props) => {
    const {todolistId, task} = props;
    const {removeTask, updateTask} = useActions(tasksThunks);

    const onClickHandler = useCallback(
        ()=>   removeTask({taskId: task.id, todolistId}),
        [task.id, todolistId]
    );

    const onChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            updateTask({ taskId:task.id, todolistId, domainModel: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New } })
        },
        [task.id, todolistId]
    );

    const onTitleChangeHandler = useCallback(
        (newValue: string) => {
            updateTask({ taskId: task.id, todolistId, domainModel: { title:newValue } })
        },
        [task.id, todolistId]
    );

    return (
        <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox checked={task.status === TaskStatuses.Completed} color="primary"
                      onChange={onChangeHandler}/>

            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </div>
    );
});
