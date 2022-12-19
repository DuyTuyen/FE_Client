import { configureStore } from '@reduxjs/toolkit'

import productModalReducer from './product-modal/productModalSlice'

import cartItemsReducer from './shopping-cart/cartItemsSlide'

import loadingReducer from './responoseAPI/loadingSlice'

import errorReducer from './responoseAPI/errorSlice' 

export const store = configureStore({
    reducer: {
        productModal: productModalReducer,
        cartItems: cartItemsReducer,
        loading: loadingReducer,
        error: errorReducer 
    },
})