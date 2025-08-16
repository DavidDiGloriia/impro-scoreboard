import {Pipe, PipeTransform} from "@angular/core";
import {ImproData} from "@models/impro-data";
import {compact, join} from 'lodash-es';
import {ImproTypeLabel} from "@constants/impro-type.constants";
import {ImproNbPlayersLabel} from "@constants/impro-nb-players.constants";
import {ImproNbPlayers} from "@enums/impro-nb-players.enum";

@Pipe({
  name: 'formatImproHeader',
})
export class FormatImproHeaderPipe implements PipeTransform {
  transform(value: ImproData): string {
    const nbPlayersLabel: string = value.nbPlayers === ImproNbPlayers.CUSTOM ? value.customNbPlayerLabel : ImproNbPlayersLabel[value.nbPlayers] ? ImproNbPlayersLabel[value.nbPlayers] : value.customNbPlayerLabel;

    return join(compact(
      [ImproTypeLabel[value.type], nbPlayersLabel]
    ), ' ∙ ');
  }
}
