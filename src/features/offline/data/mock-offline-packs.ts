/** Fixture các gói offline dùng để dựng UI trước khi nối backend. */
import { OfflineRegionPack } from "../types/offline.types";

export const MOCK_OFFLINE_PACKS: OfflineRegionPack[] = [
  {
    id: 1,
    region_id: 101,
    name: "West Lake & Solitary Hill Area",
    total_size: 148897792,
    formattedSize: "142 MB",
    languages: ["EN", "JP", "KR", "ZH"],
    status: "saved",
  },
  {
    id: 2,
    region_id: 102,
    name: "Mount Putuo Pilgrimage Path",
    total_size: 293601280,
    formattedSize: "280 MB",
    languages: ["EN", "ZH"],
    status: "downloading",
    progress: 45,
  },
  {
    id: 3,
    region_id: 103,
    name: "Wuzhen Water Town Classic...",
    total_size: 99614720,
    formattedSize: "95 MB",
    languages: ["EN", "JP", "FR"],
    status: "idle",
  },
];
