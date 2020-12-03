/**
 *
 * AssessmentFormPage
 *
 */

import React from 'react';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";
import { Table, Radio, Input,message ,Tooltip} from 'antd';
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

class AssessmentFormPage2 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            templateData: null,
            answersData: {},
            questionData: {},
            comment: '',
            ans:[],
            userId:localStorage.getItem('userID'),
            allquestions:[],
            selectedquestions:this.props.payload,
            quest:localStorage.getItem('payload123')
        }
    }

    componentDidMount() {
        //get all api
        console.log(localStorage.getItem('payload123'));
        const quest = this.props.history.location.data.questionsList
        console.log(this.props.history.location.data.questionsList);
    console.log(quest)
    //     const apiCallPromise = axios.get("/manageTemplate/?templateID="+localStorage.getItem('testtemplate'))

    //     .then(function (response) {
    //         console.log(response)
    //         console.log(response.status)
    //         //console.log("response",response.data.questionsList)
    //         //console.log(this.state.dataSource)

    //         if (response.status === 200) {
    //             //this.setState({ dataSource: response.data.data });
    //             //this.state.dataSource = response.data.data;
    //             return response.data.questionsList;
    //         } else {
    //             console.log('error');
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    // // using .then, create a new apiCallPromise which extracts the data
    // apiCallPromise.then((response) => {

    //     console.log('response.data.data : ', response);
    //     // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]

    //     this.setState({ dataSource: response });
    //     assessmentFormTemplateResponse.data.assessmentDetails.questions = response
    //     console.log(this.state.dataSource)
    //     console.log(assessmentFormTemplateResponse.data.assessmentDetails.questions)

    //     const allquestions1=[]
    //     assessmentFormTemplateResponse.data.assessmentDetails.questions.forEach((questionData) => {
    //         allquestions1.push({
    //                     "questionID": questionData.questionID,
    //                     "questionText": questionData.questionText,
    //                     "ansText":'',
    //                     "mainSkillArea":questionData.skill.mainSkillArea,
    //                     "subSkillArea":questionData.skill.subSkillArea,
    //                     "questionLevel":questionData.questionLevel
    //                 });
    //     });
    //     console.log(allquestions1)
    //     this.setState({ allquestions: allquestions1 });
    //     console.log(this.state.allquestions)
    // })


        // [{name: 'a', b: 'b'}, {name: 'c', d: 'd'}]

        this.setState({ dataSource: quest });
        assessmentFormTemplateResponse.data.assessmentDetails.questions = quest
        console.log(this.state.dataSource)
        console.log(assessmentFormTemplateResponse.data.assessmentDetails.questions)

        let allquestions1=[]
        assessmentFormTemplateResponse.data.assessmentDetails.questions.forEach((questionData) => {
            allquestions1.push({
                        "questionID": questionData.questionID,
                        "questionText": questionData.questionText,
                        "ansText":'',
                        "mainSkillArea":questionData.skill.mainSkillArea,
                        "subSkillArea":questionData.skill.subSkillArea,
                        "questionLevel":questionData.questionLevel
                    });
        });
        console.log(allquestions1)
        this.setState({ allquestions: allquestions1 });
        console.log(this.state.allquestions)
        //const allquestions1=this.state.allquestions

        // assessmentFormTemplateResponse.data.assessmentDetails.questions.forEach((questionData) => {
        //     allquestions1.push({
        //                 "questionID": questionData.questionID,
        //                 "questionText": questionData.questionText,
        //                 "ansText":''
        //             });
        // });
        const tempAnswersData = {};
        assessmentFormTemplateResponse.data.assessmentDetails.questions.forEach((questionData) => {
            if (questionData.questionAnswer) {
                tempAnswersData[questionData.questionID] = questionData.questionText;
            }
        });

        // const apiResponse = this.state.dataSource
        // console.log(apiResponse)
        // for (let i = 0; i< this.state.dataSource.length; i ++) {
        //     allquestions.push({
        //         "questionID": this.state.dataSource[i].questionID,
        //         "questionText": this.state.dataSource[i].questionText,
        //         "ansText":''
        //     });
        //     console.log("all questions")
        //     console.log(allquestions)
        // }

        //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
        //this.setState({ templateData: assessmentFormTemplateResponse.data, answersData: tempAnswersData, comment: assessmentFormTemplateResponse.data.assessmentDetails.comment || '' })
        this.setState({ templateData: assessmentFormTemplateResponse.data, answersData: '', comment:  '' })
        this.setState({questionData:tempAnswersData})
    }

    changeAnswer = (event, questionData) => {
        console.log("changeAns")
        let tempAns = this.state.ans;
        tempAns.push({
            "question":questionData.questionID,"answer":event.target.value,"questionText":questionData.questionText
        });

        // let userDetails = {
        //     name: 'siddu',
        //     age: 70,
        // };

        // let professionalDetails = {
        //     name: 'gaiks',
        //     designation: 'full time',
        //     companyJoiningDate: '02/02/2020'
        // }

        //let tempUserDetails = userDetails;
        //tempUserDetails.designation = 'full time';

       // let completeUserDetails = { name: '-', ...userDetails, ...professionalDetails };
        //let tempUserDetails = { name: '-'. name: 'siddu',age: 70,designation: 'full time', name: 'gaiks', companyJoiningDate: '02/02/2020' };

        // completeUserDetails = {
        //     name: 'gaiks',
        //     age: 70,
        //     designation: 'full time',
        //     companyJoiningDate: '02/02/2020'
        // }

        // let answeredQuestions = [{questionId: 1, answerId: 1}, {questionId: 2, answerId: 2}, {questionId: 3, answerId: 3}];
        // let unAsweredQuestions = [{questionId: 1, answerId: 2}, {questionId: 5}];

        // let totalQuestions = [...answeredQuestions, ...unAsweredQuestions, {questionId: 6}]
        // //let totalQuestions = [{questionId: 1, answerId: 1}, {questionId: 2, answerId: 2}, {questionId: 3, answerId: 3}, {questionId: 1, answerId: 2}, {questionId: 5}, {questionnId: 6}]

        this.setState({
            answersData: { ...this.state.answersData, [questionData.questionID]: event.target.value , "question":questionData.questionID,"answer":event.target.value},
            //ans: tempAns,
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

        let res = this.state.ans
        console.log(res)
        console.log(res.length)

        let all = this.state.allquestions
        console.log("save as a draft")
        console.log(all)
        let result1=[]

        //  res = [{questionId: 2, answerId: 1}, {questionId: 4, answerId: 3}]
        //  all = [{questionId: 1}, {questionId: 2}, {questionId: 3}, {questionId: 4}, {questionId: 5},]
        let answerDataObject = {};
        res.forEach((questionsData) => answerDataObject[questionsData.question] = questionsData.answer);
        //  answerDataObject = {2: 1, 4: 3};
        console.log(answerDataObject)
        for (let i = 0; i< all.length ; i ++) {
            console.log(all[i])
            console.log(all[i].ansText)
            const questionData = all[i];
            console.log(answerDataObject[questionData.questionID])

            result1.push(
            {

                    "userID": Number(this.state.userId),
                    "answerText": answerDataObject[questionData.questionID] || questionData.ansText || '',
                    "questionID": questionData.questionID,
                    "questionText": questionData.questionText,
                    "mainSkillArea": questionData.mainSkillArea,
                    "subSkillArea": questionData.subSkillArea,
                    "questionLevel": questionData.questionLevel,
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
        message.success("Submitted successfully");
           //console.log("response="+response);
            this.props.history.push('/assessment');
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
        message.success("Submitted successfully");

         this.props.history.push('/assessment');
    }
    }


    render() {
        console.log("hi inside assessmnet form 2")
        console.log(localStorage.getItem('payload123'));
        console.log(this.props);
        console.log(this.props.history);
        console.log(this.state)
        const { templateData, comment } = this.state;
        if (!templateData) {
            return null;
        }

        const filteredDataSource = [
            {
                title: 'Main Skill',
                dataIndex: 'skill.mainSkillArea',
                key: 'skill.mainSkillArea',
                sorter: (a, b) => {
                    a = a.skill.mainSkillArea || '';
                    b = b.skill.mainSkillArea || '';
                return a.localeCompare(b)
            },
            },
            {
                title: 'Sub Skill',
                dataIndex: 'skill.subSkillArea',
                key: 'skill.subSkillArea',
                sorter: (a, b) => {
                    a = a.skill.subSkillArea || '';
                    b = b.skill.subSkillArea || '';
                return a.localeCompare(b)
            },
            },
            {
                title: 'Question Level',
                dataIndex: 'questionLevel',
                key: 'questionLevel',
                sorter: (a, b) => {
                    a = a.questionLevel || '';
                    b = b.questionLevel || '';
                return a.localeCompare(b)
            },
            },
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
                        <>
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
                        {/* <Tooltip title="1-Low 2-Medium 3-High">
                        <span>?</span>
                      </Tooltip> */}
                      </>
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


export default AssessmentFormPage2;
