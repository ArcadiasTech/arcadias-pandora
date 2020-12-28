export interface IRegistry<R> {
  register(resourceName: string, resource: R): boolean;
  unregister(resourceName: string): boolean;
  get(resourceName: string): R | null;
  getOrDefault(resourceName: string, defaultValue: R): R;
}

export class Registry<R> implements IRegistry<R> {
  private storage: Map<string, R>;

  constructor() {
    this.storage = new Map();
  }

  public register(resourceName: string, resource: R): boolean {
    if (this.storage.has(resourceName)) {
      return false;
    }
    this.storage.set(resourceName, resource);
    return true;
  }

  public unregister(resourceName: string): boolean {
    if (!this.storage.has(resourceName)) {
      return false;
    }
    this.storage.delete(resourceName);
    return true;
  }

  public get(resourceName: string): R | null {
    return this.storage.get(resourceName) || null;
  }

  public getOrDefault(resourceName: string, defaultValue: R): R {
    return this.get(resourceName) || defaultValue;
  }
}
