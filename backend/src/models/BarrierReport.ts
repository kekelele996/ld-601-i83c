import type { VerifyStatus } from "../constants/VerifyStatus";
import type { BarrierPriority } from "../constants/BarrierPriority";

export interface BarrierReport { id: number; reporter_id: number; facility_id: number; barrier_type: string; description: string; photo_url: string; verify_status: VerifyStatus; priority: BarrierPriority }
