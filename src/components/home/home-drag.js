import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Image from 'next/image'
import { UuidTool } from 'uuid-tool'
import { Avatar, Box, Button, Container, Typography, Link, Chip, Card, CardContent, CardMedia } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useAuth } from '@hooks/use-auth'
import { CheckCircleOutlined as CheckCircleOutlinedIcon } from '@components/icons/check-circle-outlined'
import { Users as UsersIcon } from '@components/icons/users'
import { Star as StarIcon } from '@components/icons/star'
import { Template as TemplateIcon } from '@components/icons/template'

import { FileDropzone } from '@components/convert/home-file-dropzone-demo'
import { PDFViewr } from '@components/convert/home-file-pdfviewer-demo'

import ServiceCheckPopover from '@components/popovers/popover-service-check'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { surveyType } from '@schema/survey-type'

/*Popup*/
import DefaultInfoPopoverInfoConvert from '@components/popovers/popover-default-info'
/*Popup*/
import ConvertGuidePopover from '@components/popovers/popover-convert-guide'

export const HomeSectionDrag = ({ onMoveScroll }) => {
    const auth = useAuth()
    const { user } = useAuth()
    const router = useRouter()

    /* Service Check*/
    const initService = router.query.init

    const theme = useTheme()

    /* File Setting */
    const [files, setFiles] = useState([])
    const [fileName, setFileName] = useState('')
    
    useEffect(() => {
        if (globalThis.sessionStorage.getItem('set-file-cache') !== null) {
            globalThis.sessionStorage.removeItem('set-file-cache')
        }
    }, [])

    const handleDrop = (newFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }

    const handleRemove = (file) => {
        setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path))
        globalThis.sessionStorage.removeItem('set-file-cache')
    }

    const handleRemoveAll = () => {
        setFiles([])
    }

    /* File Data Check */
    // useEffect(() => {
    //     if (files.length > 0) {
    //         // console.log(files)
    //         globalThis.sessionStorage.setItem('set-file-cache', JSON.stringify(files))
    //     }
    // }, [files])

    /* logout file session Remove */
    useEffect(() => {
        if (!auth.isAuthenticated) {
            setFiles([])
        }
    }, [auth.isAuthenticated])

    const [openDialogLoginModal, setOpenDialogLoginModal] = useState(false)

    const handleOpenLoginDialog = () => {
        if (auth.isAuthenticated) {
            // router.push('/dashboard').catch(console.error)
            onMoveScroll()
        } else {
            // setOpenDialogLoginModal(true)
            // TEST LOGIN STATE
            router.push('/auth/login').catch(console.error)
        }
    }

    const handleCloseLoginDialog = () => {
        setOpenDialogLoginModal(false)
    }

    /*Service Check */
    const [openDialogServiceCheck, setOpenDialogServiceCheck] = useState(false)

    const handleOpenServiceCheck = () => {
        setOpenDialogServiceCheck(true)
    }

    const handleCloseServiceCheck = () => {
        setOpenDialogServiceCheck(false)
    }

    const handleDismissServiceCheck = () => {
        globalThis.sessionStorage.setItem('dismiss-popup-service-check', 'true')
        setOpenDialogServiceCheck(false)
    }

    useEffect(() => {
        const value = globalThis.sessionStorage.getItem('dismiss-popup-service-check')

        if (initService === 'true' && value !== 'true') {
            setOpenDialogServiceCheck(true)
        }
    }, [initService])

    /* Service Price Intro */
    const [openDialogServiceBillingInfo, setOpenDialogServiceBillingInfo] = useState(false)
    const handleOpenServiceBillingInfo = () => {
        setOpenDialogServiceBillingInfo(true)
    }

    const handleCloseServiceBillingInfo = async () => {
        setOpenDialogServiceBillingInfo(false)
    }

    const handelMoveScroll = async () => {
        await handleCloseServiceBillingInfo()
        await onMoveScroll()
    }

    /*Info Popup*/
    const [openDialogDefaultInfo, setOpenDialogDefaultInfo] = useState(false)
    const handleOpenDefaultInfo = () => {
        setOpenDialogDefaultInfo(true)
    }
    const handleCloseDefaultInfo = async () => {
        setOpenDialogDefaultInfo(false)
    }

    const handleCloseMoveScroll = async () => {
        await handleCloseDefaultInfo()
        await onMoveScroll()
    }

    /*Guide Popup*/
    const [openDialogConvertGuide, setOpenDialogConvertGuide] = useState(false)
    const handleOpenConvertGuide = () => {
        setOpenDialogConvertGuide(true)
    }
    const handleCloseConvertGuide = async () => {
        setOpenDialogConvertGuide(false)
    }

    /*Popup Setting*/
    useEffect(() => {
        if (files.length > 0) {
            handleOpenDefaultInfo()
        }
    }, [files])

    return (
        <>
            <DefaultInfoPopoverInfoConvert 
                onClose={handleCloseMoveScroll} 
                open={openDialogDefaultInfo} 
                title={'변환이 완료되었습니다.'} 
                description={'계속해서 설문지를 만들어보세요!'} 
                event={onMoveScroll} 
            />
            {/* <ServiceCheckPopover
                onClose={handleCloseServiceCheck}
                open={openDialogServiceCheck}
                title={'설문지 파일을 드래그해서 변환해보세요!'}
                // dismiss={handleDismissServiceCheck}
            /> */}
            <ServiceCheckPopover
                onClose={handelMoveScroll}
                open={openDialogServiceBillingInfo}
                title={'결제 후 서비스를 이용해보세요!'}
                // dismiss={handleDismissServiceCheck}
            />
            <ConvertGuidePopover 
                onClose={handleCloseConvertGuide} 
                open={openDialogConvertGuide} 
                title={'변환 방법 가이드'} 
                description={''} 
                buttonName={'닫기'} 
            />
            
            <Box
                id="survey-maker"
                sx={{
                    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                    position: 'relative',
                    pt: 0, // nav바가 이미 HomeSectionTop에 있으므로 패딩 제거
                    pb: 8,
                    minHeight: '100vh',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '120px',
                        background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.08) 0%, transparent 100%)',
                        pointerEvents: 'none',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '100px',
                        background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ pt: 8, pb: 4, width: '100%', maxWidth: 1200 }}>
                        {/* 메인 카드 */}
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '32px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                overflow: 'visible',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 35px 70px rgba(0, 0, 0, 0.15)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '6px',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                    borderRadius: '32px 32px 0 0',
                                },
                                '@keyframes cardGlow': {
                                    '0%, 100%': {
                                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                                    },
                                    '50%': {
                                        boxShadow: '0 25px 50px rgba(102, 126, 234, 0.2)',
                                    },
                                },
                                animation: 'cardGlow 4s ease-in-out infinite',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                {/* 헤더 섹션 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 5,
                                        flexDirection: { xs: 'column', md: 'row' },
                                        textAlign: { xs: 'center', md: 'left' },
                                        gap: { xs: 3, md: 0 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: { xs: 2, sm: 3 },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: { xs: 70, md: 80 },
                                                height: { xs: 70, md: 80 },
                                                borderRadius: '20px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.1) rotate(5deg)',
                                                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: -2,
                                                    left: -2,
                                                    right: -2,
                                                    bottom: -2,
                                                    background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
                                                    borderRadius: '22px',
                                                    zIndex: -1,
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                },
                                                '&:hover::after': {
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            <img 
                                                alt="Survey AI Logo" 
                                                src="/ico/favicon.png" 
                                                width={40} 
                                                height={40}
                                                style={{ 
                                                    transition: 'all 0.3s ease',
                                                }}
                                            />
                                        </Box>
                                        
                                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: 800,
                                                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    mb: 1,
                                                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                클릭만하면 서베이 완성! 🎯
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontWeight: 500,
                                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                                    opacity: 0.8,
                                                }}
                                            >
                                                스마트 설문 제작 플랫폼
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    mt: 2,
                                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                {['🚀 빠른 제작', '📊 실시간 분석', '✨ 간편한 사용'].map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        size="small"
                                                        sx={{
                                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                                            border: '1px solid rgba(102, 126, 234, 0.2)',
                                                            color: '#667eea',
                                                            fontWeight: 600,
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                                                            },
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }} />

                                    <Button
                                        onClick={() => (auth.isAuthenticated ? 
                                            (user?.status == 3 ? 
                                                router.push(`/ws/survey/${createResourceCode()}/${surveyType[0].url}/editor`) : 
                                                setOpenDialogServiceBillingInfo(true)
                                            ) : 
                                            router.push('/auth/login')
                                        )}
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '16px',
                                            px: 4,
                                            py: 2,
                                            fontSize: { xs: '1rem', md: '1.1rem' },
                                            fontWeight: 700,
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            minWidth: { xs: '100%', sm: 'auto' },
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                    >
                                        🎨 온라인 설문 제작
                                    </Button>
                                </Box>

                                {/* 모바일 버튼 */}
                                <Box sx={{ mb: 4, display: { xs: 'block', md: 'none' } }}>
                                    <Button
                                        onClick={() => router.push(auth.isAuthenticated ? `/ws/survey/${createResourceCode()}/${surveyType[0].url}/editor` : '/auth/login')}
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '16px',
                                            py: 2,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        }}
                                    >
                                        🎨 온라인 설문 제작
                                    </Button>
                                </Box>

                                {/* 파일 드롭존 섹션 */}
                                {/* <Box sx={{ mt: 4 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 3,
                                            gap: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                fontSize: { xs: '1.3rem', md: '1.5rem' },
                                            }}
                                        >
                                            📄 PDF 파일을 드래그해서 설문으로 변환하세요
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Button
                                            onClick={handleOpenConvertGuide}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderColor: 'rgba(102, 126, 234, 0.3)',
                                                color: '#667eea',
                                                borderRadius: '12px',
                                                px: 2,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    borderColor: '#667eea',
                                                    background: 'rgba(102, 126, 234, 0.05)',
                                                },
                                            }}
                                        >
                                            📖 가이드
                                        </Button>
                                    </Box> */}
                                    
                                    {/* <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 3,
                                            fontSize: '0.95rem',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        💡 PDF 파일을 업로드하면 자동으로 설문 문항을 추출하고 최적화된 설문지로 변환해드립니다.
                                    </Typography> */}
                                    
                                    {/* <Box
                                        sx={{
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            border: '3px dashed rgba(102, 126, 234, 0.3)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                borderColor: 'rgba(102, 126, 234, 0.6)',
                                                background: 'rgba(102, 126, 234, 0.02)',
                                                transform: 'scale(1.01)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
                                                transition: 'left 0.5s ease',
                                                pointerEvents: 'none',
                                                zIndex: 1,
                                            },
                                            '&:hover::before': {
                                                left: '100%',
                                            },
                                        }}
                                    >
                                        <FileDropzone
                                            accept={{
                                                'application/pdf': [],
                                            }}
                                            files={files}
                                            onDrop={handleDrop}
                                            onRemove={handleRemove}
                                            onRemoveAll={handleRemoveAll}
                                        />
                                    </Box> */}
                                {/* </Box> */}

                                {/* <PDFViewr files={files} openPopup={handleOpenServiceBillingInfo} /> */}

                                {/* 로그인 오버레이 */}
                                {!auth.isAuthenticated && files.length > 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexFlow: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            top: 0,
                                            left: 0,
                                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 41, 59, 0.9) 100%)',
                                            backdropFilter: 'blur(15px)',
                                            borderRadius: '32px',
                                            zIndex: 999,
                                            opacity: 0,
                                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                maxWidth: 500,
                                                px: 4,
                                            }}
                                        >
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    mb: 2,
                                                    fontWeight: 700,
                                                    lineHeight: 1.3,
                                                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                                                }}
                                            >
                                                🚀 1%의 시간만 쓰세요
                                            </Typography>
                                            
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    textAlign: 'center',
                                                    mb: 4,
                                                    fontWeight: 500,
                                                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                                                }}
                                            >
                                                99%는 저희가 해드립니다
                                            </Typography>
                                            
                                            <Button
                                                onClick={handleOpenLoginDialog}
                                                size="large"
                                                variant="contained"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    borderRadius: '20px',
                                                    px: 6,
                                                    py: 2.5,
                                                    fontSize: '1.2rem',
                                                    fontWeight: 700,
                                                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        transform: 'translateY(-3px) scale(1.05)',
                                                        boxShadow: '0 20px 45px rgba(102, 126, 234, 0.5)',
                                                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                    },
                                                }}
                                            >
                                                ✨ 서비스 이용하기
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* 하단 서비스 특징 섹션 */}
                        <Box
                            sx={{
                                mt: 8,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: { xs: 2, md: 4 },
                                flexWrap: 'wrap',
                            }}
                        >
                            {[
                                { 
                                    number: '24/7', 
                                    label: '서비스 이용',
                                    icon: '🕐',
                                    description: '언제든지 접속 가능'
                                },
                                { 
                                    number: '100%', 
                                    label: '반응형 지원',
                                    icon: '📱',
                                    description: '모든 기기 최적화'
                                },
                                { 
                                    number: '실시간', 
                                    label: '데이터 분석',
                                    icon: '📊',
                                    description: '즉시 결과 확인'
                                },
                            ].map((stat, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        textAlign: 'center',
                                        p: { xs: 3, md: 4 },
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '20px',
                                        backdropFilter: 'blur(15px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        minWidth: { xs: '140px', md: '180px' },
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.05)',
                                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                                            background: 'rgba(255, 255, 255, 1)',
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: `linear-gradient(90deg, ${
                                                index === 0 ? '#667eea' : 
                                                index === 1 ? '#764ba2' : '#f093fb'
                                            }, transparent)`,
                                            borderRadius: '20px 20px 0 0',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '2rem', md: '2.5rem' },
                                            mb: 1,
                                        }}
                                    >
                                        {stat.icon}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 800,
                                            color: index === 0 ? '#667eea' : index === 1 ? '#764ba2' : '#f093fb',
                                            mb: 1,
                                            fontSize: { xs: '1.5rem', md: '1.8rem' },
                                        }}
                                    >
                                        {stat.number}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 600,
                                            mb: 0.5,
                                            fontSize: { xs: '0.9rem', md: '1rem' },
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {stat.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* 추가 기능 소개 섹션 */}
                        <Box
                            sx={{
                                mt: 10,
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                🌟 왜 우리 서비스를 선택해야 할까요?
                            </Typography>
                            
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 4,
                                    mt: 6,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {[
                                    {
                                        icon: '📱',
                                        title: '완벽한 반응형 디자인',
                                        description: '데스크톱, 태블릿, 모바일 모든 기기에서 최적화된 설문 경험을 제공합니다.',
                                    },
                                    {
                                        icon: '📊',
                                        title: '실시간 데이터 분석',
                                        description: '설문 응답을 실시간으로 수집하고 즉시 차트와 통계로 확인할 수 있습니다.',
                                    },
                                ].map((feature, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 4,
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            transition: 'all 0.3s ease',
                                            width: { xs: '100%', sm: '300px', md: '350px' },
                                            maxWidth: '400px',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                                                background: 'rgba(255, 255, 255, 1)',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h2"
                                            sx={{ fontSize: '3rem', mb: 2 }}
                                        >
                                            {feature.icon}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 2,
                                                color: 'text.primary',
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.secondary',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    )
}