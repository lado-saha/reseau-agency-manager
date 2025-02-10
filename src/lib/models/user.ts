export interface User {
  id: string;
  name: string,
  email: string;
  passwordHash: string;
  sex: 'male' | 'female',
  photo: string | File;
  phone: string;
  signupComplete: boolean;
  recruitable: boolean
}
