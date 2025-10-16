import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { UuidTool } from 'uuid-tool'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { useAuth } from '@hooks/use-auth'
import axios from 'axios'
import { wait } from '@utils/wait'
import API from '@utils/API'
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
    Tabs,
    Tab,
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
    ImageList,
    ImageListItem,
    ImageListItemBar,
    CircularProgress,
} from '@mui/material'

/* M Icon */
import SouthIcon from '@mui/icons-material/South'
import BackspaceIcon from '@mui/icons-material/Backspace'

/* Import Component */
import { CardList } from '@components/payment/card-list'
//Card List
import { CardListSelected } from '@components/payment/card-list-selected'

//BASE
import { PropertyList } from '@components/base/property-list'
import { PropertyListItem } from '@components/base/property-list-item'

//Util
import { formatPrice } from '@utils/auto-format'

const typeOptions = [
    {
        title: '일반결제',
        value: 'general',
    },
    {
        title: '등록한 카드로 결제',
        value: 'registed',
    },
]

const RewardPaymentRequest = (props) => {
    const { selectedReward, handleChangeReward } = props
    const { selectedCategory, setSelectedCategory, selectedItem, setSelectedItem, requestNumber, setRequestNumber, orderCode, setOrderCode } = props
    const { user } = useAuth()
    const router = useRouter()
    const { code, type } = router.query
    const theme = useTheme()
    const middleDevice = useMediaQuery(theme.breakpoints.down('md'))
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    // Payment Init : Iamport & Payjoa
    useEffect(() => {
        /* Chai iamport */
        const { IMP } = window
        IMP.init('imp61484477') // 예: imp00000000
    }, [])
    /*
     * Billing Setting
     */
    const [isLoading, setIsLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [billingAgree, setBillingAgree] = useState(false)

    const onChangeRequestNumber = (value) => {
        handleChangeReward('count', parseInt(value))
        if (value > 0 && selectedReward?.item !== '') {
            setTotalProductPrice(value * selectedReward?.item.CPN_PRICE)
        } else {
            setTotalProductPrice(0)
        }
    }
    const [totalProductPrice, setTotalProductPrice] = useState(0)
    useEffect(() => {
        if (selectedReward?.count > 0 && selectedReward?.item !== '') {
            setTotalProductPrice(selectedReward?.count * selectedReward?.item?.CPN_PRICE)
        } else {
            setTotalProductPrice(0)
        }
    }, [selectedReward])

    /* Payment Method */
    const [billingMethodType, setBillingMethodType] = useState(typeOptions[0].value)
    const handleBillingMethodChange = (selectedType) => {
        setBillingMethodType(selectedType)
        if (selectedType == 'general') {
            setBillingCardNumber('')
        } else {
            if (user?.payment.length) {
                setBillingCardNumber(user?.payment[0].cardNumber)
            }
        }
    }

    /* Card Number */
    const [billingCardNumber, setBillingCardNumber] = useState(user?.payment.length ? user?.payment[0]?.cardNumber : '')
    const handleBillingCardNumberChange = (selectedCardNumber) => {
        setBillingCardNumber(selectedCardNumber)
    }

    /* Progress Control */
    const [nextButtonDisable, setNextButtonDisable] = useState(true)
    useEffect(() => {
        if ((billingMethodType == typeOptions[1].value && (!billingAgree || billingCardNumber == '')) || (billingMethodType == typeOptions[0].value && !billingAgree)) {
            setNextButtonDisable(true)
        } else {
            setNextButtonDisable(false)
        }
    }, [billingMethodType, billingAgree, billingCardNumber])

    /* Billing Middle Process */
    /* Random Number */
    const shuffleArray = (array) => {
        return array.sort((a, b) => {
            return 0.5 - Math.random()
        })
    }
    /* Random Passwd*/
    const [billingKeypad, setBillingKeypad] = useState([])
    useEffect(() => {
        setBillingKeypad(shuffleArray(Array.from(Array(10).keys())))
    }, [])

    //* Biilling Info */
    const [billingPasswd, setBillingPasswd] = useState([])
    const [billingSubscribe, setBillingSubscribe] = useState(true)
    // useEffect(() => {
    //     console.log(billingPasswd)
    // }, [billingPasswd])

    const handleBillingPasswdChange = (e, value) => {
        e.preventDefault()
        if (billingPasswd.length >= 6) {
            alert('비밀번호는 6자리 모두 입력하셨습니다.')
        } else {
            setBillingPasswd([...billingPasswd, value])
        }
    }

    const deleteAllPasswd = (e) => {
        e.preventDefault()
        setBillingPasswd([])
    }

    const deletePasswdDigit = (e) => {
        e.preventDefault()
        setBillingPasswd(billingPasswd.slice(0, billingPasswd.length - 1))
    }

    /* Page Billing */
    const pageNext = async (e) => {
        e.preventDefault()
        if (billingMethodType == typeOptions[0].value) {
            // console.log(billing)
            // alert(`일반결제`)
            setPageNumber(2)
            // const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')

            var actionURL = 'https://ssl.payjoa.co.kr/card/DaouCardMng.jsp'
            // var pf = document.frmConfirm
            // pf.target = '_self'
            // pf.action = fileName
            // pf.method = 'post'
            // pf.submit()

            try {
                // console.log('result', res)
                var pf = document.payForm
                var formData = new FormData(pf)

                var PAYJOA = window.open('', 'PAYJOA', 'width=468,height=750')
                pf.target = 'PAYJOA'
                pf.action = actionURL
                pf.method = 'post'
                console.log('pf', pf)
                const userCode = formData.get('USERID')
                const orderCode = formData.get('ORDERNO')
                const orderName = formData.get('PRODUCTNAME')
                const price = formData.get('AMOUNT')
                // console.log(userCode)
                // console.log(orderNo)
                // const { UserCode, orderCode, orderType, orderName, price } = req.body
                const biillingRequestInfo = {
                    UserCode: user?.code.data,
                    orderCode: orderCode,
                    orderType: 2,
                    orderName: orderName,
                    price: price,
                    orderCount: parseInt(selectedReward?.count),
                    productNumber: selectedReward?.item?.NO_REQ,
                }
                await wait(500)
                const resBillingRequest = await API.post('payment/cachedBilling', biillingRequestInfo)
                console.log('resBillingRequest', resBillingRequest)
                if (Boolean(resBillingRequest.isSuccess)) {
                    pf.submit()
                    let checkStatusInterval = setInterval(async () => {
                        const requestStatus = await API.post('payment/checkout/status', biillingRequestInfo)
                        // console.log('requestStatus', requestStatus)
                        // console.log('PAYJOA', PAYJOA.opener, PAYJOA.opener.closed)
                        if (requestStatus?.payload?.result === null) {
                            clearInterval(checkStatusInterval)
                            PAYJOA.close()
                            await wait(500)
                            alert(`결제 시간이 초과하였습니다.`)
                            setPageNumber(0)
                        } else if (requestStatus?.payload?.result === true) {
                            clearInterval(checkStatusInterval)
                            alert(`결제가 완료되었습니다.`)
                            router.push(`/ws/survey/${code}/${type}/share`).catch(console.error)
                        } else if (PAYJOA.opener == undefined || requestStatus?.payload?.result === false) {
                            clearInterval(checkStatusInterval)
                            await wait(500)
                            alert(`결제 실패하였습니다.\n다시 시도부탁드리겠습니다.`)
                            setPageNumber(0)
                        }
                    }, 1000)
                } else {
                    alert(`결제오류\n다시 시도부탁드리겠습니다.\n`)
                    setPageNumber(0)
                    PAYJOA.close()
                    router.refresh()
                }
            } catch (error) {
                console.log('error', error)
            }
        } else {
            setPageNumber(1)
        }
    }

    const pageBack = (e) => {
        e.preventDefault()
        setPageNumber(0)
        setBillingPasswd([])
        setBillingKeypad(shuffleArray(Array.from(Array(10).keys())))
    }

    // Regist Card Submit Button
    const handleSubmit = async (e) => {
        e.preventDefault()

        const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')

        const biillingPasswdCheck = {
            UserCode: user?.code.data,
            billingPasswd: billingPasswd.join(''),
        }
        // console.log('BillingDataRebuild', cardBillingDataRebuild)

        setIsLoading(true)
        await wait(500)
        const resPasswdCheck = await API.post('payment/passwdCheck', biillingPasswdCheck)
        if (!resPasswdCheck.isSuccess) {
            alert(`비밀번호가 올바르지 않습니다.`)
            setBillingKeypad(shuffleArray(Array.from(Array(10).keys())))
            setBillingPasswd([])
            setIsLoading(false)
            return
        }
        // console.log('totalProductPrice', totalProductPrice)

        const biillingRequestInfo = {
            UserCode: user?.code.data,
            customerUid: uuidString,
            cardNumber: billingCardNumber,
            billingPasswd: billingPasswd.join(''),
            merchantUid: selectedReward?.code,
            orderType: `2`,
            orderName: `[리워드]${selectedReward?.item?.NM_GOODS} ${selectedReward?.count}개`,
            // price: `100`,
            price: `${totalProductPrice}`,
            orderCount: parseInt(selectedReward?.count),
            productNumber: selectedReward?.item?.NO_REQ,
        }
        await wait(500)
        const resBillingRequest = await API.post('payment/payBilling', biillingRequestInfo)
        // console.log('billingRequest', resBillingRequest)
        if (resBillingRequest.isSuccess) {
            setIsLoading(false)
            alert(`결제가 완료되었습니다.`)
            router.push(`/ws/survey/${code}/${type}/reward`).catch(console.error)
        } else {
            alert(`결제정보가 올바르지 않거나, 결제가 취소되습니다.\n다시 시도부탁드리겠습니다.\n`)
            setIsLoading(false)
            pageBack(e)
            setBillingCardNumber('')
        }
    }

    return (
        <>
            {user?.code && (
                <div style={{ display: 'none' }}>
                    <form name="payForm" acceptCharset="EUC-KR">
                        <input name="TYPE" defaultValue="P" />
                        <input name="PAYMETHOD" defaultValue="CARD" />
                        <input name="CPID" defaultValue="CMP67647" />
                        <input name="ORDERNO" defaultValue={selectedReward?.code} />
                        <input name="PRODUCTTYPE" defaultValue="1" />
                        <input name="BILLTYPE" defaultValue="1" />
                        <input name="TAXFREECD" defaultValue="00" />
                        <input name="AMOUNT" value={totalProductPrice} onChange={() => console.log} />
                        {/* <input name="AMOUNT"  defaultValue={`100`}  /> */}
                        <input name="PRODUCTNAME" value={`[리워드]${selectedReward?.item?.NM_GOODS} ${selectedReward?.count}개`} onChange={() => console.log} />
                        <input name="USERID" defaultValue={UuidTool.toString(user?.code.data).replace(/-/g, '')} />
                        {/* ENDOF */}
                        <input name="HOMEURL" defaultValue="" />
                        <input name="CLOSEURL" defaultValue="" />
                        <input name="FAILURL" defaultValue="" />
                    </form>
                </div>
            )}
            {/* PAGE 0 : Product Setting */}
            {pageNumber === 0 && (
                <Box
                    sx={{
                        backgroundColor: 'background.white',
                        marginTop: mobileDevice ? '0px' : '30px',
                    }}
                >
                    <Card>
                        <CardHeader
                            // action={
                            //     <IconButton>
                            //         <AddIcon fontSize="small" />
                            //     </IconButton>
                            // }
                            title={'리워드 예상 견적'}
                        />
                        <Divider />

                        <CardContent>
                            <Box sx={{ mt: 0, ml: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                fontWeight: '400',
                                                mb: 1,
                                            }}
                                        >
                                            응답자수
                                        </Typography>
                                        <Box
                                            sx={{
                                                mt: 0,
                                                mx: -1,
                                            }}
                                        >
                                            <TextField fullWidth required label="" name="requestNumber" onChange={(e) => onChangeRequestNumber(e.target.value)} placeholder="ex) 100" inputProps={{ maxLength: 19 }} value={selectedReward?.count || 0} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                fontWeight: '400',
                                                mb: 1,
                                            }}
                                        >
                                            상품 상세
                                        </Typography>
                                        <Box
                                            sx={{
                                                border: 1,
                                                borderColor: 'divider',
                                                borderRadius: 1,
                                                mt: 0,
                                                mx: -1,
                                            }}
                                        >
                                            <PropertyList>
                                                <PropertyListItem align="horizontal" divider label="상품명" value={selectedReward?.item ? `${selectedReward?.item.NM_GOODS}` : `상품을 선택해주세요`} />
                                                <PropertyListItem align="horizontal" divider label="사용처" value={selectedReward?.item ? `${selectedReward?.item.NM_GOODS_COMPANY}` : ``} />
                                                <PropertyListItem align="horizontal" label="상품금액" value={selectedReward?.item ? `${formatPrice(selectedReward?.item.CPN_PRICE)}원` : `0원`} />
                                                <PropertyListItem align="horizontal" label="산출금액" value={selectedReward?.item ? `${formatPrice(selectedReward?.item.CPN_PRICE)} x ${selectedReward?.count}` : `0원`} />
                                                <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="" value={`= ${formatPrice(totalProductPrice)}원`} />
                                                {/* <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="VAT(10%)" value={`+ ${formatPrice(parseInt(billingInfo.saleprice?.replace(/,/g, '')) / 10)} x ${12}`} /> */}
                                                {/* <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="" value={`= ${formatPrice(billing.price)}원`} /> */}
                                            </PropertyList>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                fontWeight: '400',
                                                mb: 1,
                                            }}
                                        >
                                            결제 수단
                                        </Typography>
                                        <Box>
                                            {typeOptions.map((typeOption, index) => (
                                                <Box key={typeOption.value} sx={{ mb: 2 }}>
                                                    {index === 1 && (
                                                        <>
                                                            <Typography color="primary.main" sx={{ fontSize: ' 0.7rem', mb: 1, my: 1 }}>
                                                                <SouthIcon sx={{ width: '0.7rem', fontSize: '0.7rem', mt: 0.5 }} />
                                                                카드를 등록하시면 리워드 지급 등, 부가서비스를 편리하게 이용할 수 있습니다.
                                                            </Typography>
                                                        </>
                                                    )}
                                                    <Card
                                                        key={typeOption.value}
                                                        sx={{
                                                            alignItems: 'center',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            p: 2,
                                                            ...(billingMethodType === typeOption.value && {
                                                                borderColor: 'primary.main',
                                                                borderWidth: 2,
                                                                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                                                m: '-1px',
                                                            }),
                                                            // background: '#444',
                                                        }}
                                                        onClick={() => handleBillingMethodChange(typeOption.value)}
                                                        variant="outlined"
                                                    >
                                                        <Radio checked={billingMethodType === typeOption.value} color="primary" />
                                                        <Box sx={{ ml: 2 }}>
                                                            <Typography variant="subtitle1">{typeOption.title}</Typography>
                                                            <Typography color="textSecondary" variant="body2">
                                                                {typeOption.description}
                                                            </Typography>
                                                        </Box>
                                                    </Card>
                                                </Box>
                                            ))}

                                            <Collapse in={billingMethodType === 'registed'}>
                                                <CardListSelected size="small" selected={billingCardNumber} onSelected={handleBillingCardNumberChange} sx={{ transition: 'all 0.5s ease-in' }} />
                                            </Collapse>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                fontWeight: '400',
                                                mb: 1,
                                            }}
                                        >
                                            최종 결제 금액 (VAT 포함)
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'primary.main',
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {`${formatPrice(totalProductPrice)}원`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                fontWeight: '400',
                                                mb: 1,
                                            }}
                                        >
                                            결제 동의
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexFlow: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                ml: -1,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Checkbox size="small" checked={billingAgree} name="billing-agress" onChange={() => setBillingAgree(!billingAgree)} />
                                            <Typography
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '400',
                                                }}
                                                onClick={() => setBillingAgree(!billingAgree)}
                                            >
                                                주문 내용을 확인하였으며, 상품구매에 관한 <a>안내사항</a>에 동의합니다.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                mt: 5,
                                            }}
                                        >
                                            {/* <Button
                                                                sx={{
                                                                    mr: 2,
                                                                }}
                                                                // variant="outlined"
                                                                onClick={pageClose}
                                                            >
                                                                취소
                                                            </Button> */}
                                            <Box sx={{ m: 1, position: 'relative' }}>
                                                <Button size="large" variant="contained" disabled={nextButtonDisable || totalProductPrice == 0} onClick={(e) => pageNext(e)}>
                                                    결제하기
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
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
            {/* PAGE 1 : Product Password Typing */}
            {pageNumber === 1 && (
                <Box
                    sx={{
                        backgroundColor: 'background.white',
                        marginTop: mobileDevice ? '0px' : '30px',
                    }}
                >
                    <Card>
                        <CardHeader
                            // action={
                            //     <IconButton>
                            //         <AddIcon fontSize="small" />
                            //     </IconButton>
                            // }
                            title={'결제 비밀번호 입력'}
                        />
                        <Divider />

                        <CardContent>
                            {/* Input Value */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography sx={{ mt: 1, color: 'text.secondary' }} variant="h6" textAlign="center">
                                    {user?.name}
                                    {' 님'}
                                </Typography>
                                <Typography sx={{ mt: 1, color: 'text.black' }} variant="h5" textAlign="center">
                                    비밀번호를 입력해주세요
                                </Typography>
                                <Grid container spacing={1} sx={{ px: 3, my: { sm: 6, xs: 0 } }}>
                                    {Array.from(Array(6).keys()).map((v, index) => {
                                        return (
                                            <Grid
                                                key={`passwd-box-${index}`}
                                                item
                                                xs={2}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    variant="filled"
                                                    // type="password"
                                                    // onChange={handleBillingPasswdChange}
                                                    value={billingPasswd.length > index ? '*' : ''}
                                                    disabled
                                                    sx={{
                                                        '&>div': {
                                                            textAlign: 'center',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.08)!important',
                                                        },

                                                        '&>div>input': {
                                                            paddingBlock: {
                                                                sm: '1rem',
                                                                xs: '0',
                                                            },
                                                            paddingInline: '0rem',
                                                            fontSize: '2rem',
                                                            textAlign: 'center',
                                                        },
                                                        '&>div:before': {
                                                            display: 'none',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                                <Divider sx={{ my: 3 }} />
                                <Grid container spacing={1}>
                                    {billingKeypad.map((v, index) => {
                                        if (index == 9) {
                                            return (
                                                <Fragment key={`passwd-key-${index}`}>
                                                    <Grid
                                                        item
                                                        xs={4}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Button sx={{ fontSize: '0.8rem' }} onClick={(e) => deleteAllPasswd(e)}>
                                                            전체삭제
                                                        </Button>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={4}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Button sx={{ fontSize: '1.2rem' }} onClick={(e) => handleBillingPasswdChange(e, v)}>
                                                            {v}
                                                        </Button>
                                                    </Grid>

                                                    <Grid
                                                        item
                                                        xs={4}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Button
                                                            sx={{
                                                                fontSize: '1.2rem',
                                                            }}
                                                            onClick={(e) => deletePasswdDigit(e)}
                                                        >
                                                            <BackspaceIcon />
                                                        </Button>
                                                    </Grid>
                                                </Fragment>
                                            )
                                        } else {
                                            return (
                                                <Grid
                                                    key={`passwd-key-${index}`}
                                                    item
                                                    xs={4}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Button type="submit" sx={{ fontSize: '1.2rem' }} onClick={(e) => handleBillingPasswdChange(e, v)}>
                                                        {v}
                                                    </Button>
                                                </Grid>
                                            )
                                        }
                                    })}
                                </Grid>
                            </Box>
                            {/* Modal Button */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    mt: 5,
                                }}
                            >
                                <Button
                                    sx={{
                                        mr: 2,
                                    }}
                                    // variant="outlined"
                                    onClick={(e) => pageBack(e)}
                                >
                                    뒤로가기
                                </Button>
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <Button size="large" variant="contained" disabled={isLoading || billingPasswd.length !== 6} onClick={handleSubmit}>
                                        결제하기
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
                        </CardContent>
                    </Card>
                </Box>
            )}
            {/* PAGE 2 : Product General Buying Loading  */}
            {pageNumber === 2 && (
                <Box
                    sx={{
                        backgroundColor: 'background.white',
                        marginTop: mobileDevice ? '0px' : '30px',
                    }}
                >
                    <Card>
                        <CardHeader
                            // action={
                            //     <IconButton>
                            //         <AddIcon fontSize="small" />
                            //     </IconButton>
                            // }
                            title={'결제 진행중...'}
                        />
                        <Divider />

                        <CardContent>
                            {/* Input Value */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography sx={{ mt: 1, color: 'text.secondary' }} variant="h6" textAlign="center">
                                    {user?.name}
                                    {' 님'}
                                </Typography>
                                <Typography sx={{ mt: 1, color: 'text.black' }} variant="h5" textAlign="center">
                                    결제 진행 중 ...
                                </Typography>
                                <Divider sx={{ my: 5 }} />
                                <Grid container spacing={1} sx={{ px: 0, my: 5 }}>
                                    <CircularProgress
                                        size={50}
                                        sx={{
                                            color: 'primary.main',
                                            position: 'relative',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-25px',
                                            marginLeft: '-25px',
                                        }}
                                    />
                                </Grid>
                            </Box>
                            {/* Modal Button */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    mt: 5,
                                }}
                            >
                                <Button
                                    sx={{
                                        mr: 2,
                                    }}
                                    // variant="outlined"
                                    onClick={(e) => pageBack(e)}
                                >
                                    뒤로가기
                                </Button>
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <Button size="large" variant="contained" onClick={handleSubmit}>
                                        결제완료
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
                        </CardContent>
                    </Card>
                </Box>
            )}
        </>
    )
}

export default RewardPaymentRequest
