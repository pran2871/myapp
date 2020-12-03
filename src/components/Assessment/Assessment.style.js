import styled from 'styled-components';
import { Button } from 'antd';
import SelectDropDownComponent from '../SelectDropDownComponent';
import { Input } from 'antd';

export const StudentNameContainer = styled.div`
    font-size: 24px;
    display: flex;
    font-weight: bold;
`;

export const FieldContainer = styled.div`
    margin: 15px 0;
`;

export const TemplateContainer = styled.div`
    margin: 15px 0;
`;

export const CommentFieldContainer = styled.div`
    margin: 15px 0;
    max-width: 350px;
`;

export const ButtonFieldContainer = styled.div`
    margin: 15px 0;
    display: flex;
    justify-content: flex-end;
`;

export const ButtonComponent = styled(Button)`
    margin-left: 10px;
`;

export const QuestionHeaderContainer = styled.div`
    margin-bottom: 35px;
    display: flex;
    justify-content: space-between;
`;

export const TableHeaderContainer = styled.div`
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
`;

export const InputField = styled(Input)`
    max-width: 350px;
`;

export const SkillSelectionContainer = styled.div`
    display: flex;
    width: 500px;
`;

export const SelectDropDownComponentWrapper = styled(SelectDropDownComponent)`
    margin-right: 15px;
`;


export const IconContainer = styled.div`
    padding: 5px 10px;
`;

export const ActionContainer = styled.div`
    display: flex;
`;