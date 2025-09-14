import { supabase } from "@/lib/supabaseClient";

export type UploadedFile = {
  path: string;
  publicUrl?: string;
};

export async function uploadFilesToApplicationsBucket(
  files: File[],
  folderPrefix: string
): Promise<UploadedFile[]> {
  const results: UploadedFile[] = [];
  if (!files || files.length === 0) return results;

  const timestamp = Date.now();
  for (const file of files) {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const path = `${folderPrefix}/${timestamp}-${sanitizedName}`;
    const { error } = await supabase.storage.from("applications").upload(path, file, {
      upsert: false,
      cacheControl: "3600",
    });
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    const { data: pub } = supabase.storage.from("applications").getPublicUrl(path);
    results.push({ path, publicUrl: pub?.publicUrl });
  }
  return results;
}


