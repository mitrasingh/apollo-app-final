import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	userId: string | null;
	userPhoto: string | null;
	firstName: string | null;
	lastName: string | null;
	title: string | null;
	email: string | null;
}

const initialState: UserState = {
	userId: null,
	userPhoto: null,
	firstName: null,
	lastName: null,
	title: null,
	email: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginUser: (state, action: PayloadAction<UserState>) => {
			Object.assign(state, action.payload);
		},
		logoutUser: (state) => {
			Object.assign(state, initialState);
		},
		editUser: (state, action: PayloadAction<UserState>) => {
			Object.assign(state, action.payload);
		},
	},
});

export const { loginUser, logoutUser, editUser } = userSlice.actions;
export default userSlice.reducer;
