import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeRequest from '../api/axios';
import { setValue } from '../redux/token/tokenSlice';
import { clearError, setError } from '../redux/responoseAPI/errorSlice';
import { close, show } from '../redux/responoseAPI/loadingSlice';

function Register() {
    const {loading,error} = useSelector(state => {
        return {
            loading: state.loading.value,
            error: state.error.value
        } 
    })
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const dispatch = useDispatch()
    const history = useHistory()

    async function handleRegister(e) {
        e.preventDefault()
        dispatch(show())
        try {
            const res = await makeRequest.userAPI.register({ username, password,name,email,phone,address, role:"Customer" })
            dispatch(setValue(res.data))
            dispatch(clearError())
            alert("Đăng ký thành công, chào mừng bạn")
            history.push("/")
        }  catch (error) {
            if (axios.isAxiosError(error))
                dispatch(setError(error.response ? error.response.data.message : error.message))
            else
                dispatch(setError(error.toString()))
        } finally {
            dispatch(close())
        }
    }

    return (
        loading ?
        "loading...":
        <Container style={{ marginTop: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Đăng Ký</h1>
            {error !== "" && error.split("---").map((err, index) => <Alert variant="danger" key={index+err} severity="error">{err}</Alert>)}
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" >
                    <Form.Label>Tài khoản</Form.Label>
                    <Form.Control value={username} onChange={(e) => { setUsername(e.target.value) }} type="text" placeholder="Nhập tài khoản" />
                </Form.Group>
                <Form.Group className="mb-3" Register>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Nhập mật khẩu" />
                </Form.Group>
                <Form.Group className="mb-3" Register>
                    <Form.Label>Họ và Tên</Form.Label>
                    <Form.Control value={name} onChange={(e) => { setName(e.target.value) }} type="text" placeholder="Nhập họ và tên" />
                </Form.Group>
                <Form.Group className="mb-3" Register>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control pattern="(84|0[3|5|7|8|9])+([0-9]{8})\b" value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" placeholder="Nhập số điện thoại" />
                </Form.Group>
                <Form.Group className="mb-3" Register>
                    <Form.Label>Email</Form.Label>
                    <Form.Control pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Nhập email" />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control value={address} onChange={(e) => { setAddress(e.target.value) }} type="text" placeholder="Nhập địa chỉ" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Đăng ký
                </Button>
            </Form>
        </Container>
    );
}

export default Register;