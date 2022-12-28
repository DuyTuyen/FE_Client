import React, { useEffect } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import makeRequest from '../api/axios'
import { useDispatch, useSelector } from 'react-redux';
import { close, show } from '../redux/responoseAPI/loadingSlice';
import { clearError, setError } from '../redux/responoseAPI/errorSlice';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function RatingViewModal(props) {
    const [star, setStar] = useState(5)
    const [content, setContent] = useState('')
    const [ratingProducts, setRatingProducts] = useState([])

    const { loading, error } = useSelector(state => {
        return {
            loading: state.loading.value,
            error: state.error.value
        }
    })
    const { token, ratingOrder, isShow, onClose } = props
    const dispatch = useDispatch()
    const history = useHistory()

    function handleClose() {
        onClose(false)
    }

    async function handleCreateComment() {
        dispatch(show())
        try {
            await makeRequest.ratingAPI.create(token, { star, r_user: ratingOrder.r_user, comment: content, r_order: ratingOrder._id, r_products: ratingProducts })
            alert('cảm ơn bạn đã đánh giá')
            handleClose()
            dispatch(clearError())
        } catch (error) {
            if (axios.isAxiosError(error))
                dispatch(setError(error.response ? error.response.data.message : error.message))
            else
                dispatch(setError(error.toString()))
        } finally {
            dispatch(close())
        }
    }

    function handleChangeRatingProducts(id){
        let tempRatingProducts = []
        if(ratingProducts.includes(id)){
            if(ratingProducts === 1){
                alert("hãy chọn ít nhất 1 sản phẩm để thực hiện dánh giá")
                return
            }
            tempRatingProducts = ratingProducts.filter(p => p !== id)
        } else {
            tempRatingProducts = [...ratingProducts,id]
        }
        setRatingProducts(tempRatingProducts)
    }

    useEffect(() => {
        if(ratingOrder){
            const tempRatingProducts =  ratingOrder.r_orderDetails.map(detail =>
                detail.r_productDetail.r_product._id
            )
            setRatingProducts(tempRatingProducts)
        }
    },[ratingOrder])



    return (
        loading ?
            "loading..." :
            <div className={`product-view__modal ${isShow ? "active" : ""}`}>
                <div className="product-view__modal__content">
                    <div class="h-30 row d-flex justify-content-center">
                        <div class="col-lg-8 centered">
                            <div class="blog__details__comment">
                                <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Hãy cho chúng tôi biết trải nghiệm đơn hàng mà bạn vừa đặt</h4>
                                {error !== "" && error.split("---").map((err, index) => <Alert variant="danger" key={index + err} severity="error">{err}</Alert>)}

                                <div class="blog__details__evaluate">
                                    <div className="row">
                                        <div class="col-lg-6 col-md-6">
                                            <h5 >Chọn sản phẩm bạn muốn đánh giá</h5>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between"}} class="col-lg-6 col-md-6">
                                            {
                                                ratingOrder?.r_orderDetails.map(detail =>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={detail.r_productDetail.r_product.name}
                                                        defaultChecked
                                                        onChange={(e) => {handleChangeRatingProducts(detail.r_productDetail.r_product._id)}}
                                                    />
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div class="blog__details__evaluate">
                                    <div className="row">
                                        <div class="col-lg-6 col-md-6">
                                            <h5 >Mức độ hài lòng của bạn</h5>
                                        </div>
                                        <div class="col-lg-6 col-md-6">
                                            <StarRatings
                                                rating={star}
                                                starRatedColor="#fa8c16"
                                                changeRating={(star) => setStar(star)}
                                                numberOfStars={5}
                                                name='rating'
                                                starDimension="25px"
                                                starSpacing="5px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", alignItems: "center" }} class="col-lg-12 text-center">
                                        <textarea style={{ height: "100px", width: "100%" }} value={content} onChange={(e) => setContent(e.target.value)} class="comment_content"
                                            placeholder="Mời bạn đánh giá về sản phẩm..."></textarea>
                                        <Button style={{ width: "300px", marginTop: "10px" }} onClick={handleCreateComment} class="site-btn send-comment">Gửi đánh
                                            giá</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-view__modal__content__close">
                        <Button
                            size="sm"
                            onClick={() => handleClose()}
                        >
                            đóng
                        </Button>
                    </div>
                </div>
            </div>
    );
}

export default RatingViewModal;