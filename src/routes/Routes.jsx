import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Home from '../pages/Home'
import Catalog from '../pages/Products'
import Cart from '../pages/Cart'
import Product from '../pages/Product'

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/product/:id' component={Product}/>
            <Route path='/products' component={Catalog}/>
            <Route path='/cart' component={Cart}/>
        </Switch>
    )
}

export default Routes
