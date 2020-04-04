export function findLast<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean) {
   let l = array.length;
   while (l--) {
       if (predicate(array[l], l, array))
           return array[l];
   }
};

export function replaceArray<T>(source: Array<T>, target: Array<T>) {
   source.length = 0;
   source.push.apply(source, target);
   return source;
}

export function removeArrayItem<T>(array: Array<T>, item: T) {
   const index = array.indexOf(item);
   array.splice(index, 1);
   return array;
}