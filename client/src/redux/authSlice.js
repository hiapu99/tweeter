import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,       // Stores authenticated user details
    otherUser: null,  // Stores another user's details if needed
    profile: null,    // Stores another user's details if needed
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;  // Updates the `user` state with the payload
        },
        setProfile(state, action) {
            state.profile = action.payload;  // Updates the `profile` state with the payload
        },
        setOtherUser(state, action) {
            state.otherUser = action.payload;  // Updates the `otherUser` state
        },
        resetState(state) {
            return initialState; // Resets the state back to the initial values
        },
    },
});

// Exporting the actions to be used in components
export const { setUser, setOtherUser, setProfile, resetState } = authSlice.actions;

// Exporting the reducer to be combined in the store
export default authSlice.reducer;
