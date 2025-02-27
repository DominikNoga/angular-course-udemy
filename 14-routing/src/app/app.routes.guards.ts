import { inject } from "@angular/core";
import { CanMatchFn, RedirectCommand, Route, Router, UrlSegment } from "@angular/router";
import { UsersService } from "./users/users.service";

export const canMatchUserRoutes: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    const router = inject(Router);
    const userId = segments[1].path;
    const usersService = inject(UsersService);
    if (usersService.users.some(user => user.id === userId)) {
        return true;
    }

    return new RedirectCommand(router.parseUrl('/unauthorized'));
};
