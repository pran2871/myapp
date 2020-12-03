// /**
//  *
//  * AssessmentStudentSelectionPage
//  *
//  */

// import React from 'react';

// class AssessmentStudentSelectionPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
//     constructor(props) {
//         super(props);
//         this.state = {
//         }
//     }


//     render() {

//         console.log('props : ', this.props.match.params);

//         return (
//             <div>
//                 assessment listing page
//             </div>
//         )
//     }
// }


// export default AssessmentStudentSelectionPage;

import React from 'react';
import { Table, Button, Icon, Popconfirm, message } from 'antd';
import axios from 'axios';
import moment from 'moment'
import styles from './styles'
import {
    manageStudentsApiResponse,
} from './ManageStudents.constants';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
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
var dateFormat = require('dateformat');
class AssessmentFormPagePast extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            filterValue: '',
            dataSource: [],
            addEditModalStatus: '',
            addEditingStudentData: null,
            deleteData:null,
            studentID:props.match.params.studentId

        }
    }

    componentDidMount() {
      console.log('pick ur template')

        this.getStudentListApiCAllFunction();
    }

    getStudentListApiCAllFunction = () => {


       // http://localhost:8080/assessment/getPastAssessments?studentReferenceNumber=123
        const apiCallPromise = axios.get("/assessment/get?studentReferenceNumber=123")
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

    selectAssessment = (data) => {
      this.setState({
        addEditingStudentData: data
    });
    console.log("assessment from ",this.state)
    console.log(data);
    localStorage.setItem('assessmentID',data)
    console.log('history props : ', this.props);
    this.props.history.push(`/assessment/past/ans/${data}`);
    //this.props.history.push(`/assessment/1/`+data);
    }

    selectAssessmentView = (data) => {
        console.log("inside view")
        this.setState({
          addEditingStudentData: data
      });
      console.log("assessment from ",this.state)
      console.log(data);
      localStorage.setItem('assessmentID',data)
      console.log('history props : ', this.props);
      this.props.history.push(`/assessment/past/ansview/${data}`);
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
        console.log("hello")
       // console.log('history : ', this.props.history);
       // console.log('studentId : ', this.state.studentId);
        const manageStudentsColumns = [
            {
                title: 'Assessment',
                dataIndex: 'assessmentID',
                key: 'assessmentID',
            },
            {
                title: 'Reported By',
                dataIndex: 'coachName',
                key: 'coachName',

            },
            {
                title: 'Last Updated',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                sorter: (a, b) => {
                    a = a.updatedAt || '';
                    b = b.updatedAt || '';
                    return a.localeCompare(b)
                },
                render:(updatedAt)=>{
                //    return   moment(updatedAt).format('MMMM Do YYYY')DD-MM-YYYY
               // return   moment(updatedAt).format('DD-MM-YYYY') // working one.
               return updatedAt;
                }

            },

            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                sorter: (a, b) => {
                    a = a.status || '';
                    b = b.status || '';
                    return a.localeCompare(b)
                },
            },
            {
              title: '',
              dataIndex: 'assessmentID',
                key: 'assessmentID',
            render: (assessmentID,record) => {
                console.log(record.status)
                if(record.status === 'Pending'){
                return <Button onClick={() => this.selectAssessment(assessmentID)}>Start</Button>
                }

                return <Button onClick={() => this.selectAssessmentView(assessmentID)}>view</Button>
            }
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
                {/* {addEditModalStatus === 'add' ? '' : 'Enter Reference Number'}
                 {status ==='completed' ? (
                    <ManageStudentsAddEditModal
                        addEditModalStatus={addEditModalStatus}
                        addEditingStudentData={addEditingStudentData}
                        cancelAddEdit={this.cancelAddEdit}
                        updateListingData={this.updateListingData}
                    />
                ) : null}  */}
            </div>
        )
    }
}


export default AssessmentFormPagePast;

