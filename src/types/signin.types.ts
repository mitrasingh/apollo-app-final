export interface UserData {
	firstName: string;
	lastName: string;
	title: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export type UserSignIn = Pick<UserData, "email" | "password">;

export type UserEmail = Pick<UserData, "email">;
