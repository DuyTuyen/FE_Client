import { createSlice } from '@reduxjs/toolkit'

const items = localStorage.getItem('cartItems') !== null ? JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    value: items,
}

export const cartItemsSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload
            const duplicate = state.value.find(e => e._id === newItem._id && e.size === newItem.size)
            if (duplicate) {
                duplicate.quantity++
                
            } else {
                state.value = [...state.value, newItem]
            }
            localStorage.setItem('cartItems', JSON.stringify(state.value.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0))))
        },
        updateItem: (state, action) => {
            const updateItem = action.payload
            const duplicate = state.value.find(e => e._id === updateItem._id && e.size === updateItem.size)
            if (duplicate && 1 <= updateItem.quantity && updateItem.quantity <= duplicate?.maxQuantity) {
                duplicate.quantity = updateItem.quantity
                state.value = [...state.value]
                localStorage.setItem('cartItems', JSON.stringify(state.value.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0))))
            } 
        },
        removeItem: (state, action) => {
            console.log("aa")
            console.log(action.payload)
            const { id, size } = action.payload
            state.value = state.value.filter(e => e._id !== id && e.size !== size)
            localStorage.setItem('cartItems', JSON.stringify(state.value.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0))))
        },

        clear: (state) => {
            state.value = []
            localStorage.removeItem('cartItems')
        },
    },
})

// Action creators are generated for each case reducer function
export const { addItem, removeItem, updateItem, clear } = cartItemsSlice.actions

export default cartItemsSlice.reducer