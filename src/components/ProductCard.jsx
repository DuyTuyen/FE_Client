import React from 'react'

import { Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import { set } from '../redux/product-modal/productModalSlice'

import Button from './Button'

import numberWithCommas from '../utils/numberWithCommas'

const ProductCard = props => {
    const {product} = props
    const dispatch = useDispatch()
    return (
        <div className="product-card">
            <Link to={`/product/${product?._id}`}>
                <div className="product-card__image">
                    <img src={`${process.env.REACT_APP_CLOUDINARYURL}/${product?.r_productDetails[0].img}`} alt={product?.name} />
                    <img src={`${process.env.REACT_APP_CLOUDINARYURL}/${product?.r_productDetails[1] ? product?.r_productDetails[1].img: product?.r_productDetails[0].img}`} alt={product?.name} />
                </div>
                <h3 className="product-card__name">{product?.name}</h3>
                <div className="product-card__price">
                    {numberWithCommas(product?product.price: 0)}
                    <span className="product-card__price__old">
                        <del>{numberWithCommas(product?product.price*2: 0)}</del>
                    </span>
                </div>
            </Link>
            <div className="product-card__btn">
                <Button
                    size="sm"    
                    icon="bx bx-cart"
                    animate={true}
                    onClick = {() => {dispatch(set(product))}}
                >
                    chọn mua
                </Button>
            </div>
        </div>
    )
}

export default ProductCard
