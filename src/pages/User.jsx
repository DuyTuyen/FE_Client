import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeRequest from '../api/axios';
import { setValue } from '../redux/token/tokenSlice';
import { clearError, setError } from '../redux/responoseAPI/errorSlice';
import { close, show } from '../redux/responoseAPI/loadingSlice';

function User() {
    const { loading, error, token } = useSelector(state => {
        return {
            loading: state.loading.value,
            error: state.error.value,
            token: state.token.value
        }
    })
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const dispatch = useDispatch()

    async function handleUpdatingUser(e) {
        e.preventDefault()
        dispatch(show())
        try {
            const res = await makeRequest.userAPI.updateUserInfo(token, { name, email, phone, address })
            const data = res.data
            setName(data.name)
            setEmail(data.email)
            setPhone(data.phone)
            setAddress(data.address)
            dispatch(clearError())
            alert("Cập nhật thành công")
        } catch (error) {
            if (axios.isAxiosError(error))
                dispatch(setError(error.response ? error.response.data.message : error.message))
            else
                dispatch(setError(error.toString()))
        } finally {
            dispatch(close())
        }
    }

    useEffect(() => {
        async function getUserInfo() {
            dispatch(show())
            try {
                const res = await makeRequest.userAPI.getUserInfo(token)
                const data = res.data
                setName(data.name)
                setEmail(data.email)
                setPhone(data.phone)
                setAddress(data.address)
            } catch (error) {
                if (axios.isAxiosError(error))
                    dispatch(setError(error.response ? error.response.data.message : error.message))
                else
                    dispatch(setError(error.toString()))
            } finally {
                dispatch(close())
            }
        }
        getUserInfo()
    }, [token])
    return (
        loading ?
            "loading..." :
            <Container style={{ marginTop: "20px" }}>
                <h1 style={{ textAlign: "center" }}>Thông tin người dùng</h1>
                {(error !== "" && error) && error.split("---").map((err, index) => <Alert variant="danger" key={index + err} severity="error">{err}</Alert>)}
                <Form onSubmit={handleUpdatingUser}>
                    <Form.Group className="mb-3" User>
                        <Form.Label>Họ và Tên</Form.Label>
                        <Form.Control value={name} onChange={(e) => { setName(e.target.value) }} type="text" placeholder="Nhập họ và tên" />
                    </Form.Group>
                    <Form.Group className="mb-3" User>
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control pattern="(84|0[3|5|7|8|9])+([0-9]{8})\b" value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" placeholder="Nhập số điện thoại" />
                    </Form.Group>
                    <Form.Group className="mb-3" User>
                        <Form.Label>Email</Form.Label>
                        <Form.Control pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Nhập email" />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control value={address} onChange={(e) => { setAddress(e.target.value) }} type="text" placeholder="Nhập địa chỉ" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Cập nhật
                    </Button>
                </Form>
            </Container>
    );
}

export default User;