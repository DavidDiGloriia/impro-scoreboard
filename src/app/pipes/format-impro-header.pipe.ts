import {Pipe, PipeTransform} from "@angular/core";
import {ImproData} from "@models/impro-data";
import { join, compact } from 'lodash-es';
import {ImproTypeLabel} from "@constants/impro-type.constants";
import {ImproNbPlayersLabel} from "@constants/impro-nb-players.constants";

@Pipe({
  name: 'formatImproHeader',
})
export class FormatImproHeaderPipe implements PipeTransform {
  transform(value: ImproData): string {
    const nbPlayersLabel: string = ImproNbPlayersLabel[value.nbPlayers] ? ImproNbPlayersLabel[value.nbPlayers] : value.customNbPlayerLabel;


    return join(compact(
      [ImproTypeLabel[value.type], nbPlayersLabel]
    ), ' ∙ ');
  }
}
