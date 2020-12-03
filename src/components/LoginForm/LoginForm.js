import React, {useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import {withRouter} from "react-router-dom";
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import Header from '../Header/Header';

import {Button, Input, message,Spin, Icon } from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';

import {ButtonFieldContainer, FieldContainer, LoginContainer, LoginFormContainer,} from './LoginForm.styled';


function LoginForm(props) {
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: null,
        loader:false,
    })

    const handleChange = (value, id) => {
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const antIcon = <Icon type="loading" style={{fontSize:50,zIndex:5  }} spin />;

    const handleSubmitClick = (e) => {
        console.log(state.loader)
        setState({ loader: true});
        console.log(state.loader)
        e.preventDefault();

        const payload = {
            "emailID": state.email,
            "password": state.password,
        }

        axios.post("/login/", payload).then(function (response) {
            if (response.status === 200) {
                if (response.data.status === 'error') {
                    message.error(response.data.message);
                } else {
                    console.log("in 200 case")
                    console.log(state.loader)
                    //setState({ loader: false});
                    console.log(state.loader)
                    localStorage.setItem('orgID', response.data.data.organization.orgID);
                    localStorage.setItem('orgName', response.data.data.organization.orgName);
                    localStorage.setItem('roleName', response.data.data.role.roleName);
                    localStorage.setItem('emailID', response.data.data.user.emailID);
                    localStorage.setItem('userContactNo', response.data.data.user.userContactNo);
                    localStorage.setItem('userID', response.data.data.user.userID);
                    localStorage.setItem('userName', response.data.data.user.userName);
                    // localStorage.setItem(ACCESS_TOKEN_NAME, Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
                    localStorage.setItem(ACCESS_TOKEN_NAME, response.data.debugMessage);
                    axios.defaults.headers = {'Authorization': 'Bearer ' + response.data.debugMessage};

                    redirectToHome();
                }
            } else {
                message.error(response.data.message);
            }
        }).catch(function (error) {
            console.log(error);
            message.error("Unable to contact server");
        });
    }

    const redirectToHome = () => {
        if (localStorage.getItem('roleName') === 'ceo') {
            props.history.push('/manageUser');
        } else if (localStorage.getItem('roleName') === 'superadmin') {
            props.history.push('/manageOrganizations');
        } else if (localStorage.getItem('roleName') === 'admin') {
            props.history.push('/manageTemplates');
        } else if (localStorage.getItem('roleName') === 'coach') {
            props.history.push('/assessment');
        }
        // props.history.push('/dashboard');
    }

    const redirectToRegister = () => {
        props.history.push('/forgot');
    }

    return (
    
       
<LoadingMask loading={state.loader} text={"loading..."}>
  

   <div>
        <Header />
             <LoginContainer>
                 <LoginFormContainer>
                     <FieldContainer>
                         <Input
                            prefix={<MailOutlined/>}
                            placeholder="Email ID"
                            type="email"
                            id="email"
                            value={state.email}
                            onChange={(event) => handleChange(event.target.value, 'email')}
                        />
                    </FieldContainer>
                    <FieldContainer>
                        <Input
                            prefix={<LockOutlined/>}
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={state.password}
                            onChange={(event) => handleChange(event.target.value, 'password')}
                        />
                    </FieldContainer>
                    
                    <ButtonFieldContainer>
                        <Button type="primary" onClick={handleSubmitClick}>
                            Log In
                        </Button>
                        <Button type="link" onClick={redirectToRegister}>
                            Forgot Password?
                        </Button>
                    </ButtonFieldContainer>

                    {/* {state.loader ? (
                
                    
                <Spin indicator={antIcon} />
            
                
                ) :null} */}
                </LoginFormContainer>
                
            </LoginContainer>
        
            
        </div>
  
</LoadingMask>


    )
}

export default withRouter(LoginForm);