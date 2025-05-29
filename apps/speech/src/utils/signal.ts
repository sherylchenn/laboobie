import { observable } from "mobx";

export function signal<T>(initialValue: T) {
  return observable.box(initialValue);
}
