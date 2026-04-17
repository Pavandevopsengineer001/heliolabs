"use client";

import type { ReactNode } from "react";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Tell us your name."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(3, "Add a clear subject."),
  message: z.string().min(20, "Add a little more detail."),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          try {
            const response = await submitContactForm(values);
            setStatus(response.message);
            form.reset();
          } catch (error) {
            setStatus(error instanceof Error ? error.message : "Unable to send your message.");
          }
        })
      )}
      className="grid gap-5 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <input {...form.register("name")} className="input" />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input type="email" {...form.register("email")} className="input" />
        </Field>
      </div>
      <Field label="Subject" error={form.formState.errors.subject?.message}>
        <input {...form.register("subject")} className="input" />
      </Field>
      <Field label="Message" error={form.formState.errors.message?.message}>
        <textarea {...form.register("message")} rows={6} className="input min-h-40 resize-none" />
      </Field>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Button type="submit">Send Message</Button>
        {status ? <p className="text-sm text-smoke">{status}</p> : null}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-ember">{error}</span> : null}
    </label>
  );
}
