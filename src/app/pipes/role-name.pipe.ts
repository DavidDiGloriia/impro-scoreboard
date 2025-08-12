import {Pipe, PipeTransform} from "@angular/core";
import {Role} from "@enums/role.enum";

@Pipe({
  name: 'roleName',
})
export class RoleNamePipe implements PipeTransform {
  transform(value: string, isWoman: boolean): string {
    switch (value as Role) {
      case Role.CAPTAIN :
        return 'capitaine'
      case Role.COACH :
        return 'coach'
      case Role.ASSIST :
        return isWoman ? 'assistante-capitaine' : 'assistant-capitaine';
      default :
        return ''
    }
  }
}
