function pluck<DataType, KeyType extends keyof DataType>(
  items: DataType[],
  key: KeyType
): DataType[KeyType][] {
  return items.map((item) => item[key]);
}

interface Dog1 {
  name: string;
  age: number;
  title?: string;
}
const dogs: Dog1[] = [
  { name: 'Mimi', age: 12, title: 'sdad' },
  { name: 'LG', age: 13 }
];

interface Cat {
  color: string;
}

const cat1 = [{ color: 'yellow' }];
console.log(pluck(dogs, 'title'));
console.log(pluck(dogs, 'name'));
pluck(cat1, 'color');

interface BaseEvent {
  time: number;
  user: string;
}
interface EventMap {
  addToCart: BaseEvent & { quantity: number; productID: string };
  logout: BaseEvent & { token: string };
  checkout: BaseEvent;
}

function sendMyEvent<Name extends keyof EventMap>(
  name: Name,
  data: EventMap[Name]
): void {
  console.log([name, data]);
}

sendMyEvent('addToCart', {
  productID: 'foo',
  user: 'baz',
  quantity: 1,
  time: 10
});

sendMyEvent('addToCart', {
  time: 10,
  user: 'Duy',
  quantity: 10,
  productID: '10'
});

sendMyEvent('checkout', {
  time: 10,
  user: 'Duy'
});

sendMyEvent('logout', {
  time: 10,
  user: 'Duy',
  token: '123'
});
