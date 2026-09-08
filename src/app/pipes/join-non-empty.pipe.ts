import {Pipe, PipeTransform} from "@angular/core";

/** Joint les éléments non vides d'un tableau avec un séparateur. */
@Pipe({
  name: 'joinNonEmpty',
})
export class JoinNonEmptyPipe implements PipeTransform {
  transform(parts: (string | null | undefined)[], separator = ' ∙ '): string {
    return (parts || []).filter((part) => !!part && part.trim()).join(separator);
  }
}
