import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Dropdown, Form, ListGroup } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'

import logo from '../assets/images/Logo-2.png'
import { setError } from '../redux/responoseAPI/errorSlice'
import { close, show } from '../redux/responoseAPI/loadingSlice'
import { clearValue } from '../redux/token/tokenSlice'

import makeRequest from '../api/axios'

const mainNav = [
    {
        display: "Trang chủ",
        path: "/"
    },
    {
        display: "Sản phẩm",
        path: "/products"
    },
    {
        display: "Phụ kiện",
        path: "/accessories"
    },
    {
        display: "Liên hệ",
        path: "/contact"
    }
]

const Header = () => {
    const [isShowSearchbar, setIsShowSearchbar] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestedProcucts, setSuggestedProducts] = useState([])

    const { token, cartItems, loading } = useSelector(state => {
        return {
            token: state.token.value,
            cartItems: state.cartItems.value,
            loading: state.loading.value
        }
    })

    const dispatch = useDispatch()
    const history = useHistory()
    const { pathname } = useLocation()
    const activeNav = mainNav.findIndex(e => e.path === pathname)


    const menuLeft = useRef(null)

    const menuToggle = () => menuLeft.current.classList.toggle('active')

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <i
            className="bx bx-user"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
        </i>
    ))

    function handleLogout() {
        dispatch(clearValue())
        if (window.confirm("đang xuất thành công, bạn có muốn chuyển đến trang đăng nhập?"))
            history.push("/login")
    }

    function closeSearchbar() {
        setSearchTerm("")
        setIsShowSearchbar(false)
    }

    async function handleSearchSubmit(e) {
        e.preventDefault()
        history.push(`/products?searchTerm=${searchTerm}`)
        closeSearchbar()
    }

    useEffect(() => {
        async function search() {
            if (searchTerm !== "") {
                try {
                    const res = await makeRequest.productAPI.search(searchTerm)
                    setSuggestedProducts(res.data)
                } catch (error) {
                    if (axios.isAxiosError(error))
                        dispatch(setError(error.response ? error.response.data.message : error.message))
                    else
                        dispatch(setError(error.toString()))
                    history.push("/error")
                }
            } else {
                setSuggestedProducts([])
            }
        }
        const myTimeout = setTimeout(search, 200)
        return () => {
            clearTimeout(myTimeout)
        }
    }, [searchTerm])

    return (
        <div className="header shrink" >
            <div className="container">
                <div className="header__logo">
                    <Link to="/">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className="header__menu">
                    <div className="header__menu__mobile-toggle" onClick={menuToggle}>
                        <i className='bx bx-menu-alt-left'></i>
                    </div>
                    <div className="header__menu__left" ref={menuLeft}>
                        <div className="header__menu__left__close" onClick={menuToggle}>
                            <i className='bx bx-chevron-left'></i>
                        </div>
                        {
                            mainNav.map((item, index) => (
                                <div
                                    key={index}
                                    className={`header__menu__item header__menu__left__item ${index === activeNav ? 'active' : ''}`}
                                    onClick={menuToggle}
                                >
                                    <Link to={item.path}>
                                        <span>{item.display}</span>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                    <div className="header__menu__right">
                        <div className="header__menu__item header__menu__right__item">
                            <Form onSubmit={handleSearchSubmit}>
                                <Form.Control className={isShowSearchbar ? "header__menu__right__item__search__active" : "header__menu__right__item__search"} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} type="text" placeholder="Tìm kiếm" />
                                <ListGroup as="ul" variant="flush" className="header__menu__right__item__suggest-list">
                                    {
                                        suggestedProcucts.map(p => (
                                            <Link onClick={closeSearchbar} to={`/product/${p._id}`}>
                                                <ListGroup.Item key={p._id} as="li">{p.name}</ListGroup.Item>
                                            </Link>
                                        ))
                                    }
                                </ListGroup>
                            </Form>
                            <i onClick={() => {
                                setSearchTerm("")
                                setIsShowSearchbar(!isShowSearchbar)
                            }} className="bx bx-search"></i>
                        </div>
                        <div className="header__menu__item header__menu__right__item">
                            <Link to="/cart">
                                <i className="bx bx-shopping-bag"></i>
                                {cartItems.length > 0 && <span className="header__menu__right__item__quantity">{cartItems.length}</span>}
                            </Link>
                        </div>
                        <div className="header__menu__item header__menu__right__item">
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle}>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {
                                        token === "" ?
                                            <>
                                                <Dropdown.Item>
                                                    <Link to="login">
                                                        Đăng nhập
                                                    </Link>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Link to="register">
                                                        Đăng ký
                                                    </Link>
                                                </Dropdown.Item>
                                            </> :
                                            <>
                                                <Dropdown.Item>
                                                    <Link to="user">
                                                        Thông tin tài khoản
                                                    </Link>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Link to="order">
                                                        Xem đơn hàng
                                                    </Link>
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => { handleLogout() }}>
                                                    Đăng xuất
                                                </Dropdown.Item>
                                            </>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
