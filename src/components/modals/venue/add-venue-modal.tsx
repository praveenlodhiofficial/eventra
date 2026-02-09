"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleFadingPlusIcon } from "lucide-react";
import { toast } from "sonner";

import { MapBox } from "@/components/MapBox";
import { ActionButton2 } from "@/components/ui/action-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { createVenueAction } from "@/domains/venue/venue.actions";
import { VenueInput, VenueSchema } from "@/domains/venue/venue.schema";

export function AddVenueModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<VenueInput>({
    resolver: zodResolver(VenueSchema),
    defaultValues: {
      name: "Jio World Plaza",
      address: "Jio World Plaza, Bandra Kurla Complex, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400051",
    },
  });

  function onSubmit(data: VenueInput) {
    startTransition(async () => {
      const result = await createVenueAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      setIsOpen(false);
    });
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ActionButton2
          variant="secondary"
          className="flex w-fit cursor-pointer items-center gap-2"
        >
          <CircleFadingPlusIcon className="size-3.5 group-hover:animate-pulse" />
          <span className="ml-2">Add Venue</span>
        </ActionButton2>
      </DialogTrigger>

      <DialogContent className="h-full w-full rounded-none md:h-[calc(100vh-7rem)] md:max-w-3xl lg:max-w-5xl lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-4 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="bg-background sticky top-0 flex h-fit items-center justify-center">
              <DialogTitle className="border-primary w-fit border-y-2 px-5 py-1 text-base font-semibold uppercase md:text-lg lg:text-xl">
                Add Venue
              </DialogTitle>
            </DialogHeader>

            <FieldGroup className="grid md:grid-cols-2">
              {/* ================= Left: Form Fields ================= */}
              <FieldGroup>
                {[
                  {
                    name: "name",
                    label: "Name",
                    placeholder: "Venue Name",
                  },
                  {
                    name: "address",
                    label: "Address",
                    placeholder: "Venue Address",
                  },
                  {
                    name: "city",
                    label: "City",
                    placeholder: "Venue City",
                  },
                  {
                    name: "state",
                    label: "State",
                    placeholder: "Venue State",
                  },
                  {
                    name: "country",
                    label: "Country",
                    placeholder: "Venue Country",
                  },
                  {
                    name: "pincode",
                    label: "Pincode",
                    placeholder: "Venue Pincode",
                  },
                ].map((fieldData) => (
                  <Field key={fieldData.name}>
                    <FieldLabel>{fieldData.label}</FieldLabel>
                    <FormField
                      control={form.control}
                      name={fieldData.name as keyof VenueInput}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={fieldData.placeholder}
                              className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>
                ))}
              </FieldGroup>

              {/* ================= Right: Map Picker ================= */}
              <div className="!mapboxgl-map order-first h-[400px] w-full md:order-last md:h-full">
                <MapBox
                  className="flex h-full w-full rounded-xl"
                  onLocationSelect={(data) => {
                    form.setValue("address", data.address, {
                      shouldValidate: true,
                    });
                    form.setValue("city", data.city, { shouldValidate: true });
                    form.setValue("state", data.state, {
                      shouldValidate: true,
                    });
                    form.setValue("country", data.country, {
                      shouldValidate: true,
                    });
                    form.setValue("pincode", data.pincode, {
                      shouldValidate: true,
                    });
                  }}
                />
              </div>
            </FieldGroup>

            <DialogFooter className="bg-background sticky bottom-0 grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline" className="w-full">
                  Cancel
                </ActionButton2>
              </DialogClose>
              <ActionButton2
                type="submit"
                className="w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                Save changes
              </ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
