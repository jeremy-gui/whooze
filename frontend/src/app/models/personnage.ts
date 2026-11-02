export class Personnage {
  public constructor(init?: Partial<Personnage>) {
    Object.assign(this, init);
  }
  id: number;
  playerowner: number;
  nom: string;
}
