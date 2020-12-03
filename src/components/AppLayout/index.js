/**
 *
 * AppLayout
 *
 */

import { DashboardOutlined, GlobalOutlined, LineChartOutlined, ProjectOutlined, QuestionCircleOutlined, ReconciliationOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Modal } from 'antd';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Account from '../Account/Account';
import Assessment from '../Assessment';
import Landing from '../Landing/Landing';
import ManageOrg from '../ManageOrg';
import ManageQuestions from '../ManageQuestions';
import ManageStudents from '../ManageStudents';
import ManageTemplates from '../ManageTemplates';
import ManageUser from '../ManageUser/ListUsers';
import ViewReport from '../ViewReport';
import {
    AppLayoutContainer, AppLayoutSider,
    PageContainer
} from './AppLayout.styled';






const { Header, Content, Footer, Sider } = Layout;
class AppLayout extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            isSliderCollapsed: false,
            changeRoutData: null,
            alertModalVisibilityStatus: false,
        }
    }


    handleSignoutClick = () => {
        console.log("sign out clicked");
        localStorage.clear();
        this.props.history.push(`/login`);
    }

    handleAccountClick = () => {
        console.log("account click");
        this.props.history.push(`/account`);
    }

    handleCollapse = () => {
        this.setState({ isSliderCollapsed: !this.state.isSliderCollapsed });
    }

    navigatePage = (routeData) => {
        console.log(localStorage.getItem('formInProgress'));
        if (localStorage.getItem('formInProgress')) {
            this.setState({ changeRoutData: routeData, alertModalVisibilityStatus: true });
        } else {
            this.props.history.push(routeData.path);
        }
    }

    handleOk = () => {
        localStorage.removeItem('formInProgress');
        this.props.history.push(this.state.changeRoutData.path);
        this.setState({ changeRoutData: null, alertModalVisibilityStatus: false });
    }

    handleCancel = () => {
        this.setState({ changeRoutData: null, alertModalVisibilityStatus: false });
    }

    render() {


        const userType = localStorage.getItem('roleName');
        
        const routes = [
            {
                path: '/dashboard',
                name: 'Dashboard',
                icon: <DashboardOutlined />,
                component: Landing,
                validUsers: ['ceo', 'superadmin', 'admin', 'coach']
            },
            // {
            //     path: '/account',
            //     name: 'Profile',
            //     icon: 'user',
            //     component: Account,
            //     validUsers: ['ceo', 'superadmin', 'admin', 'coach']
            // },
            {
                path: '/manageUser',
                name: 'Manage Users',
                icon: <TeamOutlined />,
                component: ManageUser,
                validUsers: ['ceo', 'superadmin', 'admin']
            },
            {
                path: '/manageOrganizations',
                name: 'Manage Organizations',
                icon: <GlobalOutlined />,
                component: ManageOrg,
                validUsers: ['ceo', 'superadmin']
            },
            {
                path: '/manageTemplates',
                name: 'Manage Templates',
                icon: <ProjectOutlined />,
                component: ManageTemplates,
                validUsers: ['ceo', 'superadmin', 'admin', 'coach']
            }, {
                path: '/manageStudents',
                name: 'Manage Students',
                icon: <UserOutlined />,
                component: ManageStudents,
                validUsers: ['ceo', 'superadmin', 'admin', 'coach']
            }, {
                path: '/assessment',
                name: 'Manage Assessment',
                icon: <ReconciliationOutlined />,
                component: Assessment,
                validUsers: ['ceo', 'superadmin', 'admin', 'coach'],
                hasChildren: true,
            }, {
                path: '/manageQuestions',
                name: 'Manage Questions',
                icon: <QuestionCircleOutlined />,
                component: ManageQuestions,
                validUsers: ['ceo', 'superadmin', 'admin', 'coach'],
            }, {

                path: '/viewreport',
                name: 'View Report',
                icon: <LineChartOutlined />,
                component: ViewReport,
                validUsers: ['ceo', 'superadmin', 'admin', 'coach'],
            }
        ];

        const filteredRoutes = routes.filter((routeData) => routeData.validUsers.indexOf(userType) >= 0);

        const splitArray = this.props.location.pathname.split('/');

        let displayUrl = splitArray[splitArray.length - 1];

        displayUrl = displayUrl.replace(/([A-Z])/g, (x, y) => " " + y.toUpperCase()).replace(/\s/, " ").trim();
        displayUrl = displayUrl.charAt(0).toUpperCase() + displayUrl.slice(1);

        const NotFoundPage = props => {

            return (
                <div>
                    page nor found
                </div>
            );
        };

        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.handleAccountClick} >
                        Profile
                </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.handleSignoutClick} >
                        Sign out
                </a>
                </Menu.Item>

            </Menu>
        );

        return (
            <AppLayoutContainer>
                <Modal
                    // title="Basic Modal"
                    visible={this.state.alertModalVisibilityStatus}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div>
                        Are you sure you want to leave the page?
                    </div>
                </Modal>
                <AppLayoutSider
                    breakpoint="sm"
                    collapsible
                    collapsed={this.state.isSliderCollapsed}
                    onCollapse={this.handleCollapse}
                    width='230px'
                >
                    <Header style={{ padding: '0', height: '55px', color: 'white' }}>
                        {/* we can have img here */}
                        <div>
                            ISA
                        </div>
                    </Header>
                    <Menu
                        theme="dark"
                        mode="inline"
                    // selectedKeys={currentPath.match(/\//g).length === 1 ? [getRoute('dashboard').url] : [this.getKey(currentPath, '/', 3)]}
                    // defaultOpenKeys={['/app']}
                    >
                        {filteredRoutes.map((route) => (
                            <Menu.Item key={route.path}>
                                {/* <Link to={route.path} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon type={route.icon} />
                                    <span>{route.name}</span>

                                </Link> */}

                                <div style={{ display: "flex", alignItems: 'center' }} onClick={() => this.navigatePage(route)}>
                                    {route.icon}
                                    <span>{route.name}</span>
                                </div>

                            </Menu.Item>
                        ))}

                    </Menu>

                </AppLayoutSider>
                <Layout>
                    <Header style={{ color: 'white' }}>
                        {displayUrl}

                        {/*<Dropdown overlay={menu} placement="topRight" style={{marginLeft:200}}  >*/}
                        {/*    <Button style={{marginRight:-480, marginLeft:480}}>Account</Button>*/}
                        {/*</Dropdown>*/}
                        <Button target="_blank" rel="noopener noreferrer" onClick={this.handleAccountClick} style={{ position: "absolute", right: "120px", top: "16px" }}>
                            Profile
                        </Button>
                        <Button target="_blank" rel="noopener noreferrer" onClick={this.handleSignoutClick} style={{ position: "absolute", right: "20px", top: "16px" }}>
                            Log out
                        </Button>

                    </Header>

                    <Content style={{ margin: '16px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <Switch>
                            <PageContainer>
                                {filteredRoutes.map((route) => (
                                    <Route
                                        exact={!route.hasChildren}
                                        key={route.path}
                                        path={route.path}
                                        component={route.component}
                                    />
                                ))}
                                <Route
                                    exact
                                    path="/account"
                                    component={Account}
                                />
                            </PageContainer>
                        </Switch>
                    </Content>
                </Layout>
            </AppLayoutContainer>
        )
    }
}


export default AppLayout;
