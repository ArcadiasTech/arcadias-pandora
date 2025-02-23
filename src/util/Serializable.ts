export interface Serializable<T> {
  serialize(): T;
  deserialize(target: T): void;
}
