/**
 *
 * AssessmentTemplateSelectionPage
 *
 */


import React from 'react';
//  import { Tabs, TabList, TabPanel, Tab } from 'react-re-super-tabs'
import { Tabs } from 'antd';
import PickTemplate from './PickTemplate'
import Contact from './Contact'



class AssessmentTemplateSelectionPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function



    render() {



        

        return (

              <div>

                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Graph 1" key="1">
                      <PickTemplate />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Graph 2" key="2">
                      <Contact />
                    </Tabs.TabPane>
                  </Tabs>
            
            
          </div>
        )
    }
}


export default AssessmentTemplateSelectionPage;
