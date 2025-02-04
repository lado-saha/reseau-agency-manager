export interface User {
  id: string;
  name: string,
  email: string;
  passwordHash: string;
  role: string;
  sex: 'male' | 'female',
  photo: string | File;
}
