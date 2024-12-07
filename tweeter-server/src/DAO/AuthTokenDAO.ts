import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {

    
    addToken(token: string, userAlias: string, expirationTime: number): Promise<void>;
    getToken(token: string): Promise<AuthToken | null>;
    updateToken(token: string, updatedTime: number): Promise<void>;
    deleteToken(token: string): Promise<void>;
}