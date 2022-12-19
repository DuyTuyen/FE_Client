import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false,
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        show: (state) => {
            state.value = true
        },
        close: (state) => {
            state.value = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { show, close } = loadingSlice.actions

export default loadingSlice.reducer