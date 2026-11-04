"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import type { ContactFormTexts } from "@/types";

// Mirrors the schema in /api/contact; the server validates again.
const schema = z.object({
  name: z.string().trim().min(2, "Adınızı ve soyadınızı yazın."),
  email: z.string().trim().email("Geçerli bir e-posta adresi yazın."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().trim().min(10, "Mesajınız en az 10 karakter olmalı."),
  consent: z.literal(true, { error: "Devam etmek için onay vermeniz gerekiyor." }),
});

type Field = keyof z.infer<typeof schema>;
type FieldErrors = Partial<Record<Field, string[]>>;
type Status = "idle" | "loading" | "success" | "error";

const FIELD_ORDER: Field[] = ["name", "email", "phone", "subject", "message", "consent"];
const EMPTY = { name: "", email: "", phone: "", subject: "", message: "", consent: false };

export function ContactForm({ texts }: { texts: ContactFormTexts }) {
  const t = texts;
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState(EMPTY);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const next = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setValues((v) => ({ ...v, [name]: next }));
    if (errors[name as Field]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]?.length);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const result = schema.safeParse(values);
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors as FieldErrors;
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    setErrors({});
    setStatus("loading");
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, honeypot }),
      });
      if (res.ok) {
        setStatus("success");
        setValues(EMPTY);
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      const data: { error?: string | FieldErrors } = await res.json().catch(() => ({}));
      if (data.error && typeof data.error === "object") {
        setErrors(data.error);
        focusFirstError(data.error);
      } else if (res.status === 429 && typeof data.error === "string") {
        setServerError(data.error);
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="cf-done" ref={successRef} tabIndex={-1} role="status">
        <h2>{t.successTitle}</h2>
        <p>{t.successMessage}</p>
        <button type="button" className="btn btn-paper" onClick={() => setStatus("idle")}>
          {t.resetLabel}
        </button>
      </div>
    );
  }

  const err = (f: Field) => errors[f]?.[0];
  const describe = (f: Field) => (err(f) ? `cf-${f}-err` : undefined);
  const loading = status === "loading";

  return (
    <form ref={formRef} className="cf" onSubmit={onSubmit} noValidate aria-labelledby={t.formTitle ? "cfH" : undefined}>
      {t.formTitle && <h2 id="cfH">{t.formTitle}</h2>}
      {t.formText && <p className="cf-lede">{t.formText}</p>}

      {/* honeypot: hidden from people and assistive tech, bots fill it */}
      <div className="sr" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="cf-name">{t.nameLabel}</label>
          <input id="cf-name" name="name" autoComplete="name" required value={values.name} onChange={onChange} aria-invalid={!!err("name")} aria-describedby={describe("name")} />
          {err("name") && <p className="cf-err" id="cf-name-err">{err("name")}</p>}
        </div>
        <div className="field">
          <label htmlFor="cf-email">{t.emailFieldLabel}</label>
          <input id="cf-email" name="email" type="email" inputMode="email" autoComplete="email" required value={values.email} onChange={onChange} aria-invalid={!!err("email")} aria-describedby={describe("email")} />
          {err("email") && <p className="cf-err" id="cf-email-err">{err("email")}</p>}
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="cf-phone">
            {t.phoneFieldLabel} <span className="cf-opt">({t.optionalLabel})</span>
          </label>
          <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={onChange} />
        </div>
        <div className="field">
          <label htmlFor="cf-subject">
            {t.subjectLabel} <span className="cf-opt">({t.optionalLabel})</span>
          </label>
          <input id="cf-subject" name="subject" autoComplete="organization" value={values.subject} onChange={onChange} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-message">{t.messageLabel}</label>
        <textarea id="cf-message" name="message" rows={6} required placeholder={t.messagePlaceholder} value={values.message} onChange={onChange} aria-invalid={!!err("message")} aria-describedby={describe("message")} />
        {err("message") && <p className="cf-err" id="cf-message-err">{err("message")}</p>}
      </div>

      <div className="cf-consent">
        <input id="cf-consent" name="consent" type="checkbox" required checked={values.consent} onChange={onChange} aria-invalid={!!err("consent")} aria-describedby={describe("consent")} />
        <label htmlFor="cf-consent">
          {t.consentHref && t.consentLinkLabel && (
            <Link href={t.consentHref} target="_blank">
              {t.consentLinkLabel}
            </Link>
          )}{" "}
          {t.consentText}
        </label>
        {err("consent") && <p className="cf-err" id="cf-consent-err">{err("consent")}</p>}
      </div>

      <div className="cf-foot">
        <button type="submit" className="btn cf-submit" disabled={loading} aria-busy={loading}>
          {loading && <span className="cf-spin" aria-hidden="true" />}
          {loading ? t.sendingLabel : t.submitLabel}
        </button>
        <p className="cf-status" role="alert">
          {status === "error" && (serverError ?? t.errorMessage)}
        </p>
      </div>
    </form>
  );
}
