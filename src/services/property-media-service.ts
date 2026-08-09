import { supabase } from "../lib/supabase";
import { authenticatedFetch } from "./backend-api";

const BUCKET = "property-media";

export interface UploadedPropertyMedia {
  id: string;
  storagePath: string;
  publicUrl: string;
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  options: { primary?: boolean; caption?: string; displayOrder?: number } = {},
): Promise<UploadedPropertyMedia> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Each image must be 10 MB or smaller.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to upload property images.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${user.id}/${propertyId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  try {
    const response = await authenticatedFetch(`/properties/${propertyId}/media`, {
      method: "POST",
      body: JSON.stringify({
        storagePath,
        mediaType: "image",
        caption: options.caption || null,
        primary: Boolean(options.primary),
        displayOrder: options.displayOrder || 0,
      }),
    });
    const media = await response.json();
    return { id: media.id, storagePath, publicUrl: publicData.publicUrl };
  } catch (error) {
    // Do not leave orphaned storage objects if registration fails.
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw error;
  }
}

export async function listPropertyImages(propertyId: string) {
  const response = await authenticatedFetch(`/properties/${propertyId}/media`);
  return response.json();
}
