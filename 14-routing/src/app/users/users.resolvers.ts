import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { UsersService } from "./users.service";
import { Task } from "../tasks/task/task.model";
import { TasksService } from "../tasks/tasks.service";

export const resolveUsername: ResolveFn<string> = (activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) => {
    const usersService = inject(UsersService);
    const userId = activatedRoute.paramMap.get('userId');
    return usersService.users.find(user => user.id === userId)?.name || 'No user found';
};

export const userTasksResolver: ResolveFn<Task[]> = (activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) => {
    const tasksService = inject(TasksService);
    const userId = activatedRoute.params['userId'];
    const order: 'asc' | 'desc' = activatedRoute.queryParams['order'];
    return tasksService.allTasks()
        .filter(task => task.userId === userId)
        .sort((t1, t2) => {
            if (order === 'asc')
                return t1.dueDate.localeCompare(t2.dueDate);
            return t2.dueDate.localeCompare(t1.dueDate);
        });
};

export const resolveTitle: ResolveFn<string> = (activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) => {
    return `${resolveUsername(activatedRoute, routerState)}'s Tasks`;
};