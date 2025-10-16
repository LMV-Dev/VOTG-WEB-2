import React from 'react'

import {
    useMediaQuery,
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
    CircularProgress,
} from '@mui/material'
import { Logo } from '@components/layout/logo'
const NotFound404 = () => {
    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    backgroundColor: 'background.paper',
                    pt: 10,
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography color="primary" variant="overline">
                        WARNING
                    </Typography>

                    <Typography align="center" variant="h5" sx={{ py: 1 }}>
                        잘못된 접근입니다.
                    </Typography>
                    <Box>
                        <Button component="a" href="/" variant="outlined" sx={{ width: '200px', my: 5 }}>
                            인공지능 기반 건축설계 자동화 기술개발 연구단 바로가기
                        </Button>
                    </Box>
                    <Box sx={{ position: 'fixed', bottom: 0, my: 5 }}>
                        <Logo width={100} />
                    </Box>
                    {/* <Typography
                                align="center"
                                color="textSecondary"
                                variant="subtitle1"
                                sx={{ py: 3 }}
                            >
                                설문조사 완료후 연락처를 남겨주시면 소정의 상품을 보내드립니다.
                            </Typography> */}
                </Container>
            </Box>
        </>
    )
}

export default NotFound404
