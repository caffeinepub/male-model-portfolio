import type { ModelStats } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetModelStats, useUpdateModelStats } from "@/hooks/useQueries";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_STATS: ModelStats = {
  height: 188,
  chest: 38,
  waist: 31,
  hips: 36,
  shoes: 11,
  agencyName: "Elite Model Management",
  agencyUrl: "https://elitemodel.com",
  experience: 7n,
};

interface FieldConfig {
  key: keyof ModelStats;
  label: string;
  placeholder: string;
  type: "number" | "text" | "url";
  hint?: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: "height",
    label: "Height (cm)",
    placeholder: "188",
    type: "number",
    hint: "In centimeters",
  },
  {
    key: "chest",
    label: "Chest (in)",
    placeholder: "38",
    type: "number",
    hint: "In inches",
  },
  {
    key: "waist",
    label: "Waist (in)",
    placeholder: "31",
    type: "number",
    hint: "In inches",
  },
  {
    key: "hips",
    label: "Hips (in)",
    placeholder: "36",
    type: "number",
    hint: "In inches",
  },
  {
    key: "shoes",
    label: "Shoe Size (US)",
    placeholder: "11",
    type: "number",
    hint: "US shoe size",
  },
  {
    key: "experience",
    label: "Years of Experience",
    placeholder: "7",
    type: "number",
    hint: "Years in the industry",
  },
  {
    key: "agencyName",
    label: "Agency Name",
    placeholder: "Elite Model Management",
    type: "text",
  },
  {
    key: "agencyUrl",
    label: "Agency URL",
    placeholder: "https://elitemodel.com",
    type: "url",
  },
];

export function StatsTab() {
  const { data: stats, isLoading } = useGetModelStats();
  const updateStats = useUpdateModelStats();

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const source = stats || DEFAULT_STATS;
    setFormValues({
      height: String(source.height),
      chest: String(source.chest),
      waist: String(source.waist),
      hips: String(source.hips),
      shoes: String(source.shoes),
      experience: String(source.experience),
      agencyName: source.agencyName,
      agencyUrl: source.agencyUrl,
    });
  }, [stats]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const newStats: ModelStats = {
      height: Number(formValues.height) || 0,
      chest: Number(formValues.chest) || 0,
      waist: Number(formValues.waist) || 0,
      hips: Number(formValues.hips) || 0,
      shoes: Number(formValues.shoes) || 0,
      experience: BigInt(Math.floor(Number(formValues.experience) || 0)),
      agencyName: formValues.agencyName || "",
      agencyUrl: formValues.agencyUrl || "",
    };

    try {
      await updateStats.mutateAsync(newStats);
      toast.success("Stats updated successfully");
    } catch {
      toast.error("Failed to update stats");
    }
  };

  if (isLoading) {
    return (
      <div data-ocid="stats.loading_state" className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-none" />
        {[...Array(4)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
          <Skeleton key={i} className="h-12 w-full rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white">Stats</h2>
        <p className="font-sans text-white/40 text-sm mt-1">
          Update model measurements and agency information
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FIELDS.map(({ key, label, placeholder, type, hint }) => (
          <div key={key}>
            <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
              {label}
            </Label>
            <Input
              type={type}
              value={formValues[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              min={type === "number" ? 0 : undefined}
              className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
            />
            {hint && (
              <p className="font-sans text-white/25 text-xs mt-1">{hint}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          data-ocid="stats.save_button"
          onClick={handleSave}
          disabled={updateStats.isPending}
          className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest px-8"
        >
          {updateStats.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Stats
        </Button>
      </div>
    </div>
  );
}
