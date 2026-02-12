import { ClickOutsideDirective } from './Click-outside.directive';
import { NgModule } from "@angular/core";
import { AlphabetsDirective } from "./alphabets.directive";
import { NumberDirective } from "./number.directive";
import { SpecialCharacterDirective } from "./special-character.directive";
import { PasswordAddressDirectiveTsDirective } from './password-address.directive.ts.directive';
import { EmailDirectiveTsDirective } from './email.directive.ts.directive';
import { FormatnumberDirective } from "./custom-directive/formatnumber.directive";


@NgModule({
    declarations: [
        SpecialCharacterDirective,
        AlphabetsDirective,
        NumberDirective,
        PasswordAddressDirectiveTsDirective,
        EmailDirectiveTsDirective,
        FormatnumberDirective,
        ClickOutsideDirective,

    ],
    exports: [
        SpecialCharacterDirective,
        AlphabetsDirective,
        NumberDirective,
        PasswordAddressDirectiveTsDirective,
        EmailDirectiveTsDirective,
        FormatnumberDirective,
        ClickOutsideDirective
    ]
})
export class CustomDirectiveModule {}
