import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
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
    InputAdornment,
} from '@mui/material'

/* Icons */
import { IconShareMMS } from '@public/votg/IconShareMMS'
import { IconShareKakao } from '@public/votg/IconShareKakao'
import { IconShareMail } from '@public/votg/IconShareMail'
import { IconShareUrl } from '@public/votg/IconShareUrl'

const elementMenu = [
    {
        title: '문자 메시지',
        short: '문자',
        icon: <IconShareMMS customColor="#000" />,
        iconActive: <IconShareMMS color="primary" />,
    },
    {
        title: '카카오톡',
        short: '카톡',
        icon: <IconShareKakao customColor="#000" />,
        iconActive: <IconShareKakao color="primary" />,
    },
    {
        title: '이메일',
        short: '이메일',
        icon: <IconShareMail customColor="#000" />,
        iconActive: <IconShareMail color="primary" />,
    },
    {
        title: 'URL',
        short: 'URL',
        icon: <IconShareUrl customColor="#000" />,
        iconActive: <IconShareUrl color="primary" />,
    },
]

const ShareDistributeType = (props) => {
    const { selectDistribute, setSelectDistribute } = props
    return (
        <>
            <Card sx={{ mb: 1 }}>
                {/* <CardHeader title={`배포 URL`} /> */}
                <CardContent>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Typography variant="h5">배포 방식 선택</Typography>
                            <Divider sx={{ my: 3 }} />
                        </Grid>
                        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ ml: 0 }}>
                            {elementMenu.map((menu, index) => {
                                return (
                                    <Grid item xs={6} sm={3} key={`distribute-method-${index}`}>
                                        <Tooltip title={`${menu.title}로 배포하기`}>
                                            <IconButton
                                                sx={{
                                                    minWidth: '150px',
                                                    minHeight: '150px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    border: selectDistribute === index ? '2px solid #FF5353' : '2px solid #CCCCCC',
                                                    ':hover': {
                                                        background: 'transparent',
                                                        border: '2px solid #FF5353',
                                                    },
                                                }}
                                                onClick={() => setSelectDistribute(index)}
                                            >
                                                <Box sx={{ width: '100%', minWidth: '100px', mb: 2 }}>
                                                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 500, color: selectDistribute === index ? '#FF5353' : '#000' }}>{menu.title}</Typography>
                                                </Box>
                                                <Box>{selectDistribute === index ? menu.iconActive : menu.icon}</Box>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default ShareDistributeType
