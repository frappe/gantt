import Task from "./Task";

export default interface PopupOptions {
    position: string;
    subtitle: string;
    target_element: any;
    task: Task;
    title: string;
}