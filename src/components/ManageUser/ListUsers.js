import React from 'react';
import axios from 'axios';
import './ListUsers.css'
import AddEditModal from './AddEditModal';
import {SearchOutlined} from '@ant-design/icons';
import {filterArray} from '../../utils/utilityFunctions';
import {Button, Icon, message, Popconfirm, Table, Tooltip} from 'antd';
import {ActionContainer, IconContainer, InputField, InputFilterContainer} from './style';

class ManageUsers extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            filterValue: '',
            dataSource: [],
            addEditModalStatus: '',
            addEditUserData: null,
            deleteData: null,
            organizationList: [],
        }
    }

    handleSignoutClick = () => {
        localStorage.clear();
        message.error("You were logged out!");
        this.props.history.push(`/login`);
    }

    componentDidMount() {
        this.fetchUsersList();

        if (localStorage.getItem('roleName').toLowerCase() === 'ceo' || localStorage.getItem('roleName').toLowerCase() === 'superadmin') {
            axios.get("/manageOrganization/getAll/").then(response => {
                if (response.status === 200) {
                    this.setState({organizationList: response.data.data});
                } else {
                    console.log('error fetching orgList');
                }
            }).catch(error => {
                console.log(error.response);
                if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                    // message.error("You were logged out!");
                    // this.handleSignoutClick();
                } else {
                    // message.error("Unable to contact server");
                }
                return false;
            });
        }
    }

    fetchUsersList = () => {
        axios.get("/manageUser/getAll/?user_id=" + localStorage.getItem('userID')).then(response => {
            if (response.status === 200) {
                if (response.data.status === "error") {
                    message.error(response.data.message);
                } else {
                    if (response.data.message !== "") {
                        message.success(response.data.message);
                    }
                    this.setState({dataSource: response.data.data});
                }
            } else {
                message.error("Something went wrong");
            }
        }).catch(error => {
            console.log(error.response);
            if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                // message.error("You were logged out!");
                this.handleSignoutClick();
            } else {
                message.error("Unable to contact server");
            }
        });
    }


    // export ManageUsers();

    deleteUser = (userRoleOrgID, userData) => {
        this.setState({
            addEditModalStatus: '',
            deleteData: userData
        });

        const deleteUserPayload = {
            userRoleOrgID: userData.userRoleOrgID,
            user: userData.user,
            role: userData.role,
            organization: userData.organization
        }

        axios.delete("/manageUser/?user_id=" + localStorage.getItem('userID'), {data: deleteUserPayload}).then(response => {
            if (response.status === 200) {
                if (response.data.status === "error") {
                    message.error(response.data.message);
                } else if (response.data.status === "success") {
                    if (response.data.message !== "") {
                        message.success(response.data.message);
                    }

                    const dataSource = [...this.state.dataSource];
                    // this.setState({ dataSource: dataSource.filter(item => item.userRoleOrgID !== userRoleOrgID) });
                    dataSource[dataSource.indexOf(userData)].deleted = true;
                    this.setState({dataSource: dataSource});
                    // this.refreshListingData();
                }
            } else {
                message.error("Something went wrong");
            }
        }).catch(error => {
            console.log(error.response);
            if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                // message.error("You were logged out!");
                this.handleSignoutClick();
            } else {
                message.error("Unable to contact server");
            }
        });
    }

    reviveUser = (userRoleOrgID, userData) => {
        this.setState({
            addEditModalStatus: '',
            deleteData: userData
        });

        const reviveUserPayload = {
            userRoleOrgID: userData.userRoleOrgID,
            deleted: userData.deleted,
            user: userData.user,
            role: userData.role,
            organization: userData.organization
        }

        axios.post("/manageUser/revive?user_id=" + localStorage.getItem('userID'), reviveUserPayload).then(response => {
            if (response.status === 200) {
                if (response.data.status === "error") {
                    message.error(response.data.message);
                } else if (response.data.status === "success") {
                    if (response.data.message !== "") {
                        message.success(response.data.message);
                    }

                    const dataSource = [...this.state.dataSource];
                    dataSource[dataSource.indexOf(userData)].deleted = false;
                    this.setState({dataSource: dataSource});
                    // this.refreshListingData();
                }
            } else {
                message.error("Something went wrong");
            }
        }).catch(error => {
            console.log(error.response);
            if (error.response !== undefined && (error.response.status === 401 || error.response.status === 403)) {
                // message.error("You were logged out!");
                this.handleSignoutClick();
            } else {
                message.error("Unable to contact server");
            }
        });
    }

    createNewUser = () => {
        this.setState({addEditModalStatus: 'add'});
    }

    editUserData = (userRoleOrgID, userData) => {
        let orgID = userData.organization.orgID;

        if (userData.role.roleName.toLowerCase() === 'superadmin' || userData.role.roleName.toLowerCase() === 'ceo') {
            orgID = '';
        }

        this.setState({
            addEditModalStatus: 'edit',
            addEditUserData: {
                userRoleOrgID: userData.userRoleOrgID,
                userID: userData.user.userID,
                emailID: userData.user.emailID,
                userName: userData.user.userName,
                password: '',
                userContactNo: userData.user.userContactNo,
                roleName: userData.role.roleName,
                orgID: orgID
            }
        });
    }

    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditUserData: null
        });
    }

    changeFilter = (event) => {
        this.setState({filterValue: event.target.value});
    }

    refreshListingData = () => {
        this.fetchUsersList();
        this.cancelAddEdit();
    }

    render() {
        const manageUsersColumns = [
            {
                title: 'S. No.',
                dataIndex: '',
                key: 'S. No.',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'Name',
                dataIndex: 'user.userName',
                key: 'userName',
                sorter: (a, b) => {
                    a = a.user.userName || '';
                    b = b.user.userName || '';
                    return a.localeCompare(b)
                },
            },
            {
                title: 'Email ID',
                dataIndex: 'user.emailID',
                key: 'emailID',
                sorter: (a, b) => {
                    a = a.user.emailID || '';
                    b = b.user.emailID || '';
                    return a.localeCompare(b)
                },
            },
            {
                title: 'Role',
                dataIndex: 'role.roleName',
                key: 'roleName',
                sorter: (a, b) => {
                    a = a.role.roleName || '';
                    b = b.role.roleName || '';
                    return a.localeCompare(b)
                },
            },
            {
                title: 'Organization Name',
                dataIndex: 'organization.orgName',
                key: 'orgName',
                sorter: (a, b) => {
                    a = a.organization.orgName || '';
                    b = b.organization.orgName || '';
                    return a.localeCompare(b)
                }
            },
            {
                title: 'Status',
                dataIndex: 'deleted',
                key: 'deleted',
                render: deleted => (deleted ? 'Inactive' : 'Active'),
                sorter: (a, b) => {
                    a = a.deleted.toString();
                    b = b.deleted.toString();
                    return a.localeCompare(b)
                },
            },
            {
                title: 'Actions',
                dataIndex: 'userRoleOrgID',
                key: 'userRoleOrgID',
                render: (userRoleOrgID, userData) => {
                    return (
                        <ActionContainer>
                            <IconContainer>
                                <Tooltip title="Edit User">
                                    <Icon type={'edit'} onClick={() => this.editUserData(userRoleOrgID, userData)}/>
                                </Tooltip>
                            </IconContainer>
                            {
                                userData.deleted ?
                                    <IconContainer>
                                        <Tooltip title="Revive User">
                                            <Popconfirm
                                                title={'Are you sure to revive?'}
                                                onConfirm={() => this.reviveUser(userRoleOrgID, userData)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Icon type={'sync'}/>
                                            </Popconfirm>
                                        </Tooltip>
                                    </IconContainer>
                                    :
                                    <IconContainer>
                                        <Tooltip title="Delete User">
                                            <Popconfirm
                                                title={'Are you sure to delete?'}
                                                onConfirm={() => this.deleteUser(userRoleOrgID, userData)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Icon type={'delete'}/>
                                            </Popconfirm>
                                        </Tooltip>
                                    </IconContainer>
                            }
                        </ActionContainer>
                    );
                }
            },
        ];


        const {filterValue, dataSource, addEditModalStatus = '', addEditUserData, organizationList} = this.state;

        let filteredDataSource = dataSource;
        if (filterValue && filterValue.length > 0) {
            filteredDataSource = filterArray(
                dataSource,
                filterValue,
                ['user.userName', 'user.emailID', 'role.roleName', 'organization.orgName', 'deleted']
            );
        }

        return (
            <div>
                <InputFilterContainer>
                    <InputField
                        prefix={<SearchOutlined/>}
                        onChange={this.changeFilter}
                        value={filterValue}
                        allowClear
                        placeholder="Search User"
                    />
                    <Button
                        type="primary"
                        onClick={this.createNewUser}
                    >Add User</Button>
                </InputFilterContainer>
                <Table
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    dataSource={filteredDataSource}
                    columns={manageUsersColumns}
                />
                {
                    addEditModalStatus && addEditModalStatus.length > 0 ? (
                        <AddEditModal
                            addEditModalStatus={addEditModalStatus}
                            addEditUserData={addEditUserData}
                            cancelAddEdit={this.cancelAddEdit}
                            refreshListingData={this.refreshListingData}
                            organizationList={organizationList}
                        />
                    ) : null
                }
            </div>
        )
    }
}


export default ManageUsers;