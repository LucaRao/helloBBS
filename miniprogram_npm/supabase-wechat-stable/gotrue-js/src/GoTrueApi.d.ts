import { Session, Provider, AdminUserAttributes, UserAttributes, CookieOptions, User, OpenIDConnectCredentials, VerifyOTPParams } from './lib/types';
import type { ApiError } from './lib/types';
export default class GoTrueApi {
    protected url: string;
    protected headers: {
        [key: string]: string;
    };
    protected cookieOptions: CookieOptions;
    protected fetch: any;
    constructor({ url, headers, cookieOptions, fetch, }: {
        url: string;
        headers?: {
            [key: string]: string;
        };
        cookieOptions?: CookieOptions;
        fetch?: any;
    });
    /**
     * Create a temporary object with all configured headers and
     * adds the Authorization token to be used on request methods
     * @param jwt A valid, logged-in JWT.
     */
    private _createRequestHeaders;
    private cookieName;
    /**
     * Generates the relevant login URL for a third-party provider.
     * @param provider One of the providers supported by GoTrue.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param scopes A space-separated list of scopes granted to the OAuth application.
     */
    getUrlForProvider(provider: Provider, options: {
        redirectTo?: string;
        scopes?: string;
        queryParams?: {
            [key: string]: string;
        };
    }): string;
    /**
     * Creates a new user using their email address.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param data Optional user metadata.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     *
     * @returns A logged-in session if the server has "autoconfirm" ON
     * @returns A user if the server has "autoconfirm" OFF
     */
    signUpWithEmail(email: string, password: string, options?: {
        redirectTo?: string;
        data?: object;
        captchaToken?: string;
    }): Promise<{
        data: Session | User | null;
        error: ApiError | null;
    }>;
    /**
     * Logs in an existing user using their email address.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     */
    signInWithEmail(email: string, password: string, options?: {
        redirectTo?: string;
        captchaToken?: string;
    }): Promise<{
        data: Session | null;
        error: ApiError | null;
    }>;
    /**
     * Signs up a new user using their phone number and a password.
     * @param phone The phone number of the user.
     * @param password The password of the user.
     * @param data Optional user metadata.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     */
    signUpWithPhone(phone: string, password: string, options?: {
        data?: object;
        captchaToken?: string;
    }): Promise<{
        data: Session | User | null;
        error: ApiError | null;
    }>;
    /**
     * Logs in an existing user using their phone number and password.
     * @param phone The phone number of the user.
     * @param password The password of the user.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     */
    signInWithPhone(phone: string, password: string, options?: {
        captchaToken?: string;
    }): Promise<{
        data: Session | null;
        error: ApiError | null;
    }>;
    /**
     * Logs in an OpenID Connect user using their id_token.
     * @param id_token The IDToken of the user.
     * @param nonce The nonce of the user. The nonce is a random value generated by the developer (= yourself) before the initial grant is started. You should check the OpenID Connect specification for details. https://openid.net/developers/specs/
     * @param provider The provider of the user.
     * @param client_id The clientID of the user.
     * @param issuer The issuer of the user.
     */
    signInWithOpenIDConnect({ id_token, nonce, client_id, issuer, provider, }: OpenIDConnectCredentials): Promise<{
        data: Session | null;
        error: ApiError | null;
    }>;
    /**
     * Sends a magic login link to an email address.
     * @param email The email address of the user.
     * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     */
    sendMagicLinkEmail(email: string, options?: {
        shouldCreateUser?: boolean;
        redirectTo?: string;
        captchaToken?: string;
    }): Promise<{
        data: {} | null;
        error: ApiError | null;
    }>;
    /**
     * Sends a mobile OTP via SMS. Will register the account if it doesn't already exist
     * @param phone The user's phone number WITH international prefix
     * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     */
    sendMobileOTP(phone: string, options?: {
        shouldCreateUser?: boolean;
        captchaToken?: string;
    }): Promise<{
        data: {} | null;
        error: ApiError | null;
    }>;
    /**
     * Removes a logged-in session.
     * @param jwt A valid, logged-in JWT.
     */
    signOut(jwt: string): Promise<{
        error: ApiError | null;
    }>;
    /**
     * @deprecated Use `verifyOTP` instead!
     * @param phone The user's phone number WITH international prefix
     * @param token token that user was sent to their mobile phone
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    verifyMobileOTP(phone: string, token: string, options?: {
        redirectTo?: string;
    }): Promise<{
        data: Session | User | null;
        error: ApiError | null;
    }>;
    /**
     * Send User supplied Email / Mobile OTP to be verified
     * @param email The user's email address
     * @param phone The user's phone number WITH international prefix
     * @param token token that user was sent to their mobile phone
     * @param type verification type that the otp is generated for
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     */
    verifyOTP({ email, phone, token, type }: VerifyOTPParams, options?: {
        redirectTo?: string;
    }): Promise<{
        data: Session | User | null;
        error: ApiError | null;
    }>;
    /**
     * Sends an invite link to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param data Optional user metadata
     */
    inviteUserByEmail(email: string, options?: {
        redirectTo?: string;
        data?: object;
    }): Promise<{
        data: User | null;
        error: ApiError | null;
    }>;
    /**
     * Sends a reset request to an email address.
     * @param email The email address of the user.
     * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
     * @param captchaToken Verification token received when the user completes the captcha on your site.
     */
    resetPasswordForEmail(email: string, options?: {
        redirectTo?: string;
        captchaToken?: string;
    }): Promise<{
        data: {} | null;
        error: ApiError | null;
    }>;
    /**
     * Generates a new JWT.
     * @param refreshToken A valid refresh token that was returned on login.
     */
    refreshAccessToken(refreshToken: string): Promise<{
        data: Session | null;
        error: ApiError | null;
    }>;
    /**
     * Set/delete the auth cookie based on the AuthChangeEvent.
     * Works for Next.js & Express (requires cookie-parser middleware).
     * @param req The request object.
     * @param res The response object.
     */
    setAuthCookie(req: any, res: any): void;
    /**
     * Deletes the Auth Cookies and redirects to the
     * @param req The request object.
     * @param res The response object.
     * @param options Optionally specify a `redirectTo` URL in the options.
     */
    deleteAuthCookie(req: any, res: any, { redirectTo }: {
        redirectTo?: string;
    }): any;
    /**
     * Helper method to generate the Auth Cookie string for you in case you can't use `setAuthCookie`.
     * @param req The request object.
     * @param res The response object.
     * @returns The Cookie string that needs to be set as the value for the `Set-Cookie` header.
     */
    getAuthCookieString(req: any, res: any): string[];
    /**
     * Generates links to be sent via email or other.
     * @param type The link type ("signup" or "magiclink" or "recovery" or "invite").
     * @param email The user's email.
     * @param password User password. For signup only.
     * @param data Optional user metadata. For signup only.
     * @param redirectTo The link type ("signup" or "magiclink" or "recovery" or "invite").
     */
    generateLink(type: 'signup' | 'magiclink' | 'recovery' | 'invite' | 'email_change_current' | 'email_change_new', email: string, options?: {
        password?: string;
        data?: object;
        redirectTo?: string;
    }): Promise<{
        data: Session | User | null;
        error: ApiError | null;
    }>;
    /**
     * Creates a new user.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @param attributes The data you want to create the user with.
     */
    createUser(attributes: AdminUserAttributes): Promise<{
        user: null;
        data: null;
        error: ApiError;
    } | {
        user: User;
        data: User;
        error: null;
    }>;
    /**
     * Get a list of users.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    listUsers(): Promise<{
        data: null;
        error: ApiError;
    } | {
        data: User[];
        error: null;
    }>;
    /**
     * Get user by id.
     *
     * @param uid The user's unique identifier
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    getUserById(uid: string): Promise<{
        data: null;
        error: ApiError;
    } | {
        data: User;
        error: null;
    }>;
    /**
     * Get user by reading the cookie from the request.
     * Works for Next.js & Express (requires cookie-parser middleware).
     */
    getUserByCookie(req: any, res?: any): Promise<{
        token: string | null;
        user: User | null;
        data: User | null;
        error: ApiError | null;
    }>;
    /**
     * Updates the user data.
     *
     * @param attributes The data you want to update.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     */
    updateUserById(uid: string, attributes: AdminUserAttributes): Promise<{
        user: User | null;
        data: User | null;
        error: ApiError | null;
    }>;
    /**
     * Delete a user. Requires a `service_role` key.
     *
     * This function should only be called on a server. Never expose your `service_role` key in the browser.
     *
     * @param uid The user uid you want to remove.
     */
    deleteUser(uid: string): Promise<{
        user: User | null;
        data: User | null;
        error: ApiError | null;
    }>;
    /**
     * Gets the current user details.
     *
     * This method is called by the GoTrueClient `update` where
     * the jwt is set to this.currentSession.access_token
     * and therefore, acts like getting the currently authenticated user
     *
     * @param jwt A valid, logged-in JWT. Typically, the access_token for the currentSession
     */
    getUser(jwt: string): Promise<{
        user: User | null;
        data: User | null;
        error: ApiError | null;
    }>;
    /**
     * Updates the user data.
     * @param jwt A valid, logged-in JWT.
     * @param attributes The data you want to update.
     */
    updateUser(jwt: string, attributes: UserAttributes): Promise<{
        user: User | null;
        data: User | null;
        error: ApiError | null;
    }>;
}
//# sourceMappingURL=GoTrueApi.d.ts.map