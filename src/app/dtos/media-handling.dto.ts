import {MediaAction} from "@enums/video-action.enum";

export interface MediaHandlingDto {
  mediaId?: string;
  sequence?: string;
  action?: MediaAction;
  numberValue?: number;
}
