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
import COLOR from '../enums/Color'
import SIZE from '../enums/Size'
import Section, { SectionBody } from '../components/Section'
import Grid from '../components/Grid'
import CategoryCard from '../components/CategoryCard'

const Products = () => {
    const cateId = useQuery().get("cateId")
    const searchTerm = useQuery().get("searchTerm")
    const loading = useSelector(state => state.loading.value)
    const dispatch = useDispatch()
    const history = useHistory()

    const initFilter = {
        r_brand: [],
        color: [],
        size: []
    }
    const [activeCategory, setActiveCategory] = useState(null)
    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState(null)
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

    const handleChangePage = async (activePage) => {
        try {
            dispatch(show())
            let myFilter = `reqPage=${activePage}`
            if (!filter.r_brand.includes("all"))
                myFilter += filter.r_brand.reduce((q_brand, item) => `${q_brand}r_brand[]=${item}&`, "")
            if (!filter.color.includes("all"))
                myFilter += filter.color.reduce((q_color, item) => `${q_color}color[]=${item}&`, "")
            if (!filter.size.includes("all"))
                myFilter += filter.size.reduce((q_size, item) => `${q_size}size[]=${item}&`, "")
            if (activeCategory)
                myFilter += `r_category=${activeCategory._id}`
            const res = await makeRequest.productAPI.filter(myFilter)
            setProducts(res.data.docs)
            setPagination({activePage: res.data.page, totalPages: res.data.totalPages})
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

    useEffect(() => {
        if (cateId && categories.length > 0){
            const foundCate = categories.find(c => c._id === cateId)
            setActiveCategory(foundCate)
        }
    }, [cateId,categories])

    useEffect(() => {
        async function getProducts() {
            try {
                dispatch(show())
                let res = null
                if (searchTerm)
                    res = await makeRequest.productAPI.search(searchTerm)
                if (activeCategory)
                    res = await makeRequest.productAPI.getByCategoryId(activeCategory._id)
                else
                    res = await makeRequest.productAPI.getAll()
                setProducts(res.data.docs)
                setPagination({activePage: res.data.page, totalPages: res.data.totalPages})
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
    }, [searchTerm, activeCategory])

    useEffect(() => {
        dispatch(show())
        Promise.all([makeRequest.categoryAPI.getAll(), makeRequest.brandAPI.getAll()])
            .then(results => {
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
                    myFilter += filter.r_brand.reduce((q_brand, item) => `${q_brand}r_brand[]=${item}&`, "")
                if (!filter.color.includes("all"))
                    myFilter += filter.color.reduce((q_color, item) => `${q_color}color[]=${item}&`, "")
                if (!filter.size.includes("all"))
                    myFilter += filter.size.reduce((q_size, item) => `${q_size}size[]=${item}&`, "")
                if (activeCategory)
                    myFilter += `r_category=${activeCategory._id}`
                const res = await makeRequest.productAPI.filter(myFilter)
                setProducts(res.data.docs)
                setPagination({activePage: res.data.page, totalPages: res.data.totalPages})
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
        if (filter !== initFilter)
            filterProducts()
    }, [filter])

    return (
        <Helmet title="Sản phẩm">
            <Section>
                <SectionBody>
                    <Grid
                        col={8}
                        mdCol={4}
                        smCol={4}
                        gap={20}
                    >
                        {
                            categories.map((item) => (
                                <div
                                    onClick={() => {
                                        if (item._id === activeCategory?._id)
                                            setActiveCategory(null)
                                        else
                                            setActiveCategory(item)
                                    }}
                                >
                                    <CategoryCard
                                        style={{ cursor: "pointer", borderColor: item._id === activeCategory?._id ? "blue" : "white" }}
                                        key={item._id}
                                        item={item}
                                    />
                                </div>
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section>
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
                                pagination={pagination}
                                onChangePage={handleChangePage}
                            />
                    }
                </div>
            </div>
        </Helmet>
    )
}

export default Products
