export class Personnage {
  public constructor(init?: Partial<Personnage>) {
    Object.assign(this, init);
  }
  id: number;
  owner: number;
  nom: string;
}
