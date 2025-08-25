import {VideoAction} from "@enums/video-action.enum";

export interface VideoHandlingDto {
  videoId?: string;
  sequence?: string;
  action?: VideoAction;
  numberValue?: number;
}
