import { FormGroup } from "@angular/forms";

export function dateRangeValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const startDate = formGroup.controls[controlName];
        const endDate = formGroup.controls[matchingControlName];

        if (endDate.errors && !endDate.errors.dateRangeValidator) {
            // return if another validator has already found an error on the endDate
            return;
        }

        // set error on endDate if validation fails
        if (startDate.value > endDate.value) {
            endDate.setErrors({ incorrect: true });
        } else {
            endDate.setErrors(null);
        }
    }
}