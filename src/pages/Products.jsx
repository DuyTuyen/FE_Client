import React, { useState, useEffect, useRef } from 'react'

import Helmet from '../components/Helmet'
import CheckBox from '../components/CheckBox'

import Button from '../components/Button'
import InfinityList from '../components/InfinityList'
import makeRequest from '../api/axios'
import { close, show } from '../redux/responoseAPI/loadingSlice'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { clearError, setError } from '../redux/responoseAPI/errorSlice'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useQuery from '../hooks/useQuery'
import { Card, CardGroup, Col, Container, Row } from 'react-bootstrap'
import COLOR from '../enums/Color'
import SIZE from '../enums/Size'

const Products = () => {
    const cateId = useQuery().get("cateId")
    const searchTerm = useQuery().get("searchTerm")

    const [activeCategory, setActiveCategory] = useState(null)

    const loading = useSelector(state => state.loading.value)
    const dispatch = useDispatch()
    const history = useHistory()

    const initFilter = {
        r_brand: [],
        color: [],
        size: []
    }

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])

    const [filter, setFilter] = useState(initFilter)

    const clearFilter = () => setFilter(initFilter)

    const filterRef = useRef(null)

    const showHideFilter = () => filterRef.current.classList.toggle('active')

    const filterSelect = (checked, value, filterName) => {
        switch (filterName) {
            case "r_brand":
                if (checked) {
                    setFilter({ ...filter, r_brand: [...filter.r_brand, value] })
                }
                else {
                    let newR_Brand = []
                    if (value !== "all")
                        newR_Brand = filter.r_brand.filter(e => e !== value)
                    setFilter({ ...filter, r_brand: newR_Brand })
                }
                break
            case "color":
                if (checked) {
                    setFilter({ ...filter, color: [...filter.color, value] })
                }
                else {
                    let newColor = []
                    if (value !== "all")
                        newColor = filter.color.filter(e => e !== value)
                    setFilter({ ...filter, color: newColor })
                }
                break
            case "size":
                if (checked) {
                    setFilter({ ...filter, size: [...filter.size, value] })
                }
                else {
                    let newSize = []
                    if (value !== "all")
                        newSize = filter.size.filter(e => e !== value)
                    setFilter({ ...filter, size: newSize })
                }
                break
        }

    }
    useEffect(() => {
        if(cateId)
            setActiveCategory(categories.find(c => c._id === cateId))
    },[cateId])

    useEffect(() => {
        async function getProducts() {
            try {
                dispatch(show())
                let res = null
                if (searchTerm)
                    res = await makeRequest.productAPI.search(searchTerm)
                if(activeCategory)
                    res = await makeRequest.productAPI.getByCategoryId(activeCategory._id)
                else
                    res = await makeRequest.productAPI.getAll()
                setProducts(res.data)
                dispatch(clearError())
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
        getProducts()
    }, [searchTerm,activeCategory])

    useEffect(() => {
        dispatch(show())
        Promise.all([makeRequest.categoryAPI.getAll(), makeRequest.brandAPI.getAll()])
            .then(results => {
                console.log(results)
                setCategories(results[0].data)
                setBrands(results[1].data)
                dispatch(clearError())
            })
            .catch((error) => {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
                history.push("/error")
            })
            .finally(() => {
                dispatch(close())
            })
    }, [])

    useEffect(() => {
        async function filterProducts() {
            try {
                dispatch(show())
                let myFilter = ""
                if (!filter.r_brand.includes("all"))
                    myFilter += filter.r_brand.reduce((q_brand, item) => `${q_brand}r_brand[]=${item}&`,"")
                if (!filter.color.includes("all"))
                    myFilter += filter.color.reduce((q_color, item) => `${q_color}color[]=${item}&`,"")
                if (!filter.size.includes("all"))
                    myFilter += filter.size.reduce((q_size, item) => `${q_size}size[]=${item}&`,"")
                const res = await makeRequest.productAPI.filter(myFilter)
                setProducts(res.data)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
                history.push("/error")
            }
            finally{
                dispatch(close())
            }
        }
        if(filter !== initFilter)
            filterProducts()
    }, [filter])

    return (
        <Helmet title="Sản phẩm">
            <Container fluid>
                <CardGroup style={{ marginBottom: "50px" }}>
                    <Row xs={1} md={4} className="g-4">

                        {
                            categories.map(cate => (
                                <Col onClick={(e) => { setActiveCategory(cate) }} style={{ cursor: "pointer" }}>
                                    <Card style={{ width: '12rem', height: '8rem', display: "flex", alignItems: "center", padding: 7, border: "2px solid", borderColor: cate._id === activeCategory?._id ? "#0d6efd" : "white" }}>
                                        <Card.Img style={{ width: '8rem', height: '5rem' }} variant="top" src={`${process.env.REACT_APP_CLOUDINARYURL}/${cate.img}`} />
                                        <Card.Body>
                                            <Card.Title>{cate.name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </CardGroup>
            </Container>
            <div className="catalog">
                <div className="catalog__filter" ref={filterRef}>
                    <div className="catalog__filter__close" onClick={() => showHideFilter()}>
                        <i className="bx bx-left-arrow-alt"></i>
                    </div>
                    <div className="catalog__filter__widget">
                        <div className="catalog__filter__widget__title">
                            Thương hiệu
                        </div>
                        <div className="catalog__filter__widget__content">
                            <div className="catalog__filter__widget__content__item">
                                <CheckBox
                                    label="Tất cả"
                                    onChange={(e) => { filterSelect(e.checked, "all", "r_brand") }}
                                    checked={filter.r_brand.includes("all")}
                                />
                            </div>
                            {
                                brands.map((item, index) => (
                                    <div key={item._id} className="catalog__filter__widget__content__item">
                                        <CheckBox
                                            label={item.name}
                                            onChange={(e) => { filterSelect(e.checked, item.name, "r_brand") }}
                                            checked={
                                                filter.r_brand.includes("all") ?
                                                    true :
                                                    filter.r_brand.includes(item.name)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="catalog__filter__widget">
                        <div className="catalog__filter__widget__title">
                            màu sắc
                        </div>
                        <div className="catalog__filter__widget__content">
                            <div className="catalog__filter__widget__content__item">
                                <CheckBox
                                    label="Tất cả"
                                    onChange={(e) => { filterSelect(e.checked, "all", "color") }}
                                    checked={filter.color.includes("all")}
                                />
                            </div>
                            {
                                Object.keys(COLOR).map((item, index) => (
                                    <div key={index} className="catalog__filter__widget__content__item">
                                        <CheckBox
                                            label={COLOR[item]}
                                            onChange={(e) => { filterSelect(e.checked, item, "color") }}
                                            checked={
                                                filter.color.includes("all") ?
                                                    true :
                                                    filter.color.includes(item)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="catalog__filter__widget">
                        <div className="catalog__filter__widget__title">
                            kích cỡ
                        </div>
                        <div className="catalog__filter__widget__content">
                            <div className="catalog__filter__widget__content__item">
                                <CheckBox
                                    label="Tất cả"
                                    onChange={(e) => { filterSelect(e.checked, "all", "size") }}
                                    checked={filter.size.includes("all")}
                                />
                            </div>
                            {
                                Object.keys(SIZE).map((item, index) => (
                                    <div key={index} className="catalog__filter__widget__content__item">
                                        <CheckBox
                                            label={SIZE[item]}
                                            onChange={(e) => { filterSelect(e.checked, item, "size") }}
                                            checked={
                                                filter.size.includes("all") ?
                                                    true :
                                                    filter.size.includes(item)}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="catalog__filter__widget">
                        <div className="catalog__filter__widget__content">
                            <Button size="sm" onClick={clearFilter}>xóa bộ lọc</Button>
                        </div>
                    </div>
                </div>
                <div className="catalog__filter__toggle">
                    <Button size="sm" onClick={() => showHideFilter()}>bộ lọc</Button>
                </div>
                <div className="catalog__content">
                    {
                        loading ?
                            "loading..." :
                            <InfinityList
                                data={products}
                            />
                    }
                </div>
            </div>
        </Helmet>
    )
}

export default Products
