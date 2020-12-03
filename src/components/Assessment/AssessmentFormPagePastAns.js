/**
 *
 * AssessmentFormPage
 *
 */

import React from 'react';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
import { Table, Radio, Input,message,Tooltip } from 'antd';
import axios from 'axios';
import {
    assessmentFormTemplateResponse,
} from './Assessment.constant';

import {
    StudentNameContainer,
    FieldContainer,
    CommentFieldContainer,
    ButtonFieldContainer,
    ButtonComponent,
} from './Assessment.style';

class AssessmentFormPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            templateData: null,
            answersData: {},
            comment: '',
            ans:[],
            userId:localStorage.getItem('userID')

        }
    }

    componentDidMount() {
        //get all api
        const apiCallPromise = axios.get("/assessment/getAssessment?assessmentID="+localStorage.getItem('assessmentID'))

        .then(function (response) {
            console.log(response)
            console.log(response.data.data.answers)
            //console.log("response",response.data.questionsList)
            //console.log(this.state.dataSource)

            if (response.status === 200) {
                //this.setState({ dataSource: response.data.data });
                //this.state.dataSource = response.data.data;
                return response.data.data.answers;
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
        assessmentFormTemplateResponse.data.assessmentDetails.questions = response
        console.log(this.state.dataSource)
        console.log(assessmentFormTemplateResponse.data.assessmentDetails.questions)
    })

    console.log("old ans");
        const tempAnswersData = {};
        assessmentFormTemplateResponse.data.assessmentDetails.questions.forEach((questionData) => {
            console.log(questionData)
            if (questionData.answerText) {
                tempAnswersData[questionData.questionID] = questionData.answerText;
            }
        });
        this.setState({ templateData: assessmentFormTemplateResponse.data, answersData: tempAnswersData, comment: assessmentFormTemplateResponse.data.assessmentDetails.comment || '' })
       // this.setState({ templateData: assessmentFormTemplateResponse.data, answersData: '', comment:  '' })
       console.log(tempAnswersData)
    }

    changeAnswer = (event, questionData) => {
        console.log("changeAns")

        this.setState({ answersData: { ...this.state.answersData, [questionData.questionID]: event.target.value , "question":questionData.questionID,"answer":event.target.value} })

        console.log(questionData)
        this.state.ans.push({
            "question":questionData.questionID,"answer":event.target.value
        })
    }

    commentChange = (event) => {
        this.setState({ comment: event.target.value })
    }

    submitForm = (mode) => {
        console.log('mode : ', mode); // submit or saveDraft
        console.log('state : ', this.state.answersData);
        console.log('state : ', this.state);
        const result=[]

        const res = this.state.ans
        console.log(res)
        console.log(this.state.ans.length)
        console.log(res.length)

        const result1 =[]
        for (let i = 0; i< res.length; i ++) {

            console.log(this.state.userId)
        console.log(this.state.ans.answer)
        console.log(this.state.ans.question)
        console.log(this.state.templateData.studentDetails.studentID)

            result1.push(
            {

                    "userID": Number(this.state.userId),
                    "answerText":res[i].answer,
                    "questionID": res[i].question,
                    "studentReferenceNumber": this.state.templateData.studentDetails.studentReferenceNumber,
                    "comment":this.state.comment,

            }
            );
        }
        //this.setState({ : mainSkillOptionsTemp });
        // if (mode === 'submit') {
        //     this.props.history.push('/assessment')
        // }
        console.log(result1)
        if(mode === 'submit'){
        const reply = axios.post('/assessment/submit',result1).then(function (response) {
            console.log(response);
            console.log("updating Lists1");

        });
        reply.then((response) => {
            message.success("Submitted successfully");
           console.log("response="+response);
            this.props.history.push('/assessment');
        })
    }
    if(mode === 'saveDraft'){
        const reply = axios.post('/assessment/draft',result1).then(function (response) {
            console.log(response);
            console.log("updating Lists1");

        });
        reply.then((response) => {
            message.success("Draft Saved successfully");
           console.log("response="+response);
            this.props.history.push('/assessment');
        })

    }
    }


    render() {

        const { templateData, comment } = this.state;
        if (!templateData) {
            return null;
        }

        const filteredDataSource = [
            {
                title: 'Question',
                dataIndex: 'questionText',
                key: 'questionText',
            },
            {
                title: 'Answer',
                dataIndex: 'questionID',
                key: 'questionID',
                render: (questionID, questionData) => {
                    const { answersData } = this.state;
                    return (
                        <Radio.Group name="radiogroup" value={(answersData && answersData[questionID]) || ''} onChange={(event) => this.changeAnswer(event, questionData)} style={{display: 'flex', flexDirection: 'row'}}>
                                <Tooltip title="Not Independent">
                                    <Radio value={1} >1</Radio>
                                </Tooltip>
                                <Tooltip title="Independent with Guidance">
                                    <Radio value={2} >2</Radio>
                                </Tooltip>
                                <Tooltip title="Independent">
                                    <Radio value={3} >3</Radio>
                                </Tooltip>
                        </Radio.Group>
                    );
                }
            },
        ];

        return (
            <div>
                <StudentNameContainer>
                    {/* {templateData.studentDetails.studentName || ''} */}
                    {localStorage.getItem('testName')}
                </StudentNameContainer>
                <FieldContainer>
                    <Table
                        dataSource={this.state.dataSource}
                        columns={filteredDataSource}
                        pagination={false}
                    />
                </FieldContainer>
                <CommentFieldContainer>
                    <Input.TextArea
                        rows={4}
                        value={comment}
                        placeholder="Enter your comment"
                        onChange={this.commentChange}
                    />
                </CommentFieldContainer>
                <ButtonFieldContainer>
                    <ButtonComponent
                        type="default"
                        onClick={() => this.submitForm('saveDraft')}
                    >
                        Save Draft
                    </ButtonComponent>
                    <ButtonComponent
                        type="primary"
                        onClick={() => this.submitForm('submit')}
                    >
                        Submit
                    </ButtonComponent>
                </ButtonFieldContainer>
            </div>
        )
    }
}


export default AssessmentFormPage;
