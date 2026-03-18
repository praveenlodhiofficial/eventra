"use client";

import { ReactNode } from "react";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleFadingPlusIcon, Loader2 } from "lucide-react";
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
import {
  createVenueAction,
  updateVenueAction,
} from "@/domains/venue/venue.actions";
import {
  VenueInput,
  VenueSchema,
  VenueSummary,
} from "@/domains/venue/venue.schema";

type VenueForUpdate = VenueSummary;

type Props =
  | {
      type?: "create";
      trigger?: ReactNode;
    }
  | {
      type: "update";
      venue: VenueForUpdate;
      trigger?: ReactNode;
    };

export function VenueModal(props: Props = { type: "create" }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isUpdate = props.type === "update";

  const venue: VenueForUpdate = isUpdate
    ? props.venue
    : {
        id: "",
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      };

  const form = useForm<VenueInput>({
    resolver: zodResolver(VenueSchema),
    defaultValues: {
      name: venue.name,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      country: venue.country,
      pincode: venue.pincode,
      lat: venue.lat ?? undefined,
      lng: venue.lng ?? undefined,
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(data: VenueInput) {
    startTransition(async () => {
      const result = isUpdate
        ? await updateVenueAction(venue.id, data)
        : await createVenueAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {props.trigger ? (
          props.trigger
        ) : isUpdate ? (
          <ActionButton2 type="button" variant="outline" className="w-fit">
            Edit Venue
          </ActionButton2>
        ) : (
          <ActionButton2
            type="button"
            variant="secondary"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <CircleFadingPlusIcon className="size-3.5 group-hover:animate-pulse" />
            <span className="ml-2">Add Venue</span>
          </ActionButton2>
        )}
      </DialogTrigger>

      <DialogContent className="h-full w-full rounded-none md:h-[calc(100vh-7rem)] md:max-w-3xl lg:max-w-5xl lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-4 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="bg-background sticky top-0 flex h-fit items-center justify-center">
              <DialogTitle className="border-primary w-fit border-y-2 px-5 py-1 text-base font-semibold uppercase md:text-lg lg:text-xl">
                {isUpdate ? "Update Venue" : "Add Venue"}
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
                    readOnly: true,
                  },
                  {
                    name: "state",
                    label: "State",
                    placeholder: "Venue State",
                    readOnly: true,
                  },
                  {
                    name: "country",
                    label: "Country",
                    placeholder: "Venue Country",
                    readOnly: true,
                  },
                  {
                    name: "pincode",
                    label: "Pincode",
                    placeholder: "Venue Pincode",
                    readOnly: true,
                  },
                ].map((fieldData) => (
                  <Field key={fieldData.name}>
                    <FieldLabel>
                      {fieldData.label}
                      {"readOnly" in fieldData && fieldData.readOnly
                        ? " (auto)"
                        : ""}
                    </FieldLabel>
                    <FormField
                      control={form.control}
                      name={fieldData.name as keyof VenueInput}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={fieldData.placeholder}
                              className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              readOnly={
                                "readOnly" in fieldData
                                  ? Boolean(fieldData.readOnly)
                                  : false
                              }
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
                    form.setValue("lat", data.lat, { shouldValidate: true });
                    form.setValue("lng", data.lng, { shouldValidate: true });
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
                disabled={isSubmitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-center gap-2">
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isUpdate ? (
                    "Update Venue"
                  ) : (
                    "Add Venue"
                  )}
                </div>
              </ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
