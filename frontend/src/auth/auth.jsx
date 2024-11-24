import './auth.css'
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { login, signup } from './authActions'
import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import Messages from '../common/msg/messages'
import Input from '../common/form/inputAuth'

class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = { loginMode: true }
    }

    // Используем функцию для переключения между режимами
    changeMode = () => this.setState(prevState => ({ loginMode: !prevState.loginMode }))

    onSubmit(values) {
        const { login, signup } = this.props
        this.state.loginMode ? login(values) : signup(values)
    }

    render() {
        const { loginMode } = this.state
        const { handleSubmit } = this.props
        return (
            <div className="login-box">
                <div className="login-logo"><b>Office</b>Map</div>
                <div className="login-box-body">
                    <p className="login-box-msg">Добро пожаловать!</p>
                    <form onSubmit={handleSubmit(v => this.onSubmit(v))}>
                        <Field component={Input} type="input" name="name"
                            placeholder="Имя" icon='user' hide={loginMode} />
                        <Field component={Input} type="email" name="email"
                            placeholder="Электронная почта" icon='envelope' />
                        <Field component={Input} type="password" name="password"
                            placeholder="Пароль" icon='lock' />
                        <Field component={Input} type="password" name="confirm_password"
                            placeholder="Подтвердите пароль" icon='lock' hide={loginMode} />
                        <Row>
                            <Grid cols="12">
                                <button type="submit"
                                    className="btn btn-primary btn-block btn-flat">
                                    {loginMode ? 'Войти' : 'Зарегистрироваться'}
                                </button>
                            </Grid>
                        </Row>
                    </form>
                    <br />

                </div>
                <Messages />
            </div>
        )
    }
}

Auth = reduxForm({ form: 'authForm' })(Auth)
const mapDispatchToProps = dispatch => bindActionCreators({ login, signup }, dispatch)
export default connect(null, mapDispatchToProps)(Auth)
