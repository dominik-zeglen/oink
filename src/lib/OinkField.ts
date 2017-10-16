export interface IOinkField {
  name: string;
}

export class OinkField {
  private name: string;

  constructor(field) {
    this.name = field.name;
  }

  public getName = () => {
    return this.name;
  }
}
