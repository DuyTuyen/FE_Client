import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Home from '../pages/Home'
import Catalog from '../pages/Products'
import Cart from '../pages/Cart'
import Product from '../pages/Product'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import UpdateNewPassword from '../pages/UpdateNewPassword'
import Order from '../pages/Order'
import User from '../pages/User'

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/product/:id' component={Product}/>
            <Route path='/products' component={Catalog}/>
            <Route path='/cart' component={Cart}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <Route path='/forgot' component={ForgotPassword}/>
            <Route path='/order' component={Order}/>
            <Route path='/user' component={User}/>
            <Route path='/updateNewPassword/:token' component={UpdateNewPassword}/>
        </Switch>
    )
}

export default Routes
