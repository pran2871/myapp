/**
 *
 * ManageQuestions new
 *
 */

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table } from "ant-table-extensions";
import { Button, message, Modal, Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import React from 'react';
import { ACCESS_TOKEN_NAME } from "../../constants/apiConstants";
import {
    filterArray
} from '../../utils/utilityFunctions';
import ManageQuestionAddEditModal from './ManageQuestionAddEditModal';
import {
    ActionContainer, FieldContainer,
    IconContainer,

    InputField, QuestionHeaderContainer,

    SelectDropDownComponentWrapper, SkillSelectionContainer,

    TableHeaderContainer
} from './ManageQuestions.styled';




class ManageQuestions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            mainSkillOptions: [],
            mainSkillValue: '',
            subSkillOptions: [],
            subSkillValue: '',
            questionsData: [],
            addEditModalStatus: '',
            addEditingQuestionData: null,
            questionFilterValue: '',
            newMainSkillValue: '',
            newSubSkillValue: '',

            visible: false,
            visible1: false

        }
    }

    componentDidMount() {
        // ToDo: api call to get the list of main skills options
        // const mainSkillOptions = mainSkillsApiResponse.data.map((mainSkill) => {
        //     return {
        //         id: mainSkill.mainSkillId,
        //         label: mainSkill.mainSkillName
        //     }
        // });

        ///manageQuestion/getMainSkills
        //API to get sub skill areas: /manageQuestion/getSubSkills
        const apiCallPromise = axios.get('/manageQuestion/getMainSkills')
            .then(function (response) {
                //console.log(response)
                if (response.status === 200) {
                    return response.data.data;
                } else {
                    console.log('error');
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if (error.response.status === 403) {
                    message.error("You were logged out!");
                } else {
                    message.error("Unable to contact server");
                }
            });


        apiCallPromise.then((apiResponse) => {
            console.log('apiResponse in get main skills: ', apiResponse);

            const mainSkillOptionsTemp = []

            for (let i = 0; i < apiResponse.length; i++) {
                mainSkillOptionsTemp.push({
                    id: apiResponse[i],
                    label: apiResponse[i],
                });
            }

            this.setState({ mainSkillOptions: mainSkillOptionsTemp });

        })

        // const mainSkillOptionsTemp = []

        // for (let i = 0; i< mainSkillsApiResponse.data.length; i ++) {
        //     mainSkillOptionsTemp.push({
        //         id: mainSkillsApiResponse.data[i].mainSkillId,
        //         label: mainSkillsApiResponse.data[i].mainSkillName,
        //     });
        // }

        // this.setState({ mainSkillOptions: mainSkillOptionsTemp });
    }

    changeFilter = (value, fieldId) => {
        console.log(value)
        if (fieldId === 'mainSkillValue') {
            this.setState({ [fieldId]: value, subSkillOptions: [], subSkillValue: '', questionsData: [] });

            // ToDo: api call to get this list of sub skill options
            const apiCallPromise = axios.get("/manageQuestion/getSubSkills?mainSkillArea=" + value)
                .then(function (response) {
                    //console.log(response)
                    if (response.status === 200) {
                        return response.data.data;
                    } else {
                        console.log('error');
                    }
                })
                .catch(function (error) {
                    console.log(error.response);
                    if (error.response.status === 403) {
                        message.error("You were logged out!");
                    } else {
                        message.error("Unable to contact server");
                    }
                });

            apiCallPromise.then((apiResponse) => {
                console.log('apiResponse: ', apiResponse);

                const subSkillOptionsTmp = []

                for (let i = 0; i < apiResponse.length; i++) {
                    subSkillOptionsTmp.push({
                        id: apiResponse[i],
                        label: apiResponse[i],
                    });
                }

                //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
                this.setState({ subSkillOptions: subSkillOptionsTmp });
            })

        } else {


            //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
            console.log("else part")
            this.setState({ [fieldId]: value });
            this.setState({ [fieldId]: value }, function () {
                this.getQuestions();
            });
            // console.log('Main Skill area', this.state.mainSkillValue, 'sub skill Area : ', this.state.subSkillValue);


            // })

            // const subSkillOptions = subSkillsApiResponse.data.map((subSkill) => {
            //     return {
            //         id: subSkill.subSkillId,
            //         label: subSkill.subSkillName,
            //     }
            // });
            // this.setState({ subSkillOptions })

            // this.setState({ [fieldId]: value });

            // this.getQuestions();
        }
    }

    getQuestions = () => {
        //  ToDo: api call to get the list of questions
        //http://localhost:8080/manageQuestion/bySkill?mainSkillArea=Academic&subSkillArea=Transportation
        //starttt
        console.log("hi in questions!!!")
        console.log('API is', `/manageQuestion/bySkill?mainSkillArea=${this.state.mainSkillValue}&subSkillArea=${this.state.subSkillValue}`);
        const apiCallPromise = axios.get(`/manageQuestion/bySkill?mainSkillArea=${this.state.mainSkillValue}&subSkillArea=${this.state.subSkillValue}`)
            .then(function (response) {
                //console.log(response)
                if (response.status === 200) {
                    return response.data.data;
                } else {
                    console.log('error');
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if (error.response.status === 403) {
                    message.error("You were logged out!");
                } else {
                    message.error("Unable to contact server");
                }
            });

        let questionsTemp = []
        apiCallPromise.then((apiResponse) => {
            console.log('apiResponse in questions: ', apiResponse);



            for (let i = 0; i < apiResponse.length; i++) {
                questionsTemp.push({
                    questionID: apiResponse[i].questionID,
                    questionLabel: apiResponse[i].questionText,
                    ///newly
                    questionLevel: apiResponse[i].questionLevel,
                });
            }
            console.log("hi 223", questionsTemp)
            //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
            //this.setState({ subSkillOptions: subSkillOptionsTmp });
            const questionsData = questionsTemp.map((question) => {
                return {
                    ...question,
                    key: question.questionID,
                }
            });
            // console.log("display quesrtion data")
            console.log('Question Data is====', questionsData)
            this.setState({ questionsData });
        })

        //byme


    }

    editQuestion = (data) => {
        console.log("null data", data)
        this.setState({
            addEditModalStatus: 'edit',
            addEditingQuestionData: data
        });
    }

    deleteQuestion = (questionID) => {
        //  ToDo: api call to delete the questionId question
        ////
        //http://localhost:8080/manageQuestion/deleteQuestion?questionID=17
        console.log('Inside delete question function: ', questionID);
        console.log(`delete API http://localhost:8080/manageQuestion/deleteQuestion?questionID=${questionID}`)
        const apiCallPromise = axios.delete(`/manageQuestion/deleteQuestion?questionID=${questionID}`, { data: this.deleteQuestion, headers: { 'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME) } })
            .then(response => {

                console.log(response)

                if (response.status === 200) {
                    if (response.data.status === "error") {
                        message.error(response.data.message);
                    } else if (response.data.status === "success") {
                        if (response.data.message !== "") {
                            message.success(response.data.message);
                        }
                    }
                    // message.success('Question deleted successfully');
                    //this.state.dataSource = response.data.data;
                    // return response.data.data;
                } else {
                    console.log('error');
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if (error.response.status === 403) {
                    message.error("You were logged out!");
                } else {
                    message.error("Unable to contact server");
                }
            });
        apiCallPromise.then((response) => {
            // message.success("Question deleted successfully");
            this.updateListingData();
        })
        ///me

        console.log('delete question : ', questionID);
        this.getQuestions();
    }

    cancelAddEdit = () => {
        this.setState({
            addEditModalStatus: '',
            addEditingQuestionData: null
        });
    }

    updateListingData = () => {
        this.getQuestions();
        this.cancelAddEdit();
    }

    createNewQuestion = () => {
        this.setState({ addEditModalStatus: 'add' });
    }
    addNewMainSkill = () => {
        console.log('addItem');
        const { mainSkillOptions, newMainSkillValue } = this.state;
        console.log(mainSkillOptions, newMainSkillValue);
        axios.post(`/manageQuestion/addMainSkill?mainSkillArea=${newMainSkillValue}`, {})
            .then(response => {
                console.log("suceess added db")
                if (response.data.status === 'error')
                    message.error(response.data.message);
                if (response.data.status === 'success') {
                    message.success(response.data.message);
                    this.setState({
                        newMainSkillValue: '',
                        visible1: false
                    });
                }

            })
            .catch(error => {
                message.error("Add main skill");
                this.setState({
                    newMainSkillValue: '',
                    visible1: false
                });

            })
        this.setState({
            newMainSkillValue: '',
            visible1: false
        });


    };
    addNewSubSkill = () => {

        const { visible, subSkillOptions, newSubSkillValue, mainSkillValue } = this.state;
        console.log('addItem', newSubSkillValue);
        axios.post(`/manageQuestion/addSubSkill?mainSkillArea=${mainSkillValue}&subSkillArea=${newSubSkillValue}`, {})
            .then(response => {
                console.log(mainSkillValue, "mainSkillValue")
                if (response.data.status === 'error') { message.error(response.data.message); }
                if (response.data.status === 'success') {
                    message.success(response.data.message);
                    this.setState({
                        newSubSkillValue: '',
                        visible1: false
                    });
                }
                this.setState({
                    newSubSkillValue: '',
                    visible1: false
                });

            })
            .catch(error => {
                console.log(error)
                message.error("Subskill  error");
                this.setState({
                    newSubSkillValue: '',
                    visible1: false
                });
            })
        this.setState({
            newSubSkillValue: '',
        })
        console.log(subSkillOptions, newSubSkillValue);

    };
    onMainSkillAdded = event => {
        this.setState({
            newMainSkillValue: event.target.value,
        });
    };
    onSubSkillAdded = event => {
        this.setState({
            newSubSkillValue: event.target.value,
        });
    };
    showModal = () => {
        console.log("showModal", this.state.visible);
        this.setState({
            visible: true,
        });
    };
    showModal1 = () => {
        console.log("showModal", this.state.visible);
        this.setState({
            visible1: true,
        });
    };



    handleCancel = () => {
        console.log("handlecancel", this.state.visible);
        console.log("");
        this.setState({
            visible: false,
            newMainSkillValue: ''
        });
        console.log(" after handlecancel", this.state.visible);
    };

    handleCancel1 = () => {
        console.log("handlecancel", this.state.visible);
        console.log("");
        this.setState({
            visible1: false,
            newSubSkillValue: ''
        });
        console.log(" after handlecancel", this.state.visible);
    };
    render() {
        const {
            mainSkillOptions,
            mainSkillValue,
            subSkillOptions,
            subSkillValue,
            questionsData,
            addEditModalStatus,
            addEditingQuestionData,
            questionFilterValue,
            newMainSkillValue,
            newSubSkillValue,
            visible,
            visible1
        } = this.state;

        const questionsColumns = [
            {
                title: 'Question',
                dataIndex: 'questionLabel',
                key: 'questionLabel',
            },
            // newly
            {
                title: 'Question Level',
                dataIndex: 'questionLevel',
                key: 'questionLevel',
            },
            //newly
            {
                title: 'Action',
                dataIndex: 'questionID',
                key: 'questionID',
                render: (questionID, questionData) => {
                    return (
                        <ActionContainer>
                            <IconContainer>
                                <Popconfirm
                                    title={'Are you sure ?'}
                                    onConfirm={() => this.deleteQuestion(questionID)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined />
                                </Popconfirm>
                            </IconContainer>
                            <IconContainer>
                                <EditOutlined onClick={() => this.editQuestion(questionData)} />
                            </IconContainer>
                        </ActionContainer>
                    );
                }
            },
        ];

        // questionsData



        let updatedQuestionsData = questionsData;
        // update
        //console.log('Question Data  --->>>>>>>>>', updatedQuestionsData)
        if (questionFilterValue && questionFilterValue.length) {
            updatedQuestionsData = filterArray(questionsData, questionFilterValue, ['questionLabel']);
        }

        return (
            <div>
                <QuestionHeaderContainer>
                    <SkillSelectionContainer style={{ display: "flex" }}>
                        <SelectDropDownComponentWrapper
                            options={mainSkillOptions || []}
                            value={mainSkillValue}
                            showSearch
                            allowClear
                            showArrow
                            onChangeHandler={(value) => this.changeFilter(value, 'mainSkillValue')} placeholder="Select Main Skill"
                        />
                        <div style={{ marginRight: 150 }}><Tooltip placement="topLeft" title="Add Main Skill Area">
                            <Button icon="plus" onClick={this.showModal}>
                            </Button>
                        </Tooltip>
                            <Modal
                                title="Add Main Skill"
                                visible={visible}
                                onOk={this.addNewMainSkill}
                                onCancel={this.handleCancel}
                                okText="Add"
                            >
                                <input style={{ width: 700 }}
                                    type="text"
                                    placeholder="Enter Main Skill Area"
                                    value={newMainSkillValue}
                                    name="modalInputName"
                                    onChange={this.onMainSkillAdded}

                                />
                            </Modal>

                        </div>


                        <SelectDropDownComponentWrapper
                            options={subSkillOptions || []}
                            value={subSkillValue}
                            showSearch
                            allowClear
                            showArrow
                            onChangeHandler={(value) => this.changeFilter(value, 'subSkillValue')}
                            placeholder="Select Sub Skill"
                        />
                        <div style={{ marginRight: 150 }}><Tooltip placement="topLeft" title="Add Sub Skill Area">
                            <Button icon="plus" onClick={this.showModal1}>
                            </Button>
                        </Tooltip>
                            <Modal
                                title="Add Sub Skill"
                                visible={visible1}
                                onOk={this.addNewSubSkill}
                                onCancel={this.handleCancel1}
                                okText="Add"
                            >
                                <input style={{ width: 700 }}
                                    type="text"
                                    placeholder="Enter Sub Skill Area"
                                    value={newSubSkillValue}
                                    name="modalInputName"
                                    onChange={this.onSubSkillAdded}

                                />
                            </Modal>
                        </div>

                    </SkillSelectionContainer>


                </QuestionHeaderContainer>
                {(mainSkillValue && subSkillValue) ? (
                    <>
                        <TableHeaderContainer>
                            <InputField
                                value={questionFilterValue}
                                onChange={(event) => this.changeFilter(event.target.value, 'questionFilterValue')}
                                placeholder="Filter question"
                            />
                            <Button onClick={this.createNewQuestion}>
                                Create New Question
                            </Button>
                        </TableHeaderContainer>
                        <FieldContainer>
                            <Table
                                dataSource={updatedQuestionsData}
                                columns={questionsColumns}
                                pagination={false}  //  Remove this line if you need pagination in questions
                            />
                        </FieldContainer>
                    </>
                ) : null}
                {addEditModalStatus && addEditModalStatus.length ? (
                    <ManageQuestionAddEditModal
                        addEditModalStatus={addEditModalStatus}
                        addEditingQuestionData={addEditingQuestionData}
                        cancelAddEdit={this.cancelAddEdit}
                        updateListingData={this.updateListingData}
                        mainSkillValue={mainSkillValue}
                        mainSkillOptions={mainSkillOptions}
                        subSkillValue={subSkillValue}
                        subSkillOptions={subSkillOptions}
                    />
                ) : null}
            </div>
        )
    }
}


export default ManageQuestions;