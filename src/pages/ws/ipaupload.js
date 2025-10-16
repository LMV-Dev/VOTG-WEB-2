import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import Head from 'next/head'
import axios from 'axios'
import * as XLSX from 'xlsx'
/*MUI Element*/
import { Box, CircularProgress, Button, Card, CardActions, CardContent, Container, Divider, Grid, MenuItem, TextField, Typography, IconButton } from '@mui/material'
import { FileDropzone } from '@components/convert/ipa-file-dropzone'
/*Import Hooks*/
import { UuidTool } from 'uuid-tool'
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { AuthGuard } from '@components/auth/auth-guard'
import { useMoveScroll } from '@hooks/use-move-scroll'
/* Compoent/Home */
import { HomeSectionDrag } from '@components/home/home-drag'
/*Improt Layouts*/
import LayoutWithServiceMenu from '@layouts/ws/layout-with-service-menu'
// /* Echart */
// import * as echarts from 'echarts';
// // import 'echarts-stat';
// import ecStat from 'echarts-stat';

// import * as echarts from 'echarts';
// import ecStat from 'echarts-stat';
let echarts = null;
let ecStat = null;
if (typeof window !== 'undefined') {
  // Only import on client
  echarts = require('echarts');
  ecStat = require('echarts-stat');
}

//ELEMENT
const PAGE_TITLE = 'IPA 설문 업로드'

const Page_Ipaupload = () => {    
    const { user } = useAuth()

    //File Drop
    const [files, setFiles] = useState([])
    const [excelData, setExcelData] = useState([]);
    const [showChartSummary, setShowChartSummary] = useState(false);
    let worksheet = null;

    const handleDrop = (newFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles])
        const file = newFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryString = event.target.result;
            const workbook = XLSX.read(binaryString, { type: 'binary' });

            const firstSheetName = workbook.SheetNames[0];
            worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(jsonData);
        };

        reader.readAsBinaryString(file);
    }

    const handleRemove = (file) => {
        setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path))
        globalThis.sessionStorage.removeItem('set-file-cache')
    }

    const handleRemoveAll = () => {
        setFiles([])
    }

    useEffect(() => {
        if (excelData !== undefined && excelData.length > 0) {
            //console.log(excelData)
            const cols =  excelData.length;
            const rows =  excelData[0].length;

            const data = [];

            for (let row = 0; row < rows; row++) {
                const rowData = [];
                for (let col = 1; col < cols; col++) {
                    //console.log(`${col}-${row} : `, excelData[col][row])
                    if (excelData[col][row] !== undefined) {
                        rowData.push(excelData[col][row]);
                    }else{
                        rowData.push(null);
                    }
                }
                data.push(rowData);
            }

            const xyData = [];
            let first = 0;
            let y_total1 = 0; let y_total2 = 0; let y_total3 = 0; let y_total4 = 0; let y_total5 = 0; 
            for (let count = 0; count < data.length; count++) {
                if (count > 0 && count <= 30){
                    first = 0;
                    // 평균 계산
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    // 표준 편차 계산
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    // 공분산 게산
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    // 상관계수 계산
                    const corrcoef = cov / (std1 * std2);
                    // x축
                    const x_val = Math.round(mean2 * 100) / 100;
                    // y축
                    const y_val = Math.round(corrcoef * 1000) / 100;
                    // 좌표값
                    y_total1 = y_total1 + y_val;
                }else if (count > 31 && count <= 61){
                    first = 31;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    y_total2 = y_total2 + y_val;
                }else if (count > 62 && count <= 92){
                    first = 62;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    y_total3 = y_total3 + y_val;
                }else if (count > 93 && count <= 123){
                    first = 93;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    y_total4 = y_total4 + y_val;
                }else if (count > 124){
                    first = 124;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    y_total5 = y_total5 + y_val;
                }
            }

            for (let count = 0; count < data.length; count++) {
                if (count > 0 && count <= 30){
                    first = 0;
                    // 평균 계산
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    // 표준 편차 계산
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    // 공분산 게산
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    // 상관계수 계산
                    const corrcoef = cov / (std1 * std2);
                    // x축
                    const x_val = Math.round(mean2 * 100) / 100;
                    // y축
                    const y_val = Math.round(corrcoef * 100) / 100;
                    // 좌표값
                    xyData.push([x_val, (y_val / y_total1)]);
                }else if (count > 31 && count <= 61){
                    first = 31;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    xyData.push([x_val, (y_val / y_total2)]);
                }else if (count > 62 && count <= 92){
                    first = 62;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    xyData.push([x_val, (y_val / y_total3)]);
                }else if (count > 93 && count <= 123){
                    first = 93;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    xyData.push([x_val, (y_val / y_total4)]);
                }else if (count > 124){
                    first = 124;
                    const mean1 = data[first].reduce((acc, val) => acc + val) / data[first].length;
                    const mean2 = data[count].reduce((acc, val) => acc + val) / data[count].length;
                    const std1 = Math.sqrt(data[first].reduce((acc, val) => acc + (val - mean1) ** 2, 0) / (data[first].length - 1));
                    const std2 = Math.sqrt(data[count].reduce((acc, val) => acc + (val - mean2) ** 2, 0) / (data[count].length - 1));
                    const cov = data[first].reduce((acc, val, idx) => acc + ((val - mean1) * (data[count][idx] - mean2)), 0) / (data[first].length - 1);
                    const corrcoef = cov / (std1 * std2);
                    const x_val = Math.round(mean2 * 100) / 100;
                    const y_val = Math.round(corrcoef * 100) / 100;
                    xyData.push([x_val, (y_val / y_total5)]);
                }
            }
            
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
            var CLUSTER_COUNT = 6;
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
                      name: 'average',
                      xAxis: 'average'
                    },
                    {
                      name: 'average',
                      yAxis: 'average'
                    },
                  ]
                }
              }
            };

            myChart.setOption(option);
        }
    }, [excelData])

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
    
    return (
        <>
            <Head>
                <title>{PAGE_TITLE} | 뷰즈온더고 :: Views On the Go</title>
            </Head>
            <Container
                component="main"
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    py: 5,
                    background: '#fff',
                    minHeight: 'calc(100vh - 150px)',
                }}
            >
                {/* Title Line */}
                <Box sx={{ mb: 4 }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                        <Grid item>
                            <Typography variant="h4">IPA 설문 업로드</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ mb: 3 }} />
                {/* Empty Title Line */}
                <Box
                    sx={{
                        mt: 2,
                        background: 'rgba(253,240,239,1)',
                    }}
                >
                    <FileDropzone
                        accept={{
                            'application/xls': ['.xls', '.xlsx'],
                        }}
                        files={files}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                        onRemoveAll={handleRemoveAll}
                    />
                </Box>

                <Box
                    sx={{
                        mt: 2,
                    }}
                >
                    <div className='graph_wrap'>
                        <div style={graphStyle.info}>
                            <p style={graphStyle.p}>IPA 분석 그래프</p>
                            <p style={graphStyle.p}>표본 : {excelData.length}개</p>
                            {/* <p style={graphStyle.p}>업로드 일시 :</p>
                            <p style={graphStyle.p}>{new Date().toLocaleTimeString()}</p> */}
                        </div>
                        <div className="graph_box" >
                            <div id="chart-container" className='graph' ></div>
                        </div>
                    </div>
                </Box>

               
                {/* Selected Item List */}
            </Container>
        </>
    )
}

Page_Ipaupload.getLayout = (page) => (
    <AuthGuard>
        <LayoutWithServiceMenu>{page}</LayoutWithServiceMenu>
    </AuthGuard>
)

export default Page_Ipaupload