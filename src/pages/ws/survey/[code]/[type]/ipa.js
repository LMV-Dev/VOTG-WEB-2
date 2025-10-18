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

const regions = [
    '전체', '남구', '달서구', '달성군', 
    '동구', '북구', '서구', '수성구', '중구'
  ];

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

    const showGraph = useEffect(()=>{
    if (totalUserData && totalUserData.length){
      const data = totalUserData;
      
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
    
      const xyData = [];
      
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
            xyData.push([x_val, (y_val / y_total[v1])]);
        })
      });
    
      setShowChartSummary(true);

      var chartDom = document.getElementById('chart-container');
      var myChart = echarts.init(chartDom);
      var option;

      // See https://github.com/ecomfe/echarts-stat
      echarts.registerTransform(ecStat.transform.clustering);
      for (var k = 0; k < xyData.length; k++) {
          if(k==0){
             var xmin = xyData[k][0];
             var xmax = xyData[k][0];
             var ymin = xyData[k][1];
             var ymax = xyData[k][1];
            }
          if(xyData[k][0]<xmin){
                xmin = xyData[k][0];
            }
          if(xyData[k][0]>xmax){
                xmax = xyData[k][0];
            }
          if(xyData[k][1]<ymin){
                ymin = xyData[k][1];
            }
          if(xyData[k][1]>ymax){
                ymax = xyData[k][1];
            }
      }
      xmin = (Math.round(xmin*0.9*10)/10).toFixed(2);
      xmax = (Math.round(xmax*1.1*10)/10).toFixed(2);
      ymin = (Math.round(ymin*0.9*10)/10).toFixed(2);
      ymax = (Math.round(ymax*1.1*10)/10).toFixed(2);
      
      //alert(xmin+'/'+xmax+'/'+ymin+'/'+ymax);
      var CLUSTER_COUNT = overallSatisfactionIndices.length;
      var DIENSIION_CLUSTER_INDEX = 2;
      let clusterName = '';
      var COLOR_ALL = [
        '#37A2DA',
        '#e06343',
        '#37a354',
        '#b55dba',
        '#b5bd48',
        '#8378EA',
        '#96BFFF'
      ];
      var pieces = [];
      for (var i = 0; i < CLUSTER_COUNT; i++) {
          if(i=='0'){
                clusterName = 'Group1 입지 만족도와 중요도';
            }else if(i=='1'){
                clusterName = 'Group2 배치 만족도와 중요도';
            }else if(i=='2'){
                clusterName = 'Group3 건물외관 만족도와 중요도';
            }else if(i=='3'){
                clusterName = 'Group4 단위공간 만족도와 중요도 ';
            }else if(i=='4'){
                clusterName = 'Group5 주변환경 만족도와 중요도';
            }
        pieces.push({
          value: i,
          label: clusterName,
          color: COLOR_ALL[i]
        });
      }
      option = {
        dataset: [
          {
            source: xyData
          },
          {
            transform: {
              type: 'ecStat:clustering',
              // print: true,
              config: {
                clusterCount: CLUSTER_COUNT,
                outputType: 'single',
                outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
              }
            }
          }
        ],
        tooltip: {
          position: 'top'
        },
        visualMap: {
          type: 'piecewise',
          top: 'middle',
          min: 0,
          max: CLUSTER_COUNT,
          left: 10,
          splitNumber: CLUSTER_COUNT,
          dimension: DIENSIION_CLUSTER_INDEX,
          pieces: pieces
        },
        grid: {
          left: 260
        },
        xAxis: [
          {
            name: 'Performance\n(Mean Satisfaction Scores)',
            min: xmin,
            max: xmax,
            type: 'value',
            axisLine: { onZero: false }
          }
        ],
        yAxis: [
          {
            name: 'Importance\n(Correclation with Overall Satisfaction)',
            position: 'left',
            min: ymin,
            max: ymax,
            type: 'value',
            axisLine: { onZero: false }
          }
        ],
        series: {
          name:'average',
          type: 'scatter',
          encode: { tooltip: [0, 1] },
          symbolSize: 15,
          itemStyle: {
            borderColor: '#555'
          },
          datasetIndex: 1,
          markLine: {
            lineStyle: {
              type: 'dashed'
            },
            data: [
                {
                    name: 'X average',
                    type: 'average',
                    valueDim: 'x'  // X축 평균
                },
                {
                    name: 'Y average',
                    type: 'average',
                    valueDim: 'y'  // Y축 평균
                }
            ]
          }
        }
      };

      myChart.setOption(option,true);
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

    const graphStyle = {
        graphbox:{
            position:'relative',
            width:'100%',
            paddingBottom:'50%'
        },
        graph:{
            position:'absolute',
            left:'0',top:'0',
            width:'100%',
            height:'100%'
        },
        info:{
            background: 'rgba(253,240,239,1)',
            padding:'20px 10px',
        },
        p:{
            margin:'0 auto',
            fontSize:'14px',
            fontWeight:'500'
        }
    }

    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      };
    
      const buttonStyle = {
        padding: '10px 20px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      };

      const pressedButtonStyle = {
        padding: '10px 20px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      };
    
      const hoverStyle = {
        backgroundColor: '#f0f0f0',
      };

    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 인공지능 기반 건축설계 자동화 기술개발 연구단</title>
            </Head>
            <LayoutSurveyReportMenu>
                <Container disableGutters={true} maxWidth={'md'}>
                    <Box
                    sx={{
                        mt: 2,
                    }}
                    >
                    <button style={buttonStyle} onClick={()=>{
                        window.open("https://kras.seoul.go.kr/land_info/info/baseInfo/baseInfo.do#t03-tab", "_blank");
                    }}>
                        부동산 주소 검색
                    </button>
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
                    <div className='graph_wrap'>
                        <div style={graphStyle.info}>
                            <p style={graphStyle.p}>IPA 분석 그래프</p>
                        </div>
                        <div className="graph_box" >
                            <div id="chart-container" className='graph' ></div>
                        </div>
                    </div>
                </Box>
                </Container>
            </LayoutSurveyReportMenu>
        </>
    )
}

Survey_answers.getLayout = (page) => <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>

export default Survey_answers
