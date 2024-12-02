export interface UserItem {
    firstName: string;
    lastName: string;
    user_alias: string;
    passwords: string;
    imageUrl?: string; // Optional, in case not all users have an image
}