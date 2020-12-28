import { Resource } from "../../src/data/Resource";
import * as yup from "yup";

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

const validator = yup.object().shape({
  name: yup.string().optional(),
  surname: yup.string().optional(),
  age: yup.number().optional().integer(),
  attrs: yup.object().shape({
    max_health: yup.number().optional(),
    min_damage: yup.number().optional(),
    max_damage: yup.number().optional(),
  }),
  inventory: yup.array().of(
    yup.object().shape({
      item: yup.string().required(),
      quantity: yup.number().required().integer(),
    })
  ),
});

const resource = Resource.createNew({
  validator,
  validationBehavior: "onModify",
});

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

(async function () {
  await resource.modifyLocalField("name", "Baz");
  console.log(resource.errors);
  await resource.modifyLocalField("attrs.min_damage", 5);
  console.log(resource.errors);
  await resource.modifyLocalField("attrs.max_damage", 99);
  console.log(resource.errors);
  await resource.modifyLocalField("inventory[0]", 5);
  console.log(resource.errors);

  console.log("\nRemote:", resource.remoteResource);
  console.log("Local:", resource.localResource);
  console.log(resource.touchedFields);
  console.log(resource.dirtyFields);
})();
