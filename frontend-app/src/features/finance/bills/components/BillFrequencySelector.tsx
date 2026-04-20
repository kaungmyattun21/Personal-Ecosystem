"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { AppSelect, SelectOption } from "@/components/ui/app-select";
import { BillFormValues } from "../billFormSchema";

const FREQUENCY_OPTIONS: SelectOption[] = [
  { id: "ONCE", label: "Once" },
  { id: "WEEKLY", label: "Weekly" },
  { id: "MONTHLY", label: "Monthly" },
  { id: "YEARLY", label: "Yearly" },
];

export function BillFrequencySelector() {
  const { control, setValue } = useFormContext<BillFormValues>();
  const selectedFrequency = useWatch({ control, name: "frequency" });

  return (
    <FormField name="frequency" label="Frequency">
      <AppSelect
        value={selectedFrequency}
        onValueChange={(val) => setValue("frequency", val as any)}
        options={FREQUENCY_OPTIONS}
        placeholder="Frequency"
      />
    </FormField>
  );
}
