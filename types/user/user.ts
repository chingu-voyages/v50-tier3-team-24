// user.ts
export interface User {
  userGuid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateCreated: Date;
  dateModified: Date;
  documents: AnnoteDocument[];
}
