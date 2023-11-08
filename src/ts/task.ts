export default interface Task{
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