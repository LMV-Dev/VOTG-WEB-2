import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import API from '@utils/API'
import axios from 'axios'
import { UuidTool } from 'uuid-tool'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import { wait } from '@utils/wait'
import {
    AppBar,
    useMediaQuery,
    CircularProgress,
    Box,
    Button,
    IconButton,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Container,
    Divider,
    Grid,
    MenuItem,
    Tooltip,
    TextField,
    Toolbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    Collapse,
    Rating,
    Tabs,
    Tab,
} from '@mui/material'


//ELEMENT
const PAGE_TITLE = '설문 결과'

/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
import LayoutSurveyReportMenu from '@layouts/ws/layout-survey-report-menu'

/* Excel */
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

/* M Icon */
import AddIcon from '@mui/icons-material/Add'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

/* Icons */
import { IconSurveyDelete } from '@public/votg/IconSurveyDelete'
import { IconSurveyMinimap } from '@public/votg/IconSurveyMinimap'
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

/*Popup*/
import DefaultInfoPopoverInfoConvert from '@components/popovers/popover-default-info'
import { borderColor } from '@mui/system'

/*Scroll Hook*/
import { useMoveScroll } from '@hooks/use-move-scroll'

/*Drag Align*/
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

/*Transition*/
import { Transition, TransitionGroup, CSSTransition } from 'react-transition-group'

import * as echarts from 'echarts';
// import 'echarts-stat';
import ecStat from 'echarts-stat';

// Import Chart Type
import ChartType_Bar from '@components/survey/charts/chart-type-bar'
import ChartType_Pie from '@components/survey/charts/chart-type-pie'

//Import Report Element
import Report_Title_Download from '@components/survey/report/report-title-download'
import Report_NoneType from '@components/survey/report/report-none-type'
import Postcode from '@components/postcode'

const COLORS = [
    '#E57373', // Red
    '#F06292', // Pink
    '#BA68C8', // Purple
    '#64B5F6', // Blue
    '#4FC3F7', // Light Blue
    '#4DB6AC', // Teal
    '#81C784', // Green
    '#FFD54F', // Yellow
    '#FF8A65', // Orange
    '#A1887F'  // Brown
  ];

const regions = [
    '전체', '남구', '달서구', '달성군', 
    '동구', '북구', '서구', '수성구', '중구'
  ];

  function extractLastLineStartingWithThree(text) {
    // 텍스트를 줄 단위로 나눕니다.
    const lines = text.split('\n');
    
    // "3."으로 시작하는 마지막 라인을 찾습니다.
    const isLast = false;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim().startsWith('3.')) {
            if (i === lines.length - 1){
                return lines[i].trim();
            }else{
                return lines[i].trim() + lines[i+1].trim();;
            }
        }
    }
    
    // "3."으로 시작하는 라인이 없을 경우 null을 반환합니다.
    return null;
}

const getTitlePrefix = (title) => {
    // Extract the '숫자.숫자.숫자' pattern from the start of the string
    const match = title.match(/^(\d+\.\d+)/);
    return match ? match[0] : 'default'; // Return 'default' if the pattern is not found
};
  

const groupByTitlePrefix = (titles, xyData) => {
    const grouped = {};

    titles.forEach((title, index) => {
        const prefix = getTitlePrefix(title[1]); // Use title[1] for prefix extraction
        if (!grouped[prefix]) {
            grouped[prefix] = { titles: [], xyData: [] };
        }
        grouped[prefix].titles.push(title[1]);
        grouped[prefix].xyData.push(xyData[index]);
    });

    return grouped;
};



const Survey_answers = () => {
    const theme = useTheme()
    const router = useRouter()
    const { code } = router.query
    const { user } = useAuth()
    //Scroll Ref
    const targets = useRef([])

    /*Survey Data */
    const [surveySelectedInfo, setSurveySelectedInfo] = useState(null)
    const [surveySelectedSurveyTitle, setSurveySelectedSurveyQuestionTitle] = useState(null)
    /* Question Edit State */
    const [originQuestions, setOriginQuestions] = useState([])
    const [questionList, setQuestionList] = useState([])

    /* Result Load */
    const [surveyResult, setSurveyResult] = useState(null)
    const [resultRebuild, setResultRebuild] = useState([])
    const [graphTypeControl, setGraphTypeControl] = useState([])

    /* 상품 정보 */
    const [selectedReward, setSelectedReward] = useState(null)
    //** 리워드 데이터를 로딩한 후 리워드 데이터가 구매했는지 여부 판단이 필요함 */
    const [rewardRequestItem, setRewardRequestItem] = useState(false)
    const [rewardRequestStatus, setRewardRequestStatus] = useState(false)
    const [totalUserData,setTotalUserData] = useState(false);
    const [showChartSummary, setShowChartSummary] = useState(false);
    const [conditions,setConditions] = useState([]);
    const chartsContainer = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            const result = await API.get('payment/request/item', {
                UserCode: UuidTool.toString(user?.code.data).replace(/-/g, ''),
                orderCode: selectedReward.code,
            })
            // console.log('result', result)
            if (result.payload !== null && result.payload !== undefined) {
                // console.log('result', result.payload.status === '0' ? false : result.payload.status === '1' ? 'true' : false)
                setRewardRequestItem(result.payload)
                setRewardRequestStatus(result.payload.status === '0' ? false : result.payload.status === '1' ? 'true' : false)
            }
        }

        if (selectedReward?.code !== undefined && selectedReward?.code !== null) {
            fetchData()
        }
    }, [selectedReward])

    // useEffect(() => {
    //     console.log('rewardRequestItem', rewardRequestItem)
    //     console.log('rewardRequestStatus', rewardRequestStatus)
    // }, [rewardRequestItem, rewardRequestStatus])

    /* Question Update */
    useEffect(() => {
        // console.log('questionList - data', questionList)
        // console.log('surveyResult - data', surveyResult)
        const userData = [];
        surveyResult?.forEach((result, rIndex) => {
            const ans = result.answer
            let answerJson = JSON.parse(ans)
            let shouldSkip = false; // 이 변수를 통해 조건에 따라 전체 루프를 중단
            for (const condition of conditions) {
                // answerJson에서 조건의 id에 해당하는 오브젝트를 찾습니다.
                const matchingObject = answerJson.find(item => item.id === condition.id);
                if (matchingObject) {
                    // 해당 오브젝트의 answer 배열에서 content 값이 같은 인덱스를 찾습니다.
                    const matchingIndex = matchingObject.answer.findIndex(
                        answer => answer.content === condition.content
                    );
        
                    if (matchingIndex !== -1) {
                        
                        // matchingObject.checked 배열에 matchingIndex가 포함되어 있는지 확인
                        if (typeof(matchingObject.checked) === "object") {
                            const isChecked = matchingObject.checked.includes(matchingIndex);
        
                            if (!isChecked) {
                                shouldSkip = true; // 조건이 맞지 않으면 전체 루프 중단
                            }else{
                                shouldSkip = false;
                                break;
                            }
                        } else if (matchingObject.checked !== matchingIndex) {
                            shouldSkip = true; // 조건이 맞지 않으면 전체 루프 중단
                        }else{
                            shouldSkip = false;
                            break;
                        }
                    }
                }
            }
        
            if (shouldSkip) {
                return; // 현재 surveyResult 항목을 건너뛰고 다음 항목으로 이동
            }
            const results = answerJson.filter(item => item.title.includes('전반적 만족도') || item.title.includes('공간별 만족도')).map(item => {
              if (item.title.includes('전반적 만족도')){
                let totalChecked = 0;
                let count = 0;

                // 행렬형 응답의 체크된 값을 합산
                const matrixAnswers = item.answer[0].content[2];
                matrixAnswers.forEach(answer => {
                    totalChecked += answer.checked + 1;
                    count += 1;
                });

                const average = count > 0 ? totalChecked / count : 0;

                return {
                    title: item.title,
                    averageChecked: Number(average.toFixed(1))
                };
              }else{
                return {
                  title: item.title,
                  averageChecked:item.answer[0].content[2][1].checked+1,
                }
              }
            });
            userData.push(results);
        })
        setTotalUserData(userData);

        const graphType = questionList?.map((r, rIndex) => {
            return {
                type: 0,
            }
        })
        setGraphTypeControl(graphType)
        // console.log('new questionList - length', questionList.length)
        // console.log('graphTypeControl - value', graphType)
    }, [surveyResult,conditions])

    // useEffect(() => {
    //     console.log('resultRebuild', resultRebuild)
    // }, [resultRebuild])

    const onChangeGraphType = (index, value) => {
        // console.log('index', index)
        // console.log('value', value)
        if (graphTypeControl[index]?.type !== undefined && graphTypeControl[index]?.type !== null) graphTypeControl[index].type = value
        setGraphTypeControl([...graphTypeControl])
    }

    /* Loaded survey Data */
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            const res = await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .get(`https://api.koaiarchitecture.com/online/survey/answers/result`, {
                    params: { UserCode: JSON.stringify(user?.code.data), surveyCode: code },
                })
                if (res.data){
                setSurveySelectedSurveyQuestionTitle(JSON.parse(res.data.payload.selected.survey).title || JSON.parse(res.data.payload.selected.survey).info?.title)
                            // console.log('questionList', JSON.parse(res.data.payload.selected.survey).question)
                            const ques = JSON.parse(res.data.payload.selected.survey).question || JSON.parse(res.data.payload.selected.survey).questions;
                            setQuestionList(ques.filter((v)=> v.type===2));
                            setOriginQuestions(JSON.parse(res.data.payload.selected.survey).question || JSON.parse(res.data.payload.selected.survey).questions)
                            // await wait(500)
                            setSurveyResult(res.data.payload.result)
                            // console.log('surveyResult GetData', JSON.parse(res.data.payload.selected.survey).reward)
                            setSelectedReward(JSON.parse(res.data.payload.selected.survey).reward)
                }
                
        }
        // call the function
        fetchData().catch((error)=>{
            console.log(error);
            router.push('/ws/manager')
        })
        return () => {
            isMounted = false
        }
    }, [user])
    const colorArray = ['#FF5353', '#0C7CD5', '#7BC67E', '#FFB547', '#2F3EB1']

    /**
     *
     *
     * 행렬형 ROW
     *
     *
     */
    const TableCollapsRow = ({ item, a, aIndex, rowIndex }) => {
        const [open, setOpen] = useState(false)

        const [tableToggle, setTableToggle] = useState(0)

        const resultRebuild = a.content[1].map((item, colIndex) => {
            // console.log('colum', rowIndex, item.column)
            // console.log('value', rowIndex, a.content[2][rowIndex][colIndex] || 0)

            const content = item.column
            const result = a.content[2][rowIndex][colIndex] || 0
            return {
                content: content,
                result: result,
            }
        })

        return (
            <Fragment>
                <TableRow>
                    {/* 질문 */}
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                        <Typography
                            sx={{
                                lineHeight: '1.3',
                                fontSize: { sm: '0.8rem', xs: '0.5rem' },
                                textAlign: 'left',
                                ml: '0.3rem',
                                py: 1,
                            }}
                        >
                            {item.row.length === 0 ? '선택지가 입력되지 않았습니다' : item.row}
                        </Typography>
                    </TableCell>
                    {/* 질문별 선택지 */}
                    {a.content[1].map((item, colIndex) => {
                        // console.log('item', item)
                        return (
                            <TableCell key={`table-body-row-cell-select-${aIndex}-${colIndex}`} sx={{ maxWidth: '5rem' }}>
                                {/* {q.duplicate ? (
                                    <Checkbox sx={{ '& span': { width: '100%' } }} />
                                ) : (
                                    <Radio
                                        sx={{ transform: { sm: 'scale(0.8)', xs: 'scale(0.5)' } }}
                                        checked={a.content[2][rowIndex].checked === colIndex}
                                        onChange={(e) => onChangeTableAnswer(e, 'radio', qIndex, a.content[2][rowIndex], a.content[2], 2, rowIndex, colIndex)}
                                    />
                                )} */}
                                <Typography
                                    sx={{
                                        lineHeight: '1.3',
                                        fontSize: { sm: '0.8rem', xs: '0.5rem' },
                                        textAlign: 'center',
                                    }}
                                >
                                    {a.content[2][rowIndex][colIndex]}
                                    {/* {console.log('a.content', a.content[2])} */}
                                </Typography>
                            </TableCell>
                        )
                    })}
                    <TableCell>
                        <IconButton aria-label="expand row" size="medium" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow sx={{ background: '#fafafa' }}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={a.content[1].length + 2}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <AppBar position="static" sx={{ backgroundColor: '#FFF !important', mb: 5 }}>
                                    <Tabs
                                        value={tableToggle}
                                        onChange={(e, value) => setTableToggle(value)}
                                        textColor="inherit"
                                        variant="fullWidth"
                                        indicatorColor="primary"
                                        sx={{
                                            '& .MuiTabs-indicator': {
                                                color: '#fff',
                                                backgroundColor: 'primary.main',
                                                height: '100%',
                                                zIndex: 0,
                                            },
                                        }}
                                    >
                                        <Tab
                                            label="막대 그래프"
                                            value={0}
                                            sx={{
                                                color: 'text.black',
                                                '&[aria-selected=true]': {
                                                    color: 'text.white',
                                                    zIndex: 1,
                                                },
                                            }}
                                        />
                                        <Tab
                                            label="파이 그래프"
                                            value={1}
                                            sx={{
                                                color: 'text.black',
                                                '&[aria-selected=true]': {
                                                    color: 'text.white',
                                                    zIndex: 1,
                                                },
                                            }}
                                        />
                                    </Tabs>
                                </AppBar>
                                {tableToggle == 0 && <ChartType_Bar colorArray={colorArray} resultData={resultRebuild} />}
                                {tableToggle == 1 && <ChartType_Pie colorArray={colorArray} resultData={resultRebuild} />}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Fragment>
        )
    }

    useEffect(()=>{
    if (totalUserData && totalUserData.length){
      const data = totalUserData;
      chartsContainer.current.innerHTML = '';
      const overallSatisfactionIndices = [];
      const spatialSatisfactionIndices = [];

      data[0].forEach((item, index) => {
        if (item.title.includes("전반적 만족도")) {
            overallSatisfactionIndices.push(index);
        }
        if (item.title.includes("공간별 만족도")) {
            spatialSatisfactionIndices.push(index);
        }
      });

      
      let y_total = [];
      overallSatisfactionIndices.forEach((v1)=>{
        if (Number(y_total[v1]) === NaN || !Number(y_total[v1])){
            y_total[v1] = 0;
        }
        const overallData = data.map((v)=> v[v1].averageChecked);
        const mean1 = overallData.reduce((acc, val) => acc + val) / overallData.length;
        const std1 = Math.sqrt(overallData.reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (overallData.length - 1));
        spatialSatisfactionIndices.forEach((v2)=>{
            const spatialData = data.map((v)=> v[v2].averageChecked);
            const mean2 = spatialData.reduce((acc, val) => acc + val) / spatialData.length;
            // 표준 편차 계산
            
            const std2 = Math.sqrt(spatialData.reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (spatialData.length - 1));
            // 공분산 게산
            const cov = overallData.reduce((acc, val, idx) => acc + ((val - mean1) * (spatialData[idx] - mean2)), 0) / (overallData.length - 1);
            // 상관계수 계산
            const corrcoef = cov / (std1 * std2);
            // x축
            const x_val = Math.round(mean2 * 100) / 100;
            // y축
            const y_val = Math.round(corrcoef * 100) / 100;
            y_total[v1] = y_total[v1] + y_val;
        })
      });


      overallSatisfactionIndices.forEach((v1,clusterIndex)=>{
        const xyDataTemp = [];
        const titlesTemp = [];
        const colors = []; // 색상 배열 추가
        const legendData = [];
        if (Number(y_total[v1]) === NaN || !Number(y_total[v1])){
            y_total[v1] = 0;
        }
        const overallData = data.map((v)=> v[v1].averageChecked);
        const mean1 = overallData.reduce((acc, val) => acc + val) / overallData.length;
        const std1 = Math.sqrt(overallData.reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (overallData.length - 1));
        const title1 = extractLastLineStartingWithThree(data[0][v1].title);
        spatialSatisfactionIndices.forEach((v2)=>{
            const spatialData = data.map((v)=> v[v2].averageChecked);
            const mean2 = spatialData.reduce((acc, val) => acc + val) / spatialData.length;
            // 표준 편차 계산
            
            const std2 = Math.sqrt(spatialData.reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (spatialData.length - 1));
            // 공분산 게산
            const cov = overallData.reduce((acc, val, idx) => acc + ((val - mean1) * (spatialData[idx] - mean2)), 0) / (overallData.length - 1);
            // 상관계수 계산
            const corrcoef = cov / (std1 * std2);
            // x축
            const x_val = Math.round(mean2 * 100) / 100;
            // y축
            const y_val = Math.round(corrcoef * 100) / 100;
            const title2 = extractLastLineStartingWithThree(data[0][v2].title);
            xyDataTemp.push([x_val, (y_val / y_total[v1])]);
            titlesTemp.push([title1,title2]);
        })
        const grouped = groupByTitlePrefix(titlesTemp,xyDataTemp);


        Object.keys(grouped).forEach((v)=>{
            const titles = grouped[v].titles;
            const xyData = grouped[v].xyData;
            
            // Create the main card container
            const card = document.createElement('div');
            card.style.background = '#fff';
            card.style.borderRadius = '20px';
            card.style.padding = '24px';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.overflow = 'hidden';

            // Create the card title section
            const titleContainer = document.createElement('div');
            titleContainer.style.marginBottom = '24px';

            const titleDecorator = document.createElement('div');
            titleDecorator.style.width = '32px';
            titleDecorator.style.height = '4px';
            titleDecorator.style.backgroundColor = '#6d5dd1'; // A solid purple color
            titleDecorator.style.borderRadius = '2px';
            titleDecorator.style.marginBottom = '8px';

            const chartTitle = document.createElement('h3');
            chartTitle.textContent = `${title1} - ${v}`;
            chartTitle.style.margin = '0';
            chartTitle.style.color = '#1b2559';
            chartTitle.style.fontSize = '1.75rem';
            chartTitle.style.fontWeight = '700';

            titleContainer.appendChild(titleDecorator);
            titleContainer.appendChild(chartTitle);
            card.appendChild(titleContainer);

            // Create a container for the chart and the table
            const contentWrapper = document.createElement('div');
            contentWrapper.style.display = 'flex';
            contentWrapper.style.flexDirection = 'row';
            contentWrapper.style.flexWrap = 'wrap';
            contentWrapper.style.gap = '24px';
            contentWrapper.style.alignItems = 'flex-start';

            // Chart container
            const chartContainerWrapper = document.createElement('div');
            chartContainerWrapper.style.flex = '3 1 600px'; // Give more space to chart

            const chartContainer = document.createElement('div');
            chartContainer.style.width = '100%';
            chartContainer.style.height = '600px';
            chartContainer.id = `chart-${clusterIndex}-${v}`;
            chartContainerWrapper.appendChild(chartContainer);
            contentWrapper.appendChild(chartContainerWrapper);

            // Rank table container
            const rankContainer = document.createElement('div');
            rankContainer.style.flex = '2 1 320px'; // Less space for table
            rankContainer.style.display = 'flex';
            rankContainer.style.flexDirection = 'column';

            // Create table using divs for styling flexibility
            const table = document.createElement('div');
            table.style.width = '100%';
            table.style.border = '1px solid #e9ecef';
            table.style.borderRadius = '12px';
            table.style.overflow = 'hidden';
            table.style.fontFamily = 'inherit';

            // Table Header
            const tableHeader = document.createElement('div');
            tableHeader.style.display = 'flex';
            tableHeader.style.fontWeight = '600';
            tableHeader.style.background = '#f4f7fe'; // Light blue/purple from image
            tableHeader.style.color = '#6d5dd1';
            tableHeader.style.borderBottom = '1px solid #e9ecef';

            const headerTitles = ['순위', '항목', '중요도', '만족도'];
            const headerFlex = ['0.7', '2', '1', '1']; // Adjust flex for rank column
            headerTitles.forEach((title, index) => {
                const headerCell = document.createElement('div');
                headerCell.textContent = title;
                headerCell.style.padding = '12px';
                headerCell.style.textAlign = 'center';
                headerCell.style.flex = headerFlex[index];
                tableHeader.appendChild(headerCell);
            });
            table.appendChild(tableHeader);

            // Table Body
            // --- START: MODIFIED CODE ---
            const importanceRank = xyData
                .map((data, index) => ({
                    title: titles[index],
                    importance: data[1],
                    performance: data[0],
                    originalIndex: index, // Store the original index before sorting
                })).sort((a, b) => b.importance - a.importance);
            // --- END: MODIFIED CODE ---
            
            const visibilityState = {};
            importanceRank.forEach(item => {
                visibilityState[item.title] = true;
            });

            importanceRank.forEach((item, idx) => {
                const rankRow = document.createElement('div');
                rankRow.style.display = 'flex';
                rankRow.style.borderBottom = '1px solid #e9ecef';
                rankRow.style.background = '#fff';
                rankRow.style.color = '#34495e';
                rankRow.style.cursor = 'pointer';
                rankRow.style.transition = 'opacity 0.3s, background-color 0.3s';

                if (idx === importanceRank.length - 1) {
                    rankRow.style.borderBottom = 'none';
                }

                rankRow.addEventListener('mouseover', () => {
                    if (visibilityState[item.title]) {
                        rankRow.style.backgroundColor = '#f8f9fa';
                    }
                });
                rankRow.addEventListener('mouseout', () => {
                    rankRow.style.backgroundColor = '#fff';
                });

                rankRow.addEventListener('click', () => {
                    visibilityState[item.title] = !visibilityState[item.title];
                    rankRow.style.opacity = visibilityState[item.title] ? '1' : '0.5';
                    rankRow.style.textDecoration = visibilityState[item.title] ? 'none' : 'line-through';
                    
                    myChart.dispatchAction({
                        type: 'legendToggleSelect',
                        name: item.title
                    });
                });

                // --- START: MODIFIED CODE ---
                // Use the stored originalIndex to get the correct color
                const color = COLORS[item.originalIndex % COLORS.length];
                // --- END: MODIFIED CODE ---

                const rankCell = document.createElement('div');
                rankCell.style.display = 'flex';
                rankCell.style.alignItems = 'center';
                rankCell.style.justifyContent = 'center';
                rankCell.style.padding = '12px';
                rankCell.style.flex = headerFlex[0];

                const colorIndicator = document.createElement('div');
                colorIndicator.style.width = '12px';
                colorIndicator.style.height = '12px';
                colorIndicator.style.borderRadius = '50%';
                colorIndicator.style.backgroundColor = color;
                colorIndicator.style.marginRight = '8px';
                colorIndicator.style.flexShrink = '0';

                const rankText = document.createElement('span');
                rankText.textContent = `${idx + 1}`;

                rankCell.appendChild(colorIndicator);
                rankCell.appendChild(rankText);
                rankRow.appendChild(rankCell);

                const titleCell = document.createElement('div');
                titleCell.textContent = item.title;
                titleCell.style.padding = '12px';
                titleCell.style.textAlign = 'left';
                titleCell.style.flex = headerFlex[1];
                titleCell.style.alignSelf = 'center';

                const importanceCell = document.createElement('div');
                importanceCell.textContent = item.importance.toFixed(3);
                importanceCell.style.padding = '12px';
                importanceCell.style.textAlign = 'center';
                importanceCell.style.flex = headerFlex[2];
                importanceCell.style.alignSelf = 'center';

                const performanceCell = document.createElement('div');
                performanceCell.textContent = item.performance.toFixed(3);
                performanceCell.style.padding = '12px';
                performanceCell.style.textAlign = 'center';
                performanceCell.style.flex = headerFlex[3];
                performanceCell.style.alignSelf = 'center';
                
                rankRow.appendChild(titleCell);
                rankRow.appendChild(importanceCell);
                rankRow.appendChild(performanceCell);
                table.appendChild(rankRow);
            });

            rankContainer.appendChild(table);
            contentWrapper.appendChild(rankContainer);
            card.appendChild(contentWrapper);
            chartsContainer.current.appendChild(card);
            
            var myChart = echarts.init(chartContainer);

            let xmin, xmax, ymin, ymax;

            if (xyData.length > 0) {
                xmin = Math.min(...xyData.map(d => d[0]));
                xmax = Math.max(...xyData.map(d => d[0]));
                ymin = Math.min(...xyData.map(d => d[1]));
                ymax = Math.max(...xyData.map(d => d[1]));
                // 범위를 10% 넓게 조정합니다.
                xmin = (xmin * 0.9).toFixed(2);
                xmax = (xmax * 1.1).toFixed(2);
                ymin = (ymin * 0.8).toFixed(2);
                ymax = (ymax * 1.2).toFixed(2);
            }

            const avgPerformance = (xyData.reduce((sum, d) => sum + d[0], 0) / xyData.length).toFixed(3);
            const avgImportance = (xyData.reduce((sum, d) => sum + d[1], 0) / xyData.length).toFixed(3);

            const seriesData = xyData.map((dataPoint, index) => ({
                name: titles[index],
                type: 'scatter',
                data: [dataPoint],
                symbolSize: 15,
                itemStyle: {
                    color: COLORS[index % COLORS.length],
                    borderColor: '#555',
                },
                markLine: {
                    lineStyle: { type: 'dashed',color:"#FF5722" },
                    data: [
                        { name: 'Performance Average', xAxis: avgPerformance },
                        { name: 'Importance Average', yAxis: avgImportance }
                    ]
                } 
            }));
            const option = {
                dataset: [{ source: xyData }],
                tooltip: {
                    trigger: 'item',
                    position: 'top',
                    formatter: function (params) {
                        if (params.componentType === "markLine") {
                            return null;
                        }else if (params.componentSubType === "bar"){
                            const title = titles[params.dataIndex];
                            return `${title}<br/>${params.data.value}`
                        }
                         else {
                            const title = titles[params.dataIndex];
                            return `${title}<br/>Performance: ${params.data[0]}<br/>Importance: ${params.data[1]}`;
                        }
                    }
                },
                legend: {
                    show: false
                },
                grid: [
                    { left: '10%', right: '10%', top: '15%', bottom: '50%' },
                    { left: '10%', right: '55%', top: '60%', bottom: '10%' },
                    { left: '55%', right: '10%', top: '60%', bottom: '10%' },
                ],
                xAxis: [
                    {
                        name: 'Performance\n(Mean Satisfaction Scores)',
                        type: 'value',
                        min: xmin,
                        max: xmax,
                        gridIndex: 0
                    },
                    {
                        type: 'category',
                        gridIndex: 1,
                        axisTick: { show: false },
                        axisLabel: { show: true, interval: 0, rotate: 45 },
                        data: titles.map((title) => title[1]),
                    },
                    {
                        type: 'category',
                        gridIndex: 2,
                        axisTick: { show: false },
                        axisLabel: { show: true, interval: 0, rotate: 45 },
                        data: titles.map((title) => title[1]),
                    }
                ],
                yAxis: [
                    {
                        name: 'Importance\n(Correlation with Overall Satisfaction)',
                        type: 'value',
                        min: ymin,
                        max: ymax,
                        gridIndex: 0,
                        axisLabel: {
                            formatter: (value) => value.toFixed(3)
                        }
                    },
                    {
                        name: 'Performance',
                        type: 'value',
                        gridIndex: 1,
                        min: Math.min(...xyData.map(d => d[0])) * 0.9,
                        max: Math.max(...xyData.map(d => d[0])) * 1.1,
                        axisLabel: {
                            formatter: (value) => value.toFixed(3)
                        }
                    },
                    {
                        name: 'Importance',
                        type: 'value',
                        gridIndex: 2,
                        min: Math.min(...xyData.map(d => d[1])) * 0.9,
                        max: Math.max(...xyData.map(d => d[1])) * 1.1,
                        axisLabel: {
                            formatter: (value) => value.toFixed(3)
                        }
                    }
                ],
                series: [
                    ...seriesData,
                    {
                        name: 'Performance Bar',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: xyData.map((d, index) => ({
                            value: d[0],
                            itemStyle: { color: COLORS[index % COLORS.length] }
                        })),
                        barWidth: '30%',
                    },
                    {
                        name: 'Importance Bar',
                        type: 'bar',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: xyData.map((d, index) => ({
                            value: d[1],
                            itemStyle: { color: COLORS[index % COLORS.length] }
                        })),
                        barWidth: '30%',
                    }
                ]
            };
            
            myChart.setOption(option,true);
            })
      });
    
      setShowChartSummary(true);

      
    }
      
    },[totalUserData])


    const handleButtonClick = (region, index) => {
        if (index === 0) {
          // '전체'를 클릭한 경우 조건을 모두 초기화
          setConditions([]);
        } else {
          setConditions((prevConditions) => {
            const exists = prevConditions.some(
              (condition) => condition.content === region
            );
    
            if (exists) {
              // 이미 존재하는 경우 제거
              return prevConditions.filter(
                (condition) => condition.content !== region
              );
            } else {
              // 존재하지 않는 경우 추가
              return [
                ...prevConditions,
                { id: "01f3d16d8508476a02e71c21a5436cf3", content: region }
              ];
            }
          });
        }
      };

    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      };
    
      const buttonStyle = {
        padding: '10px 20px',
        border: '1px solid transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        fontWeight: '500',
      };

      const pressedButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#ffffff',
        color: '#673ab7',
        border: '1px solid #673ab7'
      };

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            <LayoutSurveyReportMenu>
                <Box sx={{ 
                    width: '100vw', 
                    minHeight: '100vh',
                    p: { xs: 2, sm: 4, md: 6 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}>
                    <Container maxWidth="xl" disableGutters={true}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                             <Box sx={{
                                width: '100%',
                                mb: 4,
                                p: 2,
                                background: 'rgba(0,0,0,0.1)',
                                borderRadius: '16px'
                             }}>
                                <div style={{flexDirection:'row',display:"flex",alignItems:"center",marginBottom:10}}>
                                    <Postcode buttonStyle={buttonStyle}/>
                                    <button style={{...buttonStyle,marginLeft:10}} type='button' onClick={()=>{
                                        window.open("https://kras.daegu.go.kr/land_info/info/landuse/landuse.do");
                                    }}>
                                        토지이용계획 열람
                                    </button>
                                </div>
                                <div style={containerStyle}>
                                    {regions.map((region, index) => (
                                        <button
                                        key={index}
                                        style={conditions.some(
                                            (condition) => condition.content === region
                                        ) ? pressedButtonStyle : buttonStyle}
                                        onClick={() => handleButtonClick(region, index)}
                                        >
                                        {region}
                                        </button>
                                    ))}
                                </div>
                            </Box>
                            <div ref={chartsContainer} id="chart-container" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '32px',
                                width: '100%'
                            }}></div>
                        </Box>
                    </Container>
                </Box>
            </LayoutSurveyReportMenu>
        </>
    )
}

Survey_answers.getLayout = (page) => <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>

export default Survey_answers