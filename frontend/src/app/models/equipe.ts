export class Equipe {
  public constructor(init?: Partial<Equipe>) {
    Object.assign(this, init);
  }
  id: number;
  nom: string;
  partie_id: number;
  score: number;
}

