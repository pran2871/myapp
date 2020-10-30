/**
 *
 * ManageStudents
 *
 */

import React from 'react';
import { Table, Button, Icon, Popconfirm, message } from 'antd';
import axios from 'axios';
import {
    manageStudentsApiResponse,
} from './ManageStudents.constants';

import ManageStudentsAddEditModal from './ManageStudentsAddEditModal';

import {
    filterArray,
} from '../../utils/utilityFunctions';

import {
    InputFilterContainer,
    InputField,
    IconContainer,
    ActionContainer,
} from './ManageStudents.styled';

class ManageStudents extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            filterValue: '',
            dataSource: [],
            addEditModalStatus: '',
            addEditingStudentData: null,
            deleteData:null,
            
        }
    }

    componentDidMount() {
        this.getStudentListApiCAllFunction();
    }

    getStudentListApiCAllFunction = () => {
        //  ToDo: api call for the list of students data and save the data in this.state.dataSource

        console.log("inside getStudentApi Call function 2")
       // http://localhost:8080/manageStudents/getAll
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
            if(response.data.status ==='error')
            {                        
                console.log(response.data.message);
                message.error(response.data.message);
                
            }else{
            return response.data.data;
            }
        } else{
            console.log('error');
            message.error(response.data.message);
        }
    })
    .catch(function (error) {
        console.log(error);
    });  

    // using .then, create a new apiCallPromise which extracts the data
    apiCallPromise.then((response) => {

      console.log('response.data.data : ', response);
      // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]

      this.setState({ dataSource: response });
    })

    }

    changeFilter = (event) => {
        this.setState({ filterValue: event.target.value });
    }

    editStudentData = (data) => {
        this.setState({
            addEditModalStatus: 'edit',
            addEditingStudentData: data
        });
    }

    createNewStudent = () => {
        this.setState({ addEditModalStatus: 'add' });
    }

    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditingStudentData: null
        });
    }

    deleteStudent = (data) => {
        //  ToDo: delete api call
        console.log("delete"+data)
        this.setState({
            addEditModalStatus: '',
            deleteData: data
        });
        console.log(this.state.deleteData)
        console.log(data)
        //?email_id="+payload.email
        const apiCallPromise = axios.delete("manageStudents/delete?studentReferenceNumber="+data)
        .then(function (response) {
            console.log("inside delete function")
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
    apiCallPromise.then((response) => {
        message.success("Student deleted successfully");
        this.updateListingData();
    })

        this.getStudentListApiCAllFunction();
    }

    updateListingData = () => {
        console.log("inside the index page");
        this.getStudentListApiCAllFunction();
        this.cancelAddEdit();
    }

    render() {

        const manageStudentsColumns = [
            {
                title: 'Name',
                dataIndex: 'studentName',
                key: 'studentName',
            },
            {
                title: 'Reference ID',
                dataIndex: 'studentReferenceNumber',
                key: 'studentReferenceNumber',
            },
            // {
            //     title: 'Address',
            //     dataIndex: 'studentContactNo',
            //     key: 'studentContactNo',
            // },
            {
                title: 'Organization Name',
                dataIndex: 'organizationName',
                key: 'organizationName',
            },
            {
                title: 'Coach Name',
                dataIndex: 'coachName',
                key: 'coachName',
            },
            {
                title: 'Actions',
                dataIndex: 'studentReferenceNumber',
                key: 'studentReferenceNumber',
                render: (studentReferenceNumber,studentData) => {
                    return (
                        <ActionContainer>
                            <IconContainer>
                                <Popconfirm
                                    title={'Are you sure ?'}
                                    onConfirm={() => this.deleteStudent(studentReferenceNumber)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Icon type={'delete'} />
                                </Popconfirm>
                            </IconContainer>
                            <IconContainer>
                                <Icon type={'edit'} onClick={() => this.editStudentData(studentData)} />
                            </IconContainer>
                        </ActionContainer>
                    );
                }
            },
        ];

        const { filterValue, dataSource, addEditModalStatus = '', addEditingStudentData } = this.state;

        let filteredDataSource = dataSource;

        if (filterValue && filterValue.length) {
            filteredDataSource = filterArray(dataSource, filterValue, ['studentName', 'studentReferenceNumber', 'studentContactNo', 'organization.orgName', 'userID']);
        }

        return (
            <div>
                <InputFilterContainer>
                    <InputField
                        onChange={this.changeFilter}
                        value={filterValue}
                        placeholder="Enter Filter"
                    />
                    <Button
                        type="primary"
                        onClick={this.createNewStudent}
                    >
                        Add Student
                    </Button>
                </InputFilterContainer>
                <Table
                    dataSource={filteredDataSource}
                    columns={manageStudentsColumns}
                />
                {addEditModalStatus && addEditModalStatus.length ? (
                    <ManageStudentsAddEditModal
                        addEditModalStatus={addEditModalStatus}
                        addEditingStudentData={addEditingStudentData}
                        cancelAddEdit={this.cancelAddEdit}
                        updateListingData={this.updateListingData}
                    />
                ) : null}
            </div>
        )
    }
}


export default ManageStudents;
