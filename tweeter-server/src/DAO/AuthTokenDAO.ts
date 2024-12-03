import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {

    
    addToken(token: string, userAlias: string): Promise<void>;
    getToken(token: string): Promise<AuthToken | null>;
    deleteToken(token: string): Promise<void>;
}