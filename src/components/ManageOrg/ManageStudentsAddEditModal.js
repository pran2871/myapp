/**
 *
 * ManageStudentsAddEdit
 *
 */

import React from 'react';
import { Button, Modal, Input , message} from 'antd';
import axios from 'axios';
import SelectDropDownComponent from '../SelectDropDownComponent';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
import {
    FieldContainer,
} from './ManageStudents.styled';
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import {
    manageStudentsOrganizationResponse,
    manageStudentsCoachListResponse,
} from './ManageStudents.constants';
// {studentID: 1, studentReferenceNumber: 123, studentName: "sid1", studentContactNo: "123", orgID: 1, …}
class ManageStudentsAddEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            addEditingStudentData: {
                name: '',
                referenceNumber: '',
                contactNumber: '',
                orgName: '',
                coach: '',
                selectedFile:'',
                fileName:'',
                loader:false,
            },
            organizationList: [],
            coachList: [],
            // coachList: manageStudentsCoachListResponse.data,
        }
    }

    componentDidMount() {


        //http://localhost:8080/manageOrganization/getAll/
        const apiCallPromise = axios.get("/manageOrganization/getAll/").then(function (response) {
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


      const parsedData  = response.map((rowData) => {
        return Object.values(rowData).map((value) => `${value}`);
      });
      console.log('setting data : ', parsedData);
      this.setState({ organizationList: response });
    })

      //  this.setState({ organizationList: manageStudentsOrganizationResponse.data })

// {name: "qwe", referenceNumber: "1234", contactNumber: "1234", organization: "2", coach: "2"}
        const { addEditingStudentData } = this.props;
        if (addEditingStudentData) {
            this.setState({ addEditingStudentData: {
                ...addEditingStudentData,
                name: addEditingStudentData.studentName,
                referenceNumber: addEditingStudentData.studentReferenceNumber,
                contactNumber: addEditingStudentData.studentContactNo,
                orgName: addEditingStudentData.orgName,
                coach: addEditingStudentData.userID
            }});
        }
    }
    // "studentReferenceNumber" : this.state.addEditingStudentData.referenceNumber,
    // "studentName" : this.state.addEditingStudentData.name,
    // "studentContactNo" : this.state.addEditingStudentData.contactNumber,
    // "userID":this.state.addEditingStudentData.coach,
    // "orgID":this.state.addEditingStudentData.organization

    changeFilter = (value, fieldId) => {
        this.setState({ addEditingStudentData: {
            ...this.state.addEditingStudentData,
            [fieldId]: value,
        } });

    //     if (fieldId === 'orgName') {

    //         //http://localhost:8080/manageStudents/getCoaches?orgID=1
    //         //var id =
    //         const apiCallPromise = axios.get(`manageStudents/getCoaches?orgID=${this.state.addEditingStudentData.orgName}`)
    //     .then(function (response) {
    //         console.log(response)
    //         console.log(response.data.data)
    //         //console.log(response.data.userName)
    //         //console.log(this.state.dataSource)
    //         console.log("akash")
    //     if(response.status === 200){
    //         //this.setState({ dataSource: response.data.data });
    //         //this.state.dataSource = response.data.data;
    //         return response.data.data;
    //     } else{
    //         console.log('error');
    //     }
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });

    // // using .then, create a new apiCallPromise which extracts the data
    // apiCallPromise.then((response) => {

    //   console.log('response.data. : ', response);
    //   // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]



    //   this.setState({
    //     addEditingStudentData: {
    //         ...this.state.addEditingStudentData,
    //         [fieldId]: value,
    //         coach: '',
    //     },
    //     coachList: response,
    // });

    // })
    //     } else {
    //         this.setState({ addEditingStudentData: {
    //             ...this.state.addEditingStudentData,
    //             [fieldId]: value,
    //         } });
    //     }
    }


    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditingStudentData: null
        });
    }
    onFileChangeHandler = (e) => {
        e.preventDefault();
        
            
            this.setState({ addEditingStudentData: {
                ...this.state.addEditingStudentData,
                selectedFile: e.target.files[0]
            } });
        let formData = new FormData();
        console.log(e.target.files[0])

        
        console.log(this.state.addEditingStudentData.selectedFile)
        formData.append('file', e.target.files[0]);
        console.log(formData.file);
        // axios.post("/manageOrganization/upload",formData,{headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}} )
        //     .then(res => {
        //             console.log(res.data);
        //             alert("File uploaded successfully.")
        //     })

    };


    submit = (e) => {

        this.setState({ loader: true});
        console.log('addEditingStudentData : ', this.state.addEditingStudentData);
        console.log('addEditModalStatus : ', this.props.addEditModalStatus);


        //http://localhost:8080/manageOrganization/add/
        //http://localhost:8080/manageOrganization/update/

       console.log("student details");

       console.log(this.state.addEditingStudentData);


        // {studentID: 1, studentReferenceNumber: 123, studentName: "sid1", studentContactNo: "123", orgID: 1, …}
        const payload={
            "orgID":this.state.addEditingStudentData.orgID,
            "orgName":this.state.addEditingStudentData.orgName,
            
        }

        //e.preventDefault();
        
        let formData = new FormData();
        //console.log(e.target.files[0])
        //console.log(this.state.selectedFile)
        formData.append('file', this.state.addEditingStudentData.selectedFile);
        formData.append('filename',this.state.addEditingStudentData.orgName);
        console.log(formData.file);
        console.log(formData.filename);
       
        console.log(this.state.addEditingStudentData.selectedFile);

        console.log(payload)
        if(this.props.addEditModalStatus === 'add'){


            const reply1 = axios.post("/manageOrganization/upload",formData,{headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}} )
            .then(res => {
                    console.log(res.data);
                    //alert("File uploaded successfully.")
            // })
            // reply1.then((response)=>{
            //     
            let logo = "https://isaubstorageaccount.blob.core.windows.net/isablob/"+res.data;
            const payload={
                    "orgID":this.state.addEditingStudentData.orgID,
                    "orgName":this.state.addEditingStudentData.orgName,
                    "orgLogo":logo
                }
                console.log(res.data);
                console.log("inside add the student");
                console.log(payload);
                const reply = axios.post('/manageOrganization/',payload,{headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}}).then(function (response) {
                    console.log(response);
                    console.log("updating Lists1");

                });
                reply.then((response) => {
                    console.log("done with inner reply.")
                  //  message.success("Organisation successfully added");
                  //  this.props.updateListingData();
                })

        })
        reply1.then((response)=>{
            this.setState({ loader: false});
            message.success("Organisation successfully added");
                    this.props.updateListingData();
        })

       // this.setState({ loader: false});

        }else{
        //     console.log("inside update the student");
        //     console.log(payload);
        //    const reply = axios.patch('/manageOrganization/', payload)
        //    .then(function (response) {
        //         console.log(response);
        //         console.log("updating Lists1");

        //     });
        //     reply.then((response) => {
        //         message.success("Organisation successfully updated");
        //         this.props.updateListingData();
        //     })
        // }

        const reply1 = axios.post("/manageOrganization/upload",formData,{headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}} )
            .then(res => {
                    console.log(res.data);
                    //alert("File uploaded successfully.")
            // })
            // reply1.then((response)=>{
            //     
            let logo = "https://isaubstorageaccount.blob.core.windows.net/isablob/"+res.data;
            const payload={
                    "orgID":this.state.addEditingStudentData.orgID,
                    "orgName":this.state.addEditingStudentData.orgName,
                    "orgLogo":logo
                }
                console.log(res.data);
                console.log("inside add the student");
                console.log(payload);
                const reply = axios.patch('/manageOrganization/',payload,{headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}}).then(function (response) {
                    console.log(response);
                    console.log("updating Lists1");

                });
                reply.then((response) => {
                    console.log("done with inner reply.")
                  //  message.success("Organisation successfully added");
                    this.props.updateListingData();
                })

        })
        reply1.then((response)=>{
            this.setState({ loader: false});
            message.success("Organisation successfully updated");
                    this.props.updateListingData();
        })
        //this.setState({ loader: false});
       // this.props.updateListingData()
    }
           
    //this.setState({ loader: false});
    }

    render() {

        const { addEditingStudentData, organizationList = [], coachList = [] } = this.state;
        const { cancelAddEdit, addEditModalStatus } = this.props;

        return (
            
            
            <Modal
                title={addEditModalStatus === 'edit' ? 'Edit Organization' : 'Add Organization'}
                visible={addEditModalStatus.length}
                onOk={addEditModalStatus === 'edit' ? this.editStudentData : this.createNewStudent}
                onCancel={cancelAddEdit}
                footer={[
                    <>

                    <Button key="back" onClick={cancelAddEdit}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.submit}>
                        {addEditModalStatus === 'edit' ? 'Update' : 'Create'}
                    </Button>,
                    </>
                ]}
            >
                <LoadingMask loading={this.state.loader} text={"uploading..."}>
                <FieldContainer>
                    <Input
                        onChange={(event) => this.changeFilter(event.target.value, 'orgName')}
                        value={addEditingStudentData.orgName}
                        placeholder="Enter Name"
                    />
                    <FieldContainer>
                        <input type="file" onChange={this.onFileChangeHandler} placeholder="Upload Logo"/>
                    </FieldContainer>
                </FieldContainer>
                </LoadingMask>
                {/* <FieldContainer>
                    <div >
                                <label>Upload Your File </label>
                                <input type="file" className="form-control" name="file" onChange={this.onFileChangeHandler}/>
                    </div>
                </FieldContainer> */}

            </Modal>
            
        )
    }
}


export default ManageStudentsAddEdit;
