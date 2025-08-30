import {TeamDto} from "./team.dto";
import {ProjectionMode} from "@enums/projection-mode.enum";

export interface GameDataDto {
  teamA?: TeamDto;
  teamB?: TeamDto;
  projectionMode?: ProjectionMode;
  automaticPlayerPresentation?: boolean
}
