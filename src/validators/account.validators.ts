import { AbstractControl, ValidationErrors, SelectControlValueAccessor } from "@angular/forms";


export class AccountValidators {

    static isValidPhoneNumber(controls: AbstractControl): ValidationErrors | null {
        if (controls.value >= 800000000 && controls.value <= 1999999999)
            return null;
        else
            return { invalid: true }

    }

    static passwordShouldMatch(controls: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((res, rej) => {
            if (controls.get('password').value == controls.get('confirm').value)
                res(null);
            else
                res({ notMatch: true });
        });
    }

}