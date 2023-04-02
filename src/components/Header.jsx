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
import Notification from './Notification'

const mainNav = [
    {
        display: "Trang chủ",
        path: "/"
    },
    {
        display: "Sản phẩm",
        path: "/products"
    },
]

const Header = () => {
    const [isShowSearchbar, setIsShowSearchbar] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestedProcucts, setSuggestedProducts] = useState([])
    const [notifications, setNotifications] = useState([])
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

    const CustomBellToggle = React.forwardRef(({ children, onClick }, ref) => (
        <i
            className="bx bx-bell"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {notifications?.filter(n => !n.isRead).length > 0 && <span className="header__menu__right__item__quantity">{notifications?.filter(n => !n.isRead).length}</span>}
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


    const handleMarkRead = async (notification) => {
        dispatch(show());
        try {
          await makeRequest.notificationAPI.updateIsRead(notification._id);
        } catch (error) {
          if (axios.isAxiosError(error))
            dispatch(setError(error.response ? error.response.data.message : error.message));
          else dispatch(setError(error.toString()));
          history.push("/error")
        } finally {
          dispatch(close());
        }
      }
    
      const handleMarkAllAsRead = async () => {
        try {
            const temp = notifications.filter(n => !n.isRead)
            if(temp.length >0){
                await Promise.all(temp.map(n => handleMarkRead(n)))
                const tempNotifications = [...notifications.map(n => {
                    return {
                        ...n,
                        isRead:true
                    }
                })]
                setNotifications(tempNotifications)
            }
        } catch (error) {
            console.log(error)
        }
      };

    useEffect(() => {
        async function search() {
            if (searchTerm !== "") {
                try {
                    const res = await makeRequest.productAPI.search(searchTerm)
                    setSuggestedProducts(res.data.docs)
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

    useEffect(() => {
        async function getNotifications() {
            try {
                const res = await makeRequest.notificationAPI.getAll(token)
                setNotifications(res.data)
            } catch (error) {
                if (axios.isAxiosError(error))
                    console.log((error.response ? error.response.data.message : error.message))
                else
                    console.log(error.toString());
            }
        }
        getNotifications()
    }, [token])

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
                                                    <Link to="/login">
                                                        Đăng nhập
                                                    </Link>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Link to="/register">
                                                        Đăng ký
                                                    </Link>
                                                </Dropdown.Item>
                                            </> :
                                            <>
                                                <Dropdown.Item>
                                                    <Link to="/user">
                                                        Thông tin tài khoản
                                                    </Link>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Link to="/order">
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
                        <div className="header__menu__item header__menu__right__item">
                            <Dropdown onClick= {handleMarkAllAsRead}>
                                <Dropdown.Toggle as={CustomBellToggle}>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        notifications.map(n => (
                                            <Dropdown.Item key={n._id} >
                                                <Notification
                                                    notification={n}
                                                />
                                            </Dropdown.Item>
                                        ))
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
