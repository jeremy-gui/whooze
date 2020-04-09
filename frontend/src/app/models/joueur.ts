import {User} from './user';

export class Joueur {
  public constructor(init?: Partial<Joueur>) {
    Object.assign(this, init);
  }
  id: number;
  username: string;
  owner_id: number;
}

