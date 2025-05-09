export interface SignIn {
	email: string;
	password: string;
}

export type EmailOnly = Pick<SignIn, "email">;
