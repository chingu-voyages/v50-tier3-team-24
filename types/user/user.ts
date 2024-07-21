// user.ts
export interface User {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  documents: AnnoteDocument[];
}
