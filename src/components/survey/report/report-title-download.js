import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
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

/* Excel */
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
//Util
import { formatPrice } from '@utils/auto-format'
import { formatInTimeZone } from 'date-fns-tz'

const Report_Title_Download = ({ surveySelectedSurveyTitle, questionList, surveyResult, rewardRequestStatus, rewardRequestItem }) => {
    // Excel
    const router = useRouter()
    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const excelFileExtension = '.xlsx'
    const excelFileName = '작성자'
    const excelDownloadResult = (questionData, answerData) => {
        const ws = XLSX.utils.aoa_to_sheet([[`${surveySelectedSurveyTitle}`]])
        XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 })

        const extraColumn = 1
        const colWidth = 300
        let mergeSize = 0
        let mergeAddSize = 0
        let titleSize = 1
        /* Question Width */
        const questionWidth = [...Array(questionData.length * 100)].map((val, idx) => {
            return {
                wpx: colWidth,
            }
        })
        ws['!cols'] = [{ wpx: 200 }, ...questionWidth] // 행사이즈

        /* Question Merged */
        const questionMerged = questionData.map((q, qIndex) => {
            // console.log('questionMerged - q.type', q.type)

            if (q.type === 2) {
                mergeAddSize = mergeAddSize + q.answer[0].content[0].length
            } else {
                mergeAddSize = mergeAddSize + 2
            }

            // let mergeData = { s: { r: 2, c: extraColumn + 2 * qIndex }, e: { r: 2, c: extraColumn + 1 + 2 * qIndex } }
            // console.log('mergeData', mergeData)
            let mergeDataNew = { s: { r: 2, c: extraColumn + mergeSize }, e: { r: 2, c: mergeAddSize } }
            // console.log('mergeDataNew', mergeDataNew)

            if (q.type === 2) {
                mergeSize = mergeSize + q.answer[0].content[0].length
            } else {
                mergeSize = mergeSize + 2
            }

            return mergeDataNew
        })
        ws['!merges'] = questionMerged // 병합 사이즈

        /* Question Title */
        const questionTitle = questionData.map((q, qIndex) => {
            const newTitle = `${qIndex + 1}. ${q.title.replace(/\n/g, ' ')}`
            // console.log('q.title', newTitle)
            return newTitle
        })

        /* Qeustion Title Merge Setting */
        questionData.map((q, qIndex) => {
            // if (qIndex > 0) questionTitle.splice(titleSize, 0, '')
            if (q.type !== 2) {
                questionTitle.splice(titleSize, 0, '')
                titleSize = titleSize + 2
            } else {
                let qLength = [...Array(q.answer[0].content[0].length - 1)].map((v, index) => {
                    return ''
                })
                questionTitle.splice(titleSize, 0, ...qLength)
                titleSize = titleSize + qLength.length + 1
            }
        })
        /* Extra column */
        questionTitle.splice(0, 0, '식별코드')

        // Insert Question Ttitle */
        XLSX.utils.sheet_add_aoa(ws, [questionTitle], { origin: -1 })

        /* 
            Answer Question Data 
        */
        const questionAnswerList = []
        const questionAnswer = questionData.map((q, qIndex) => {
            let type = q.type
            if (type === 0) {
                questionAnswerList.push('text')
                questionAnswerList.push('numeric')
            } else if (type === 1) {
                //주관식
                questionAnswerList.push('')
                questionAnswerList.push('')
            } else if (type === 2) {
                //행렬형
                // console.log('q.answer[0]', q.answer[0])
                q.answer[0].content[0].map((v, vIndex) => {
                    questionAnswerList.push(`${qIndex + 1}-${vIndex + 1}.${v.row}`)
                })
            } else if (type === 3) {
                //별점형
                questionAnswerList.push('')
                questionAnswerList.push('')
            } else if (type === 4) {
                //연락처
                questionAnswerList.push('')
                questionAnswerList.push('')
            }
        })

        // console.log('questionAnswerList', questionAnswerList)
        questionAnswerList.splice(0, 0, '')

        XLSX.utils.sheet_add_aoa(ws, [questionAnswerList], { origin: -1 })
        /*
            Answer Data
        */

        surveyResult?.map((result, rIndex) => {
            const identifyCode = UuidTool.toString(result.identifyCode.data).replace(/-/g, '')
            const ans = result.answer
            let answerJson = JSON.parse(ans)
            // console.log('answerJson', answerJson)
            let answerArray = []
            answerJson.map((a, aIndex) => {
                let type = a.type
                if (type === 0) {
                    // if (a.duplicate) {
                    //     console.log('a.checked', a.checked)
                    // }
                    if (a.checked !== undefined && a.checked !== null) {
                        console.log('a', a)
                        if (a.duplicate) {
                            let resultArrayContetns = a.checked.map((n) => {
                                if (a.answer[n]?.content === undefined && a.etcActive) {
                                    return a.etcAnswer?.content
                                } else {
                                    return a.answer[n]?.content
                                }
                            })

                            console.log('resultArrayContetns', resultArrayContetns)
                            answerArray.push(resultArrayContetns.join())
                            // console.log('a.checked', a.checked)
                            let resultArray = a.checked.map((n) => parseInt(n) + 1)
                            answerArray.push(resultArray.join())
                        } else {
                            answerArray.push(a.answer[a.checked]?.content || a.etcAnswer?.content)
                            answerArray.push(parseInt(a.checked) + 1)
                        }
                    } else {
                        answerArray.push('')
                        answerArray.push(0)
                    }
                } else if (type === 1) {
                    //주관식
                    answerArray.push('')
                    answerArray.push(a.answer[0].content.replace(/\n/g, ' '))
                } else if (type === 2) {
                    //행렬형
                    // console.log(' a.answer[0].content[2]', a.answer[0].content[2])
                    a.answer[0].content[2].map((v) => {
                        answerArray.push(v.checked + 1)
                    })
                } else if (type === 3) {
                    //별점형
                    answerArray.push('')
                    answerArray.push(null)
                } else if (type === 4) {
                    //연락처
                    answerArray.push('')
                    answerArray.push(a.answer[0].content.replace(/\n/g, ' '))
                }
            })

            /* Answer Merge Setting */
            // answerArray.map((a, aIndex) => {
            //     if (a.type !== 0) {
            //         answerArray.splice(aIndex * 2, 0, '')
            //     }
            // })

            let mergeSizeAnswer = 0
            let mergeAddSizeAnswer = 0

            const answerMerged = questionData.map((q, qIndex) => {
                // console.log('questionMerged - q.type', q.type)
                let mergeDataNew = {}
                if (q.type !== 2) {
                    mergeAddSizeAnswer = mergeAddSizeAnswer + 2
                    mergeDataNew = { s: { r: 4 + rIndex, c: extraColumn + mergeSizeAnswer }, e: { r: 4 + rIndex, c: mergeAddSizeAnswer } }
                    mergeSizeAnswer = mergeSizeAnswer + 2
                } else {
                    mergeDataNew = { s: {}, e: {} }
                }
                return mergeDataNew
            })
            // console.log('answerMerged', answerMerged)
            // ws['!merges'] = [...questionMerged, ...answerMerged]

            // console.log(`ws['!merges']`, ws['!merges'])

            XLSX.utils.sheet_add_aoa(ws, [[identifyCode, ...answerArray]], { origin: -1 })
            ws['!cols'] = [{ wpx: 200 }, ...questionWidth]
            return false
        })

        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const excelFile = new Blob([excelButter], { type: excelFileType })
        FileSaver.saveAs(excelFile, surveySelectedSurveyTitle + ` 결과` + excelFileExtension)
    }

    /*
     * Product Setting
     */
    const [producItem, setProductItem] = useState(null)
    const [productCategory, setProductCategory] = useState(null)
    const [totalProductPrice, setTotalProductPrice] = useState(0)

    /* Get Reward Product Item */
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        if (rewardRequestStatus !== false) {
            const fetchData = async () => {
                await axios
                    // .get(`http://localhost:3400/json/sample/00`, null)
                    .post(`/api/gift/goodsInfo/item`, {
                        productNumber: rewardRequestItem.productNumber,
                    })
                    .then((res) => {
                        // console.log(res.data)
                        if (res.data) {
                            if (isMounted) {
                                // console.log('DAU PRODUCT LIST', res.data.payload)
                                setProductItem(res.data.payload)
                                // setSurveyLoadData(JSON.parse(res.data.payload[0].survey))
                            }
                        }
                    })
                    .catch((error) => console.log(error))
            }
            // call the function
            fetchData().catch(console.error)
            return () => {
                isMounted = false
            }
        }
    }, [router])
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Typography variant="h5">결과보기</Typography>
                            <Box>
                                <Typography sx={{ fontWeight: 500, fontSize: '1.3rem', mx: 1, my: 3 }}>{surveySelectedSurveyTitle}</Typography>
                            </Box>
                            {surveyResult === null && (
                                <>
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'primary.main',
                                            position: 'relative',
                                            top: '20%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                            marginBottom: '30px',
                                        }}
                                    />
                                </>
                            )}
                            {surveyResult?.length === 0 && (
                                <>
                                    <Box>
                                        <Typography sx={{ fontSize: '1rem', mx: 1, my: 3 }}>아직 응답자가 없습니다. 응답이 완료된 후 결과를 확인 할 수 있습니다.</Typography>
                                    </Box>
                                </>
                            )}
                            {surveyResult?.length > 0 && (
                                <>
                                    <Box>
                                        {/* producItem */}
                                        {producItem && (
                                            <>
                                                <Divider sx={{ my: 3 }} />
                                                <Box
                                                    sx={{
                                                        alignItems: 'center',
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        mt: 2,
                                                        ml: 2,
                                                    }}
                                                >
                                                    <Typography>
                                                        <li>리워드명 : {producItem ? producItem.NM_GOODS : `리워드명`}</li>
                                                        <li>상품금액: {producItem ? `${formatPrice(producItem.CPN_PRICE)}원` : `0원`}</li>
                                                        <li>구매개수: {producItem ? `${formatPrice(rewardRequestItem.orderCount)}개` : `0개`}</li>
                                                        <li>구매금액: {producItem ? `${formatPrice(producItem.CPN_PRICE)} x ${rewardRequestItem.orderCount} = ${formatPrice(rewardRequestItem.amount)}원` : `0원`}</li>
                                                        <li>구매개수: {producItem ? `${formatInTimeZone(rewardRequestItem.updatedAt, 'Asia/Seoul', 'yyyy.MM.dd, HH:mm:ss')}` : ``}</li>
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                        <Divider sx={{ my: 3 }} />
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                mt: 2,
                                            }}
                                        >
                                            <Typography>총 응답자수 : {surveyResult?.length}명</Typography>
                                            <Box sx={{ flexGrow: 1 }} />
                                            <Button
                                                // onClick={() => excelDownload(excelDataExample)}
                                                onClick={() => excelDownloadResult(questionList, surveyResult)}
                                                // component="a"
                                                // href="/sample/인공지능기술수용의도와윤리성인식에관한설문조사.xlsx"
                                                size="medium"
                                                align="right"
                                                sx={{ ml: 2, color: 'text.secondary' }}
                                                target="_blank"
                                                variant="primary"
                                                download
                                            >
                                                응답결과 다운로드
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default Report_Title_Download
