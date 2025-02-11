import { Injectable } from "@angular/core";
import { CreateTaskDto, Task } from "../types/task.types";
import { DUMMY_TASKS } from "../constants/dummy_tasks";

@Injectable({
    providedIn: 'root'
}) export class Task2Service {
    private tasks = DUMMY_TASKS;

    constructor() {
        const tasks = localStorage.getItem('tasks');

        if (tasks) {
            this.tasks = JSON.parse(tasks);
        }
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    getUserTasks(userId: string) {
        return this.tasks.filter((task) => task.userId === userId);
    }

    deleteTask(taskId: string): void {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    addTask(task: CreateTaskDto, userId: string): void {
        const newTask: Task = {
            ...task,
            id: this.randomId(),
            userId
        };
        this.tasks = [newTask, ...this.tasks];
        this.saveTasks();
    }

    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    private randomId = (): string => new Date().getTime().toString();
}