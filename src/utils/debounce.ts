type Func<T extends any[]> = (...args: T) => any;

export function debounce<T extends any[]>(
  callback: Func<T>,
  delay: number
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout>;
  return function debounceCallback(...args: T): void {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
