import { useEffect, useState } from 'react'
import { useMediaQuery, Box, Button, IconButton, Card, CardContent, Divider, Grid, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// Auth
import { useAuth } from '@hooks/use-auth'
import { useCookies } from 'react-cookie'

//Icon
import DownloadIcon from '@mui/icons-material/Download'

//Popup
import BillingPopover from '@components/popovers/popover-billing'

const plans = [
    {
        name: '체험',
        nameColor: '#333333',
        features: ['기능 제한 없음', '변환 2회', '총 응답 300명'],
    },
    {
        name: 'Starter',
        textColor: '#7E97FF',
        price: '49,000',
        saleprice: '11,000',
        month: 6,
        features: ['기능 제한 없음', '6개월간 표본 300건 발송', '총 변환 20 페이지'],
        highlight: ['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 400개 동일)'],
        highlightColor: ['#fff', '#FFF500', '#FFF500'],
        description: '',
    },
    {
        name: 'Standard',
        textColor: '#4994FF',
        price: '79,000',
        saleprice: '59,000',
        month: 12,
        features: ['기능 제한 없음', '연간 표본 3,000건 발송', '총 변환  100 페이지'],
        highlight: ['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 2,000개 동일)'],
        highlightColor: ['#fff', '#FFF500', '#FFF500'],
        description: '',
    },
    {
        name: 'Professional',
        textColor: '#2AC5DE',
        price: '159,000',
        saleprice: '99,000',
        month: 12,
        features: ['기능 제한 없음', '연간 표본 6,000건 발송', '총 변환  200 페이지', '설문 설계, 문항 선정', '리포트 1회 50% 할인'],
        highlight: ['', '(카카오톡, 문자 메시지 설문 배포 가능)', '(당사제공 양식기준, 연간 문항수 4,000개 동일)', '', '(별도 문의)'],
        highlightColor: ['#fff', '#FFF500', '#FFF500', '#fff', '#FFF500'],
        event: ['', '', '', '', '론칭기념 이벤트'],
        eventColor: ['#fff', '#fff', '#fff', '#fff', '#FFF500'],
        description: '',
    },
]

export const PlanSelect = (props) => {
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))
    // To get the user from the authContext, you can use
    const { user } = useAuth()
    const [cookie, setCookie, rmCookie] = useCookies()

    const [selected, setSelected] = useState(0)

    const [upgradeDiabled, setUpgradeDiabled] = useState(true)

    useEffect(() => {
        setUpgradeDiabled(user?.status === 3 && user?.type === selected - 1)
    }, [user, selected])

    // console.log('PlanSelect', user.type)

    // Dialog
    const [openDialog, setOpenDialog] = useState(false)

    const handleOpenBillingDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseBillingDialog = () => {
        setOpenDialog(false)
    }

    return (
        <>
            <BillingPopover orderType="plan" billingInfo={plans[selected]} returnUrl={'/ws/payment'} onClose={handleCloseBillingDialog} open={openDialog} />
            <div {...props}>
                <Card>
                    <CardContent>
                        <div>
                            <Typography variant="h6">서비스 업그레이드</Typography>
                            <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                                기능에 따라 원하시는 플랜을 사용해보세요!
                            </Typography>
                        </div>
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                {plans.map((plan, index) => {
                                    if (index > 0) {
                                        return (
                                            <Grid item key={plan.name} md={4} xs={12}>
                                                <Card
                                                    elevation={0}
                                                    onClick={() => setSelected(index)}
                                                    variant="outlined"
                                                    sx={{
                                                        cursor: 'pointer',
                                                        ...(selected === index && {
                                                            borderColor: 'primary.main',
                                                            borderWidth: 2,
                                                            m: '-1px',
                                                        }),
                                                        minHeight: '280px',
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Box
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            <Typography variant="h6" color={plan.nameColor}>
                                                                {plan.name}
                                                            </Typography>
                                                            {user?.status === 3 && user?.type === index - 1 && (
                                                                <Typography color="success.main" variant="caption">
                                                                    사용중
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                mb: 1,
                                                                mt: 1,
                                                            }}
                                                        >
                                                            <Typography variant="h5">{plan.saleprice == undefined ? `무료` : `월 ${plan.saleprice}원`}</Typography>

                                                            <Typography
                                                                color="textSecondary"
                                                                sx={{
                                                                    mt: 'auto',
                                                                    ml: '4px',
                                                                    textDecoration: 'line-through',
                                                                }}
                                                                variant="body2"
                                                            >
                                                                {plan.price == undefined ? `` : `월 ${plan.price}원`}
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                mb: 1,
                                                                mt: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                color="secondary"
                                                                sx={{
                                                                    mt: -0.5,
                                                                    ml: 0.5,
                                                                    fontSize: '0.6rem',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                VAT 미포함
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ mt: 2 }} />
                                                        {plan.features.map((feature) => (
                                                            <Box
                                                                key={feature}
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    display: 'flex',
                                                                    '& + &': {
                                                                        mt: 0,
                                                                    },
                                                                }}
                                                            >
                                                                {/* <CheckIcon fontSize="small" sx={{ color: 'text.primary' }} /> */}
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 500,
                                                                        ml: 0.5,
                                                                    }}
                                                                >
                                                                    ・ {feature}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                        <Box sx={{ flexGrow: 1 }} />
                                                        <Typography
                                                            color="#AAA"
                                                            sx={{
                                                                mt: 2,
                                                                fontSize: '0.6rem',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {plan.description}
                                                        </Typography>
                                                        <Box sx={{ flexGrow: 1 }} />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    }
                                })}
                            </Grid>
                        </Box>
                        <Divider
                            sx={{
                                mb: 3,
                                mt: 3,
                            }}
                        />

                        {/* <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                mb: 4,
                                mt: 3,
                            }}
                        >
                            <Typography color="textSecondary" variant="body2">
                                구독을 한번 결제한 후에는 약정에 따라 서비스를 {` `}
                                <Link href="#" underline="none">
                                    변경
                                </Link>
                                할 수 있습니다.
                            </Typography>
                        </Box> */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button variant="contained" disabled={upgradeDiabled} onClick={handleOpenBillingDialog}>
                                업그레이드
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                {/* <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <div>
                            <Typography variant="h6">결제 내역</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                모든 결제내역의 인보이스를 다운받을 수 있습니다. 방금 결제한 경우
                                아래 표에 표시되는 데 시간이 걸릴 수 있습니다.
                            </Typography>
                        </div>
                    </CardContent>
                    {!mobileDevice ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">날짜</TableCell>
                                    <TableCell align="center">내역</TableCell>
                                    <TableCell align="center">결제 금액 (VAT 포함)</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">2022.08.01</TableCell>
                                    <TableCell align="center">뷰즈온더고 BASIC</TableCell>
                                    <TableCell align="center">598,000원</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            sx={{
                                                display: 'flex',
                                                flexFlow: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                            }}
                                            onClick={() => console.log('인보이스 다운로드')}
                                        >
                                            인보이스
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">내역</TableCell>
                                    <TableCell align="center">결제 금액 (V.A.T 포함)</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography
                                            sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                                        >
                                            2022.08.01
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.9rem' }}>
                                            뷰즈온더고 BASIC
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">598,000원</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => console.log('인보이스 다운로드')}
                                        >
                                            <DownloadIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </Card> */}
            </div>
        </>
    )
}
