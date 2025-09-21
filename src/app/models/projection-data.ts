import {ProjectionDataDto} from "../dtos/projection-data.dto";

export class ProjectionData {
  constructor(private _dto: ProjectionDataDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  get top(): number {
    return this._dto.top || 0;
  }

  set top(value: number) {
    this._dto.top = value;
  }

  withTop(value: number): ProjectionData {
    this.top = value;
    return this;
  }

  get bottom(): number {
    return this._dto.bottom || 0;
  }

  set bottom(value: number) {
    this._dto.bottom = value;
  }

  withBottom(value: number): ProjectionData {
    this.bottom = value;
    return this;
  }

  get left(): number {
    return this._dto.left || 0;
  }

  set left(value: number) {
    this._dto.left = value;
  }

  withLeft(value: number): ProjectionData {
    this.left = value;
    return this;
  }

  get right(): number {
    return this._dto.right || 0;
  }

  set right(value: number) {
    this._dto.right = value;
  }

  withRight(value: number): ProjectionData {
    this.right = value;
    return this;
  }

  toDto(): ProjectionDataDto {
    return this._dto;
  }

  clone(): ProjectionData {
    return new ProjectionData({
      ...this.toDto()
    });
  }
}
