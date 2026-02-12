import { UserTypeDto } from './../service/auth.service';
import { PlatformDetailsDto } from "./platform-details-dto";

export interface LoginDto{
    username:string;
    password:string;
    platformDetailsDto:PlatformDetailsDto
    userTypeDto:UserTypeDto;
}
