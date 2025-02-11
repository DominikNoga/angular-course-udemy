import { Injectable } from "@angular/core";
import { CreateTaskDto, Task } from "../types/task.types";
import { DUMMY_TASKS } from "../constants/dummy_tasks";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
}) export class TaskService {
    private tasksSubject = new BehaviorSubject<Task[]>(DUMMY_TASKS);
    tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

    constructor() { }

    getTasks(): Observable<Task[]> {
        return this.tasksSubject.asObservable();
    }

    deleteTask(taskId: string): void {
        const updatedTasks = this.tasksSubject.value.filter(task => task.id !== taskId);
        this.tasksSubject.next(updatedTasks);
    }

    addTask(task: CreateTaskDto, userId: string): void {
        const newTask: Task = {
            ...task,
            id: this.randomId(),
            userId
        };
        const updatedTasks = [newTask, ...this.tasksSubject.value];
        this.tasksSubject.next(updatedTasks);
    }

    private randomId = (): string => new Date().getTime().toString();
}