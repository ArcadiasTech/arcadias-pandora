import Registry from "../../src/util/Registry";

const testRegistry = new Registry<number>();

testRegistry.register("One", 1);
testRegistry.register("Two", 2);

console.log(testRegistry.get("One"));
console.log(testRegistry.getOrDefault("Three", 3));
