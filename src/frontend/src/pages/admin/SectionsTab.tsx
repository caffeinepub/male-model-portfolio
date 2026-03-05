import { Button } from "@/components/ui/button";
import { useGetSectionOrder, useUpdateSectionOrder } from "@/hooks/useQueries";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero / Landing",
  about: "About / Bio",
  portfolio: "Portfolio Gallery",
  stats: "Model Statistics",
  contact: "Contact",
};

const DEFAULT_SECTIONS = ["hero", "about", "portfolio", "stats", "contact"];

export function SectionsTab() {
  const { data: sectionOrder } = useGetSectionOrder();
  const updateSectionOrder = useUpdateSectionOrder();

  const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    if (sectionOrder && sectionOrder.length > 0) {
      setSections(sectionOrder);
    }
  }, [sectionOrder]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updateSectionOrder.mutateAsync(sections);
      toast.success("Section order updated");
    } catch {
      toast.error("Failed to update section order");
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white">Sections</h2>
        <p className="font-sans text-white/40 text-sm mt-1">
          Reorder portfolio sections
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section}
            data-ocid={`sections.item.${index + 1}`}
            className="flex items-center justify-between p-4 border border-white/8 transition-colors"
            style={{ background: "oklch(0.12 0 0)" }}
          >
            <div className="flex items-center gap-3">
              <span className="font-sans text-white/20 text-xs w-5 tabular-nums">
                {index + 1}
              </span>
              <div>
                <p className="font-sans text-white/80 text-sm font-medium">
                  {SECTION_LABELS[section] || section}
                </p>
                <p className="font-sans text-white/30 text-xs">{section}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                aria-label="Move section up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === sections.length - 1}
                className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                aria-label="Move section down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          data-ocid="sections.save_button"
          onClick={handleSave}
          disabled={updateSectionOrder.isPending}
          className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest px-8"
        >
          {updateSectionOrder.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Order
        </Button>
      </div>
    </div>
  );
}
