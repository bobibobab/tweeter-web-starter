import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {

    
    addToken(token: string, userAlias: string): void;
    getToken(token: string): Promise<AuthToken | null>;
    deleteToken(token: string): void;
}