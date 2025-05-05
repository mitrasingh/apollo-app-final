import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    userPhoto: null,
    firstName: null,
    lastName: null,
    title: null,
    email: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.userId = action.payload.userId
            state.userPhoto = action.payload.userPhoto
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.title = action.payload.title
            state.email = action.payload.email
        },
        logoutUser: (state) => {
            state.userId = null
            state.userPhoto = null
            state.firstName = null
            state.lastName = null
            state.title = null
            state.email = null
        },
        editUser: (state, action) => {
            state.userId = action.payload.userId
            state.userPhoto = action.payload.userPhoto
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.title = action.payload.title
            state.email = action.payload.email
        }
    }
})

export const { loginUser, logoutUser, editUser } = userSlice.actions
export default userSlice.reducer
