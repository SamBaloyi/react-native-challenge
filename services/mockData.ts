import { Item } from "../types/item";

/**
 * A mock dataset representing a collection of items.
 * Each item contains an ID, title, body, and a user ID indicating ownership.
 *
 * @constant
 * @type {Item[]}
 * @example
 * // Accessing the first item's title
 * console.log(mockItems[0].title); // Output: "First Item"
 */
export const mockItems: Item[] = [
  {
    id: 1,
    title: "First Item",
    body: "This is the body of the first item",
    userId: 1,
  },
  {
    id: 2,
    title: "Second Item",
    body: "This is the body of the second item",
    userId: 1,
  },
  {
    id: 3,
    title: "Third Item",
    body: "This is the body of the third item",
    userId: 2,
  },
  {
    id: 4,
    title: "Fourth Item",
    body: "This is the body of the fourth item",
    userId: 2,
  },
  {
    id: 5,
    title: "Fifth Item",
    body: "This is the body of the fifth item",
    userId: 3,
  },
];
