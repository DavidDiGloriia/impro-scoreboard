import {ProjectionMode} from "@enums/projection-mode.enum";

export const ProjectionModeLabel: { [value: string]: string } = {
  [ProjectionMode.NORMAL]: 'En hauteur',
  [ProjectionMode.PUSHED_ON_TOP]: 'Près du sol',
}
