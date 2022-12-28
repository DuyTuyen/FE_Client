import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import Helmet from '../components/Helmet'
import CartItem from '../components/CartItem'
import Button from '../components/Button'

import numberWithCommas from '../utils/numberWithCommas'
import { Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { close, show } from '../redux/responoseAPI/loadingSlice'
import makeRequest from '../api/axios'
import axios from 'axios'
import { setError } from '../redux/responoseAPI/errorSlice'
import { clear } from '../redux/shopping-cart/cartItemsSlide'

const Cart = () => {
    const {loading,token} = useSelector((state) => {
        return {
            loading: state.loading.value,
            token: state.token.value
        }
    })
    const cartItems = useSelector((state) => state.cartItems.value)

    const dispatch = useDispatch()
    const history = useHistory()

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [paymentType, setPaymentType] = useState("in_person")
    const [activeCity, setActiveCity] = useState(null)
    const [activeDistrict, setActiveDistrict] = useState(null)
    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [shippingCharges, setShippingCharges] = useState(0)

    useEffect(() => {
        setTotalPrice(cartItems.reduce((total, item) => total + item.quantity * item.price, 0))
    }, [cartItems])

    useEffect(() => {
        dispatch(show())
        async function getCities() {
            try {
                const res = await makeRequest.provinceAPI.getAll()
                setCities(res.data)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
                history.push("/error")
            }
            finally {
                dispatch(close())
            }
        }
        getCities()
    }, [])

    useEffect(() => {
        if (activeCity) {
            setDistricts(activeCity.districts)
        }
    }, [activeCity])

    useEffect(() => {
        async function calculateShippingCharges() {
            try {
                dispatch(show())
                const resGeoCode = await makeRequest.provinceAPI.getGeoCodeing(`${address}, ${activeDistrict.name}, ${activeCity.name}`)
                const firstGeoCode = resGeoCode.data.features[0].center
                const myLng = parseFloat(process.env.REACT_APP_MY_GEOCODE_LNG)
                const myLat = parseFloat(process.env.REACT_APP_MY_GEOCODE_LAT)
                const resShippingCharges = await makeRequest.provinceAPI.calculateShippingCharges({ myLng, myLat, cusLng: firstGeoCode[0], cusLat: firstGeoCode[1] })
                const tempShippingCharges = Math.round(resShippingCharges.data.routes[0].distance * parseInt(process.env.REACT_APP_CHARGES_PER_MET))
                setShippingCharges(tempShippingCharges)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
                history.push("/error")
            }
            finally {
                dispatch(close())
            }
        }
        let myTimeout = null
        if (address !== "" && activeCity && activeDistrict)
            myTimeout = setTimeout(calculateShippingCharges, 1000)
        return () => {
            clearTimeout(myTimeout)
        }
    }, [address, activeDistrict])

    async function handlePay() {
        dispatch(show())
        try {
            if (name === "" || phone === "" || email === "" || address === "" || !activeCity || !activeDistrict)
                return
            const res = await makeRequest.orderAPI.create(token,{
                name,
                phone,
                email,
                address: `${address}, ${activeDistrict.name}, ${activeCity.name}`,
                paymentType,
                totalBill: totalPrice + shippingCharges,
                r_orderDetails: cartItems.map(item => {
                    return {
                        quantity: item.quantity,
                        price: item.price,
                        r_productDetail: item._id,
                        size: item.size
                    }
                })
            })
            dispatch(clear())
            if (paymentType === 'momo')
                window.location.href = res.data.payUrl
            else
                history.push(res.data.payUrl)
        } catch (error) {
            if (axios.isAxiosError(error))
                dispatch(setError(error.response ? error.response.data.message : error.message))
            else
                dispatch(setError(error.toString()))
            history.push("/error")
        }
        finally {
            dispatch(close())
        }
    }

    return (
        loading ?
            "loading..." :
            <Helmet title="Giỏ hàng">
                {
                    cartItems.length <= 0 ?
                        <h2 style={{ textAlign: "center" }}>Chưa có sản phẩm trong giỏ hàng</h2> :
                        <>
                            <div className="cart">
                                <div className="cart__list">
                                    {
                                        cartItems.map((item) => (
                                            <CartItem item={item} key={item._id} />
                                        ))
                                    }
                                </div>
                                <div className="cart__info">
                                    <div className="cart__info__txt">
                                        <Form>
                                            <Form.Group className="mb-3" >
                                                <Form.Label>Tên người nhận</Form.Label>
                                                <Form.Control value={name} onChange={(e) => { setName(e.target.value) }} type="text" placeholder="nhập tên người nhận" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" >
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control pattern="(84|0[3|5|7|8|9])+([0-9]{8})\b" value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" placeholder="nhập số điện thoại người nhận" />
                                            </Form.Group>

                                            <Form.Group className="mb-3" >
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="nhập địa chỉ email" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" >
                                                <Form.Label>Phương thức thanh toán</Form.Label>
                                                <Form.Select onChange={(e) => { setPaymentType(e.target.value) }} class="mb-3">
                                                    <option value="in_person">Thanh toán khi nhận hàng</option>
                                                    <option value="momo">Thanh toán qua ví MoMo</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3" >
                                                <Form.Label>Địa chỉ giao hàng</Form.Label>
                                                <Form.Control value={address} onChange={(e) => { setAddress(e.target.value) }} type="text" placeholder="nhập địa chỉ giao hàng" />
                                            </Form.Group>
                                            <Form.Group style={{ display: "flex" }} className="mb-3" >
                                                <Form.Select onChange={(e) => {
                                                    const foundCity = cities.find(city => city.code === Number(e.target.value))
                                                    if (foundCity)
                                                        setActiveCity(foundCity)
                                                }} style={{ marginRight: "5px" }}>
                                                    {
                                                        cities.map(city =>
                                                            <option key={city.code} value={city.code}>{city.name}</option>
                                                        )
                                                    }
                                                </Form.Select>
                                                <Form.Select onChange={(e) => {
                                                    const foundDistrict = districts.find(district => district.code === Number(e.target.value))
                                                    if (foundDistrict)
                                                        setActiveDistrict(foundDistrict)
                                                }} style={{ marginRight: "5px" }}>
                                                    {
                                                        districts.map(district =>
                                                            <option key={district.code} value={district.code}>{district.name}</option>
                                                        )
                                                    }
                                                </Form.Select>
                                            </Form.Group>

                                        </Form>
                                        <p className="h1 cart__info__txt__breakLine">-------------------------------------</p>
                                        <div className="cart__info__txt__price">
                                            <span>Phí vận chuyển:</span> <span style={{ color: "black" }}>{numberWithCommas(shippingCharges)}</span>
                                        </div>
                                        <div className="cart__info__txt__price">
                                            <span>Tạm tính:</span> <span style={{ color: "black" }}>{numberWithCommas(totalPrice)}</span>
                                        </div>
                                        <div className="cart__info__txt__price">
                                            <span>Tổng:</span> <span>{numberWithCommas(totalPrice + shippingCharges)}</span>
                                        </div>
                                    </div>
                                    <div className="cart__info__btn">
                                        <Button onClick={handlePay} size="block">
                                            Đặt hàng
                                        </Button>
                                        <Link to="/products">
                                            <Button size="block">
                                                Tiếp tục mua hàng
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </Helmet>
    )
}

export default Cart
