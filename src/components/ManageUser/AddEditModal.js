import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {Form, Input, message, Modal, Select} from 'antd';
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
import './AddEditModal.css'

const {Option} = Select;

class addEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addEditUserData: {
                userRoleOrgID: '',
                userID: '',
                emailID: '',
                userName: '',
                password: '',
                userContactNo: '',
                roleName: '',
                orgID: ''
            },
            organizationList: [],
            roleList: [],
            orgRequired: true,
            disableOrg: false
        }
    }

    handleSignoutClick = () => {
        localStorage.clear();
        message.error("You were logged out!");
        this.props.history.push(`/login`);
    }

    componentDidMount() {
        if (localStorage.getItem('roleName').toLowerCase() === 'ceo') {
            this.setState({roleList: ['Coach', 'Admin', 'Superadmin']});
        } else if (localStorage.getItem('roleName').toLowerCase() === 'superadmin') {
            this.setState({roleList: ['Coach', 'Admin', 'Superadmin']});
        } else if (localStorage.getItem('roleName').toLowerCase() === 'admin') {
            this.setState({roleList: ['Coach', 'Admin']});
        }

        if (localStorage.getItem('roleName').toLowerCase() === 'ceo' || localStorage.getItem('roleName').toLowerCase() === 'superadmin') {
            const {organizationList} = this.props;
            this.setState({organizationList: organizationList});
        } else {
            this.setState({
                organizationList: [
                    {
                        orgID: localStorage.getItem('orgID'),
                        orgName: localStorage.getItem('orgName')
                    }
                ]
            });
        }

        const {addEditUserData} = this.props;
        if (addEditUserData) {
            this.setState({
                addEditUserData: {
                    ...addEditUserData,
                    userID: addEditUserData.userID,
                    userName: addEditUserData.userName,
                    emailID: addEditUserData.emailID,
                    password: addEditUserData.password,
                    userContactNo: addEditUserData.userContactNo,
                    roleName: addEditUserData.roleName,
                    orgID: addEditUserData.orgID,
                }
            });

            if (addEditUserData.roleName.toLowerCase() === 'superadmin' || addEditUserData.roleName.toLowerCase() === 'ceo') {
                this.props.form.resetFields(['orgID']);
                this.setState({orgRequired: false});
                this.setState({disableOrg: true});
            }
        }
    }

    changeFilter = (value, fieldId) => {
        if (fieldId === 'roleName') {
            if (value.toLowerCase() === 'superadmin') {
                this.props.form.resetFields(['orgID']);
                this.setState({orgRequired: false});
                this.setState({disableOrg: true});
            } else {
                this.setState({orgRequired: true});
                this.setState({disableOrg: false});
            }
        }
    }

    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditUserData: null
        });
    }

    submit = (values) => {
        if (this.props.addEditModalStatus === 'add') {
            if (values.password === null || values.password === "") {
                message.error("Password can not be empty");
                return;
            }

            const newUser = {
                "user": {
                    "emailID": values.emailID,
                    "userName": values.name,
                    "password": values.password,
                    "userContactNo": values.contactNo
                },
                "role": {
                    "roleName": values.roleName
                },
                "organization": {
                    "orgID": values.orgID
                }
            }

            const addUserResponse = axios.post("/manageUser/?user_id=" + localStorage.getItem('userID'), newUser).then(response => {
                return response;
            });

            addUserResponse.then(response => {
                if (response.status === 200) {
                    if (response.data.status === "error") {
                        message.error(response.data.message);
                    } else if (response.data.status === "success") {
                        this.props.refreshListingData();

                        if (response.data.message !== "") {
                            message.success(response.data.message);
                        }
                    }
                } else {
                    message.error("Something went wrong");
                }
            }).catch(error => {
                console.log(error.response);
                if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                    this.handleSignoutClick();
                } else {
                    message.error("Unable to contact server");
                }
            });
        } else {
            const newUser = {
                "userRoleOrgID": this.state.addEditUserData.userRoleOrgID,
                "user": {
                    "userID": this.state.addEditUserData.userID,
                    "emailID": values.emailID,
                    "userName": values.name,
                    "password": values.password,
                    "userContactNo": values.contactNo
                },
                "role": {
                    "roleName": values.roleName
                },
                "organization": {
                    "orgID": values.orgID
                }
            }

            const updateUserResponse = axios.patch("/manageUser/?user_id=" + localStorage.getItem('userID'), newUser).then(function (response) {
                return response;
            });

            updateUserResponse.then((response) => {
                if (response.status === 200) {
                    if (response.data.status === "error") {
                        message.error(response.data.message);
                    } else if (response.data.status === "success") {
                        this.props.refreshListingData();

                        if (response.data.message !== "") {
                            message.success(response.data.message);
                        }

                        // Don't check for strict === check coz both value are of diff types
                        if (newUser.user.userID == localStorage.getItem('userID')) {
                            localStorage.setItem('orgID', response.data.data.organization.orgID);
                            localStorage.setItem('orgName', response.data.data.organization.orgName);
                            localStorage.setItem('roleName', response.data.data.role.roleName);
                            localStorage.setItem('emailID', response.data.data.user.emailID);
                            localStorage.setItem('userContactNo', response.data.data.user.userContactNo);
                            localStorage.setItem('userName', response.data.data.user.userName);
                        }
                    }
                } else {
                    message.error("Something went wrong");
                }
            }).catch(error => {
                console.log(error.response);
                if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                    this.handleSignoutClick();
                } else {
                    message.error("Unable to contact server");
                }
            });
        }
    }

    render() {
        const {addEditUserData, organizationList = [], roleList = []} = this.state;
        const {cancelAddEdit, addEditModalStatus} = this.props;
        const {getFieldDecorator} = this.props.form;
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

        return (
            <Modal
                title={addEditModalStatus === 'edit' ? <b>Update User</b> : <b>Add New User</b>}
                visible={addEditModalStatus.length > 0}
                okText={addEditModalStatus === 'edit' ? 'Update' : 'Create'}
                onOk={() => {
                    this.props.form.validateFields().then(values => {
                        this.submit(values);
                    }).catch(info => {
                        console.log("Validation Failed:", info);
                    });
                }}
                cancelText="Cancel"
                onCancel={cancelAddEdit}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="Name" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'name',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Name is required'
                                        }
                                        ],
                                    }
                                )(
                                    <Input
                                        allowClear
                                        prefix={<UserOutlined/>}
                                        placeholder="Enter Name"
                                        onChange={(event) => this.changeFilter(event.target.value, 'userName')}
                                    />,
                                )
                                :
                                getFieldDecorator(
                                    'name',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Name is required'
                                        }],
                                        initialValue: addEditUserData.userName
                                    }
                                )(
                                    <Input
                                        allowClear
                                        prefix={<UserOutlined/>}
                                        placeholder="Enter Name"
                                        onChange={(event) => this.changeFilter(event.target.value, 'userName')}
                                    />,
                                )
                        }
                    </Form.Item>
                    <Form.Item label="Email ID" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'emailID',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Email ID is required',
                                        }, {
                                            pattern: /^[^\s@]+@[^\s@]+\.([^\s@1-9]){2,}$/,
                                            message: 'Invalid Email ID',
                                        }]
                                    }
                                )(
                                    <Input
                                        allowClear
                                        prefix={<MailOutlined/>}
                                        placeholder="Enter Email ID"
                                        onChange={(event) => this.changeFilter(event.target.value, 'emailID')}
                                    />,
                                )
                                :
                                getFieldDecorator(
                                    'emailID',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Email ID is required',
                                        }, {
                                            pattern: /^[^\s@]+@[^\s@]+\.([^\s@1-9]){2,}$/,
                                            message: 'Invalid Email ID',
                                        }],
                                        initialValue: addEditUserData.emailID
                                    }
                                )(
                                    <Input
                                        allowClear
                                        prefix={<MailOutlined/>}
                                        placeholder="Enter Email ID"
                                        onChange={(event) => this.changeFilter(event.target.value, 'emailID')}
                                    />,
                                )
                        }
                    </Form.Item>
                    <Form.Item label="Password" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'password',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Password is required'
                                        }, {
                                            min: 8,
                                            message: 'Password must be between 8 and 12 characters'
                                        }, {
                                            max: 12,
                                            message: 'Password must be between 8 and 12 characters'
                                        }],
                                    }
                                )(
                                    <Input.Password
                                        allowClear
                                        prefix={<LockOutlined/>}
                                        autocomplete="new-password"
                                        placeholder="Enter Password"
                                        onChange={(event) => this.changeFilter(event.target.value, 'password')}
                                        iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                    />
                                )
                                :
                                getFieldDecorator(
                                    'password',
                                    {
                                        rules: [{
                                            required: false,
                                            message: 'Password is required'
                                        }, {
                                            min: 8,
                                            message: 'Password must be between 8 and 12 characters'
                                        }, {
                                            max: 12,
                                            message: 'Password must be between 8 and 12 characters'
                                        }],
                                        initialValue: addEditUserData.password
                                    }
                                )(
                                    <Input.Password
                                        allowClear
                                        prefix={<LockOutlined/>}
                                        autocomplete="new-password"
                                        placeholder="Enter Password"
                                        onChange={(event) => this.changeFilter(event.target.value, 'password')}
                                        iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                    />
                                )
                        }
                    </Form.Item>
                    <Form.Item label="Contact Number" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'contactNo',
                                    {
                                        rules: [{
                                            pattern: /^[0-9]{8,10}$/,
                                            message: 'Invalid Contact Number'
                                        }],
                                    }
                                )(
                                    <Input
                                        allowClear
                                        prefix={<PhoneOutlined/>}
                                        placeholder="Enter Contact Number"
                                        onChange={(event) => this.changeFilter(event.target.value, 'userContactNo')}
                                    />
                                )
                                :
                                getFieldDecorator(
                                    'contactNo',
                                    {
                                        rules: [{
                                            pattern: /^[0-9]{8,10}$/,
                                            message: 'Invalid Contact Number'
                                        }],
                                        initialValue: addEditUserData.userContactNo
                                    }
                                )(
                                    <Input
                                        allowClear
                                        prefix={<PhoneOutlined/>}
                                        placeholder="Enter Contact Number"
                                        onChange={(event) => this.changeFilter(event.target.value, 'userContactNo')}
                                    />
                                )
                        }
                    </Form.Item>
                    <Form.Item label="Role" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'roleName',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Please select a Role',
                                        }],
                                    }
                                )(
                                    <Select
                                        showArrow
                                        placeholder={
                                            <React.Fragment>
                                                <TeamOutlined/>
                                                &nbsp; Select Role
                                            </React.Fragment>
                                        }
                                        onChange={(value) => this.changeFilter(value, 'roleName')}
                                    >
                                        {
                                            roleList.map(roleName =>
                                                <Option value={roleName.toLowerCase()}>
                                                    {roleName}
                                                </Option>)
                                        }
                                    </Select>
                                ) :

                                getFieldDecorator(
                                    'roleName',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Please select a Role',
                                        }],
                                        initialValue: addEditUserData.roleName
                                    }
                                )(
                                    <Select
                                        showArrow
                                        placeholder={
                                            <React.Fragment>
                                                <TeamOutlined/>
                                                &nbsp; Select Role
                                            </React.Fragment>
                                        }
                                        onChange={(value) => this.changeFilter(value, 'roleName')}
                                        disabled={addEditUserData.roleName.toLowerCase() === 'ceo'}
                                    >
                                        {
                                            roleList.map(roleName =>
                                                <Option value={roleName.toLowerCase()}>
                                                    {roleName}
                                                </Option>)
                                        }
                                    </Select>
                                )
                        }
                    </Form.Item>
                    <Form.Item label="Organization" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'orgID',
                                    {
                                        rules: [{
                                            required: this.state.orgRequired,
                                            message: 'Please select an Organization',
                                        }],
                                    }
                                )(
                                    <Select
                                        showSearch
                                        allowClear
                                        showArrow
                                        placeholder={
                                            <React.Fragment>
                                                <GlobalOutlined/>
                                                &nbsp; Select Organization
                                            </React.Fragment>
                                        }
                                        onChange={(value) => this.changeFilter(value, 'orgID')}
                                        disabled={this.state.disableOrg}
                                    >
                                        {
                                            organizationList.map(organizationData =>
                                                <Option value={organizationData.orgID}>
                                                    {organizationData.orgName}
                                                </Option>)
                                        }
                                    </Select>
                                ) :

                                getFieldDecorator(
                                    'orgID',
                                    {
                                        rules: [{
                                            required: this.state.orgRequired,
                                            message: 'Please select an Organization',
                                        }],
                                        initialValue: addEditUserData.roleName.toLowerCase() !== 'superadmin' && addEditUserData.roleName.toLowerCase() !== 'ceo' ? addEditUserData.orgID : '',
                                    }
                                )(
                                    <Select
                                        showSearch
                                        allowClear
                                        showArrow
                                        placeholder={
                                            <React.Fragment>
                                                <GlobalOutlined/>
                                                &nbsp; Select Organization
                                            </React.Fragment>
                                        }
                                        onChange={(value) => this.changeFilter(value, 'orgID')}
                                        disabled={this.state.disableOrg}
                                    >
                                        {
                                            organizationList.map(organizationData =>
                                                <Option value={organizationData.orgID}>
                                                    {organizationData.orgName}
                                                </Option>)
                                        }
                                    </Select>
                                )
                        }
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}


export default withRouter(Form.create()(addEdit));