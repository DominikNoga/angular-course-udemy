import { Route } from "@angular/router";
import { NoTaskComponent } from "./tasks/no-task/no-task.component";
import { UserTasksComponent } from "./users/user-tasks/user-tasks.component";
import { NotFoundComponent } from "./not-found/not-found/not-found.component";
import { resolveTitle, resolveUsername } from "./users/users.resolvers";
import { canMatchUserRoutes } from "./app.routes.guards";

export const routes: Route[] = [
    {
        path: '',
        component: NoTaskComponent
    },
    {
        path: 'users/:userId',
        component: UserTasksComponent,
        loadChildren: () => import('../app/users/users.routes')
            .then(m => m.userRoutes),
        resolve: {
            username: resolveUsername
        },
        title: resolveTitle,
        canMatch: [canMatchUserRoutes]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
] as const;
