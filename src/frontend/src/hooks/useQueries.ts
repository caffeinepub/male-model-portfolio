import type { ContactInfo, ModelStats, Photo } from "@/backend";
import { PhotoCategory } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ─── Public Queries ───────────────────────────────────────────────────────────

export function useGetAllPhotos() {
  const { actor, isFetching } = useActor();
  return useQuery<Photo[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllPhotos();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPhotosByCategory(category: PhotoCategory) {
  const { actor, isFetching } = useActor();
  return useQuery<Photo[]>({
    queryKey: ["photos", category],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPhotosByCategory(category);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBio() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["bio"],
    queryFn: async () => {
      if (!actor) return "";
      try {
        return await actor.getBio();
      } catch {
        return "";
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetModelStats() {
  const { actor, isFetching } = useActor();
  return useQuery<ModelStats | null>({
    queryKey: ["modelStats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getModelStats();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInfo | null>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getContactInfo();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSectionOrder() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["sectionOrder"],
    queryFn: async () => {
      if (!actor) return ["hero", "about", "portfolio", "stats", "contact"];
      try {
        const order = await actor.getSectionOrder();
        return order.length > 0
          ? order
          : ["hero", "about", "portfolio", "stats", "contact"];
      } catch {
        return ["hero", "about", "portfolio", "stats", "contact"];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin Mutations ──────────────────────────────────────────────────────────

export function useAddPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photo: Photo) => {
      if (!actor) throw new Error("Not connected");
      await actor.addPhoto(photo);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useUpdatePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photo: Photo) => {
      if (!actor) throw new Error("Not connected");
      await actor.updatePhoto(photo);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deletePhoto(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useReorderPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!actor) throw new Error("Not connected");
      await actor.reorderPhotos(newOrder);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useUpdateBio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bio: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateBio(bio);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bio"] });
    },
  });
}

export function useUpdateModelStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stats: ModelStats) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateModelStats(stats);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["modelStats"] });
    },
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contact: ContactInfo) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateContactInfo(contact);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
    },
  });
}

export function useUpdateSectionOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateSectionOrder(newOrder);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sectionOrder"] });
    },
  });
}

export { PhotoCategory };
