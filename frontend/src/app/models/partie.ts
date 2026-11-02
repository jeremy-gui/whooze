
export enum StadePartieEnCours {
  CREATE_TEAMS = 'CREATE_TEAMS',
  CHOOSE_PERSO = 'CHOOSE_PERSO',
  ROUND_1 = 'ROUND_1',
  ROUND_2 = 'ROUND_2',
  ROUND_3 = 'ROUND_3',
  COMPLETED = 'COMPLETED'
}

export class Partie {
  public constructor(init?: Partial<Partie>) {
    Object.assign(this, init);
  }
  id: number;
  stadePartieEnCours: StadePartieEnCours;
  owner_id: number;
  code_unique: string;
}

