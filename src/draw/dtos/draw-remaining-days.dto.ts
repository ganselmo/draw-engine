import { Expose } from "class-transformer";

export class DrawRemainingDaysDto{
    @Expose()
    remainingDays:number
}

