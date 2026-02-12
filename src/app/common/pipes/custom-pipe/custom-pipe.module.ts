import { NgModule } from "@angular/core";
import { FormatPipe } from "./formate.pipe";
import { FormatMinimumDecimalPipe } from "./formatWithMinimumDecimal.pipe";

@NgModule({
    declarations:[
        FormatPipe,
        FormatMinimumDecimalPipe
    ],
    exports:[
        FormatPipe,
        FormatMinimumDecimalPipe
    ],
})

export class CustomPipeModule{

}