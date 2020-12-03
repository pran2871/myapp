/**
 *
 * ManageQuestions new
 *
 */

import React from 'react';
import { Table, Button, Icon, Popconfirm, message } from 'antd';
import axios from 'axios';
import Chart from "react-google-charts";
import {
    mainSkillsApiResponse,
    subSkillsApiResponse,
    questionsResponse,
} from './ManageQuestions.constants';
import CanvasJSReact from '../../assets/canvasjs.react';
import {ACCESS_TOKEN_NAME} from "../../constants/apiConstants";



import ManageQuestionAddEditModal from './ManageQuestionAddEditModal';

import {
    filterArray,
} from '../../utils/utilityFunctions';

import {
    SkillSelectionContainer,
    QuestionHeaderContainer,
    TableHeaderContainer,
    SelectDropDownComponentWrapper,
    FieldContainer,
    IconContainer,
    ActionContainer,
    InputField,
} from './ManageQuestions.styled';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// const data =[
//     ['x', 'Student Performance'],
//     ["26-11-2020 16:51:21", 88.89],
//     ["26-11-2020 16:51:21", 88.89]
// ];
let data=[];


const options1 = 
    { 
      title: "Student Score vs Time",
        hAxis: {
          title: 'Date',
          
        },
        vAxis: {
          title: 'Score',
          
        },
      }

class ManageQuestions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            studentOptions: [],
            mainSkillOptions: [],
            mainSkillValue: '',
            studentValue: '',
            subSkillOptions: [],
            graphResult:[],
            graphResult1:[],
            subSkillValue: '',
            questionsData: [],
            addEditModalStatus: '',
            addEditingQuestionData: null,
            questionFilterValue: '',
        }
    }

    componentDidMount() {
        //collecting the student names.
            const apiCallPromise1 = axios.get('/manageStudents/getAll', {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
            .then(function (response) {
                //console.log(response)
                if(response.status === 200){
                return response.data.data;
                } else{
                    console.log('error');
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 403) {
                    message.error("You were logged out!");
                } else {
                    message.error("Unable to contact server");
                }
            });

            
        apiCallPromise1.then((apiResponse) => {
            console.log('apiResponse in get students: ', apiResponse);

            const studentOptionsTemp = []

            for (let i = 0; i< apiResponse.length; i ++) {
                studentOptionsTemp.push({
                    id: apiResponse[i].studentReferenceNumber,
                    label: apiResponse[i].studentName,
                });
            }
            console.log(studentOptionsTemp)
            this.setState({ studentOptions: studentOptionsTemp });

        })

        // collecting main skills 
        const apiCallPromise = axios.get('/manageQuestion/getMainSkills', {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
            .then(function (response) {
                //console.log(response)
                if(response.status === 200){
                return response.data.data;
                } else{
                    console.log('error');
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 403) {
                    message.error("You were logged out!");
                } else {
                    message.error("Unable to contact server");
                }
            });

            
        apiCallPromise.then((apiResponse) => {
            console.log('apiResponse in get main skills: ', apiResponse);

            const mainSkillOptionsTemp = []

            for (let i = 0; i< apiResponse.length; i ++) {
                mainSkillOptionsTemp.push({
                    id: apiResponse[i],
                    label: apiResponse[i],
                });
            }

            this.setState({ mainSkillOptions: mainSkillOptionsTemp });

        })
    }

    changeFilter = (value, fieldId) => {
        console.log(value)
        if(fieldId ==='studentValue'){
           // const apiCallPromise1 = axios.get("/assessment/getCompletedAssessments?studentReferenceNumber="+value, {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
            localStorage.setItem('std',value);
            const apiCallPromise1 = axios.get("/assessment/reportOne?studentReferenceNumber="+localStorage.getItem('std')+"&mainSkillArea="+''+"&subSkillArea="+'', {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
            .then(function (response) {
                console.log(response)
                if(response.status === 200){
                return response.data.data;
                } else{
                    console.log('error');
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if(error.response.status === 403) {
                    message.error("You were logged out!");
                } else {
                    message.error("Unable to contact server");
                }
            });
            
        apiCallPromise1.then((apiResponse) => {
            console.log('apiResponse: ', apiResponse);

            const graphResult = []
            const graphResult1 = []
            graphResult1.push(['x', 'Student Performance'])
            // for (let i = 0; i< apiResponse.length; i ++) {
            //     graphResult.push({
            //         x: apiResponse[i].assessmentID,
            //         y: apiResponse[i].score,
            //     });
            // }

            
            for (let i = 0; i< apiResponse.length; i ++) {
                graphResult1.push([
                     apiResponse[i].updatedAt,
                    apiResponse[i].score,
                ]);
            }

            console.log(graphResult1);
            //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
            this.setState({ graphResult: graphResult });
            this.setState({ graphResult1: graphResult1 });
            data = this.state.graphResult1;
            console.log(data);
            
        })
    }
       
    if (fieldId === 'mainSkillValue') {
        this.setState({ [fieldId]: value, subSkillOptions: [], subSkillValue: '', questionsData: [] });

        // ToDo: api call to get this list of sub skill options
        const apiCallPromise3 = axios.get("/manageQuestion/getSubSkills?mainSkillArea="+value, {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
        localStorage.setItem('mainskill',value);
        console.log("mainSkillValue")
        console.log(value)
        const apiCallPromise1 = axios.get("/assessment/reportOne?studentReferenceNumber="+localStorage.getItem('std')+"&mainSkillArea="+localStorage.getItem('mainskill')+"&subSkillArea="+'', {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
        .then(function (response) {
            //console.log(response)
            console.log(response)
            if(response.status === 200){
            return response.data.data;
            } else{
                console.log('error');
            }
        })
        .catch(function (error) {
            console.log(error.response);
            if(error.response.status === 403) {
                message.error("You were logged out!");
            } else {
                message.error("Unable to contact server");
            }
        });

    //apiCallPromise.then((apiResponse) => {
    apiCallPromise1.then((apiResponse) => {
        console.log('apiResponse: ', apiResponse);

        const subSkillOptionsTmp = []
        const graphResult = []
        const graphResult1 = []
        graphResult1.push(['x', 'Student Performance'])

        for (let i = 0; i< apiResponse.length; i ++) {
            subSkillOptionsTmp.push({
                id: apiResponse[i],
                label: apiResponse[i],
            });
            // graphResult1.push({
            //     x: apiResponse[i].assessmentID,
            //     y: apiResponse[i].score,
            // });
        }
        for (let i = 0; i< apiResponse.length; i ++) {
            graphResult1.push([
                 apiResponse[i].updatedAt,
                apiResponse[i].score,
            ]);
        }
        //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
        this.setState({ subSkillOptions: subSkillOptionsTmp });
        this.setState({ graphResult1: graphResult1 });

        this.setState({ [fieldId]: value, subSkillOptions: [], subSkillValue: '', questionsData: [] });

        // ToDo: api call to get this list of sub skill options
        const apiCallPromise = axios.get("/manageQuestion/getSubSkills?mainSkillArea=" + value, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME) } })
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

    });

    } else {


        localStorage.setItem('subskill',value);
        //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
        const apiCallPromise5 = axios.get("/assessment/reportOne?studentReferenceNumber="+localStorage.getItem('std')+"&mainSkillArea="+localStorage.getItem('mainskill')+"&subSkillArea="+localStorage.getItem('subskill'), {headers: {'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN_NAME)}})
        .then(function (response) {
            console.log(response)
            if(response.status === 200){
            return response.data.data;
            } else{
                console.log('error');
            }
        })
        .catch(function (error) {
            console.log(error.response);
            if(error.response.status === 403) {
                message.error("You were logged out!");
            } else {
                message.error("Unable to contact server");
            }
        });

    apiCallPromise5.then((apiResponse) => {
        console.log('apiResponse: ', apiResponse);

        const graphResult = []
        const graphResult1 = []
        graphResult1.push(['x', 'Student Performance'])

        for (let i = 0; i< apiResponse.length; i ++) {
            graphResult.push({
                x: apiResponse[i].assessmentID,
                y: apiResponse[i].score,
            });
        }
        for (let i = 0; i< apiResponse.length; i ++) {
            graphResult1.push([
                 apiResponse[i].updatedAt,
                apiResponse[i].score,
            ]);
        }
        //this.setState({ mainSkillOptions: mainSkillOptionsTemp });
        this.setState({ graphResult1: graphResult1 });
    })

        console.log("else part")
        this.setState({ [fieldId]: value });
        // this.setState({ [fieldId]: value }, function() {
        //     this.getQuestions();
        //   });
        
    }
}



    render() {     
        const {
            studentOptions,
            mainSkillOptions,
            mainSkillValue,
            studentValue,
            subSkillOptions,
            subSkillValue,
            questionsData,
            questionFilterValue,
        } = this.state;


        let updatedQuestionsData = questionsData;
        if (questionFilterValue && questionFilterValue.length) {
            updatedQuestionsData = filterArray(questionsData, questionFilterValue, ['questionLabel']);
        }

        return (
            <div>
                <QuestionHeaderContainer>
                
                        
                    <SkillSelectionContainer>
                    <SelectDropDownComponentWrapper
                            options={studentOptions || []}
                            value={studentValue}
                            showSearch
                            allowClear
                            showArrow
                            onChangeHandler={(value) => this.changeFilter(value, 'studentValue')}
                            placeholder="Select Student "
                        />
                        <SelectDropDownComponentWrapper
                            options={mainSkillOptions || []}
                            value={mainSkillValue}
                            showSearch
                            allowClear
                            showArrow
                            onChangeHandler={(value) => this.changeFilter(value, 'mainSkillValue')}
                            placeholder="Select Main Skill"
                        />
                         
                         
                        <SelectDropDownComponentWrapper
                            options={subSkillOptions || []}
                            value={subSkillValue}
                            showSearch
                            allowClear
                            showArrow
                            onChangeHandler={(value) => this.changeFilter(value, 'subSkillValue')}
                            placeholder="Select Sub Skill"
                        />
                    </SkillSelectionContainer>
                </QuestionHeaderContainer>

                        <div className="App">
                        <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={this.state.graphResult1}
                        options={options1}
                        />
                        </div>
            </div>
            
        )
    }
}


export default ManageQuestions;