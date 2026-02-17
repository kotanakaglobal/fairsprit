'use client';

import { FormEvent, useMemo, useState } from 'react';
import { calculate, Operation } from '@/lib/calc';

const operations: Array<{ label: string; value: Operation }> = [
  { label: 'Add (+)', value: 'add' },
  { label: 'Subtract (−)', value: 'subtract' },
  { label: 'Multiply (×)', value: 'multiply' },
  { label: 'Divide (÷)', value: 'divide' },
];

export default function HomePage() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [submitted, setSubmitted] = useState(false);

  const parsedLeft = Number(left);
  const parsedRight = Number(right);

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }

    if (!Number.isFinite(parsedLeft) || !Number.isFinite(parsedRight)) {
      return 'Please enter valid numbers.';
    }

    try {
      return calculate(parsedLeft, parsedRight, operation).toString();
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'Unexpected error.';
    }
  }, [operation, parsedLeft, parsedRight, submitted]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <h1>FairSprit Calculator</h1>
      <p>Enter two numbers and choose an operation.</p>

      <form className="card" onSubmit={onSubmit}>
        <label htmlFor="left">First number</label>
        <input
          id="left"
          inputMode="decimal"
          value={left}
          onChange={(event) => setLeft(event.target.value)}
          placeholder="e.g. 12.5"
        />

        <label htmlFor="operation" style={{ marginTop: '1rem' }}>
          Operation
        </label>
        <select
          id="operation"
          value={operation}
          onChange={(event) => setOperation(event.target.value as Operation)}
        >
          {operations.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label htmlFor="right" style={{ marginTop: '1rem' }}>
          Second number
        </label>
        <input
          id="right"
          inputMode="decimal"
          value={right}
          onChange={(event) => setRight(event.target.value)}
          placeholder="e.g. 3"
        />

        <button type="submit" style={{ marginTop: '1rem' }}>
          Calculate
        </button>
      </form>

      <section className="card" aria-live="polite">
        <h2>Result</h2>
        <p className="result">{result ?? '—'}</p>
      </section>
    </main>
  );
}
