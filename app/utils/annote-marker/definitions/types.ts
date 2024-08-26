export interface AnnoteOnMarkerInsertedData {
  pinNumber: number;
  color: string;
  text: string | null;
  uuid: string;
}

export interface AnnotteOnMarkerDeletedData {
  pinNumber: number;
  uuid: string;
}

export interface AnnoteMarkerConfig {
  placeholder?: string;
  onMarkerInserted?: (data: AnnoteOnMarkerInsertedData) => void;
  onMarkerDeleted?: (data: AnnotteOnMarkerDeletedData) => void;
  onUuidsInvIew?: (data: string[]) => void;
}
