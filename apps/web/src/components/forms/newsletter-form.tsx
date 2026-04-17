"use client";

import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          try {
            const response = await subscribeToNewsletter(values.email);
            setStatus(response.message);
            form.reset();
          } catch (error) {
            setStatus(error instanceof Error ? error.message : "Something went wrong.");
          }
        })
      )}
      className="flex flex-col gap-4 md:flex-row"
    >
      <div className="flex-1">
        <input
          type="email"
          placeholder="Enter your email"
          {...form.register("email")}
          className="w-full rounded-full border border-black/10 bg-white px-5 py-4 text-sm text-ink outline-none transition focus:border-ember"
        />
        {form.formState.errors.email ? (
          <p className="mt-2 text-sm text-ember">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="min-w-44">
        Join the Newsletter
      </Button>
      {status ? <p className="text-sm text-smoke md:self-center">{status}</p> : null}
    </form>
  );
}

