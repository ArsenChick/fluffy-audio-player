import { PLAYLIST_ORDER } from "../constants/constants";

export function applyOrderToArray<T>(
  list: Array<T>, order: Array<number> = PLAYLIST_ORDER
) {
  const listLength = list.length
  if(listLength != order.length)
    throw Error('im tired');

  const res = new Array<T>(listLength);
  order.forEach((position, index) => {
    res[position] = list[index];
  });

  return res;
}
