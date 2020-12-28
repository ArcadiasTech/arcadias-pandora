import _ from "lodash";
import jp from "jsonpath";
import * as yup from "yup";

type ValidationBehavior = "onModify" | "onDemand";

type ResourceOptions<T extends object, C> = {
  validator: yup.ObjectSchema<T, C>;
  validationBehavior?: ValidationBehavior;
};

export class Resource<R> {
  public static createNew<T extends object, C>(options: ResourceOptions<T, C>) {
    return new Resource<yup.InferType<typeof options.validator>>(options);
  }

  private _validator: yup.ObjectSchema;
  private _validationBehavior: ValidationBehavior;
  private _fetched: boolean;
  private _pending: boolean;
  private _errors: object;
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

  public get errors(): Readonly<object> {
    return this._errors;
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

  private constructor(options: ResourceOptions<any, any>) {
    this._fetched = false;
    this._touchedFields = new Set();
    this._dirtyFields = new Set();
    this._validator = options.validator;
    this._validationBehavior = options.validationBehavior || "onModify";
    this._errors = {};
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

  public async validate() {
    if (!this._validator) return;
    try {
      this._errors = {};
      await this._validator.validate(this._localResource, {
        abortEarly: false,
      });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((e) => {
          jp.value(this._errors, `$.${e.path}`, e.message);
        });
        return false;
      }
    }
  }

  public reset() {
    this._localResource = _.cloneDeep(this._remoteResource);
    this._touchedFields.clear();
    this._dirtyFields.clear();
    this._errors = {};
  }

  public async modifyLocalField(jsonPath: string, newValue: any) {
    this._touchedFields.add(jsonPath);
    jp.value(this._localResource, jsonPath, newValue);
    this.dirtyCheck(jsonPath);
    if (this._validationBehavior === "onModify") await this.validate();
  }

  public onRemoteModified(jsonPath: string, newValue: any) {
    // TODO
  }
}
