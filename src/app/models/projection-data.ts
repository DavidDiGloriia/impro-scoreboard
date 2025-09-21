import {ProjectionDataDto} from "../dtos/projection-data.dto";

export class ProjectionData {
  constructor(private _dto: ProjectionDataDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  get x(): number {
    return this._dto.x || 0;
  }

  set x(value: number) {
    this._dto.x = value;
  }

  withX(x: number): ProjectionData {
    this.x = x;
    return this;
  }

  get y(): number {
    return this._dto.y || 0;
  }

  set y(value: number) {
    this._dto.y = value;
  }

  withY(y: number): ProjectionData {
    this.y = y;
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
