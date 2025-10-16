import NextLink from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Badge, Box, Button, CircularProgress, Dialog, DialogContent, Divider, IconButton, InputAdornment, TextField, Typography, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material'
import { X as XIcon } from '@components/icons/x'
import { wait } from '@utils/wait'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { GuestGuard } from '@components/auth/guest-guard'
// import Vid from './public/media/intro.mp4'

const ConvertGuidePopover = (props) => {
    const { onClose, open, dismiss, title, description, buttonName, ...other } = props

    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const onLoadedData = () => {
        setIsVideoLoaded(true)
    }

    return (
        <Dialog fullWidth maxWidth="lg" onClose={onClose} open={!!open} {...other} sx={{ maxWidth: '1100px', margin: '0 auto' }}>
            <DialogContent sx={{ p: 2 }}>
                <Box
                    sx={{
                        pt: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography sx={{ fontSize: { sm: '1.5rem', xs: '1.3rem' }, fontWeight: 700, color: '#FF5353' }}>Drag & Survey 가이드라인</Typography>
                </Box>
                {/* Modal Button */}
                <Box
                    sx={{
                        pt: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        px: { sm: 5, xs: 0 },
                    }}
                >
                    <Typography
                        sx={{
                            my: 1,
                            fontSize: { sm: '1.3rem', xs: '1.1rem' },
                            color: 'text.sencondary',
                            fontWeight: 700,
                        }}
                    >
                        *주의사항
                    </Typography>
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'top',
                                mb: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    fontWeight: '500',
                                    mr: 2,
                                }}
                            >
                                1.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    color: '#000',
                                    fontWeight: 500,
                                    '& span': { fontSize: { sm: '1.1rem', xs: '0.9rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                }}
                            >
                                뷰즈온더고의 Drag & Survey 기능은 첨부된 설문지 양식을 <span>PDF파일로 변환하신 후</span>에 온라인폼으로 전환이 가능합니다.
                            </Typography>
                        </Box>
                    </>

                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'top',
                                mb: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    fontWeight: '500',
                                    mr: 2,
                                }}
                            >
                                2.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    color: '#000',
                                    fontWeight: 500,
                                    '& span': { fontSize: { sm: '1.1rem', xs: '0.9rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                }}
                            >
                                첨부된 설문지 표양식에 맞추어 여러분의 설문 문항을 넣어 편집해 주세요.
                            </Typography>
                        </Box>
                    </>

                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'top',
                                mb: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    fontWeight: '500',
                                    mr: 2,
                                }}
                            >
                                3.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    color: '#000',
                                    fontWeight: 500,
                                    '& span': { fontSize: { sm: '1.1rem', xs: '0.9rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                }}
                            >
                                <span>한 페이지당 하나의 표</span>를 넣어 지문을 만들어 주세요.
                            </Typography>
                        </Box>
                    </>

                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'top',
                                mb: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    fontWeight: '500',
                                    mr: 2,
                                }}
                            >
                                4.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    color: '#000',
                                    fontWeight: 500,
                                    '& span': { fontSize: { sm: '1.1rem', xs: '0.9rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                }}
                            >
                                모든 문항과 선택지는 반드시 <span>지정된 양식의 ‘표 안에’</span> 넣어 주셔야 합니다.
                            </Typography>
                        </Box>
                    </>

                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'top',
                                mb: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    fontWeight: '500',
                                    mr: 2,
                                }}
                            >
                                5.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { sm: '1.1rem', xs: '0.9rem' },
                                    color: '#000',
                                    fontWeight: 500,
                                    '& span': { fontSize: { sm: '1.1rem', xs: '0.9rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'none' },
                                }}
                            >
                                <span>선택지는 반드시 아래의 원문자를 넣어서 표를 완성해 주세요.</span>
                            </Typography>
                        </Box>
                    </>
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 100 }}>
                                        <Typography sx={{ textAlign: 'center', fontSize: { sm: '1rem', xs: '1rem' }, fontWeight: 700 }}>사용 가능한 선택지 원문자</Typography>{' '}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography sx={{ textAlign: 'center', fontSize: { sm: '1.1rem', xs: '0.9rem' } }}>① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 100 }}>
                                        <Typography sx={{ textAlign: 'center', fontSize: { sm: '1rem', xs: '1rem' }, fontWeight: 700 }}>변환 순서</Typography>{' '}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    1.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    메인 페이지에 첨부된 설문지 양식을 다운로드 받아주세요.
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'start',
                                                    alignItems: 'top',
                                                    mx: 5,
                                                    my: 2,
                                                }}
                                            >
                                                <img alt="" src="/media/guide_select_image.png" width={300} />
                                            </Box>
                                        </>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    2.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    양식에 여러분의 설문문항과 선택지를 입력하시고, 표의 행과 열을 추가 또는 삭제하셔서 설문지를 완성해주세요.
                                                </Typography>
                                            </Box>
                                        </>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    3.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    완성된 양식을 PDF로 저장해주세요.
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 3,
                                                    }}
                                                ></Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: 'text.secondary',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1.1rem', xs: '0.9rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    {`파일 > 다름 이름으로 저장 > 포맷 pdf 선택 > 저장`}
                                                </Typography>
                                            </Box>
                                        </>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    4.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    저장한 PDF 파일을 뷰즈온더고 Drag & Survey 네모칸(Drop zone)에 끌어와 넣어주세요.
                                                </Typography>
                                            </Box>
                                        </>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    5.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    자동으로 온라인설문지폼이 생성됩니다. (좌측이 원본, 우측이 변환된 폼)
                                                </Typography>
                                            </Box>
                                        </>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    6.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    원하시는 형태의 결제방식을 선택하여 변환된 설문지 수정페이지로 이동해주세요.
                                                </Typography>
                                            </Box>
                                        </>
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'top',
                                                    mx: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        fontWeight: '500',
                                                        mr: 2,
                                                    }}
                                                >
                                                    7.
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: { sm: '1rem', xs: '0.8rem' },
                                                        color: '#000',
                                                        fontWeight: 500,
                                                        '& span': { fontSize: { sm: '1rem', xs: '0.8rem' }, color: '#FF5353', fontWeight: 700, textDecoration: 'underline' },
                                                    }}
                                                >
                                                    설문지 수정 및 검토를 마친 후 배포하면 완료 !
                                                </Typography>
                                            </Box>
                                        </>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 2,
                    }}
                >
                    {dismiss !== undefined && (
                        <Box sx={{ position: 'relative' }}>
                            <Button fullWidth size="small" sx={{ mt: 2 }} variant="text" onClick={dismiss}>
                                다시보지 않기
                            </Button>
                        </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ position: 'relative' }}>
                        <Button fullWidth size="small" sx={{ mt: 2 }} variant="text" onClick={onClose}>
                            {buttonName ? buttonName : '확인'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

ConvertGuidePopover.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

// ConvertGuidePopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default ConvertGuidePopover
