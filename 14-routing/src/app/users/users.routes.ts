import { Routes } from "@angular/router";
import { TasksComponent } from "../tasks/tasks.component";
import { canLeaveNewTaskPage, NewTaskComponent } from "../tasks/new-task/new-task.component";
import { userTasksResolver } from "./users.resolvers";
import { TasksService } from "../tasks/tasks.service";

export const userRoutes: Routes = [
    {
        path: '',
        providers: [TasksService],
        children: [
            {
                path: '',
                redirectTo: 'tasks',
                pathMatch: 'prefix'
            },
            {
                // it will be automatically concatenated with users/userId
                path: 'tasks',
                component: TasksComponent,
                runGuardsAndResolvers: 'always',
                resolve: {
                    userTasks: userTasksResolver
                }
            },
            {
                path: 'tasks/new',
                component: NewTaskComponent,
                canDeactivate: [canLeaveNewTaskPage]
            }
        ]
    }
];
