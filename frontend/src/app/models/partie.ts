export class Partie {
  public constructor(init?: Partial<Partie>) {
    Object.assign(this, init);
  }
  id: number;
  stadePartieEnCours: number;
  personnages: [];
  owner_id: number;
}

