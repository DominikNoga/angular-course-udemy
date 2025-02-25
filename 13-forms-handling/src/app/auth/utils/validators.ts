import { AbstractControl, AsyncValidatorFn, ValidatorFn } from "@angular/forms";

export const controlsMatch = (controlName1: string, controlName2: string): ValidatorFn => 
    (control: AbstractControl) => {
        const password = control.get(controlName1)?.value;
        const repeatPassword = control.get(controlName2)?.value;
        if (password && repeatPassword && password !== repeatPassword) {
            return { passwordsDoesNotMatch: true };
        }
        return null;
    };

