export interface AnnoteOnMarkerInsertedData {
  pinNumber: number;
  color: string;
  text: string | null;
}

export interface AnnoteMarkerConfig {
  placeholder?: string;
  onMarkerInserted?: (data: AnnoteOnMarkerInsertedData) => void;
  onMarkerDeleted?: (data: any) => void;
}
