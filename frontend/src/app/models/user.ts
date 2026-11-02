export class User {
public constructor(init?: Partial<User>) {
  Object.assign(this, init);
}
  id: number;
  email: string;
  refresh_token: string;
  access_token: string;
  password: string;
}

