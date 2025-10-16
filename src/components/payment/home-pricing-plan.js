import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import propTypes from 'prop-types'
import { UuidTool } from 'uuid-tool'
import { useMediaQuery, Grid, Box, Button, Divider, Typography, Card } from '@mui/material'
import { useAuth } from '@hooks/use-auth'

//Popup
import ServiceCheckPopover from '@components/popovers/popover-service-check'
import BillingPopover from '@components/popovers/popover-billing'

const plans = [
    // {
    //     name: 'Free',
    //     textColor: '#333333',
    //     features: ['기능 제한 없음', '2개월 변환 2회', '총 응답 300명'],
    // },
    {
        name: 'Starter',
        textColor: '#7E97FF',
        price: '49,000',
        saleprice: '11,000',
        month: 6,
        features: ['기능 제한 없음', '6개월간 표본 300건 발송', '총 변환  20 페이지'],
        highlight: ['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 400개 동일)'],
        highlightColor: ['#fff', '#FFF500', '#fff'],
        description: '',
    },
    {
        name: 'Standard',
        textColor: '#4994FF',
        price: '79,000',
        saleprice: '59,000',
        month: 12,
        features: ['기능 제한 없음', '연간 표본 3,000건 발송', '총 변환 100 페이지'],
        highlight: ['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 2,000개 동일)'],
        highlightColor: ['#fff', '#FFF500', '#fff'],
        description: '',
    },
    {
        name: 'Professional',
        textColor: '#2AC5DE',
        price: '159,000',
        saleprice: '99,000',
        month: 12,
        features: ['기능 제한 없음', '연간 표본 6,000건 발송', '총 변환  200 페이지', '설문 설계, 문항 선정', '리포트 1회 50% 할인'],
        highlight: ['', '', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 4,000개 동일)', '(별도 문의)'],
        highlightColor: ['#fff', '#fff', '#FFF500', '#fff', '#fff'],
        event: ['', '', '', '', '론칭기념 이벤트'],
        eventColor: ['#fff', '#fff', '#fff', '#fff', '#FFF500'],
        description: '',
    },
]

export const PricingPlan = (props) => {
    const auth = useAuth()
    const { user } = useAuth()
    const router = useRouter()
    const initSelected = router.query.selected
    const { name, textColor, focusColor, bgColor, cta, price, saleprice, unit, description, features, highlight, highlightColor, event, eventColor, image, popular, sx, select, ...other } = props

    const [openDialog, setOpenDialog] = useState(false)

    const handleOpenLoginDialog = () => {
        if (auth.isAuthenticated && auth.survey) {
            // const fileName = globalThis.sessionStorage.getItem('set-file-cache')
            // console.log('PricingPlan', fileName)
            // if (select === 0) {
            //     if (globalThis.sessionStorage.getItem('set-file-cache') === null) {
            //         handleOpenServiceCheck()
            //     } else {
            //         router.push(`/project/service/${fileName}`).catch(console.error)
            //     }
            // } else {
            //     handleOpenBillingDialog(select)
            // }
            handleOpenBillingDialog(select)
        } else {
            // setOpenDialog(true)
            // TEST LOGIN STATE
            router.push(`/auth/login?returnUrl=/?init=${true}`).catch(console.error)
            // if (select === 0) {
            //     router.push(`/auth/login?returnUrl=/?init=${true}`).catch(console.error)
            // } else {
            //     router.push(`/auth/login?returnUrl=/?selected=${select}`).catch(console.error)
            // }
        }
    }

    const handleCloseLoginDialog = () => {
        setOpenDialog(false)
    }

    // Dialog
    const [selected, setSelected] = useState(0)

    const [openDialogPlanSelect, setOpenDialogPlanSelect] = useState(false)

    const handleOpenBillingDialog = (select) => {
        setSelected(select)
        setOpenDialogPlanSelect(true)
    }

    const handleCloseBillingDialog = () => {
        setOpenDialogPlanSelect(false)
    }

    useEffect(() => {
        if (initSelected === select.toString() && initSelected !== '0') {
            handleOpenBillingDialog(initSelected)
        }
    }, [select])

    /*Service Check */
    const [openDialogServiceCheck, setOpenDialogServiceCheck] = useState(false)

    const handleOpenServiceCheck = async () => {
        setOpenDialogServiceCheck(true)
    }

    const handleCloseServiceCheck = async () => {
        setOpenDialogServiceCheck(false)
    }

    return (
        <>
            <ServiceCheckPopover
                onClose={handleCloseServiceCheck}
                open={openDialogServiceCheck}
                title={'설문지 파일을 변환후 이용가능합니다.'}
                // dismiss={handleDismissServiceCheck}
            />
            <BillingPopover orderType="plan" selected={selected} billingInfo={plans[selected]} returnUrl={`/project/service/`} onClose={handleCloseBillingDialog} open={openDialogPlanSelect} />

            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: bgColor,
                    ...sx,
                }}
                {...other}
            >
                <Box sx={{ p: 3 }}>
                    <Box>
                        <Typography sx={{ mt: 1, color: textColor, fontSize: '2.3rem', fontWeight: 700 }} textAlign="center">
                            {name}
                        </Typography>
                        <Box
                            sx={{
                                background: '#fff',
                                // my: 1,
                                height: '2px',
                                mx: 5,
                            }}
                        />
                    </Box>
                    {/* <Box
                    sx={{
                        height: 52,
                        width: 52,
                        '& img': {
                            height: 'auto',
                            width: '100%',
                        },
                    }}
                >
                    <img alt="" src={image} />
                </Box> */}
                    {unit ? (
                        <>
                            <Box>
                                <Typography
                                    color="#AAA"
                                    textAlign="center"
                                    sx={{
                                        fontSize: '1.1rem',
                                        fontWeight: 400,
                                        pt: 2,
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    {`ㅤ`}
                                    {unit} {price}
                                    {`ㅤ`}
                                </Typography>
                                <Typography
                                    color={textColor}
                                    textAlign="center"
                                    sx={{
                                        fontSize: '1.8rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {unit} {saleprice}
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box>
                                <Typography
                                    color={textColor}
                                    textAlign="center"
                                    sx={{
                                        fontSize: '1.3rem',
                                        fontWeight: 400,
                                        pt: 2,
                                    }}
                                >{`ㅤ`}</Typography>
                                <Typography
                                    color={textColor}
                                    textAlign="center"
                                    sx={{
                                        fontSize: '1.8rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    체험하기
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        px: { md: 3, sm: 5, xs: '10px' },
                        pt: 5,
                        pb: 3,
                    }}
                >
                    {features.map((feature, fIndex) => (
                        <Box
                            key={feature}
                            sx={{
                                alignItems: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                '& + &': {
                                    mt: 0,
                                },
                                justifyContent: 'left',
                                mb: 0,
                            }}
                        >
                            {/* <CheckIcon fontSize="small" sx={{ color: 'text.primary' }} /> */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                                <Typography
                                    color={textColor}
                                    sx={{
                                        fontSize: '1.2rem',
                                        lineHeight: '2',
                                        fontWeight: 400,
                                        ml: { sm: 1, xs: '5px' },
                                    }}
                                >
                                    ・ {feature}
                                </Typography>
                                {event !== undefined && (
                                    <Box sx={{ color: eventColor[fIndex], fontSize: '0.8rem', fontWeight: 700, ml: '2px' }}>
                                        {/* {event[fIndex] !== '' && <img alt="" src="/icons/yellowStar.png" style={{ position: 'relative', width: '10px', height: 'auto' }} />} */}
                                        {event[fIndex]}
                                    </Box>
                                )}
                            </Box>

                            {highlight !== undefined && (
                                <>
                                    <Typography color={highlightColor[fIndex]} sx={{ mt: 0, ml: { sm: 4, xs: 3 }, fontSize: '0.8rem', fontWeight: 500 }}>
                                        {highlight[fIndex]}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    ))}
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography color={textColor} sx={{ mt: 2 }} variant="body2">
                        {description}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                            px: { md: 2, sm: 1, xs: '10px' },
                        }}
                    >
                        <Button
                            onClick={handleOpenLoginDialog}
                            fullWidth
                            variant={popular ? 'contained' : 'outlined'}
                            sx={{
                                color: '#fff',
                                fontSize: '1.5rem',
                                fontWeight: 500,
                                ml: 0,
                                backgroundColor: !(auth.isAuthenticated && auth.survey) ? '#000' : focusColor,
                                borderColor: !(auth.isAuthenticated && auth.survey) ? '#000' : focusColor,
                                borderRadius: '5px',
                                '&:hover': {
                                    borderColor: 'transparent',
                                    backgroundColor: !(auth.isAuthenticated && auth.survey) ? '#000' : focusColor,
                                    // backgroundColor: !(auth.isAuthenticated && auth.survey) ? `#0000000F` : `${bgColor} + '0F'`,
                                    opacity: 0.8,
                                },
                            }}
                        >
                            {cta}
                        </Button>
                    </Box>
                </Box>
            </Card>
        </>
    )
}

PricingPlan.propTypes = {
    name: propTypes.string.isRequired,
    cta: propTypes.string.isRequired,
    features: propTypes.array.isRequired,
    popular: propTypes.bool,
    sx: propTypes.object,
}

export const PriceingFree = () => {
    const theme = useTheme()
    const deviceUp = useMediaQuery(theme.breakpoints.up('md'))
    const auth = useAuth()
    const { user } = useAuth()
    const router = useRouter()

    const handleOpenLoginDialog = () => {
        if (auth.isAuthenticated && auth.survey) {
            const fileName = globalThis.sessionStorage.getItem('set-file-cache')
            // console.log('PricingPlan', fileName)
            if (globalThis.sessionStorage.getItem('set-file-cache') === null) {
                handleOpenServiceCheck()
            } else {
                router.push(`/ws/survey/${fileName}/cnvt/convert`).catch(console.error)
            }
        } else {
            // setOpenDialog(true)
            // TEST LOGIN STATE
            router.push(`/auth/login?returnUrl=/?init=${true}`).catch(console.error)
            // if (select === 0) {
            //     router.push(`/auth/login?returnUrl=/?init=${true}`).catch(console.error)
            // } else {
            //     router.push(`/auth/login?returnUrl=/?selected=${select}`).catch(console.error)
            // }
        }
    }

    /*Service Check */
    const [openDialogServiceCheck, setOpenDialogServiceCheck] = useState(false)

    const handleOpenServiceCheck = async () => {
        setOpenDialogServiceCheck(true)
    }

    const handleCloseServiceCheck = async () => {
        setOpenDialogServiceCheck(false)
    }

    return (
        <>
            <ServiceCheckPopover
                onClose={handleCloseServiceCheck}
                open={openDialogServiceCheck}
                title={'설문지 파일을 변환후 이용가능합니다.'}
                // dismiss={handleDismissServiceCheck}
            />
            <Grid container>
                <Grid item md={12} xs={12}>
                    {deviceUp ? (
                        <>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#fff',
                                    height: '100%',
                                    mx: 'auto',
                                    px: 3,
                                    py: 2,
                                }}
                            >
                                <Grid container>
                                    <Grid item xs={3}>
                                        <Box>
                                            <Typography sx={{ mt: 1, color: '#000', fontSize: '2rem', fontWeight: 700 }} textAlign="center">
                                                체험하기
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Box>
                                            <Typography sx={{ color: '#000', fontSize: '1rem', fontWeight: 500 }} textAlign="center">
                                                {['기능 제한 없음', '계정 당 1회 한정', '2회 발송', '배포 시 20개 응답 수집 가능'].map((feature, fIndex) => (
                                                    <>
                                                        {feature}
                                                        {fIndex !== 3 && <>, </>}
                                                    </>
                                                ))}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box>
                                            <Button
                                                onClick={handleOpenLoginDialog}
                                                fullWidth
                                                variant={false ? 'contained' : 'outlined'}
                                                sx={{
                                                    color: '#fff',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 500,
                                                    ml: 0,
                                                    backgroundColor: !(auth.isAuthenticated && auth.survey) ? '#000' : 'primary.main',
                                                    borderColor: !(auth.isAuthenticated && auth.survey) ? '#000' : 'primary.main',
                                                    borderRadius: '5px',
                                                    '&:hover': {
                                                        borderColor: 'transparent',
                                                        backgroundColor: !(auth.isAuthenticated && auth.survey) ? '#000' : 'primary.main',
                                                        // backgroundColor: !(auth.isAuthenticated && auth.survey) ? `#0000000F` : `${bgColor} + '0F'`,
                                                        opacity: 0.8,
                                                    },
                                                }}
                                            >
                                                {!(auth.isAuthenticated && auth.survey) ? '회원가입' : '체험하기'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        </>
                    ) : (
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#fff',
                                height: '100%',
                                maxWidth: { md: '100%', xs: 460 },
                                mx: 'auto',
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Typography sx={{ mt: 1, color: '#000', fontSize: '2rem', fontWeight: 700 }} textAlign="center">
                                    체험하기
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ p: 3 }}>
                                {['기능 제한 없음', '계정 당 1회 한정', '2회 발송', '배포 시 20개 응답 수집 가능'].map((feature, fIndex) => (
                                    <Box
                                        key={feature}
                                        sx={{
                                            alignItems: 'left',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '& + &': {
                                                mt: 0,
                                            },
                                            justifyContent: 'left',
                                            mb: 0,
                                        }}
                                    >
                                        {/* <CheckIcon fontSize="small" sx={{ color: 'text.primary' }} /> */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                                            <Typography
                                                color={'#000'}
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    lineHeight: '2',
                                                    fontWeight: 400,
                                                    ml: { sm: 1, xs: '5px' },
                                                }}
                                            >
                                                ・ {feature}
                                            </Typography>
                                            {event !== undefined && (
                                                <Box sx={{ color: '#000', fontSize: '0.8rem', fontWeight: 700, ml: '2px' }}>
                                                    {/* {event[fIndex] !== '' && <img alt="" src="/icons/yellowStar.png" style={{ position: 'relative', width: '10px', height: 'auto' }} />} */}
                                                    {event[fIndex]}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                                <Box sx={{ flexGrow: 1 }} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 6,
                                        px: { md: 2, sm: 1, xs: '10px' },
                                    }}
                                >
                                    <Button
                                        onClick={handleOpenLoginDialog}
                                        fullWidth
                                        variant={false ? 'contained' : 'outlined'}
                                        sx={{
                                            color: '#fff',
                                            fontSize: '1.5rem',
                                            fontWeight: 500,
                                            ml: 0,
                                            backgroundColor: !(auth.isAuthenticated && auth.survey) ? '#000' : 'primary.main',
                                            borderColor: !(auth.isAuthenticated && auth.survey) ? '#000' : 'primary.main',
                                            borderRadius: '5px',
                                            '&:hover': {
                                                borderColor: 'transparent',
                                                backgroundColor: !(auth.isAuthenticated && auth.survey) ? '#000' : 'primary.main',
                                                // backgroundColor: !(auth.isAuthenticated && auth.survey) ? `#0000000F` : `${bgColor} + '0F'`,
                                                opacity: 0.8,
                                            },
                                        }}
                                    >
                                        {!(auth.isAuthenticated && auth.survey) ? '회원가입' : '체험하기'}
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </>
    )
}
