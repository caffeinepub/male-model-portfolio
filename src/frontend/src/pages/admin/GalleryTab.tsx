import { ExternalBlob, PhotoCategory } from "@/backend";
import type { Photo } from "@/backend";
import { BlobUpload } from "@/components/blob-storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddPhoto,
  useDeletePhoto,
  useGetAllPhotos,
  useReorderPhotos,
  useUpdatePhoto,
} from "@/hooks/useQueries";
import { ArrowDown, ArrowUp, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<PhotoCategory, string> = {
  [PhotoCategory.editorial]: "Editorial",
  [PhotoCategory.commercial]: "Commercial",
  [PhotoCategory.runway]: "Runway",
  [PhotoCategory.lifestyle]: "Lifestyle",
};

const CATEGORY_COLORS: Record<PhotoCategory, string> = {
  [PhotoCategory.editorial]: "bg-blue-900/40 text-blue-300 border-blue-700/30",
  [PhotoCategory.commercial]:
    "bg-emerald-900/40 text-emerald-300 border-emerald-700/30",
  [PhotoCategory.runway]:
    "bg-purple-900/40 text-purple-300 border-purple-700/30",
  [PhotoCategory.lifestyle]:
    "bg-amber-900/40 text-amber-300 border-amber-700/30",
};

function generateId(): string {
  return `photo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function GalleryTab() {
  const { data: photos, isLoading } = useGetAllPhotos();
  const addPhoto = useAddPhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const reorderPhotos = useReorderPhotos();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  // Add form state
  const [addCaption, setAddCaption] = useState("");
  const [addCategory, setAddCategory] = useState<PhotoCategory>(
    PhotoCategory.editorial,
  );
  const [addFileBytes, setAddFileBytes] =
    useState<Uint8Array<ArrayBuffer> | null>(null);

  // Edit form state
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState<PhotoCategory>(
    PhotoCategory.editorial,
  );

  const handleAdd = async () => {
    if (!addFileBytes) {
      toast.error("Please select an image");
      return;
    }
    if (!addCaption.trim()) {
      toast.error("Please add a caption");
      return;
    }

    const id = generateId();
    const photo: Photo = {
      id,
      blob: ExternalBlob.fromBytes(addFileBytes),
      caption: addCaption,
      category: addCategory,
      displayOrder: BigInt(photos?.length ?? 0),
      createdAt: BigInt(Date.now()),
    };

    try {
      await addPhoto.mutateAsync(photo);
      toast.success("Photo added successfully");
      setAddDialogOpen(false);
      setAddCaption("");
      setAddFileBytes(null);
      setAddCategory(PhotoCategory.editorial);
    } catch {
      toast.error("Failed to add photo");
    }
  };

  const openEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditCaption(photo.caption);
    setEditCategory(photo.category);
    setEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editingPhoto) return;

    try {
      await updatePhoto.mutateAsync({
        ...editingPhoto,
        caption: editCaption,
        category: editCategory,
      });
      toast.success("Photo updated");
      setEditDialogOpen(false);
      setEditingPhoto(null);
    } catch {
      toast.error("Failed to update photo");
    }
  };

  const handleDelete = async () => {
    if (!deletingPhotoId) return;
    try {
      await deletePhoto.mutateAsync(deletingPhotoId);
      toast.success("Photo deleted");
      setDeleteDialogOpen(false);
      setDeletingPhotoId(null);
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (!photos || index === 0) return;
    const ids = photos.map((p) => p.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    try {
      await reorderPhotos.mutateAsync(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (!photos || index === photos.length - 1) return;
    const ids = photos.map((p) => p.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    try {
      await reorderPhotos.mutateAsync(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Failed to reorder");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Gallery
          </h2>
          <p className="font-sans text-white/40 text-sm mt-1">
            {photos?.length ?? 0} photos
          </p>
        </div>
        <Button
          data-ocid="gallery.add_button"
          onClick={() => setAddDialogOpen(true)}
          className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {/* Photo list */}
      {isLoading ? (
        <div
          data-ocid="gallery.loading_state"
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
            <Skeleton key={i} className="h-40 rounded-none" />
          ))}
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              data-ocid={`gallery.item.${index + 1}`}
              className="relative border border-white/8 overflow-hidden group"
              style={{ background: "oklch(0.12 0 0)" }}
            >
              <img
                src={photo.blob.getDirectURL()}
                alt={photo.caption}
                className="w-full h-40 object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  data-ocid={`gallery.edit_button.${index + 1}`}
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(photo)}
                  className="border-white/20 text-white hover:bg-white/10 font-sans text-xs"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  data-ocid={`gallery.delete_button.${index + 1}`}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDeletingPhotoId(photo.id);
                    setDeleteDialogOpen(true);
                  }}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 font-sans text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>

              <div className="p-3">
                <p className="font-sans text-white/80 text-sm truncate">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 border font-sans ${CATEGORY_COLORS[photo.category]}`}
                  >
                    {CATEGORY_LABELS[photo.category]}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || reorderPhotos.isPending}
                      className="text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors p-1"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={
                        index === (photos?.length ?? 0) - 1 ||
                        reorderPhotos.isPending
                      }
                      className="text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors p-1"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          data-ocid="gallery.empty_state"
          className="border border-dashed border-white/10 p-16 text-center"
        >
          <p className="font-sans text-white/30 text-sm">
            No photos yet. Add your first photo to get started.
          </p>
        </div>
      )}

      {/* Add Photo Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              Add Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <BlobUpload
              onUpload={(bytes) => setAddFileBytes(bytes)}
              accept="image/*"
              label="Upload Photo"
              isUploading={addPhoto.isPending}
            />
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
                Caption
              </Label>
              <Input
                data-ocid="gallery.input"
                value={addCaption}
                onChange={(e) => setAddCaption(e.target.value)}
                placeholder="Photo caption..."
                className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
                Category
              </Label>
              <Select
                value={addCategory}
                onValueChange={(v) => setAddCategory(v as PhotoCategory)}
              >
                <SelectTrigger
                  data-ocid="gallery.select"
                  className="bg-muted border-white/10 text-white font-sans"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/10">
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-white font-sans"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="gallery.cancel_button"
              onClick={() => setAddDialogOpen(false)}
              className="border-white/10 text-white/60 hover:text-white font-sans text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              data-ocid="gallery.submit_button"
              onClick={handleAdd}
              disabled={addPhoto.isPending || !addFileBytes}
              className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest"
            >
              {addPhoto.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Add Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Photo Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white">
              Edit Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
                Caption
              </Label>
              <Input
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Photo caption..."
                className="bg-muted border-white/10 text-white placeholder:text-white/25 font-sans"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-widest font-sans mb-2 block">
                Category
              </Label>
              <Select
                value={editCategory}
                onValueChange={(v) => setEditCategory(v as PhotoCategory)}
              >
                <SelectTrigger className="bg-muted border-white/10 text-white font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/10">
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-white font-sans"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="gallery.cancel_button"
              onClick={() => setEditDialogOpen(false)}
              className="border-white/10 text-white/60 hover:text-white font-sans text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              data-ocid="gallery.save_button"
              onClick={handleEdit}
              disabled={updatePhoto.isPending}
              className="bg-gold hover:bg-gold/90 text-black font-sans text-xs uppercase tracking-widest"
            >
              {updatePhoto.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-white/10 bg-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl text-white">
              Delete Photo
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-white/50">
              This action cannot be undone. The photo will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="gallery.cancel_button"
              className="border-white/10 text-white/60 hover:text-white font-sans text-xs uppercase tracking-widest"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="gallery.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white font-sans text-xs uppercase tracking-widest"
            >
              {deletePhoto.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
