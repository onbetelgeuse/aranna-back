export class KeycloakProfileDto {
  public readonly provider: string;
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly name: string;
  public readonly given_name: string;

  constructor(values: Partial<KeycloakProfileDto>) {
    if (values) {
      this.provider = values.provider;
      this.id = values.id;
      this.username = values.username;
      this.email = values.email;
      this.name = values.name;
      this.given_name = values.given_name;
    }
  }

  public static fromJson(json: any): KeycloakProfileDto {
    if (json) {
      return new KeycloakProfileDto({
        provider: json.provider,
        id: json.id,
        username: json.username,
        email: json.email,
        name: json.name,
        given_name: json.given_name,
      });
    }
  }
}
