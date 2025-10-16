import { Fragment, useState, useEffect } from 'react'
import {
    CircularProgress,
    Button,
    FormGroup,
    FormControlLabel,
    TextareaAutosize,
    Avatar,
    TextField,
    Checkbox,
    Box,
    Container,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { formatInTimeZone } from 'date-fns-tz'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useAuth } from '@hooks/use-auth'
import { toast } from 'react-toastify'
import API from '@utils/API'
import { wait } from '@utils/wait'

import { Scrollbar } from '@components/layout/scrollbar'
import { Logo } from '@components/layout/logo'

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
        label: '제목',
        labels: [],
        width: '70%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    {
        index: 2,
        type: 0,
        label: '작성시간',
        labels: [],
        width: '20%',
        fontSize: '0.7rem',
        fontWeight: '700',
        align: 'center',
    },
    // {
    //     index: 3,
    //     type: 0,
    //     label: '조회수',
    //     labels: [],
    //     width: '10%',
    //     fontSize: '0.7rem',
    //     fontWeight: '700',
    //     align: 'center',
    // },
]

const applyPagination = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

export const BoardType_Table = (props) => {
    const { typeNumber, dataList } = props
    const { user } = useAuth()
    const now = new Date()
    const theme = useTheme()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [boardListData, setBoardListdata] = useState(dataList)
    const [paginatedDataList, setPaginatedDataList] = useState(null)

    // PageNation Setting
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const handleRowsPerPageChange = (event) => {
        if (parseInt(event.target.value, 10) > boardListData?.length) {
            setPage(0)
        }
        setRowsPerPage(parseInt(event.target.value, 10))
    }

    useEffect(() => {
        // console.log('boardListData', boardListData)
        if (boardListData !== null && boardListData !== undefined) {
            setPaginatedDataList(applyPagination(boardListData, page, rowsPerPage))
        }
    }, [boardListData, page, rowsPerPage])

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                mt: 2,
                pb: 10,
            }}
        >
            <Container maxWidth="md">
                <Paper>
                    <Scrollbar>
                        <Box
                            sx={{
                                // minWidth: 800,
                                p: 0,
                                minHeight: '600px',
                            }}
                        >
                            <Table
                                sx={{
                                    '& .MuiTableRow-root:hover': {
                                        transition: 'all 0.5s',
                                    },
                                    transition: 'all 0.5s',
                                }}
                            >
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
                                            <TableCell key={`board-list-header-${index}`} sx={{ width: tb.width }} align={tb.align}>
                                                {tb.type === 0 ? (
                                                    <Typography sx={{ fontSize: tb.fontSize, fontWeight: tb.fontWeight }}>{tb.label}</Typography>
                                                ) : (
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        {tb.labels.map((lbs, tbIndex) => (
                                                            <Typography key={`board-list-header-col-${tbIndex}`} sx={{ fontSize: tb.fontSize, fontWeight: tb.fontWeight, mx: 0.5 }}>
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
                                        return (
                                            <NextLink href={`/board/view/?type=${typeNumber}&code=${v.code}`}>
                                                <TableRow
                                                    key={`board-list-body-row-${index}`}
                                                    hover
                                                    sx={{
                                                        td: { my: 0, borderBottom: '0px' },
                                                    }}
                                                >
                                                    <TableCell align="center">{boardListData?.length - index - rowsPerPage * page}</TableCell>

                                                    <TableCell align="left" sx={{ cursor: 'pointer' }}>
                                                        {v.title}
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, mb: 0 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'yyyy.MM.dd')}</Typography>
                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, mb: 1 }}>{formatInTimeZone(v.createdAt, 'Asia/Seoul', 'hh:mm a')}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </NextLink>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Scrollbar>
                    {paginatedDataList !== null && (
                        <TablePagination
                            component="div"
                            count={boardListData?.length}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage=""
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to}`}
                        />
                    )}
                </Paper>

                {user?.mode >= 2 && (
                    <Box sx={{ display: 'flex', alignItems: 'cneter', justifyContent: 'center', background: 'fff', mt: 2 }}>
                        {/* <Typography sx={{ p: 1, fontWeight: 700 }}>관리자 모드</Typography> */}
                        <NextLink href={`/board/create?type=${typeNumber}`}>
                            <Button component="a" variant="outlined">
                                게시글 작성
                            </Button>
                        </NextLink>
                    </Box>
                )}
            </Container>
        </Box>
    )
}

export const BoarMenu = (props) => {
    const now = new Date()
    const theme = useTheme()
    const router = useRouter()
    const asPath = router.asPath
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                py: 3,
            }}
            {...props}
        >
            <Container maxWidth="md">
                <Paper>
                    <Scrollbar>
                        <Box
                            sx={{
                                // minWidth: 800,
                                p: 1,
                            }}
                        >
                            <Grid container justifyContent="center">
                                <Grid item xs={4} alignItems="center">
                                    {/* <Logo /> */}
                                    <NextLink href={'/board/notice'}>
                                        <Button
                                            component="a"
                                            size="small"
                                            variant="text"
                                            sx={{
                                                width: '100%',
                                                fontSize: '1rem',
                                                color: '/board/notice' == asPath ? 'primary.main' : 'text.black',
                                                background: 'transparent',
                                                ':hover': {
                                                    color: 'text.secondary',
                                                    background: 'transparent',
                                                },
                                            }}
                                        >
                                            공지사항
                                        </Button>
                                    </NextLink>
                                </Grid>
                                <Grid item xs={4} alignItems="center">
                                    {/* <Logo /> */}
                                    <NextLink href={'/board/learn'}>
                                        <Button
                                            component="a"
                                            size="small"
                                            variant="text"
                                            sx={{
                                                width: '100%',
                                                fontSize: '1rem',
                                                color: '/board/learn' == asPath ? 'primary.main' : 'text.black',
                                                background: 'transparent',
                                                ':hover': {
                                                    color: 'text.secondary',
                                                    background: 'transparent',
                                                },
                                            }}
                                        >
                                            Learning is Action
                                        </Button>
                                    </NextLink>
                                </Grid>
                                {/* <Grid item xs={4} alignItems="center">
                                    <NextLink href={'/board/media'}>
                                        <Button
                                            component="a"
                                            size="small"
                                            variant="text"
                                            sx={{
                                                width: '100%',
                                                fontSize: '1rem',
                                                color: '/board/media' == asPath ? 'primary.main' : 'text.black',
                                                background: 'transparent',
                                                ':hover': {
                                                    color: 'text.secondary',
                                                    background: 'transparent',
                                                },
                                            }}
                                        >
                                            대외활동 및 수상내역
                                        </Button>
                                    </NextLink>
                                </Grid> */}
                            </Grid>
                        </Box>
                    </Scrollbar>
                </Paper>
            </Container>
        </Box>
    )
}
