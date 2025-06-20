export interface UserData {
	firstname: string;
	lastname: string;
	title: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export type UserSignIn = Pick<UserData, "email" | "password">;

export type UserEmail = Pick<UserData, "email">;

export type UserProfile = Omit<UserData, "password" | "confirmPassword">;
