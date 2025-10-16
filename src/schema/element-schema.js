import { UuidTool } from 'uuid-tool'

/* Icons */
import { IconSurveyChoice } from '@public/votg/IconSurveyChoice'
import { IconSurveyEssay } from '@public/votg/IconSurveyEssay'
import { IconSurveyTable } from '@public/votg/IconSurveyTable'
import { IconSurveyStar } from '@public/votg/IconSurveyStar'
import { IconSurveyContact } from '@public/votg/IconSurveyContact'

import { IconSurveyRadio } from '@public/votg/IconSurveyRadio'
import { IconSurveyDuplicate } from '@public/votg/IconSurveyDuplicate'
import { IconSurveyLogic } from '@public/votg/IconSurveyLogic'
import { IconSurveyRequired } from '@public/votg/IconSurveyRequired'
import { IconSurveyCopy } from '@public/votg/IconSurveyCopy'

export const elementInfo = {
    title: '',
    description: '',
    logoImage: '',
}
export const elementPnls = {
    selected: '',
    number: '',
    type: '',
    detail: '',
}
export const elementReward = {
    code: '',
    category: '',
    item: '',
    count: 0,
}
export const elementLogic = {
    next: '',
}
export const surveyForm = {
    info: elementInfo,
    questions: [],
    pnls: null,
    reward: null,
}

export const sendContactForm = {
    sendType: 3,
    phoneNumbers: [],
    emails: [], 
}

export const elementType = [
    {
        number: 0,
        title: '객관식',
        short: '객관식',
        icon: <IconSurveyChoice sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyChoice sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 1,
        title: '주관식',
        short: '주관식',
        icon: <IconSurveyEssay sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyEssay sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 2,
        title: '행렬형',
        short: '행렬형',
        icon: <IconSurveyTable sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyTable sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 3,
        title: '별점형',
        short: '별점형',
        icon: <IconSurveyStar sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyStar sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 4,
        title: '연락처',
        short: '연락처',
        icon: <IconSurveyContact sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyContact sx={{ width: 21, mr: 1 }} variant="color" />,
    },
]

export const elementFunction = [
    {
        number: 0,
        title: '단일',
        short: '단일',
        icon: <IconSurveyRadio sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyRadio sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 1,
        title: '중복',
        short: '중복',
        icon: <IconSurveyDuplicate sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyDuplicate sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 2,
        title: '로직',
        short: '로직',
        icon: <IconSurveyLogic sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyLogic sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 3,
        title: '필수',
        short: '필수',
        icon: <IconSurveyRequired sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyRequired sx={{ width: 21, mr: 1 }} variant="color" />,
    },
    {
        number: 4,
        title: '복사',
        short: '복사',
        icon: <IconSurveyCopy sx={{ width: 21, mr: 1 }} customColor="#000" />,
        iconActive: <IconSurveyCopy sx={{ width: 21, mr: 1 }} variant="color" />,
    },
]
export const elementQuestions = [
    {
        id: UuidTool.newUuid().replace(/-/g, ''),
        title: '',
        type: null,
        typeText: '',
        duplicate: false,
        logicActive: false,
        logicNext: null,
        required: true,
        answer: [],
        etcActive: false,
        etcAnswer: null,
        checked: null,
    },
]

export const defaultQuestion = {
    title: '',
    type: null,
    typeText: '',
    duplicate: false,
    logicActive: false,
    logicNext: null,
    required: true,
    answer: [],
    etcActive: false,
    etcAnswer: null,
    checked: null,
}

export const answerType = [
    {
        content: '',
        type: 'Radio',
        checked: false,
    },
    {
        content: '',
        type: 'TextField',
    },
    {
        content: [
            [{ id: 0, row: '', edit: false }],
            [
                { id: 0, column: '', level: 1, edit: false },
                { id: 1, column: '', level: 2, edit: false },
                { id: 2, column: '', level: 3, edit: false },
            ],
            [{ id: 0, checked: null }],
        ],
        type: 'Table',
    },
    {
        content: { value: 0 },
        type: 'Rating',
    },
    {
        content: '',
        type: 'TextField',
    },
]
