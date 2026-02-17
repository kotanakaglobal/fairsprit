'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { calculateFairSplit } from '@/lib/calc';

type FormTextState = {
  total: string;
  people: string;
  drinkers: string;
  cups: string;
  cupPrice: string;
};

type FormState = {
  total: number;
  people: number;
  drinkers: number;
  cups: number;
  cupPrice: number;
};

const defaultsNum: FormState = {
  total: 30000,
  people: 6,
  drinkers: 3,
  cups: 6,
  cupPrice: 500,
};

const defaultsText: FormTextState = {
  total: String(defaultsNum.total),
  people: String(defaultsNum.people),
  drinkers: String(defaultsNum.drinkers),
  cups: String(defaultsNum.cups),
  cupPrice: String(defaultsNum.cupPrice),
};

// 0埋め/変な文字を避けるため、入力は「文字列」で持つ。
// ただし digits 以外は除去（貼り付け対策）。
function sanitizeDigits(value: string): string {
  return value.replace(/[^\d]/g, '');
}

function parseIntOrZero(value: string): number {
  if (!value) return 0;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function HomePage() {
  const [formText, setFormText] = useState<FormTextState>(defaultsText);
  const [copied, setCopied] = useState(false);

  // URL -> state 復元
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const next: FormTextState = {
      total: sanitizeDigits(params.get('total') ?? defaultsText.total),
      people: sanitizeDigits(params.get('people') ?? defaultsText.people),
      drinkers: sanitizeDigits(params.get('drinkers') ?? defaultsText.drinkers),
      cups: sanitizeDigits(params.get('cups') ?? defaultsText.cups),
      cupPrice: sanitizeDigits(params.get('price') ?? defaultsText.cupPrice),
    };

    setFormText(next);
  }, []);

  // state -> URL 反映（空ならクエリから消す）
  useEffect(() => {
    const params = new URLSearchParams();

    const setOrDelete = (key: string, value: string) => {
      if (value === '') params.delete(key);
      else params.set(key, value);
    };

    setOrDelete('total', formText.total);
    setOrDelete('people', formText.people);
    setOrDelete('drinkers', formText.drinkers);
    setOrDelete('cups', formText.cups);
    setOrDelete('price', formText.cupPrice);

    const query = params.toString();
    const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, '', next);
  }, [formText]);

  // 計算用に number 化（計算ロジックは number 前提のまま）
  const formNum: FormState = useMemo(
    () => ({
      total: parseIntOrZero(formText.total),
      people: parseIntOrZero(formText.people),
      drinkers: parseIntOrZero(formText.drinkers),
      cups: parseIntOrZero(formText.cups),
      cupPrice: parseIntOrZero(formText.cupPrice),
    }),
    [formText]
  );

  const result = useMemo(() => {
    try {
      return calculateFairSplit(formNum);
    } catch (error) {
      if (error instanceof Error) return { error: error.message };
      return { error: '入力値エラーです。' };
    }
  }, [formNum]);

  async function onCopyUrl() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function updateField<K extends keyof FormTextState>(key: K, value: string) {
    const sanitized = sanitizeDigits(value);
    setFormText((prev) => ({ ...prev, [key]: sanitized }));
  }

  return (
    <main className="container">
      <h1>🍻 フェア割り勘</h1>
      <p className="lead">飲んだ人だけ追加で払う、1分で終わる割り勘計算。</p>

      <section className="panel">
        <Field label="合計金額 total (円)">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formText.total}
            onChange={(e) => updateField('total', e.target.value)}
            placeholder="例: 30000"
          />
        </Field>

        <Field label="総人数 people">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formText.people}
            onChange={(e) => updateField('people', e.target.value)}
            placeholder="例: 6"
          />
        </Field>

        <Field label="酔っパライダー drinkers">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formText.drinkers}
            onChange={(e) => updateField('drinkers', e.target.value)}
            placeholder="例: 3"
          />
        </Field>

        <Field label="杯数 cups per drinker">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formText.cups}
            onChange={(e) => updateField('cups', e.target.value)}
            placeholder="例: 2"
          />
        </Field>

        <Field label="1杯単価 cup price (円)">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formText.cupPrice}
            onChange={(e) => updateField('cupPrice', e.target.value)}
            placeholder="例: 500"
          />
        </Field>
      </section>

      <section className="panel resultPanel" aria-live="polite">
        {'error' in result ? (
          <p className="error">⚠️ {result.error}</p>
        ) : (
          <>
            <p className="resultLine">
              飲んでない人: <strong>{yen(result.nondrinkerPay)}円</strong>
            </p>
            <p className="resultLine">
              飲んだ人: <strong>{yen(result.drinkerPay)}円</strong>
            </p>
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
