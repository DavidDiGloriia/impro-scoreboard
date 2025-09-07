import {PubMediaDto} from "./pub-media.dto";
import {PubAction} from "@enums/pub-action.enum";

export interface PubHandlingDto {
  sequence?: string;
  action?: PubAction;
  pubs?: PubMediaDto[];
}
