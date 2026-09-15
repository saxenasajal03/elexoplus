import React from 'react';
import { AlertCircle } from 'lucide-react';

const baseClass = (hasError) =>
  `w-full bg-zinc-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
    hasError
      ? 'border-rose-500/60 focus:ring-rose-500/40'
      : 'border-zinc-800 focus:ring-amber-400 focus:border-amber-400/50'
  }`;

function FieldWrapper({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="min-w-0">
      {label && (
        <label htmlFor={htmlFor} className="block text-xs font-bold text-zinc-400 mb-1.5">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-rose-400 text-[11px] mt-1.5 flex items-start gap-1">
          <AlertCircle size={11} className="shrink-0 mt-0.5" /> {error}
        </p>
      ) : hint ? (
        <p className="text-zinc-600 text-[11px] mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({ id, label, error, hint, required, icon: Icon, className = '', ...props }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${baseClass(!!error)} ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </FieldWrapper>
  );
}

export function TextAreaField({ id, label, error, hint, required, rows = 4, className = '', ...props }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={!!error}
        className={`${baseClass(!!error)} resize-y ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
}

export function SelectField({ id, label, error, hint, required, options = [], className = '', ...props }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select id={id} aria-invalid={!!error} className={`${baseClass(!!error)} ${className}`} {...props}>
        {options.map((opt) =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
    </FieldWrapper>
  );
}
