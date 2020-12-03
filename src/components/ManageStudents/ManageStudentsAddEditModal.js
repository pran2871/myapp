/**
 *
 * ManageStudentsAddEdit
 *
 */

import React from 'react';
import {Button, Modal, Input, message, Form, Select} from 'antd';
import axios from 'axios';
import {withRouter} from 'react-router';
import SelectDropDownComponent from '../SelectDropDownComponent';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
import {
    FieldContainer,
} from './ManageStudents.styled';

import {
    manageStudentsOrganizationResponse,
    manageStudentsCoachListResponse,
} from './ManageStudents.constants';
import {GlobalOutlined, UserOutlined} from "@ant-design/icons";

const {Option} = Select;
// {studentID: 1, studentReferenceNumber: 123, studentName: "sid1", studentContactNo: "123", orgID: 1, …}
class ManageStudentsAddEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            addEditingStudentData: {
                name: '',
                referenceNumber: '',
                contactNumber: '',
                organization: '',
                coach: '',
            },
            organizationList: [],
            coachList: [],
            // coachList: manageStudentsCoachListResponse.data,
        }
    }

    componentDidMount() {


        //http://localhost:8080/manageOrganization/getAll/
        const apiCallPromise = axios.get("/manageOrganization/getAll/")
        .then(function (response) {
            console.log(response)
            console.log(response.data.data)
            //console.log(response.data.data.orgName)
            //console.log(response.data.data.orgID)
            //console.log(this.state.dataSource)
            console.log("akash")
        if(response.status === 200){
            //this.setState({ dataSource: response.data.data });
            //this.state.dataSource = response.data.data;
            //this.state.orgID = response.data.data.orgID;
            return response.data.data;
        } else{
            console.log('error');
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    // using .then, create a new apiCallPromise which extracts the data
    apiCallPromise.then((response) => {

      console.log('response.data.data : ', response);
      // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]


    //   const parsedData  = response.map((rowData) => {
    //     return Object.values(rowData).map((value) => `${value}`);
    //   });
    //   console.log('setting data : ', parsedData);
      this.setState({ organizationList: response });
    })

      //  this.setState({ organizationList: manageStudentsOrganizationResponse.data })

// {name: "qwe", referenceNumber: "1234", contactNumber: "1234", organization: "2", coach: "2"}
        const { addEditingStudentData } = this.props;
        if (addEditingStudentData) {
            console.log(addEditingStudentData)
            this.setState({ addEditingStudentData: {
                ...addEditingStudentData,
                name: addEditingStudentData.studentName,
                referenceNumber: addEditingStudentData.studentReferenceNumber,
                contactNumber: addEditingStudentData.studentContactNo,
                organization: addEditingStudentData.orgID,
                coach: addEditingStudentData.coachName
            }});
        }
    }
    // "studentReferenceNumber" : this.state.addEditingStudentData.referenceNumber,
    // "studentName" : this.state.addEditingStudentData.name,
    // "studentContactNo" : this.state.addEditingStudentData.contactNumber,
    // "userID":this.state.addEditingStudentData.coach,
    // "orgID":this.state.addEditingStudentData.organization

    changeFilter = (value, fieldId) => {
        console.log("bkuvbkdsfvdvkdsjvjksdhvbjhdsfbvjsdfhbvlsdkvblsdbv");
        if (fieldId === 'orgID') {

            //http://localhost:8080/manageStudents/getCoaches?orgID=1
            //var id =
            console.log(value);
            const apiCallPromise = axios.get(`manageStudents/getCoaches?orgID=${value}`)
        .then(function (response) {
            console.log(response)
            console.log(response.data.data)
            console.log(response.data.data.user)
            //console.log(response.data.userName)
            //console.log(this.state.dataSource)
            console.log("akash")
        if(response.status === 200){
            //this.setState({ dataSource: response.data.data });
            //this.state.dataSource = response.data.data;
            return response.data.data;
        } else{
            console.log('error');
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    // using .then, create a new apiCallPromise which extracts the data
    apiCallPromise.then((response) => {

      console.log('response.data. : ', response);
      // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]



      this.setState({
        addEditingStudentData: {
            ...this.state.addEditingStudentData,
            [fieldId]: value,
            coach: '',
        },
        coachList: response,
    });

    console.log(this.state.coachList)
    })
        } else {
            this.setState({ addEditingStudentData: {
                ...this.state.addEditingStudentData,
                [fieldId]: value,
            } });
        }
    }
    updateListingData = () => {
        console.log("updateListingData 2");
        this.getStudentListApiCAllFunction();
        this.cancelAddEdit();
    }

    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditingStudentData: null
        });
    }

    getStudentListApiCAllFunction = () => {


       // http://localhost:8080/manageStudents/getAll
       console.log("refreshed 3");
        const apiCallPromise = axios.get("/manageStudents/getAll")
        .then(function (response) {
            console.log(response)
            console.log(response.status)
            console.log(response.data.data)
            //console.log(this.state.dataSource)
            console.log("akash")
        if(response.status === 200){
            //this.setState({ dataSource: response.data.data });
            //this.state.dataSource = response.data.data;
            return response.data.data;
        } else{
            console.log('error');
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    // using .then, create a new apiCallPromise which extracts the data
    apiCallPromise.then((response) => {

      console.log('response.data.data : ', response);
      // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]


      const parsedData  = response.map((rowData) => {
        return Object.values(rowData).map((value) => `${value}`);
      });
      console.log('setting data : ', parsedData);
      this.setState({ dataSource: response });
    })

    }

    submit = (values) => {
        const payload={
            "studentReferenceNumber" : values.referenceNumber,
            "studentName" : values.name,
            "studentContactNo" : values.contactNumber,
            "userID":values.coach,
            "orgID":values.organization
        }
        console.log(payload)
        if(this.props.addEditModalStatus === 'add'){

            console.log("inside add the student");
            console.log(payload);
            const reply = axios.post('/manageStudents/add',payload).then(function (response) {
                console.log(response);
                console.log("updating Lists1");


            });

            reply.then((response) => {
                message.success("Student successfully added");
                this.props.updateListingData();
            })
        }else{
            console.log("inside update the student");
            console.log(payload);
         const reply =   axios.patch('/manageStudents/update', payload)
           .then(function (response) {
                console.log(response);
                console.log("updating Lists1");

            });
            reply.then((response) => {
                message.success("Student successfully updated");
                this.props.updateListingData();
            })
        }

           //this.updateListingData()

    }

    render() {

        const { addEditingStudentData, organizationList = [], coachList = [] } = this.state;
        const { cancelAddEdit, addEditModalStatus } = this.props;
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
                title={addEditModalStatus === 'edit' ? 'Edit Student' : 'Add New Student'}
                visible={addEditModalStatus.length}
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
                <Form {...formItemLayout}>
                    <Form.Item label="Name" hasFeedback>
                        {
                            getFieldDecorator(
                                'name',
                                {
                                    rules: [{
                                        required: true,
                                        message: 'Name is required'
                                    }],
                                    initialValue: addEditingStudentData.name
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
                    <Form.Item label="Reference Number" hasFeedback>
                        {
                            getFieldDecorator(
                                'referenceNumber',
                                {
                                    rules: [{
                                        required: true,
                                        message: 'Reference Number is required'
                                    }],
                                    initialValue: addEditingStudentData.referenceNumber
                                }
                            )(
                                <Input
                                    allowClear
                                    prefix={<UserOutlined/>}
                                    placeholder="Enter Reference Number"
                                />,
                            )
                        }
                    </Form.Item>
                    <Form.Item label="Contact Number" hasFeedback>
                        {
                            getFieldDecorator(
                                'contactNumber',
                                {
                                    rules: [{
                                        required: false,
                                        message: 'Contact Number is required'
                                    }],
                                    initialValue: addEditingStudentData.contactNumber
                                }
                            )(
                                <Input
                                    allowClear
                                    prefix={<UserOutlined/>}
                                    placeholder="Enter Reference Number"
                                />,
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
                                            required: true,
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
                                            required: true,
                                            message: 'Please select an Organization',
                                        }],
                                        initialValue: addEditingStudentData.organization,
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
                    <Form.Item label="Coach" hasFeedback>
                        {
                            addEditModalStatus === 'add' ?
                                getFieldDecorator(
                                    'coachID',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Please select a Coach',
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
                                                &nbsp; Select Coach
                                            </React.Fragment>
                                        }
                                        
                                    >
                                        {
                                            coachList.map(CoachData =>
                                                <Option value={CoachData.user.userID}>
                                                    {CoachData.user.userName}
                                                </Option>)
                                        }
                                    </Select>
                                ) :

                                getFieldDecorator(
                                    'coachID',
                                    {
                                        rules: [{
                                            required: true,
                                            message: 'Please select a Coach',
                                        }],
                                        initialValue: addEditingStudentData.coach,
                                    }
                                )(
                                    <Select
                                        showSearch
                                        allowClear
                                        showArrow
                                        placeholder={
                                            <React.Fragment>
                                                <GlobalOutlined/>
                                                &nbsp; Select Coach
                                            </React.Fragment>
                                        }
                                        
                                    >
                                        {
                                            coachList.map(CoachData =>
                                                <Option value={CoachData.user.userID}>
                                                    {CoachData.user.userName}
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


export default withRouter(Form.create()(ManageStudentsAddEdit));
