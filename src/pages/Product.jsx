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
import { setError } from '../redux/responoseAPI/errorSlice'
import axios from 'axios'
import { useSelector } from 'react-redux'

const Product = props => {

    const { id } = useParams()

    const [product, setProduct] = useState(null)

    const loading = useSelector(state => state.loading.value)

    const dispatch = useDispatch()

    const history = useHistory()


    useEffect(() => {
        dispatch(show())
        async function getProductById() {
            try {
                const res = await makeRequest.productAPI.getById(id)
                setProduct(res.data)
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
        getProductById()
    }, [id])


    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [product])

    return (
        loading ?
        "loading":
        <Helmet title={product?.name}>
            <Section>
                <SectionBody>
                    <ProductView product={product} />
                </SectionBody>
            </Section>
            {/* <Section>
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
            </Section> */}
        </Helmet>
    )
}

export default Product
