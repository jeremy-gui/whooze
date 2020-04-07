export class User {
public constructor(init?: Partial<User>) {
  Object.assign(this, init);
}
  id: number;
  email: string;
  token: string;
  password: string;
}

