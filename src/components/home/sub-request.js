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
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import API from '@utils/API'
import { wait } from '@utils/wait'

import { Scrollbar } from '@components/layout/scrollbar'

export const SubRequest = (props) => {
    const now = new Date()
    const theme = useTheme()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleChangeFeature = (index) => {
        setSelectedFeature(index)
    }

    //
    const [requestInfo, setReuestInfo] = useState({
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: false,
    })
    const handleChangeRequestInfo = (event) => {
        if (event.target.name !== '6') {
            setReuestInfo({
                ...requestInfo,
                [event.target.name]: event.target.value,
            })
        } else {
            setReuestInfo({
                ...requestInfo,
                [event.target.name]: !requestInfo[6],
            })
        }
    }

    //5
    const area = ['설문조사', '데이터분석(통계분석)', '분석보고서', '데이터구독(특정분야 빅데이터 분석 및 인사이트 제공)', '기타']
    const [selectedArea, setSelectedArea] = useState([])
    const [requestArea, setReuestArea] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
    })

    const handleChangeRequestArea = (event) => {
        setReuestArea({
            ...requestArea,
            [event.target.name]: event.target.checked,
        })
    }

    const [ETCArea, setEtcArea] = useState('')
    const handleChangeETCArea = (e) => {
        setEtcArea(e.target.value)
    }

    useEffect(() => {
        let selected = []
        area.map((v, index) => {
            if (requestArea[index]) {
                if (index != 4) {
                    selected.push(v)
                } else {
                    selected.push(`${v}:${ETCArea}`)
                }
            }
        })
        setSelectedArea(selected)
        // console.log('selected area', selected)
        setReuestInfo({
            ...requestInfo,
            4: selected,
        })
    }, [requestArea, ETCArea])

    //Final Data
    const [sendingState, setSendingState] = useState(false)
    useEffect(() => {
        // console.log('Final Data\n', requestInfo)
        // console.log('0', requestInfo[0].length > 0)
        // console.log('1', requestInfo[1].length > 0)
        // console.log('2', requestInfo[2].length > 0)
        // console.log('3', requestInfo[3].length > 0)
        // console.log('4', requestInfo[4].length > 0)
        // console.log('5', requestInfo[5].length > 0)
        // console.log('6', requestInfo[6])

        let r0 = requestInfo[0].length > 0
        let r1 = requestInfo[1].length > 0
        let r2 = requestInfo[2].length > 0
        let r3 = requestInfo[3].length > 0
        let r4 = requestInfo[4].length > 0
        let r5 = requestInfo[5].length > 0
        let r6 = requestInfo[6]
        setSendingState(r0 && r1 && r2 && r3 && r4 && r5 && r6)
        // console.log('sendingState', sendingState)
    }, [requestInfo])

    const submitRequestInfo = async () => {
        try {
            setIsLoading(true)
            // Do search here
            const res = await API.post('request/requestMail', {
                name: requestInfo[0],
                org: requestInfo[1],
                phone: requestInfo[2],
                email: requestInfo[3],
                area: requestInfo[4],
                content: requestInfo[5],
                privacy: requestInfo[6],
            })
            await wait(1000)
            setIsLoading(false)

            toast.success('문의 완료')
            await router.push(`/`).catch(console.error)
        } catch (error) {
            console.error(error)
            toast.error('문의 오류')
            await router.push(`/request`).catch(console.error)
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                py: 3,
            }}
            {...props}
        >
            <Container maxWidth="sm">
                <Paper>
                    <Scrollbar>
                        <Box
                            sx={{
                                // minWidth: 800,
                                p: 6,
                            }}
                        >
                            <Grid container justifyContent="center">
                                <Grid item alignItems="center">
                                    {/* <Logo /> */}
                                    <Typography variant="h5" style={{ textAlign: 'center' }}>
                                        맞춤 서베이 상담신청
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    1. 이름
                                </Typography>
                                <TextField required name={0} onChange={handleChangeRequestInfo} inputProps={{ maxLength: 19 }} value={requestInfo[0]} />
                            </Box>
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    2. 소속기관
                                </Typography>
                                <TextField fullWidth required name={1} onChange={handleChangeRequestInfo} value={requestInfo[1]} />
                            </Box>
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    3. 휴대폰
                                </Typography>
                                <TextField fullWidth required name={2} onChange={handleChangeRequestInfo} inputProps={{ maxLength: 19 }} value={requestInfo[2]} />
                            </Box>
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    4. 이메일
                                </Typography>
                                <TextField fullWidth required name={3} onChange={handleChangeRequestInfo} value={requestInfo[3]} />
                            </Box>
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    5. 문의 분야 (중복 선택 가능)
                                </Typography>
                                <FormGroup>
                                    {area.map((v, index) => {
                                        return <FormControlLabel key={`request-checkbox-${index}`} control={<Checkbox checked={requestArea[index]} onChange={handleChangeRequestArea} name={index} />} label={area[index]} />
                                    })}
                                </FormGroup>
                            </Box>
                            {requestArea[4] && (
                                <Box sx={{ my: 4 }}>
                                    <Typography
                                        sx={{
                                            color: 'text.black',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            ml: 0,
                                            my: 1,
                                        }}
                                    >
                                        기타
                                    </Typography>
                                    <TextField fullWidth required onChange={handleChangeETCArea} value={ETCArea} />
                                </Box>
                            )}
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    6. 문의 내용
                                </Typography>
                                <TextareaAutosize
                                    fullWidth
                                    aria-label="request-textarea"
                                    required
                                    name={5}
                                    onChange={handleChangeRequestInfo}
                                    placeholder="문의할 내용을 입력해주세요."
                                    style={{ width: '100%', height: 200, border: '1px solid #ddd' }}
                                    value={requestInfo[5]}
                                />
                            </Box>
                            <Box sx={{ my: 4 }}>
                                <Typography
                                    sx={{
                                        color: 'text.black',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        ml: 0,
                                        my: 1,
                                    }}
                                >
                                    개인정보 수집 및 이용 동의
                                    <Button variant="text" component="a" href="/request_privacy.pdf" size="small" align="right" sx={{ ml: 2, color: 'primary.main' }} target="_blank">
                                        내용 보기
                                    </Button>
                                </Typography>
                                <FormControlLabel control={<Checkbox checked={requestInfo[6]} onChange={handleChangeRequestInfo} name={6} />} label={'동의하기'} />
                            </Box>
                            <Box sx={{ mt: 2, position: 'relative' }}>
                                <Button disabled={!sendingState || isLoading} fullWidth size="large" type="submit" variant="contained" onClick={submitRequestInfo}>
                                    문의하기
                                </Button>
                                {isLoading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'primary.main',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Scrollbar>
                </Paper>
            </Container>
        </Box>
    )
}
