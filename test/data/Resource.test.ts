import { Resource } from "../../src/data/Resource";

type ResourceData = {
  name: string;
  surname: string;
  age: number;
  attrs: {
    max_health: number;
    min_damage: number;
    max_damage: number;
  };
  inventory: { item: string; quantity: number }[];
};

const resource = new Resource<ResourceData>();

resource.beginFetching();

console.log("Begin");
console.log("Pending:", resource.pending);
console.log("Fetched:", resource.fetched);

resource.endFetching({
  name: "Foo",
  surname: "Bar",
  age: 99,
  attrs: {
    max_health: 99,
    min_damage: 0,
    max_damage: 99,
  },
  inventory: [],
});

console.log("\nFetched");
console.log("Pending:", resource.pending);
console.log("Fetched:", resource.fetched);
console.log("Remote:", resource.remoteResource);
console.log("Local:", resource.localResource);

resource.modifyLocalField("name", "Baz");
resource.modifyLocalField("attrs.min_damage", 5);
resource.modifyLocalField("attrs.max_damage", 99);
resource.modifyLocalField("inventory[0]", 5);
console.log("\nRemote:", resource.remoteResource);
console.log("Local:", resource.localResource);
console.log(resource.touchedFields)
console.log(resource.dirtyFields)