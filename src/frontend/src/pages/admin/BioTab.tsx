import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetBio, useUpdateBio } from "@/hooks/useQueries";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export function BioTab() {
  const { data: bio, isLoading } = useGetBio();
  const updateBio = useUpdateBio();
  const [bioText, setBioText] = useState("");

  useEffect(() => {
    if (bio !== undefined) {
      setBioText(bio);
    }
  }, [bio]);

  const handleSave = async () => {
    try {
      await updateBio.mutateAsync(bioText);
      toast.success("Bio updated successfully");
    } catch {
      toast.error("Failed to update bio");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white">
          About / Bio
        </h2>
        <p className="font-sans text-white/40 text-sm mt-1">
          Edit your public biography text
        </p>
      </div>

      {isLoading ? (
        <div data-ocid="bio.loading_state">
          <Skeleton className="h-64 w-full rounded-none" />
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            data-ocid="bio.textarea"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Write your biography here... Use double line breaks (Enter twice) to create paragraphs."
            className="min-h-64 bg-muted border-white/10 text-white placeholder:text-white/25 font-sans text-sm leading-relaxed resize-y"
          />
          <p className="font-sans text-white/30 text-xs">
            Tip: Use double line breaks between paragraphs
          </p>
          <div className="flex justify-end">
            <Button
              data-ocid="bio.save_button"
              onClick={handleSave}
              disabled={updateBio.isPending}
              className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest px-8"
            >
              {updateBio.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Bio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
