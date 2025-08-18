"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { parseAsBoolean, useQueryStates } from "nuqs";

export function CreateCompanyModal() {
  const [{ addCompany, redirect }, setQueryStates] = useQueryStates({
    addCompany: parseAsBoolean.withDefault(false),
    redirect: parseAsBoolean.withDefault(false),
  });

  return (
    <Dialog
      open={addCompany}
      onOpenChange={(open) => setQueryStates({ addCompany: open, redirect })}
    >
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
