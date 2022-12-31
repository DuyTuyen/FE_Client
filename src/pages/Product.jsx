import React from 'react'

import Helmet from '../components/Helmet'
import Section, { SectionBody, SectionTitle } from '../components/Section'
import Grid from '../components/Grid'
import ProductCard from '../components/ProductCard'
import ProductView from '../components/ProductView'

import { useHistory, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { show, close } from '../redux/responoseAPI/loadingSlice'
import makeRequest from '../api/axios'
import { useState } from 'react'
import { clearError, setError } from '../redux/responoseAPI/errorSlice'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { fDate } from '../utils/formatTime'
import StarRatings from 'react-star-ratings'

const Product = props => {

    const { id } = useParams()

    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [rates, setRates] = useState([])

    const loading = useSelector(state => state.loading.value)

    const dispatch = useDispatch()

    const history = useHistory()


    useEffect(() => {
        dispatch(show())
        async function getProductById() {
            try {
                const res = await makeRequest.productAPI.getById(id)
                setProduct(res.data)
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
        async function getRates(id) {
            dispatch(show())
            try {
                const res = await makeRequest.ratingAPI.getByProductId(id)
                setRates(res.data)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
                history.push("/error")
            } finally {
                dispatch(close())
            }
        }
        getProductById()
        if(id){
            getRates(id)
        }
    }, [id])


    useEffect(() => {
        window.scrollTo(0, 0)
        async function getRelatedProducts(){
            dispatch(show())
            try {
                const res = await makeRequest.productAPI.getByCategoryId(product.r_category._id)
                const filterData = res.data.filter(item => item._id !== product._id)
                setRelatedProducts(filterData)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
                history.push("/error")
            } finally {
                dispatch(close())
            }
        }
        if(product)
            getRelatedProducts()
    }, [product])

    return (
        loading ?
            "loading..." :
            <Helmet title={product?.name}>
                <Section>
                    <SectionBody>
                        <ProductView product={product} />
                    </SectionBody>
                </Section>
                <div style={{ marginTop: "30px" }} class="tab-content">
                    <div class="tab-pane active" id="tabs-7" role="tabpanel">
                        <div class="product__details__tab__content">
                            <h3 >Mức độ hài lòng {(rates.reduce((total, rate) => total += rate.star, 0)/rates.length)}/5</h3>
                            {
                                rates?.map(rate => (
                                    <div key={rate._id} class="product__details__tab__content__item">
                                        <StarRatings
                                            rating={rate.star}
                                            starRatedColor="#fa8c16"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="25px"
                                            starSpacing="5px"
                                        />
                                        <p><strong>{rate.r_user.name}</strong>: {rate.comment}</p>
                                        <strong>{fDate(rate.createdAt)}</strong>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
             <Section>
                <SectionTitle>
                    Khám phá thêm
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            relatedProducts.map((item, index) => (
                                <ProductCard
                                    key={index}
                                    product={item}
                                />   
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section> 
            </Helmet>
    )
}

export default Product
