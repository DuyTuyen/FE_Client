import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import Helmet from '../components/Helmet'
import HeroSlider from '../components/HeroSlider'
import Section, { SectionTitle, SectionBody } from '../components/Section'
import PolicyCard from '../components/PolicyCard'
import Grid from '../components/Grid'
import ProductCard from '../components/ProductCard'

import policy from '../assets/fake-data/policy'

import banner from '../assets/images/banner.png'
import { useSelector } from 'react-redux'
import { close, show } from '../redux/responoseAPI/loadingSlice'
import { useDispatch } from 'react-redux'
import makeRequest from '../api/axios'
import { useState } from 'react'
import axios from 'axios'
import { setError } from '../redux/responoseAPI/errorSlice'

const Home = () => {
    const [products, setProducts] = useState([])
    const loading = useSelector(state => state.loading.value)
    const dispatch = useDispatch()
    const history = useHistory()
    
    useEffect(() => {
        dispatch(show())
        Promise.all([makeRequest.productAPI.getAll()])
          .then((results) => {
            setProducts(results[0].data)
          })
          .catch(error => {
            if (axios.isAxiosError(error))
              dispatch(setError(error.response ? error.response.data.message : error.message))
            else
              dispatch(setError(error.toString()))
            history.push("/error")
          })
          .finally(() => {
            dispatch(close())
          })
      }, [dispatch,history])

    return (
        <Helmet title="Trang chủ">
            {/* hero slider */}
            <HeroSlider
                data={products.slice(0,3)}
                control={true}
                auto={false}
                timeOut={5000}
            />
            {/* end hero slider */}

            {/* policy section */}
            <Section>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            policy.map((item, index) => <Link key={index} to="/policy">
                                <PolicyCard
                                    name={item.name}
                                    description={item.description}
                                    icon={item.icon}
                                />
                            </Link>)
                        }
                    </Grid>
                </SectionBody>
            </Section>
            {/* end policy section */}

            {/* best selling section */}
            <Section>
                <SectionTitle>
                    top sản phẩm bán chạy trong tuần
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            products.map((item) => (
                                <ProductCard
                                    key={item._id}
                                    product={item}
                                />
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section>
            {/* end best selling section */}

            {/* new arrival section */}
            {/* <Section>
                <SectionTitle>
                    sản phẩm mới
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            productData.getProducts(8).map((item, index) => (
                                <ProductCard
                                    key={index}
                                    img01={item.image01}
                                    img02={item.image02}
                                    name={item.title}
                                    price={Number(item.price)}
                                    slug={item.slug}
                                />
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section> */}
            {/* end new arrival section */}
            
            {/* banner */}
            <Section>
                <SectionBody>
                    <Link to="/catalog">
                        <img src={banner} alt="" />
                    </Link>
                </SectionBody>
            </Section>
            {/* end banner */}

            {/* popular product section */}
            {/* <Section>
                <SectionTitle>
                    phổ biến
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            productData.getProducts(12).map((item, index) => (
                                <ProductCard
                                    key={index}
                                    img01={item.image01}
                                    img02={item.image02}
                                    name={item.title}
                                    price={Number(item.price)}
                                    slug={item.slug}
                                />
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section> */}
            {/* end popular product section */}
        </Helmet>
    )
}

export default Home
