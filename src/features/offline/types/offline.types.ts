export type OfflinePackageStatus = "saved" | "downloading" | "idle";

export interface OfflineRegionPack {
  id: number;
  region_id: number;
  name: string;
  total_size: number;
  formattedSize: string;
  languages: string[];
  status: OfflinePackageStatus;
  progress?: number;
}

export interface DeviceStorageInfo {
  usedBytes: number;
  totalBytes: number;
  displayText: string;
  usedPercentage: number;
}
