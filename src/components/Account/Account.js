import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    GlobalOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';

import axios from 'axios';

let confirmDirty = false;

function Account(props) {
    const handleConfirmBlurPassword = e => {
        const {value} = e.target;

        confirmDirty = value !== null && value !== '' && value !== undefined;

        props.form.validateFields(['confirmpassword'], {
            force: true
        });
    };

    const compareToFirstPassword = (rule, value, callback) => {
        if (value !== null && value !== '' && value !== undefined && value !== props.form.getFieldValue('password')) {
            callback('Incorrect Confirm Password');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        if (value === null || value === '' || value === undefined) {
            confirmDirty = false;
        }

        props.form.validateFields(['confirmpassword'], {
            force: true
        });

        callback();
    };

    const saveEdit = e => {
        e.preventDefault();

        props.form.validateFields((err, values) => {
            // console.log('Received values of form: ', values);

            if (!err) {
                const payload = {
                    "userName": values.name,
                    "emailID": values.email,
                    "userContactNo": values.contactNo,
                    "password": values.password,
                    "confirmpassword": values.confirmpassword,
                    "userID": localStorage.getItem('userID')
                }

                const reply = axios.patch("/manageUser/profile?user_id=" + localStorage.getItem('userID'), payload).then(response => {
                    if (response.status === 200) {
                        if (response.data.status === "error") {
                            message.error(response.data.message);
                        } else {
                            if (response.data.message !== "") {
                                message.success(response.data.message);
                            }

                            localStorage.setItem('userName', values.name);
                            localStorage.setItem('emailID', values.email);
                            localStorage.setItem('userContactNo', values.contactNo);
                        }
                    } else {
                        message.error("Something went wrong");
                    }
                }).catch(error => {
                    if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                        localStorage.clear();
                        message.error("You were logged out!");
                        props.history.push('/login');
                    } else {
                        message.error("Unable to contact server");
                    }
                });
            }
        });
    }

    const formItemLayout = {
        labelCol: {
            xs: {span: 8},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 8},
            sm: {span: 8},
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 8,
                offset: 0,
            },
            sm: {
                span: 8,
                offset: 8,
            },
        },
    };

    const {getFieldDecorator} = props.form;

    return (
        <Form {...formItemLayout} onSubmit={saveEdit}>
            <Form.Item label="Name" hasFeedback>
                {
                    getFieldDecorator(
                        'name',
                        {
                            rules: [{
                                required: true,
                                message: 'Name is required'
                            }],
                            initialValue: localStorage.getItem('userName') || ''
                        }
                    )(
                        <Input
                            allowClear
                            prefix={<UserOutlined/>}
                            placeholder="Enter Name"
                        />,
                    )
                }
            </Form.Item>
            <Form.Item label="Email ID" hasFeedback>
                {
                    getFieldDecorator(
                        'email',
                        {
                            rules: [{
                                required: true,
                                message: 'Email ID is required'
                            }, {
                                pattern: /^[^\s@]+@[^\s@]+\.([^\s@1-9]){2,}$/,
                                message: 'Invalid Email ID',
                            }],
                            initialValue: localStorage.getItem('emailID') || ''
                        }
                    )(
                        <Input
                            allowClear
                            prefix={<MailOutlined/>}
                            placeholder="Enter Email ID"
                        />,
                    )
                }
            </Form.Item>
            <Form.Item label="Password" hasFeedback>
                {
                    getFieldDecorator(
                        'password',
                        {
                            rules: [{
                                min: 8,
                                message: 'Password must be between 8 and 12 characters'
                            }, {
                                max: 12,
                                message: 'Password must be between 8 and 12 characters'
                            }, {
                                validator: validateToNextPassword,
                            }],
                            initialValue: ''
                        }
                    )(
                        <Input.Password
                            prefix={<LockOutlined/>}
                            autocomplete="new-password"
                            placeholder="Enter Password"
                            onChange={handleConfirmBlurPassword}
                            onKeyUp={handleConfirmBlurPassword}
                            iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                        />,
                    )
                }
            </Form.Item>
            <Form.Item label="Confirm Password" hasFeedback>
                {
                    getFieldDecorator(
                        'confirmpassword',
                        {
                            rules: [{
                                required: confirmDirty,
                                message: 'Please confirm your password!'
                            }, {
                                validator: compareToFirstPassword,
                            }],
                            initialValue: ''
                        }
                    )(
                        <Input.Password
                            prefix={<LockOutlined/>}
                            autocomplete="new-password"
                            placeholder="Confirm Password"
                            iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                        />,
                    )
                }
            </Form.Item>
            <Form.Item label="Contact Number" hasFeedback>
                {
                    getFieldDecorator(
                        'contactNo',
                        {
                            rules: [{
                                pattern: /^[0-9]{8,10}$/,
                                message: 'Invalid Contact Number'
                            }],
                            initialValue: localStorage.getItem('userContactNo') !== 'null' ? localStorage.getItem('userContactNo') : ''
                        }
                    )(
                        <Input
                            allowClear
                            prefix={<PhoneOutlined/>}
                            placeholder="Enter Contact Number"
                        />,
                    )
                }
            </Form.Item>
            <Form.Item label="Role">
                <Input
                    disabled={true}
                    prefix={<TeamOutlined/>}
                    value={localStorage.getItem('roleName')}
                />
            </Form.Item>
            <Form.Item label="Organization">
                <Input
                    disabled={true}
                    prefix={<GlobalOutlined/>}
                    value={localStorage.getItem('orgName') !== 'null' ? localStorage.getItem('orgName') : ''}
                />
            </Form.Item>
            <Form.Item {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Form.create()(Account);