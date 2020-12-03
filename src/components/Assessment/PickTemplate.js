// import React from 'react'
// import styles from './styles'

// const About = () => (
//   <div style={styles.container}>

//     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
//   </div>
// )

// export default About

import React from 'react';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
import { Table, Button, Icon, Popconfirm, message } from 'antd';
import axios from 'axios';
import styles from './styles'
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

class PickTemplate extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
      console.log('pick ur template')
      console.log(this.state.studentID)
        this.getStudentListApiCAllFunction();
    }

    getStudentListApiCAllFunction = () => {


       // http://localhost:8080/manageStudents/getAll
        const apiCallPromise = axios.get("/manageTemplate")
        .then(function (response) {
            console.log(response)
            console.log(response.status)
            console.log(response.data)
            //console.log(this.state.dataSource)
            console.log("akash")
        if(response.status === 200){
            //this.setState({ dataSource: response.data.data });
            //this.state.dataSource = response.data.data;
            return response.data;
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

    createNewStudent = (data) => {
        this.setState({ addEditModalStatus: 'add' });
    }

    selectTemplate = (data) => {
      this.setState({
        addEditingStudentData: data
    });
    console.log("studentID from ",this.state)
    console.log(data);
    console.log('history props : ', this.props);
    localStorage.setItem('testtemplate',data)
    this.props.history.push(`/assessment/${data}/${data}`);
    //this.props.history.push(`/assessment/1/`+data);
    }

    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditingStudentData: null
        });
    }

    deleteStudent = (data) => {

        console.log("delete"+data)
        this.setState({
            addEditModalStatus: 'edit',
            deleteData: data
        });
        console.log(this.state.deleteData)
        const apiCallPromise = axios.get("manageOrganization/delete/")
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
        message.success('Student successfully deleted');
        this.getStudentListApiCAllFunction();
    }

    updateListingData = () => {
        this.getStudentListApiCAllFunction();
        this.cancelAddEdit();
    }

    render() {

        const manageStudentsColumns = [
            {
                title: 'Template Name',
                dataIndex: 'templateName',
                key: 'templateName',
                sorter: (a, b) => {
                    a = a.templateName || '';
                    b = b.templateName || '';
                return a.localeCompare(b)
            },
            },
            {
                title: 'Created By',
                dataIndex: 'createdBY.userName',
                key: 'createdBY.userName',
                sorter: (a, b) => {
                    a = a.createdBY.userName || '';
                    b = b.createdBY.userName || '';
                return a.localeCompare(b)
            },
            },
            {
              title: '',
              dataIndex: 'templateID',
                key: 'templateID',
              render: (templateID) => <Button onClick={() => this.selectTemplate(templateID)}>Start</Button>,
          },
            // {
            //     title: 'Address',
            //     dataIndex: 'studentContactNo',
            //     key: 'studentContactNo',
            // },
            // {
            //     title: 'Organization Name',
            //     dataIndex: 'organization.orgName',
            //     key: 'organization',
            // },
            // {
            //     title: 'Coach Name',
            //     dataIndex: 'userID',
            //     key: 'userID',
            // },

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


export default PickTemplate;

