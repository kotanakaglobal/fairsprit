export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export function calculate(left: number, right: number, operation: Operation): number {
  switch (operation) {
    case 'add':
      return left + right;
    case 'subtract':
      return left - right;
    case 'multiply':
      return left * right;
    case 'divide':
      if (right === 0) {
        throw new Error('Cannot divide by zero.');
      }
      return left / right;
    default:
      return assertNever(operation);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported operation: ${value as string}`);
}
