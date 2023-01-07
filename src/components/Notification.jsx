import React from 'react';
import orderStatus from '../enums/orderStatus';
import { fDate, fToNow } from '../utils/formatTime';
import notificationContent from '../enums/notificationContent';

Notification.propTypes = {

};

function Notification(props) {
    const { notification } = props
    return (
        <div className="notification">
            <div className="notification__left">
                <img className="notification__left__img" src={`${process.env.REACT_APP_CLOUDINARYURL}/${notification?.r_order.r_orderDetails[0].r_productDetail.img}`}></img>
            </div>
            <div className="notification__right">
                <h2 className="notification__right__title">Đơn hàng {orderStatus[notification?.r_order.status]}</h2>
                <div className="notification__right__content">
                    Đơn hàng gồm{notification?.r_order.r_orderDetails.reduce((str, detail) => `${str}${detail.quantity} ${detail.r_productDetail.r_product.name} ${detail.r_productDetail.color}, `, "")} được đặt ngày {fDate(notification?.createdAt)} {notificationContent[notification?.r_order.status]}.
                </div>
                <p className='notification__right__date'>{fToNow(notification?.createdAt)}</p>
            </div>
            <br />
        </div>
    );
}

export default Notification;