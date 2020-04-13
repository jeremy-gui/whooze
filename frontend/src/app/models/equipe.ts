export class Equipe {
  public constructor(init?: Partial<Equipe>) {
    Object.assign(this, init);
  }
  id: number;
  name: string;
  partie_id: number;
}

