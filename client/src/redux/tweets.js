import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tweet: null,
    refresh: false,
    isActive: false, // Added active in initialState
};

const tweetSlice = createSlice({
    name: 'tweet',
    initialState,
    reducers: {
        setTweet(state, action) { 
            state.tweet = action.payload; // Updates the tweet state with the payload
        },
        toggleRefresh(state) {
            state.refresh = !state.refresh; // Toggles the refresh state
        },
        setActive(state, action) {
            state.isActive = action.payload; // Corrected to action.payload for setting the active state
        },
    },
});

// Exporting the actions to be used in components
export const { setTweet, toggleRefresh, setActive } = tweetSlice.actions;

// Exporting the reducer to be combined in the store
export default tweetSlice.reducer;
