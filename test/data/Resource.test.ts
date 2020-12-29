import { Resource } from "../../src/data/Resource";
import * as yup from "yup";

const remoteData = {
  name: "Foo",
  surname: "Bar",
  age: 99,
  attrs: {
    max_health: 99,
    min_damage: 0,
    max_damage: 99,
  },
  inventory: [],
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

test("marks fetch correctly", () => {
  resource.beginFetching();

  expect(resource.pending).toBe(true);
  expect(resource.fetched).toBe(false);
  resource.endFetching(remoteData);

  expect(resource.pending).toBe(false);
  expect(resource.fetched).toBe(true);
  expect(resource.remoteResource).toBe(remoteData);
  expect(resource.remoteResource).toBe(resource.localResource);
});

test("updates local resource correctly", async () => {
  await resource.modifyLocalField("name", "Baz");
  expect(resource.localResource.name).toBe("Baz");

  await resource.modifyLocalField("attrs.min_damage", 5);
  expect(resource.localResource.attrs.min_damage).toBe(5);

  expect(resource.localResource.inventory.length).toBe(0);
  const newItem = { item: "Stick", quantity: 1 };
  await resource.modifyLocalField("inventory[0]", newItem);
  expect(resource.localResource.inventory[0]).toBe(newItem);
});

test("updates remote resource correctly", async () => {
  await resource.onRemoteModified("name", "Baz");

  expect(resource.dirtyFields).not.toContain("name");
});
