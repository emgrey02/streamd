export {};

declare global {
    interface UserSession {
        success: boolean;
        status_code: number;
        status_message: string;
        account_id: string;
        access_token: string;
    }
}
