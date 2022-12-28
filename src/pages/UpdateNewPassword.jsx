import axios from 'axios';
import React, { useState } from 'react';
import {Alert, Button, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import makeRequest from '../api/axios';
import { clearError, setError } from '../redux/responoseAPI/errorSlice';
import { close, show } from '../redux/responoseAPI/loadingSlice';

function UpdateNewPassword() {
    const {loading, error} = useSelector(state => {
        return {
            loading: state.loading.value,
            error: state.error.value
        }
    })
    const {token} =  useParams()
    const [password, setPassword] = useState("")
    const history = useHistory()
    const dispatch = useDispatch()

    async function handleUpdateNewPassword(e) {
        e.preventDefault()
        dispatch(show())
        try {
            await makeRequest.userAPI.updateNewPassword({ password, token})
            alert("Câp nhật mật khẩu mới thành công")
            dispatch(clearError())
            history.push("/login")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                dispatch(setError(error.response.data.message))
            }
            dispatch(setError(error.toString()))
        } finally {
            dispatch(close())
        }
    }

    return (
        loading ?
        "loading...":
        <Container style={{ marginTop: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Tạo mật khẩu mới</h1>
            {error !== "" && error.split("---").map((err, index) => <Alert variant="danger" key={index + err} severity="error">{err}</Alert>)}
            <Form onSubmit={handleUpdateNewPassword}>
                <Form.Group className="mb-3" Register>
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Nhập mật khẩu mới" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Tạo
                </Button>
            </Form>
        </Container>
    );
}

export default UpdateNewPassword;