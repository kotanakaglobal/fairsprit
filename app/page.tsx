'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { calculateFairSplit } from '@/lib/calc';

type FormState = {
  total: number;
  people: number;
  drinkers: number;
  cups: number;
  cupPrice: number;
};

const defaults: FormState = {
  total: 30000,
  people: 6,
  drinkers: 3,
  cups: 6,
  cupPrice: 500,
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(defaults);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const next: FormState = {
      total: parseInt(params.get('total') ?? `${defaults.total}`, 10),
      people: parseInt(params.get('people') ?? `${defaults.people}`, 10),
      drinkers: parseInt(params.get('drinkers') ?? `${defaults.drinkers}`, 10),
      cups: parseInt(params.get('cups') ?? `${defaults.cups}`, 10),
      cupPrice: parseInt(params.get('price') ?? `${defaults.cupPrice}`, 10),
    };

    if (Object.values(next).every((v) => Number.isFinite(v))) {
      setForm(next);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('total', String(form.total));
    params.set('people', String(form.people));
    params.set('drinkers', String(form.drinkers));
    params.set('cups', String(form.cups));
    params.set('price', String(form.cupPrice));

    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', next);
  }, [form]);

  const result = useMemo(() => {
    try {
      return calculateFairSplit(form);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: '入力値エラーです。' };
    }
  }, [form]);

  async function onCopyUrl() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function updateField<K extends keyof FormState>(key: K, value: string) {
    const n = Number.parseInt(value, 10);
    setForm((prev) => ({
      ...prev,
      [key]: Number.isNaN(n) ? 0 : n,
    }));
  }

  return (
    <main className="container">
      <h1>🍻 フェア割り勘</h1>
      <p className="lead">飲んだ人だけ追加で払う、1分で終わる割り勘計算。</p>

      <section className="panel">
        <Field label="合計金額 total (円)">
          <input type="number" inputMode="numeric" value={form.total} onChange={(e) => updateField('total', e.target.value)} />
        </Field>

        <Field label="総人数 people">
          <input type="number" inputMode="numeric" value={form.people} onChange={(e) => updateField('people', e.target.value)} />
        </Field>

        <Field label="酔っパライダー drinkers">
          <input type="number" inputMode="numeric" value={form.drinkers} onChange={(e) => updateField('drinkers', e.target.value)} />
        </Field>

        <Field label="杯数 cups per drinker">
          <input type="number" inputMode="numeric" value={form.cups} onChange={(e) => updateField('cups', e.target.value)} />
        </Field>

        <Field label="1杯単価 cup price (円)">
          <input type="number" inputMode="numeric" value={form.cupPrice} onChange={(e) => updateField('cupPrice', e.target.value)} />
        </Field>
      </section>

      <section className="panel resultPanel" aria-live="polite">
        {'error' in result ? (
          <p className="error">⚠️ {result.error}</p>
        ) : (
          <>
            <p className="resultLine">飲んでない人: <strong>{yen(result.nondrinkerPay)}円</strong></p>
            <p className="resultLine">飲んだ人: <strong>{yen(result.drinkerPay)}円</strong></p>
            {result.drinkerPayPlusOneCount > 0 && (
              <p className="subtle">※ 飲んだ人のうち {result.drinkerPayPlusOneCount} 人は +1円（合計調整）</p>
            )}
          </>
        )}
      </section>

      <button className="copyBtn" type="button" onClick={onCopyUrl}>
        共有URLをコピー
      </button>
      {copied && <p className="copied">コピーしました！</p>}
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function yen(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value);
}
