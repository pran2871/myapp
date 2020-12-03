/**
 *
 * ManageQuestionAddEditModal
 *
 */

import React from 'react';
import { Button, Modal, Input, message } from 'antd';
import axios from 'axios';
import SelectDropDownComponent from '../SelectDropDownComponent';

import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
import {
    FieldContainer,
} from './ManageQuestions.styled';

import {
    manageStudentsOrganizationResponse,
    manageStudentsCoachListResponse,
} from './ManageQuestions.constants';

//const questionLevelList = ['Bronze', 'Gold', 'Silver']

class ManageQuestionAddEditModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            addEditingQuestionData: {
                question: '',
                //
                questionID: '',
                questionLevel: '',

            },
            //
            questionLevelList: [{id: "Bronze",
            label: "Bronze"},{id: "Silver",
            label: "Silver"},{id: "Gold",
            label: "Gold"} ],

        }
    }

    componentDidMount() {
        console.log("in component ", this.props.addEditingQuestionData)

        const { addEditingQuestionData } = this.props;

        if (addEditingQuestionData) {
            this.setState({ addEditingQuestionData: {
                ...addEditingQuestionData,
                question: addEditingQuestionData.questionLabel,
                //
                questionID: addEditingQuestionData.questionID,
            }});
        }
    }

    submit = () => {
        console.log('Update State method', this.state)
        console.log("hi im in update button click")
        console.log('addEditingQuestionData : ', this.state.addEditingQuestionData);
        console.log('addEditModalStatus : ', this.props.addEditModalStatus);
        console.log('mainSkillValue : ', this.props.mainSkillValue);
        console.log('subSkillValue : ', this.props.subSkillValue);
        //  ToDo: make the add / edit api call depending on the value of this.props.addEditModalStatus.
        //update api start
        //http://localhost:8080/manageQuestion/updateQuestion?questionID=2&questionText=question-2564566666
        // console.log(payload)


//////////////
        const payload={
            "questionID" : this.state.addEditingQuestionData.questionID,
            "questionLabel" : this.state.addEditingQuestionData.question,
            "questionLevel" : this.state.addEditingQuestionData.questionLevel,

        }

        console.log("manasa ",payload)
        //console.log(payload)
        //http://localhost:8080/manageQuestion/updateQuestion?questionID=2&questionText=question-2564566666
       if(this.props.addEditModalStatus === 'add'){
                //addquestion API

                //http://localhost:8080/manageQuestion/addQuestion?mainSkillArea=Academic&subSkillArea=Academic Insight&questionText=question444&questionLevel=Bronze
                console.log("inside add the student");
                console.log(payload);

                const reply = axios.post('manageQuestion/addQuestion?questionText='+payload.questionLabel+"&mainSkillArea="+this.props.mainSkillValue+"&subSkillArea="+this.props.subSkillValue+"&questionLevel="+payload.questionLevel, {})
                .then(function (response) {
                    console.log(response);
                    console.log("add Question list1");
                    return response;
                    //////

                });
                reply.then((response) => {
                    console.log("in reply", response)
                    if (response.status === 200) {
                        if (response.data.status === "error") {
                            message.error(response.data.message);
                        } else if (response.data.status === "success") {
                            this.props.updateListingData();
                            if (response.data.message !== "") {
                                message.success(response.data.message);
                            }
                        }
                    } else {
                        message.error("Something went wrong");
                    }
                }).catch(function (error) {
                    console.log(error.response);
                    if(error.response.status === 403) {
                        message.error("You were logged out!");
                    } else {
                        message.error("Unable to contact server");
                    }
                });

                console.log(this.props.mainSkillValue);
                console.log(this.props.subSkillValue);
                const reply2 = axios.post('/manageQuestion/addQuestion?questionText='+payload.questionLabel+"&mainSkillArea="+this.props.mainSkillValue+"&subSkillArea="+this.props.subSkillValue+"&questionLevel="+payload.questionLevel).then(function (response) {
                    console.log(response);
                    console.log("add Question list1");

                });
                reply2.then((response) => {
                    message.success("Question successfully added..!");
                    this.props.updateListingData();
                })
            }else{
            //axios.get("/login/changePassword?email_id="+payload.email+"&password="+payload.password, payload)
            //updateapi
         const reply1 =   axios.patch('/manageQuestion/updateQuestion?questionID='+payload.questionID+"&questionText="+payload.questionLabel+"&questionLevel="+payload.questionLevel,payload)
           .then(function (response) {
            });
            reply1.then((response) => {
                // success message popup
                 message.success("Question successfully updated!");
                this.props.updateListingData();
            })
        }
       //end by me
        //   use this.state.addEditingQuestionData to get the student data
        // message.success(`Question ${this.props.addEditModalStatus === 'add' ? 'created' : 'updated'} successfully`);
        // this.props.updateListingData();
    }

    changeFilter = (value) => {
        console.log("value----",value)
        console.log('aa', this.state.addEditingQuestionData)
        this.setState({ addEditingQuestionData: {
            ...this.state.addEditingQuestionData,
            question: value,
            //

        }
    });

    }

    changeQuestionLevel = (value) => {
        console.log("Chnage question lelvel new value---------->>>>>>>>>>>>>>>>>>>>>>>>>>>",value)
       // console.log('aa', this.state.addEditingQuestionData)
        this.setState({ addEditingQuestionData: {
            ...this.state.addEditingQuestionData,
            questionLevel: value
        }
    });
    }


    render() {
        //console.log('new data', addEditingQuestionData);
        const { addEditingQuestionData } = this.state;
        const { cancelAddEdit, addEditModalStatus, mainSkillValue, mainSkillOptions, subSkillValue, subSkillOptions, questionLevelList = [] } = this.props;
        console.log('Select struc uture',mainSkillOptions)

        console.log('state : ', this.state);

        return (
            <Modal
                title={addEditModalStatus === 'edit' ? 'Edit Student Data' : 'Add New Student'}
                visible={addEditModalStatus.length}
                onOk={addEditModalStatus === 'edit' ? this.editStudentData : this.createNewStudent}
                onCancel={cancelAddEdit}
                footer={[
                    <Button key="back" onClick={cancelAddEdit}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.submit}>
                        {addEditModalStatus === 'edit' ? 'Update' : 'Create'}
                    </Button>,
                ]}
            >
                <FieldContainer>
                    <SelectDropDownComponent
                        disabled
                        onChange={(event) => this.changeFilter(event.target.value)}
                        value={mainSkillValue}
                        placeholder="Main skill"
                        options={mainSkillOptions}
                    />
                </FieldContainer>

                <FieldContainer>
                    <SelectDropDownComponent
                        disabled
                        onChange={(event) => this.changeFilter(event.target.value)}
                        value={subSkillValue}
                        placeholder="Sub skill"
                        options={subSkillOptions}
                    />
                </FieldContainer>
                <FieldContainer>
                    <Input
                        onChange={(event) => this.changeFilter(event.target.value)}
                        value={addEditingQuestionData.question}
                        placeholder="Enter Question"
                    />
                </FieldContainer>
                {/* newly */}
                <FieldContainer>
                    <SelectDropDownComponent

                        onChangeHandler={(value) => this.changeQuestionLevel(value)}
                        value={addEditingQuestionData.questionLevel}
                        placeholder="Bronze or silver or gold"
                        options={this.state.questionLevelList}

                    />
                </FieldContainer>
            </Modal>
        )
    }

}


export default ManageQuestionAddEditModal;