import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import makeRequest from '../api/axios';
import { clearError, setError } from '../redux/responoseAPI/errorSlice';
import { close, show } from '../redux/responoseAPI/loadingSlice';

function ForgotPassword() {
    const {loading, error} = useSelector(state => {
        return {
            loading: state.loading.value,
            error: state.error.value
        }
    })
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    async function handleForgotPassword(e) {
        e.preventDefault()
        dispatch(show())
        try {
            const res = await makeRequest.userAPI.forgotPassword({ email })
            setMessage(res.data.message)
            dispatch(clearError())
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
            {message !== "" ?
                <Alert>{message}</Alert> :
                <>
                    <h1 style={{ textAlign: "center" }}>Quên mật khẩu</h1>
                    {error !== "" && error.split("---").map((err, index) => <Alert variant="danger" key={index + err} severity="error">{err}</Alert>)}
                    <Form onSubmit={handleForgotPassword}>
                        <Form.Group className="mb-3" Register>
                            <Form.Label>Email</Form.Label>
                            <Form.Control pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Nhập email" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Lấy lại mật khẩu
                        </Button>
                    </Form>
                </>
            }
        </Container>
    );
}

export default ForgotPassword;