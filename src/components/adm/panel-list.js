import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Head from 'next/head'
import { formatInTimeZone } from 'date-fns-tz'
import { Box, CircularProgress, Button, Card, Chip, CardActions, CardContent, Container, Divider, Grid, Tabs, Tab, MenuItem, TextField, Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material'

import axios from 'axios'
import { useAuth } from '@hooks/use-auth'
import { UuidTool } from 'uuid-tool'

/* Excel */
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

//Util
import { formatPhoneNumber, formatCardNumber } from '@utils/auto-format'

/* Component*/
import { Scrollbar } from '@components/layout/scrollbar'
import PopupAccountInfoChange from '@components/popup/popup-account-info-change'
/* Init Header*/

const TableHeader = [
    {
        index: 0,
        type: 0,
        label: 'No.',
        labels: [],
        width: '5%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'left',
    },
    {
        index: 1,
        type: 0,
        label: '이름',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 2,
        type: 0,
        label: '전화번호',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 3,
        type: 0,
        label: '이메일',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 4,
        type: 0,
        label: '모드',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 5,
        type: 0,
        label: '상태',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    // {
    //     index: 6,
    //     type: 0,
    //     label: '타입',
    //     labels: [],
    //     width: '10%',
    //     fontSize: '0.7rem',
    //     fontWeight: '700',
    //     align: 'center',
    // },
    {
        index: 6,
        type: 0,
        label: '가입날짜',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 7,
        type: 0,
        label: '관리',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
]

const applyPagination = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const PanelList = () => {
    const { user, logout } = useAuth()
    const router = useRouter()

    const [PanelListData, setPanelListdata] = useState(null)
    const [paginatedDataList, setPaginatedDataList] = useState(null)
    //UserData

    /* Loaded survey Data */
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .post(`https://api.koaiarchitecture.com/adm/panelList`, {
                    UserCode: uuidString,
                })
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // setSurveyResult(res.data.payload.result)
                            // console.log('res.data', res.data.payload)
                            setPanelListdata(res.data.payload)
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
    }, [user])

    // PageNation Setting
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const handleRowsPerPageChange = (event) => {
        if (parseInt(event.target.value, 10) > PanelListData?.length) {
            setPage(0)
        }
        setRowsPerPage(parseInt(event.target.value, 10))
    }

    useEffect(() => {
        if (PanelListData !== null) {
            setPaginatedDataList(applyPagination(PanelListData, page, rowsPerPage))
        }
    }, [PanelListData, page, rowsPerPage])

    /**
     * Popup
     * */
    const [selectedUserData, setSelectedUserData] = useState(null)
    const [popup_AccountInfoChange, setPopup_AccountInfoChange] = useState(false)

    const handleOpenPopup_AccountInfoChange = (userInfo) => {
        setSelectedUserData(userInfo)
        setPopup_AccountInfoChange(true)
    }

    const handleClosePopup_AccountInfoChange = () => {
        setPopup_AccountInfoChange(false)
    }

    /**
     *
     * Excel Download
     *
     */
    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const excelFileExtension = '.xlsx'
    const excelFileName = '작성자'
    const excelDownloadResult = (panelData) => {
        // const ws = XLSX.utils.aoa_to_sheet([[`${surveySelectedSurveyTitle}`]])
        const ws = XLSX.utils.aoa_to_sheet([[`패널 리스트`]])
        XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 })

        const extraColumn = 1
        const colWidth = 300
        let mergeSize = 0
        let mergeAddSize = 0
        let titleSize = 1
        /* Question Width */
        const questionWidth = [...Array(panelData.length * 100)].map((val, idx) => {
            return {
                wpx: colWidth,
            }
        })
        ws['!cols'] = [{ wpx: 200 }, ...questionWidth] // 행사이즈

        /* Question Title */
        const headerList = TableHeader.map((t, tIndex) => {
            const newTitle = t.label
            // console.log('q.title', newTitle)
            return newTitle
        })

        // Insert Question Ttitle */
        headerList.splice(TableHeader.length - 1)
        XLSX.utils.sheet_add_aoa(ws, [headerList], { origin: -1 })

        panelData.map((p, pIndex) => {
            // console.log('p', p)
            let modeText = p.mode === 3 ? '개발자' : p.mode === 2 ? '관리자' : '사용자'
            let statusText = p.status === 0 ? '대기' : p.status === 1 ? '경고' : p.status === 2 ? '정지' : p.status === 3 ? '정상' : '삭제'
            let registerTime = formatInTimeZone(p.createdAt, 'Asia/Seoul', 'yyyy.MM.dd, hh:mm a')
            let panelDetail = [pIndex + 1, p.name, formatPhoneNumber(p.phone), p.email, modeText, statusText, registerTime]
            XLSX.utils.sheet_add_aoa(ws, [panelDetail], { origin: -1 })
        })

        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const excelFile = new Blob([excelButter], { type: excelFileType })
        FileSaver.saveAs(excelFile, `패널목록` + excelFileExtension)
    }

    return (
        <>
            <PopupAccountInfoChange accountInfo={selectedUserData} returnUrl={'/adm'} onClose={handleClosePopup_AccountInfoChange} open={popup_AccountInfoChange} />
            <Box
                sx={{
                    background: '#fff',
                    mt: 3,
                    p: 0,
                }}
            >
                <Scrollbar>
                    <Box sx={{ mx: 2, my: 5 }}>
                        <Typography variant="h5">총 가입자수 : {PanelListData?.length}</Typography>
                        <Button
                            onClick={() => excelDownloadResult(PanelListData)}
                            size="large"
                            sx={{
                                mt: 3,
                                height: '30px',
                                // borderRadius: '20px 0px 20px 0px',
                            }}
                            type="button"
                            variant="contained"
                        >
                            패널 목록 다운로드
                        </Button>
                    </Box>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead sx={{ backgroundColor: 'transparent' }}>
                            <TableRow
                                sx={{
                                    th: {
                                        borderRight: '1px solid rgba(0,0,0,0.1)',
                                        py: 1,
                                        ':last-child ': {
                                            borderRight: '0px solid rgba(0,0,0,0.1)',
                                        },
                                    },
                                }}
                            >
                                {TableHeader.map((tb, index) => (
                                    <TableCell key={`survey-list-header-${index}`} sx={{ width: tb.width }} align={tb.align}>
                                        {tb.type === 0 ? (
                                            <Typography sx={{ fontSize: tb.fontSize, fontWeight: tb.fontWeight }}>{tb.label}</Typography>
                                        ) : (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {tb.labels.map((lbs, tbIndex) => (
                                                    <Typography key={`survey-list-header-col-${tbIndex}`} sx={{ fontSize: tb.fontSize, fontWeight: tb.fontWeight, mx: 0.5 }}>
                                                        {lbs}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedDataList?.map((v, index) => {
                                const meCode = Array.from(user.code.data, (v) => v.toString(16).padStart(2, '0')).join('')
                                const userCode = Array.from(v.code.data, (v) => v.toString(16).padStart(2, '0')).join('')

                                const isMe = meCode === userCode
                                return (
                                    <TableRow key={`survey-list-body-row-${index}`} hover sx={{ backgroundColor: isMe ? 'rgba(83, 255,83, 0.1)' : 'rgba(55, 65, 81, 0.00)', td: { my: 3, borderBottom: '0px' } }}>
                                        {/* <TableCell align="center">{PanelListData?.length - index - rowsPerPage * page}</TableCell> */}
                                        <TableCell align="center">{index + 1 + rowsPerPage * page}</TableCell>
                                        <TableCell align="center">{v.name}</TableCell>
                                        <TableCell align="center">{formatPhoneNumber(v.phone)}</TableCell>
                                        <TableCell align="center">{v.email}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: v.mode >= 2 ? 700 : 400 }}>{v.mode === 3 ? '개발자' : v.mode === 2 ? '관리자' : '사용자'}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={v.status === 0 ? '대기' : v.status === 1 ? '경고' : v.status === 2 ? '정지' : v.status === 3 ? '정상' : '삭제'}
                                                variant="contained"
                                                color={v.status === 0 ? 'disable' : v.status === 1 ? 'warning' : v.status === 2 ? 'error' : v.status === 3 ? 'success' : 'error'}
                                                size="small"
                                                sx={{
                                                    marginInline: 0,
                                                    paddingInline: 0.5,
                                                    height: '1.6rem',
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </TableCell>
                                        {/* <TableCell align="center">
                                            <Chip
                                                label={v.type === 0 ? 'Starter' : v.type === 1 ? 'Standard' : v.type === 2 ? 'Professional' : 'Dev'}
                                                variant="outlined"
                                                color={v.type === 0 ? 'free' : v.type === 1 ? 'basic' : v.type === 2 ? 'pro' : 'disable'}
                                                size="small"
                                                sx={{
                                                    marginInline: 0,
                                                    paddingInline: 0.5,
                                                    height: '1.6rem',
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </TableCell> */}

                                        <TableCell align="center">
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'hh:mm a')}</Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <IconButton onClick={() => handleOpenPopup_AccountInfoChange(v)}>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>정보변경</Typography>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
                {paginatedDataList !== null && (
                    <TablePagination
                        component="div"
                        count={PanelListData?.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage=""
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to}`}
                    />
                )}
            </Box>
        </>
    )
}

export default PanelList
