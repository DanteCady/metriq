/**
 * Large artifact storage — use S3/R2/GCS; store pointers in Postgres.
 */
export type BlobPointer = { url: string; key: string; contentType?: string };

export async function putArtifactBlob(_file: Blob, _meta: { submissionId: string; label: string }): Promise<BlobPointer | null> {
  return null;
}
