/**
 *
 * ManageStudents
 *
 */


import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Anchor, Button, message, Popconfirm, Table } from 'antd';
import axios from 'axios';
import React from 'react';
import {
    filterArray
} from '../../utils/utilityFunctions';
import {
    ActionContainer, IconContainer, InputField, InputFilterContainer
} from './ManageStudents.styled';
import ManageStudentsAddEditModal from './ManageStudentsAddEditModal';
const { Link } = Anchor;


// const props = {
//     name: 'file',
//     action: 'arn:aws:s3:us-west-1:113398994088:accesspoint/ubbuffaloaccesspoint',
//     headers: {
//         authorization: 'authorization-text',

//         'Access-Control-Allow-Origin': '*',
//     },
//     onChange(info) {
//         if (info.file.status !== 'uploading') {
//             console.log(info.file, info.fileList);
//         }
//         if (info.file.status === 'done') {
//             message.success(`${info.file.name} file uploaded successfully`);
//         } else if (info.file.status === 'error') {
//             message.error(`${info.file.name} file upload failed.`);
//         }
//     },
// };
// const config = {
//     bucketName: 'ubbuffalo',
//     region: 'us-west-1',
//     accessKeyId: 'AKIAJ5566JC3RJTRX4IQ',
//     secretAccessKey: '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'
// }

class ManageOrg extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            filterValue: '',
            dataSource: [],
            addEditModalStatus: '',
            addEditingStudentData: null,
            deleteData: null,

        }
    }



    componentDidMount() {
        this.getStudentListApiCAllFunction();

    }

    getStudentListApiCAllFunction = () => {
        //  ToDo: api call for the list of students data and save the data in this.state.dataSource

        console.log("inside getStudentApi Call function 2")
        // http://localhost:8080/manageStudents/getAll
        const apiCallPromise = axios.get("/manageOrganization/getAll")
            .then(function (response) {
                console.log(response)
                console.log(response.status)
                console.log(response.data.data)
                //console.log(this.state.dataSource)
                console.log("akash")
                if (response.status === 200) {
                    //this.setState({ dataSource: response.data.data });
                    //this.state.dataSource = response.data.data;
                    return response.data.data;
                } else {
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
        console.log("delete" + data)
        this.setState({
            addEditModalStatus: '',
            deleteData: data
        });
        console.log(this.state.deleteData)
        console.log(data)
        //?email_id="+payload.email
        const apiCallPromise = axios.delete("manageOrganization/delete?orgID=" + data)
            .then(function (response) {
                console.log("inside delete function")
                console.log(response)

                //console.log(this.state.dataSource)
                console.log("akash")
                if (response.status === 200) {
                    //this.setState({ dataSource: response.data.data });
                    //this.state.dataSource = response.data.data;
                    return response.data.data;
                } else {
                    console.log('error');
                }
            })
            // apiCallPromise.then((response) => {
            //     message.success("Organisation successfully deleted");
            //     this.updateListingData();
            // })
            .catch(function (error) {
                console.log(error);
            });

        apiCallPromise.then((response) => {
            message.success("Organisation successfully deleted");
            this.getStudentListApiCAllFunction();
        })
        // message.success('Student successfully deleted');


    }

    updateListingData = () => {
        console.log("inside the index page");
        this.getStudentListApiCAllFunction();
        this.cancelAddEdit();
    }

    // upload(e) {

    //     console.log(e.target.files[0]);
    //     const filename = e.target.files[0];
    //     console.log(filename);
    //     S3FileUpload.uploadFile(e.target.files[0], config)
    //         .then((data) => {
    //             console.log(data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }
    render() {

        const manageStudentsColumns = [

            {
                title: 'Organization Name',
                dataIndex: 'orgName',
                key: 'orgName',
                sorter: (a, b) => {
                    a = a.orgName || '';
                    b = b.orgName || '';

                    return a.localeCompare(b)
                },
            },

            {
                title: 'Download',
                dataIndex: 'orgLogo',
                key: 'orgLogo',
                render: (orgLogo, studentData) => {
                    return (
                        <Anchor>
                            <Link href={orgLogo} title="Download" />

                        </Anchor>
                    );
                }

            },
            {
                title: '  View',
                dataIndex: 'orgLogo',
                key: 'orgLogo',
                render: (orgLogo, studentData) => {
                    return (
                        <img src={orgLogo} alt="Logo" width="100" height="50" />
                    );
                }

            },
            // {
            //     title: 'Upload',
            //     dataIndex: 'orgID',
            //     key: 'orgID',
            //     render: (orgID,studentData) => {
            //         return (
            //                 <input type="file" onChange={this.upload}/>

            //         );
            //     }
            // },

            {
                title: 'Actions',
                dataIndex: 'orgID',
                key: 'orgID',
                render: (orgID, studentData) => {
                    return (
                        <ActionContainer>
                            <IconContainer>
                                <Popconfirm
                                    title={'Are you sure ?'}
                                    onConfirm={() => this.deleteStudent(orgID)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined />
                                </Popconfirm>
                            </IconContainer>
                            <IconContainer>
                                <EditOutlined onClick={() => this.editStudentData(studentData)} />
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
                        Add New Organization
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


export default ManageOrg;
