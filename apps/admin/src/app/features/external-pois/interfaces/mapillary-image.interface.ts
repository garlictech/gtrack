export interface MapillaryImage {
  ca?: number; // Image's camera angle in range  [0, 360)
  camera_make: string; // Camera make.
  camera_model: string; // Camera model.
  captured_at: string; // When image was captured.
  key: string; // Image key.
  pano: boolean; // Whether the image is panorama ( true ), or not ( false ).
  project_key?: string; // Which project the image belongs to. Absent if it doesn't belong to any project.
  user_key: string; // User who captured the image.
  username: string; // Username of who captured the image.
}
