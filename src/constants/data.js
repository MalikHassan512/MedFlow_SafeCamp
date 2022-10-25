const QUESTION_TOTAL_TYPES = {
    INPUT: "input",
    DATE: "date",
    CHECK_BOXES: "check_boxes",
    RADIO_BTNS: "radio_btns",
    DROP_DOWN: "drop_down"

}

export const QUESTIONS_LIST = [
    {
        "answer": "",
        "id": 1,
        "name": "What was the last thing you ate or drank (including water, gum, breath mints)?",
        "type": QUESTION_TOTAL_TYPES.INPUT,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        "dependentQuestionsId": null,
        "isDependent": false

    },
    {
        "answer": "",
        "id": 2,
        "name": "Ate/Drank in last 30 min?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        'options': [
            {
                label: 'Yes', value: 0
            },
            {
                label: 'No ', value: 1
            },
        ],
        "isSelected": false,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        "isDependent": false,
        "dependentQuestionsId": null,

    },
    {
        "answer": "",
        "id": 3,
        "name": "Are you smoker?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": false,
        "selectedAnswer": "",
        "dependentQuestionsId": 4,
        'options': [
            {
                label: 'Yes', value: 0, dependentId: [{
                    id: 4,
                    visible: true
                }]
            },
            {
                label: 'No ', value: 1, dependentId: [{
                    id: 4,
                    visible: false
                }]
            },
        ],
        "isSelected": false,
        "isDependent": false


    },

    {
        "answer": "",
        "id": 4,
        "name": "Smoked in last 30 min?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        'options': [
            { label: 'Yes', value: 0 },
            { label: 'No ', value: 1 },
        ],
        "isSelected": false,
        "isDependent": true,
        "dependentQuestionsId": null,

    },
    {
        "answer": "",
        "id": 5,
        "name": "Are you vaper?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": false,
        "selectedAnswer": "",
        "dependentQuestionsId": 6,
        'options': [
            {
                label: 'Yes', value: 0, dependentId: [{
                    id: 6,
                    visible: true
                }]
            },
            {
                label: 'No ', value: 1, dependentId: [{
                    id: 6,
                    visible: false
                }]
            },
        ],
        "isSelected": false,
        "isDependent": false

    },
    {
        "answer": "",
        "id": 6,
        "name": "Vaped in last 30 min?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        "dependentQuestionsId": null,
        'options': [
            { label: 'Yes', value: 0 },
            { label: 'No ', value: 1 },
        ],
        "isSelected": false,
        "isDependent": true


    },
    {
        "answer": "",
        "id": 7,
        "name": "Do you have diabetes?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": false,
        "selectedAnswer": "",
        'options': [
            { label: 'Yes', value: 0 },
            { label: 'No ', value: 1 },
        ],
        "isSelected": false,
        "isDependent": false,
        "dependentQuestionsId": null,

    },

    {
        "answer": "",
        "id": 8,
        "name": "Metabolic disorders other than Diabetic. Please list",
        "type": QUESTION_TOTAL_TYPES.INPUT,
        "isVisibleEveryTime": false,
        "selectedAnswer": "",
        "isDependent": false,
        "dependentQuestionsId": null,

    },
    {
        "answer": "",
        "id": 9,
        "name": "Medications. Please List",
        "type": QUESTION_TOTAL_TYPES.INPUT,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        "isDependent": false,
        "dependentQuestionsId": null,

    },

    {
        "answer": "",
        "id": 10,
        "name": "Have you ever been diagnosed with COVID?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": false,
        "selectedAnswer": "",
        'options': [
            {
                label: 'Yes', value: 0, dependentId: [{
                    id: 11,
                    visible: true
                }]
            },
            {
                label: 'No ', value: 1, dependentId: [{
                    id: 11,
                    visible: false
                }]
            },
            {
                label: 'U (Unsure) ', value: 2, dependentId: [{
                    id: 11,
                    visible: false
                }]
            },
            {
                label: 'W (Withheld) ', value: 3, dependentId: [{
                    id: 11,
                    visible: false
                }]
            },
        ],
        "isSelected": false,
        "isDependent": false,
        "dependentQuestionsId": 11,

    },
    {
        "answer": "",
        "id": 11,
        "name": "Have you recently been exposed to COVID?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        'options': [
            { label: 'Yes', value: 0 },
            { label: 'No ', value: 1 },
            { label: 'U (Unsure) ', value: 2 },
            { label: 'W (Withheld) ', value: 3 },
        ],
        "isSelected": false,
        "isDependent": true


    },
    {
        "answer": "",
        "id": 12,
        "name": "Do you currently have any of the following symptoms?",
        "type": QUESTION_TOTAL_TYPES.CHECK_BOXES,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        'options': [
            {
                name: "Fever",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false
            },
            {
                name: "Cough",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,

                }],
                uncheck: false
            },
            {
                name: "Fataigue",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false


            },
            {
                name: "Breathing Issues",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false

            },
            {
                name: "Aches",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false

            },
            {
                name: "Headache",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false

            },
            {
                name: "Loss of Smell",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false

            },
            {
                name: "Sore Throat",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false

            },
            {
                name: "Runny Nose",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false

            },
            {
                name: "Nausea",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false
            },
            {
                name: "Diarrhea",
                isSelected: false,
                dependentId: [{
                    id: 13,
                    visible: true,
                }],
                uncheck: false
            },
            {
                name: "None of the above",
                isSelected: false,
                uncheck: true,
                dependentId: [{
                    id: 13,
                    visible: false,
                }]

            },

        ],
        "isDependent": false,
        "dependentQuestionsId": null,

    },
    {
        "answer": "",
        "id": 13,
        "name": "When did the above symptoms begin?",
        'type': QUESTION_TOTAL_TYPES.DATE,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        "isDependent": true,
        "dependentQuestionsId": null,


    },

    {
        "answer": "",
        "id": 14,
        "name": "How many vaccine shots have you had?",
        "type": QUESTION_TOTAL_TYPES.RADIO_BTNS,
        "isVisibleEveryTime": false,
        "selectedAnswer": "",
        'options': [
            {
                label: '0', value: 0, dependentId: [{
                    id: 15,
                    visible: false
                }]
            },
            {
                label: '1 ', value: 1, dependentId: [{
                    id: 15,
                    visible: true
                }]
            },
            {
                label: '2 ', value: 2, dependentId: [{
                    id: 15,
                    visible: true
                }]
            },
            {
                label: '3 ', value: 3, dependentId: [{
                    id: 15,
                    visible: true
                }]
            },
            {
                label: '4 ', value: 4, dependentId: [{
                    id: 15,
                    visible: true
                }]
            },
            {
                label: '>4 ', value: 5, dependentId: [{
                    id: 15,
                    visible: true
                }]
            },
        ],
        "isSelected": false,
        "isDependent": false,
        "dependentQuestionsId": null,


    },
    {
        "answer": "No",
        "id": 15,
        "name": "When do you have Last Shot?",
        'type': QUESTION_TOTAL_TYPES.DATE,
        "isVisibleEveryTime": true,
        "selectedAnswer": "",
        "isDependent": true,
        "dependentQuestionsId": null,


    }
]