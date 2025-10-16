import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Head from 'next/head'
import { formatInTimeZone } from 'date-fns-tz'
import { Box, CircularProgress, Button, Card, Chip, CardActions, CardContent, Container, Divider, Grid, Tabs, Tab, MenuItem, TextField, Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material'

import axios from 'axios'
import { useAuth } from '@hooks/use-auth'
import { UuidTool } from 'uuid-tool'

//Util
import { formatPhoneNumber, formatCardNumber, formatPrice } from '@utils/auto-format'

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
        label: '날짜',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 5,
        type: 0,
        label: '결제상태',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 6,
        type: 0,
        label: '결제내역',
        labels: [],
        width: '30%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 7,
        type: 0,
        label: '결제금액',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    // {
    //     index: 8,
    //     type: 0,
    //     label: '관리',
    //     labels: [],
    //     width: '10%',
    //     fontSize: '0.7rem',
    //     fontWeight: '700',
    //     align: 'center',
    // },
]

const applyPagination = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const PayResultList = () => {
    const { user, logout } = useAuth()
    const router = useRouter()

    const [userResultListData, setUserResultListdata] = useState(null)
    const [payResultListData, setPayResultListdata] = useState(null)
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
                .post(`https://api.koaiarchitecture.com/adm//pay/resultList`, {
                    UserCode: uuidString,
                })
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setPayResultListdata(res.data.payload.PayResult)
                            // console.log('userResultListData', res.data.payload.UserData)
                            setUserResultListdata(res.data.payload.UserData)
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
        if (parseInt(event.target.value, 10) > payResultListData?.length) {
            setPage(0)
        }
        setRowsPerPage(parseInt(event.target.value, 10))
    }

    useEffect(() => {
        if (payResultListData !== null) {
            // const newData = payResultListData.filter((data) => data.status !== '0')
            setPaginatedDataList(applyPagination(payResultListData, page, rowsPerPage))
        }
    }, [payResultListData, page, rowsPerPage])

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
                            {paginatedDataList
                                ?.slice(0)
                                .reverse()
                                .map((v, index) => {
                                    const meCode = Array.from(user.code.data, (v) => v.toString(16).padStart(2, '0')).join('')
                                    const userCode = Array.from(userResultListData[index]?.code.data, (v) => v.toString(16).padStart(2, '0')).join('')
                                    const status = parseInt(v.status)
                                    const isMe = meCode === userCode

                                    const viewIndex = index + rowsPerPage * page

                                    const reverseIndex = payResultListData?.length - index - rowsPerPage * page - 1
                                    return (
                                        <TableRow key={`survey-list-body-row-${index}`} hover sx={{ backgroundColor: 'rgba(55, 65, 81, 0.00)', td: { my: 3, borderBottom: '0px' } }}>
                                            <TableCell align="center">{payResultListData?.length - index - rowsPerPage * page}</TableCell>
                                            <TableCell align="center">{userResultListData[reverseIndex]?.name}</TableCell>
                                            <TableCell align="center">{formatPhoneNumber(userResultListData[reverseIndex]?.phone)}</TableCell>
                                            <TableCell align="center">{userResultListData[reverseIndex]?.email}</TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'hh:mm a')}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={status === 0 ? '요청' : status === 1 ? '승인' : status === 2 ? '실패' : status === 3 ? '취소' : '오류'}
                                                    variant="contained"
                                                    color={status === 0 ? 'disable' : status === 1 ? 'success' : status === 2 ? 'error' : status === 3 ? 'warning' : 'error'}
                                                    size="small"
                                                    sx={{
                                                        marginInline: 0,
                                                        paddingInline: 0.5,
                                                        height: '1.6rem',
                                                        fontSize: '0.7rem',
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 400, mb: 0 }}>{v.orderName}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 400, mb: 0 }}>{formatPrice(v.amount)}원</Typography>
                                            </TableCell>

                                            {/* <TableCell align="center">
                                            <IconButton onClick={() => handleOpenPopup_AccountInfoChange(v)}>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>정보변경</Typography>
                                            </IconButton>
                                        </TableCell> */}
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </Scrollbar>
                {paginatedDataList !== null && (
                    <TablePagination
                        component="div"
                        count={payResultListData?.length}
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

export default PayResultList
