import type { ContactInfo } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetContactInfo, useUpdateContactInfo } from "@/hooks/useQueries";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_CONTACT: ContactInfo = {
  email: "booking@alexandercross.com",
  phone: "+1 (212) 555-0178",
  instagram: "@alexandercross",
  location: "New York · Paris · Milan",
};

export function ContactTab() {
  const { data: contact, isLoading } = useGetContactInfo();
  const updateContact = useUpdateContactInfo();

  const [formValues, setFormValues] = useState<ContactInfo>(DEFAULT_CONTACT);

  useEffect(() => {
    if (contact) {
      setFormValues(contact);
    }
  }, [contact]);

  const handleChange = (key: keyof ContactInfo, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateContact.mutateAsync(formValues);
      toast.success("Contact info updated");
    } catch {
      toast.error("Failed to update contact info");
    }
  };

  if (isLoading) {
    return (
      <div data-ocid="contact.loading_state" className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-none" />
        {[...Array(4)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
          <Skeleton key={i} className="h-12 w-full rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white">Contact</h2>
        <p className="font-sans text-white/40 text-sm mt-1">
          Update public contact information
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
            Email
          </Label>
          <Input
            data-ocid="contact.input"
            type="email"
            value={formValues.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="booking@yourname.com"
            className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
          />
        </div>

        <div>
          <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
            Phone
          </Label>
          <Input
            type="tel"
            value={formValues.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (212) 555-0000"
            className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
          />
        </div>

        <div>
          <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
            Instagram Handle
          </Label>
          <Input
            value={formValues.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
            placeholder="@yourhandle"
            className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
          />
          <p className="font-sans text-white/25 text-xs mt-1">
            Include the @ symbol
          </p>
        </div>

        <div>
          <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
            Location
          </Label>
          <Input
            value={formValues.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="New York · Paris · Milan"
            className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
          />
          <p className="font-sans text-white/25 text-xs mt-1">
            Use · (middle dot) to separate multiple cities
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          data-ocid="contact.save_button"
          onClick={handleSave}
          disabled={updateContact.isPending}
          className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest px-8"
        >
          {updateContact.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Contact
        </Button>
      </div>
    </div>
  );
}
