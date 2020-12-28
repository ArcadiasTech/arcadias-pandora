import _ from "lodash";
import jp from "jsonpath";

export class Resource<R> {
  private _fetched: boolean;
  private _pending: boolean;
  private _touchedFields: Set<string>;
  private _dirtyFields: Set<string>;

  private _remoteResource: R;
  private _localResource: R;

  public get remoteResource(): R {
    return this._remoteResource;
  }

  public get localResource(): R {
    return this._localResource;
  }

  public get touchedFields(): Readonly<Set<string>> {
    return this._touchedFields;
  }

  public get dirtyFields(): Readonly<Set<string>> {
    return this._dirtyFields;
  }

  public get touched(): boolean {
    return this._touchedFields.size != 0;
  }

  public get dirty(): boolean {
    return this._dirtyFields.size != 0;
  }

  public get fetched(): boolean {
    return this._fetched;
  }

  public get pending(): boolean {
    return this._pending;
  }

  public constructor() {
    this._fetched = false;
    this._touchedFields = new Set();
    this._dirtyFields = new Set();
  }

  public beginFetching() {
    this._fetched = false;
    this._pending = true;
  }

  public endFetching(resource: R) {
    this._fetched = true;
    this._pending = false;
    this._remoteResource = resource;
    this._localResource = _.cloneDeep(resource);
  }

  private dirtyCheck(jsonPath: string) {
    const localValue = jp.query(this._localResource, jsonPath);
    const remoteValue = jp.query(this._remoteResource, jsonPath);
    if (_.isEqual(localValue, remoteValue)) {
      this._dirtyFields.delete(jsonPath);
    } else {
      this._dirtyFields.add(jsonPath);
    }
  }

  public modifyLocalField(jsonPath: string, newValue: any) {
    this._touchedFields.add(jsonPath);
    jp.value(this._localResource, jsonPath, newValue);
    this.dirtyCheck(jsonPath);
  }
}
