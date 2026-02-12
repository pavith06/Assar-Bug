import { MenuDto } from './menu-dto';
import { RoleDto, UserDto } from './role-dto';
import { FieldGroupDTO } from './../field-group-dto';
export class userPageDto{
  isActive:boolean;
  userDetails:FieldGroupDTO;
  enableNotification:UserDto;
}
