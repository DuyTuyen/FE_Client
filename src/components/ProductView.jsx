import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useHistory, withRouter } from 'react-router'

import { useDispatch } from 'react-redux'

import { addItem } from '../redux/shopping-cart/cartItemsSlide'
import { remove } from '../redux/product-modal/productModalSlice'

import Button from './Button'
import numberWithCommas from '../utils/numberWithCommas'

const ProductView = props => {

    const dispatch = useDispatch()
    const history = useHistory()

    const { product } = props

    const [previewImg, setPreviewImg] = useState("")

    const [descriptionExpand, setDescriptionExpand] = useState(false)

    const [color, setColor] = useState(undefined)

    const [size, setSize] = useState(undefined)

    const [quantity, setQuantity] = useState(1)

    const [activeProductDetail, setActiveProductDetail] = useState(null)

    const [maxQuantity, setMaxQuantity] = useState(0)

    const updateQuantity = (type) => {
        if (type === 'plus') {
            setQuantity(quantity >= maxQuantity? quantity : quantity+ 1)
        } else {
            setQuantity(quantity - 1 < 1 ? 1 : quantity - 1)
        }
    }

    useEffect(() => {
        if (product) {
            setPreviewImg(product.r_productDetails[0].img)
            setQuantity(1)
            setActiveProductDetail(product.r_productDetails[0])
        }
    }, [product])

    useEffect(() => {
        const foundDetail = product?.r_productDetails.find(detail => detail.color === color)
        if (foundDetail) {
            setActiveProductDetail(foundDetail)
            setPreviewImg(foundDetail.img)
        }

    }, [color])

    useEffect(() => {
        const foundConsignment = activeProductDetail?.r_consignments.find(c => c.size === size)
        if (foundConsignment)
            setMaxQuantity(foundConsignment.quantity)
    }, [size])


    const check = () => {
        if (color === undefined) {
            alert('Vui lòng chọn màu sắc!')
            return false
        }

        if (size === undefined) {
            alert('Vui lòng chọn kích cỡ!')
            return false
        }

        return true
    }

    const addToCart = () => {
        if(check())
            dispatch(addItem({
                color,
                size,
                quantity,
                maxQuantity,
                _id: activeProductDetail._id,
                img: activeProductDetail.img,
                price: product.price,
                name: product.name
            }))
    }

    const goToCart = () => {
        if(check()){
            dispatch(addItem({
                color,
                size,
                quantity,
                maxQuantity,
                _id: activeProductDetail._id,
                img: activeProductDetail.img,
                price: product.price,
                name: product.name
            }))
            history.push("/cart")
        }
    }

    return (
        <div className="product">
            <div className="product__images">
                <div className="product__images__list">
                    {
                        product?.r_productDetails.map(item => (
                            <div key={item._id} className="product__images__list__item" onClick={() => setPreviewImg(item.img)}>
                                <img src={`${process.env.REACT_APP_CLOUDINARYURL}/${item.img}`} alt={item.color} />
                            </div>
                        ))
                    }
                </div>
                <div className="product__images__main">
                    <img src={`${process.env.REACT_APP_CLOUDINARYURL}/${previewImg}`} alt={product?.name} />
                </div>
                <div className={`product-description ${descriptionExpand ? 'expand' : ''}`}>
                    <div className="product-description__title">
                        Chi tiết sản phẩm
                    </div>
                    <div className="product-description__content" dangerouslySetInnerHTML={{ __html: product?.des }}></div>
                    <div className="product-description__toggle">
                        <Button size="sm" onClick={() => setDescriptionExpand(!descriptionExpand)}>
                            {
                                descriptionExpand ? 'Thu gọn' : 'Xem thêm'
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div className="product__info">
                <h1 className="product__info__title">{product?.name}</h1>
                <div className="product__info__item">
                    <span className="product__info__item__price">
                        {numberWithCommas(product ? product.price : 0)}
                    </span>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Màu sắc
                    </div>
                    <div className="product__info__item__list">
                        {
                            product?.r_productDetails?.map((item) => (
                                <div key={item._id} className={`product__info__item__list__item ${color === item.color ? 'active' : ''}`} onClick={() => setColor(item.color)}>
                                    <div className={`circle bg-${item.color}`}></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Kích cỡ
                    </div>
                    <div className="product__info__item__list">
                        {
                            activeProductDetail?.r_consignments.map((item, index) => (
                                <div key={index} className={`product__info__item__list__item ${size === item.size ? 'active' : ''}`} onClick={() => setSize(item.size)}>
                                    <span className="product__info__item__list__item__size">
                                        {item.size}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Số lượng <i>(Còn {maxQuantity} chiếc)</i>
                    </div>
                    <div className="product__info__item__quantity">
                        <div className="product__info__item__quantity__btn" onClick={() => updateQuantity('minus')}>
                            <i className="bx bx-minus"></i>
                        </div>
                        <div className="product__info__item__quantity__input">
                            {quantity}
                        </div>
                        <div className="product__info__item__quantity__btn" onClick={() => updateQuantity('plus')}>
                            <i className="bx bx-plus"></i>
                        </div>
                    </div>
                </div>
                <div className="product__info__item">
                    <Button onClick={() => addToCart()}>thêm vào giỏ</Button>
                    <Button onClick={() => goToCart()}>mua ngay</Button>
                </div>
            </div>
            <div className={`product-description mobile ${descriptionExpand ? 'expand' : ''}`}>
                <div className="product-description__title">
                    Chi tiết sản phẩm
                </div>
                <div className="product-description__content" dangerouslySetInnerHTML={{ __html: product?.des }}></div>
                <div className="product-description__toggle">
                    <Button size="sm" onClick={() => setDescriptionExpand(!descriptionExpand)}>
                        {
                            descriptionExpand ? 'Thu gọn' : 'Xem thêm'
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

ProductView.propTypes = {
    product: PropTypes.object
}

export default withRouter(ProductView)
