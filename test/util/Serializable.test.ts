import Serializable from "../../src/util/Serializable";

class TestClass implements Serializable<any> {
  field1: number;
  field2: string;

  serialize(): any {
    return {
      field1: this.field1,
      field2: this.field2,
    };
  }
  deserialize(target: any): void {
    this.field1 = target.field1 || 1;
    this.field2 = target.field2 || "2";
  }
}

const testInstance = new TestClass();

testInstance.deserialize({ field1: 1, field2: "Foo" });
console.log(testInstance.serialize());
