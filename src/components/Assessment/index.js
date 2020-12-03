/**
 *
 * Assessment
 *
 */

import React from 'react';
import {
    Switch,
    Route,
} from "react-router-dom";

import AssessmentStudentSelectionPage from './AssessmentStudentSelectionPage';
import AssessmentTemplateSelectionPage from './AssessmentTemplateSelectionPage';
import AssessmentFormPage from './AssessmentFormPage';
import AssessmentFormPage2 from './AssessmentFormPage2';
import AssessmentFormPagePast from './AssessmentFormPagePast';
import AssessmentFormPagePastAns from './AssessmentFormPagePastAns';
import AssessmentFormPagePastAnsView from './AssessmentFormPagePastAnsView';

class Assessment extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {

        
        return (
            <Switch>
                <Route exact path="/assessment/create" component={AssessmentFormPage2} />
                <Route exact path="/assessment/past/ansview/:studentId" component={AssessmentFormPagePastAnsView} />
                <Route exact path="/assessment/past/ans/:studentId" component={AssessmentFormPagePastAns} />
                <Route exact path="/assessment/pastassessment/:studentId" component={AssessmentFormPagePast} />
                <Route exact path="/assessment/:studentId/:templateId" component={AssessmentFormPage} />
                <Route exact path="/assessment/:studentId" component={AssessmentTemplateSelectionPage} />
                <Route exact path="/assessment" component={AssessmentStudentSelectionPage} />
                
                
            </Switch>
        )
    }
}


export default Assessment;
