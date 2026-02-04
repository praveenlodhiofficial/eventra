"use client";

import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CoverImageUpload } from "@/components/upload/CoverImageUpload";
import { AddPerformerAction } from "@/domains/performer/performer.actions";
import {
  PerformerInput,
  PerformerSchema,
} from "@/domains/performer/performer.schema";

export function AddPerformerModal() {
  const router = useRouter();

  const form = useForm<PerformerInput>({
    resolver: zodResolver(PerformerSchema),
    defaultValues: {
      name: "",
      image: "",
      bio: "",
    },
  });

  function onSubmit(data: PerformerInput) {
    startTransition(async () => {
      const result = await AddPerformerAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/performers");
      form.reset();
    });
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Performer</Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100vh-10rem)] md:max-w-3xl lg:max-w-5xl lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="flex h-fit items-center justify-center">
              <DialogTitle className="border-primary w-fit border-y-2 px-5 py-1 text-center text-xl font-semibold uppercase">
                Add Performer
              </DialogTitle>
              <DialogDescription className="sr-only">
                Add a new performer to the platform by providing the required
                information.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="grid border-5 border-red-500 md:grid-cols-[2fr_1fr]">
              <FieldGroup>
                {/* ================================== Name Input ================================== */}
                <Field>
                  <FieldLabel>Performer Name</FieldLabel>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Performer Name"
                            className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ================================== Bio Input ================================== */}
                <Field>
                  <FieldLabel>Performer Bio</FieldLabel>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            placeholder="Performer Bio"
                            rows={5}
                            aria-multiline="true"
                            className="rounded-lg border border-zinc-200 bg-white/10 p-3 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                {/* ================================== Performer Image Upload ================================== */}
                <Field>
                  <FieldLabel>Performer Image</FieldLabel>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CoverImageUpload
                            folder="eventra/performers"
                            onUploaded={(url) => field.onChange(url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>

            <DialogFooter className="grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline">Cancel</ActionButton2>
              </DialogClose>
              <ActionButton2 type="submit">Add Performer</ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
