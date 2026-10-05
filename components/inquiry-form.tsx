"use client";

import { useEffect, useRef, useState } from "react";
import { countries, countryByIso, detectCountryIso, flagEmoji } from "@/lib/countries";
import { projectTypeOptions, timelineOptions, validateInquiry } from "@/lib/inquiry";
import { Spark } from "@/components/art";
import { Sticker } from "@/components/sticker";

type Status = "idle" | "sending" | "sent" | "error";

const initial = {
  name: "",
  email: "",
  phone: "",
  projectType: "restaurant",
  projectName: "",
  timeline: "this-season",
  message: "",
  website: "",
};

export function InquiryForm({ direction }: { direction?: string }) {
  const [fields, setFields] = useState({
    ...initial,
    projectType: direction ? "portfolio" : initial.projectType,
  });
  const [countryIso, setCountryIso] = useState("US");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [devNote, setDevNote] = useState(false);

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCountryIso(detectCountryIso(zone, navigator.language));
  }, []);

  function update(key: keyof typeof initial, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function onPhoneChange(value: string) {
    const dialDigits = countryByIso(countryIso).dial.replace(/\D/g, "");
    if (value.trim().startsWith("+")) {
      const digits = value.replace(/\D/g, "");
      update("phone", digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits);
      return;
    }
    update("phone", value.replace(/[^\d\s().-]/g, ""));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const localPhone = fields.phone.trim();
    const phone = localPhone ? `${countryByIso(countryIso).dial} ${localPhone}` : "";
    const message =
      direction && !fields.message.includes(direction)
        ? `Portfolio direction: ${direction}\n\n${fields.message}`
        : fields.message;
    const parsed = validateInquiry({ ...fields, phone, message });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("sending");
    const started = Date.now();

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          phone,
          message:
            direction && !fields.message.includes(direction)
              ? `Portfolio direction: ${direction}\n\n${fields.message}`
              : fields.message,
        }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        dev?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };
      if (!response.ok || !body.ok) {
        setErrors(body.errors ?? {});
        setFormError(body.error || "We could not send that. Try again in a moment.");
        setStatus("error");
        return;
      }
      setDevNote(Boolean(body.dev));
      const wait = Math.max(0, 900 - (Date.now() - started));
      await new Promise((resolve) => setTimeout(resolve, wait));
      setStatus("sent");
    } catch {
      setFormError("The network dropped. Try again in a moment.");
      setStatus("error");
    }
  }

  if (status === "sending" || status === "sent") {
    return (
      <div className={`send-stage is-${status}`} role="status" aria-live="polite" tabIndex={-1}>
        <Spark className="send-star send-star-a" color="#ff3d92" />
        <Spark className="send-star send-star-b" color="#fff200" />
        <Spark className="send-star send-star-c" color="#7fd4ff" />
        <Spark className="send-star send-star-d" color="#c77dff" />
        {status === "sending" ? (
          <div className="send-loader">
            <span className="send-orbit" aria-hidden="true">
              <Spark className="send-orbit-star" color="#fff200" />
            </span>
            <p>sending the brief</p>
          </div>
        ) : (
          <div className="send-done">
            <p className="send-pill">sent</p>
            <Sticker as="h2" text={"you're\nin"} />
            <p>We read every note and reply within two weekdays.</p>
            {devNote ? (
              <p className="dev-note">
                Developer note: Supabase keys are not set, so this inquiry was not stored. Add them to .env.local and
                send it again.
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="inquiry" onSubmit={onSubmit} noValidate>
      {direction ? <p className="direction-chip">Direction · {direction}</p> : null}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={fields.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </label>
      </div>

      <Field label="Name" error={errors.name} htmlFor="name">
        <input
          id="name"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>
      <Field label="Email" error={errors.email} htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>
      <div className="field-row">
        <div className="field">
          <span id="phone-label">Phone, if you like</span>
          <div className="phone-field">
            <CountrySelect value={countryIso} onChange={setCountryIso} />
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Phone number"
              aria-labelledby="phone-label"
              value={fields.phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
          </div>
          {errors.phone ? <small role="alert">{errors.phone}</small> : null}
        </div>
        <Field label="Project" error={errors.projectType} htmlFor="projectType">
          <select
            id="projectType"
            name="projectType"
            value={fields.projectType}
            onChange={(event) => update("projectType", event.target.value)}
          >
            {projectTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="field-row">
        <Field label="Restaurant or project name" error={errors.projectName} htmlFor="projectName">
          <input
            id="projectName"
            name="projectName"
            value={fields.projectName}
            onChange={(event) => update("projectName", event.target.value)}
          />
        </Field>
        <Field label="Timing" error={errors.timeline} htmlFor="timeline">
          <select id="timeline" name="timeline" value={fields.timeline} onChange={(event) => update("timeline", event.target.value)}>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="What should the link do?" error={errors.message} htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          value={fields.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
      </Field>
      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}
      <button className="btn" type="submit">
        send the brief
      </button>
    </form>
  );
}

function CountrySelect({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = countryByIso(value);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={`country-pick ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code, ${selected.name} ${selected.dial}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">{flagEmoji(selected.iso)}</span>
        {selected.dial}
      </button>
      {open ? (
        <ul role="listbox" aria-label="Country code">
          {countries.map((country) => (
            <li key={country.iso}>
              <button
                type="button"
                role="option"
                aria-selected={country.iso === value}
                onClick={() => {
                  onChange(country.iso);
                  setOpen(false);
                }}
              >
                <span aria-hidden="true">{flagEmoji(country.iso)}</span>
                {country.name}
                <em>{country.dial}</em>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {error ? <small role="alert">{error}</small> : null}
    </label>
  );
}
