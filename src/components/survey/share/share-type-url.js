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

/* M Icon */
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const ShareTypeUrl = () => {
    const router = useRouter()
    const { code } = router.query
    /*URL 배포*/
    /* Copy */
    // console.log('process.env.NEXT_PUBLIC_SHARE', process.env.NEXT_PUBLIC_SHARE)
    const [shareUrl, setShareUrl] = useState(`${process.env.NEXT_PUBLIC_SHARE}/${code}/a`)
    const onCopyToUrl = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            toast.success(`클립보드에 복사되었습니다!\n`)
        } catch (error) {
            toast.error(`클립보드 복사 실패\n${error}`)
        }
    }
    /* Download */
    const downloadQRCode = () => {
        // Generate download with use canvas and stream
        const canvas = document.getElementById('votg-survey-qr-download')
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        let downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = `VOTG-qr-${name}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    return (
        <>
            <Card sx={{ mb: 1 }}>
                {/* <CardHeader title={`배포 URL`} /> */}
                <CardContent>
                    <Grid container spacing={0}>
                        <Grid item xs={9}>
                            <Typography variant="h5">배포 URL</Typography>
                            <Divider sx={{ my: 3 }} />
                            <Tooltip title="클릭해서 복사하기">
                                <TextField
                                    onClick={onCopyToUrl}
                                    fullWidth
                                    value={shareUrl}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton>
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& input': {
                                            cursor: 'pointer',
                                            caretColor: 'transparent',
                                            fontSize: '0.8rem',
                                        },
                                    }}
                                />
                            </Tooltip>
                            <Typography sx={{ fontSize: '0.7rem', mx: 1, my: 3 }}>
                                <li>제공되는 URL과 QR코드로 직접 설문 응답을 받거나, 홈페이지 팝업 창 등에 삽입해서 설문을 유도할 수 있습니다.</li>
                            </Typography>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={2}>
                            <Tooltip title="다운로드 받아 배포할 수 있습니다.">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box>
                                        <QRCodeCanvas id="votg-survey-qr-download" value={shareUrl} level={'H'} includeMargin={true} />
                                    </Box>
                                    <Box sx={{ width: '100%', px: 1 }}>
                                        <Button
                                            onClick={downloadQRCode}
                                            fullWidth
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                            }}
                                            variant="contained"
                                            size="small"
                                        >
                                            다운로드
                                        </Button>
                                    </Box>
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default ShareTypeUrl
