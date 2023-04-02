import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Form, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import makeRequest from "../api/axios";
import { clearError, setError } from "../redux/responoseAPI/errorSlice";
import { close, show } from "../redux/responoseAPI/loadingSlice";
import { fDate } from "../utils/formatTime";
import numberWithCommas from "../utils/numberWithCommas";
import ORDERSTATUS from "../enums/orderStatus";
import RatingViewModal from "../components/RatingViewModal";

function Order() {
  const [orders, setOrders] = useState([]);
  const [ratingOrder, setRatingOrder] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, token } = useSelector((state) => {
    return {
      loading: state.loading.value,
      token: state.token.value,
    };
  });
  const [isShowRatingModal, setIsShowRatingModal] = useState(false);

  useEffect(() => {
    dispatch(show());
    async function getOrders() {
      try {
        const res = await makeRequest.orderAPI.getAll(token);
        setOrders(res.data);
        dispatch(clearError());
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(
            setError(
              error.response ? error.response.data.message : error.message
            )
          );
        else dispatch(setError(error.toString()));
        history.push("/error");
      } finally {
        dispatch(close());
      }
    }
    getOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      if (!orders[0].isRated && orders[0].status === "success") {
        setIsShowRatingModal(true);
        setRatingOrder(orders[0]);
      }
    }
  }, [orders]);

  function handleCloseRatingModal() {
    setIsShowRatingModal(false);
  }

  return loading ? (
    "loading..."
  ) : (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Tên người nhận </th>
            <th>Số diện thoại</th>
            <th>Email</th>
            <th>Nơi nhận hàng</th>
            <th>Chi tiết...</th>
            <th>Tổng tiền</th>
            <th>Ngày tạo</th>
            <th>Trạng thái Đơn</th>
            <th>Trạng thái thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.email}</td>
              <td>{order.address}</td>
              <td>
                <Form.Select>
                  {order.r_orderDetails?.map((detail) => (
                    <option>
                      {detail.r_productDetail.r_product.name}{" "}
                      {detail.r_productDetail.color} kích cỡ {detail.size} -{" "}
                      {detail.quantity} cái
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>{numberWithCommas(order.totalBill)}</td>
              <td>{fDate(order.createdAt)}</td>
              <td>
                {
                  <Alert
                    variant={order.status === "falied" ? "danger" : "success"}
                  >
                    {ORDERSTATUS[order.status]}
                  </Alert>
                }
              </td>
              <td>
                {
                  <Alert variant={order.isPaid ? "success" : "danger"}>
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </Alert>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <RatingViewModal
        isShow={isShowRatingModal}
        onClose={handleCloseRatingModal}
        token={token}
        ratingOrder={ratingOrder}
      />
    </>
  );
}

export default Order;
