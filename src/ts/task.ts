export default interface Task{
    custom_class: string;
    invalid: boolean;
    start: any;
    end: any;
    id: any;
    dependencies: string | string[];
    progress: number;
    name: string;
    _start: Date;
    _end: Date;
    _index: number;
}