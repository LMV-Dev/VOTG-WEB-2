import { Fragment, useEffect, useState } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { formatInTimeZone } from 'date-fns-tz'
import { UuidTool } from 'uuid-tool'
import API from '@utils/API'
import axios from 'axios'
import { wait } from '@utils/wait'
/*MUI Element*/
import { styled } from '@mui/material/styles'
import { AppBar, Avatar, Badge, Box, Button, ButtonBase, Checkbox, Chip, IconButton, Toolbar, Tooltip, Typography, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material'

/*MUI Icon*/
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
/*Custom Icon*/
/*Import Components*/
import { Scrollbar } from '@components/layout/scrollbar'

/*Import Hooks*/
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'

/*Initial Data*/
const sortOptions = [
    {
        label: '최근순',
        value: 'desc',
    },
    {
        label: '오래된순',
        value: 'asc',
    },
]

const TableHeader = [
    {
        index: 0,
        type: 0,
        label: '번호',
        labels: [],
        width: '5%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 1,
        type: 0,
        label: '제목',
        labels: [],
        width: '35%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'left',
    },
    {
        index: 2,
        type: 0,
        label: '상태',
        labels: [],
        width: '5%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 3,
        type: 0,
        label: '생성일',
        labels: [],
        width: '10%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 4,
        type: 1,
        label: '배포/응답',
        labels: ['배포', '응답'],
        width: '15%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 5,
        type: 0,
        label: '복사',
        labels: [],
        width: '13%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    // {
    //     index: 6,
    //     type: 0,
    //     label: '미리보기',
    //     labels: [],
    //     width: '10%',
    //     fontSize: '0.7rem',
    //     fontWeight: '700',
    //     align: 'center',
    // },
    {
        index: 7,
        type: 0,
        label: '삭제',
        labels: [],
        width: '13%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
]

const applyPagination = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

/* Compoent :: Popup */
import PopupWarningWithCancel_DuplicateSurvey from '@components/popup/popup-warning-with-cancel'
import PopupWarningWithCancel_DeleteSurvey from '@components/popup/popup-warning-with-cancel'

const SurveyListTable = ({ onlineData }) => {
    const { user } = useAuth()
    const router = useRouter()
    const newOnlineDataArray = onlineData.map((v, index) => {
        return v
    })

    //PageNation
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const handleRowsPerPageChange = (event) => {
        if (parseInt(event.target.value, 10) > newOnlineDataArray.length) {
            setPage(0)
        }
        setRowsPerPage(parseInt(event.target.value, 10))
    }

    const paginatedDataList = applyPagination(newOnlineDataArray, page, rowsPerPage)

    //Current Selected Survey
    const [currentSelectedSurvey, setCurrentSelectedSurvey] = useState(null)
    // Delete Post
    const [openDialogWarning_DuplicateSurvey, setopenDialogWarning_DuplicateSurvey] = useState(false)
    const handleOpenWarning_DuplicateSurvey = (value) => {
        setopenDialogWarning_DuplicateSurvey(true)
        setCurrentSelectedSurvey(value)
    }
    const handleCloseWarning_DuplicateSurvey = async () => {
        setopenDialogWarning_DuplicateSurvey(false)
        setCurrentSelectedSurvey(null)
    }
    const handleDuplicateSurveyEvent = async () => {
        await handleDuplicateSurvey(currentSelectedSurvey)
        await handleCloseWarning_DuplicateSurvey()
    }

    const handleDuplicateSurvey = async (code) => {
        try {
            let dupUrl = 'survey/copy'
            let returnUrl = '/ws/manager'
            const res = await API.post(dupUrl, {
                UserCode: UuidTool.toString(user?.code.data).replace(/-/g, ''),
                surveyCode: code,
                newSurveyCode: createResourceCode(),
            })

            toast.success('설문지 복사 완료')
            await router.reload(returnUrl).catch(console.error)
        } catch (error) {
            console.error(error)
            toast.error('Distribute Error: ' + error)
        }
    }

    // Delete Survey
    const [openDialogWarning_DeleteSurvey, setopenDialogWarning_DeleteSurvey] = useState(false)
    const handleOpenWarning_DeleteSurvey = (value) => {
        setopenDialogWarning_DeleteSurvey(true)
        setCurrentSelectedSurvey(value)
    }
    const handleCloseWarning_DeleteSurvey = async () => {
        setopenDialogWarning_DeleteSurvey(false)
        setCurrentSelectedSurvey(null)
    }
    const handleDeleteSurveyEvent = async () => {
        await handleDeleteSurvey(currentSelectedSurvey)
        await handleCloseWarning_DeleteSurvey()
    }

    const handleDeleteSurvey = async (code) => {
        try {
            let deleteUrl = 'survey/delete'
            let returnUrl = '/ws/manager'
            const res = await API.delete(deleteUrl, {
                UserCode: UuidTool.toString(user?.code.data).replace(/-/g, ''),
                surveyCode: code,
            })

            toast.success('삭제완료')
            await router.reload(returnUrl).catch(console.error)
        } catch (error) {
            console.error(error)
            toast.error('Distribute Error: ' + error)
        }
    }

    return (
        <Box
            sx={{
                background: '#fff',
                mt: 3,
                p: 0,
            }}
        >
            <PopupWarningWithCancel_DuplicateSurvey
                sw={false}
                onClose={handleCloseWarning_DuplicateSurvey}
                open={openDialogWarning_DuplicateSurvey}
                event={handleDuplicateSurveyEvent}
                title={'설문지를 복사하시겠습니까?'}
                description={'설문지는 배포전 상태로 복사 됩니다.'}
                cancelName={'취소'}
                confirmName={'복사하기'}
                color="secondary"
            />
            <PopupWarningWithCancel_DeleteSurvey
                sw={true}
                onClose={handleCloseWarning_DeleteSurvey}
                open={openDialogWarning_DeleteSurvey}
                event={handleDeleteSurveyEvent}
                title={'설문지를 삭제하시겠습니까?'}
                description={'설문지를 삭제하면 데이터가 완전히 삭제되며, 복구할 수 없습니다.'}
                cancelName={'삭제하기'}
                confirmName={'취소'}
                color="error"
            />
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
                        {paginatedDataList.map((v, index) => {
                            const dataJsonParse = JSON.parse(v.survey)
                            // console.log('v.surveyCode', v.surveyCode)
                            const dataJsonSendNumber = JSON.parse(v.sendContact)
                            let requestPerson = 0
                            if (dataJsonSendNumber.phoneNumbers !== undefined) {
                                // console.log('dataJsonSendNumber.phoneNumbers', dataJsonSendNumber.phoneNumbers)
                                requestPerson = dataJsonSendNumber.phoneNumbers.length
                            }
                            let answerPerson = 0
                            answerPerson = v.answerLength
                            return (
                                <TableRow key={`survey-list-body-row-${index}`} hover sx={{ '&.MuiTableRow-hover:hover': { backgroundColor: 'rgba(55, 65, 81, 0.00)' }, td: { my: 3, borderBottom: '0px' } }}>
                                    <TableCell align="center">{onlineData.length - index - rowsPerPage * page}</TableCell>

                                    <TableCell>
                                        {dataJsonParse.title?.length > 0 || dataJsonParse.info.title?.length > 0 ? (
                                            <Typography fontWeight={700} fontSize="0.8rem">
                                                {dataJsonParse.title || dataJsonParse.info.title}
                                            </Typography>
                                        ) : (
                                            <Typography fontWeight={500} fontSize="0.8rem" sx={{ textDecoration: 'underline', textUnderlinePosition: 'under' }}>
                                                제목없는 설문조사
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            //'0:취소(회색), 1:승인(파랑), 2:중단(빨강), 3:완료(초록)',
                                            label={v.status === 0 ? '배포전' : v.status === 1 ? '배포중' : v.status === 2 ? '중단' : '완료'}
                                            variant="outlined"
                                            color={v.status === 0 ? 'disable' : v.status === 1 ? 'info' : v.status === 2 ? 'error' : 'success'}
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
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'hh:mm a')}</Typography>
                                    </TableCell>

                                    <TableCell sx={{ width: '10%' }} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mx: 1 }}>{`${requestPerson}`}명</Typography>
                                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, mx: 1 }}>{`${answerPerson}`}명</Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button onClick={() => handleOpenWarning_DuplicateSurvey(v.surveyCode)} variant="outlined" startIcon={<ContentCopyIcon />} color={'secondary'}>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>복사하기</Typography>
                                        </Button>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button onClick={() => handleOpenWarning_DeleteSurvey(v.surveyCode)} variant="outlined" startIcon={<ContentCopyIcon />} color={'error'}>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#D14343' }}>삭제하기</Typography>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            {/* <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    m: -1,
                    p: 1,
                }}
            >
                <Box
                    sx={{
                        m: 1,
                        width: { md: '13%', xs: '25%' },
                    }}
                >
                    <TextField
                        fullWidth
                        label=""
                        name="category"
                        size="small"
                        select
                        SelectProps={{ native: true }}
                        sx={{ '& div > select': { fontSize: '0.8rem', mb: 0.3 } }}
                    >
                        {categoryOptions.map((categoryOption) => (
                            <option key={categoryOption.value} value={categoryOption.value}>
                                {categoryOption.label}
                            </option>
                        ))}
                    </TextField>
                </Box>
                <Box
                    sx={{
                        m: 1,
                        alignItems: 'center',
                        display: 'flex',
                        width: { md: '30%', xs: '65%' },
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Enter를 눌러 검색하세요"
                        sx={{ '& div > input': { fontSize: '0.8rem' } }}
                    />
                </Box>
                <Box
                    sx={{
                        m: 1,
                        alignItems: 'center',
                        display: 'flex',
                        width: { md: '20%', xs: '25%' },
                    }}
                >
                    <TextField
                        label=""
                        name="sort"
                        select
                        SelectProps={{ native: true }}
                        size="small"
                        sx={{ '& div > select': { fontSize: '0.8rem', mb: 0.3 } }}
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Box>
            </Box> */}
            <TablePagination
                component="div"
                count={onlineData.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage=""
                labelDisplayedRows={({ from, to, count }) => `${from}-${to}`}
            />
        </Box>
    )
}

export default SurveyListTable
