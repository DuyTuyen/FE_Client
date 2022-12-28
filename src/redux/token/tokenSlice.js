import { createSlice } from '@reduxjs/toolkit'

const initValue = localStorage.getItem('token') !== null ? localStorage.getItem('token') : ""

const initialState = {
    value: initValue,
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload
            localStorage.setItem('token',action.payload)
        },

        clearValue: (state) => {
            state.value = ""
            localStorage.removeItem('token')
        },
    },
})

// Action creators are generated for each case reducer function
export const { setValue, clearValue } = tokenSlice.actions

export default tokenSlice.reducer