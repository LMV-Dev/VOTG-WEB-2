import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import axios from 'axios'
import { UuidTool } from 'uuid-tool'
import { Badge, Box, Button, Collapse, Card, Checkbox, Container, CircularProgress, Dialog, DialogTitle, DialogContent, Divider, FormControlLabel, Grid, IconButton, InputAdornment, TextField, Typography, Radio, Paper, Switch } from '@mui/material'
import { alpha } from '@mui/material/styles'
import BackspaceIcon from '@mui/icons-material/Backspace'
import { wait } from '@utils/wait'
import API from '@utils/API'

//Icons
import SouthIcon from '@mui/icons-material/South'
import { autoHypenCard, autoHypenCardWithSecret } from '@utils/auto-format'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { AuthGuard } from '@components/auth/auth-guard'
import { X as XIcon } from '@components/icons/x'

//BASE
import { PropertyList } from '@components/base/property-list'
import { PropertyListItem } from '@components/base/property-list-item'
//Card List
import { CardListSelected } from '@components/payment/card-list-selected'
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

const BillingPopover = (props) => {
    const { orderType, selected, billingInfo, returnUrl, onClose, open, ...other } = props
    const [isLoading, setIsLoading] = useState(false)
    // const [showResults, setShowResults] = useState(false)

    const isMounted = useMounted()
    const router = useRouter()
    const { user } = useAuth()

    // Payment Init : Iamport & Payjoa
    useEffect(() => {
        /* Chai iamport */
        const { IMP } = window
        IMP.init('imp61484477') // 예: imp00000000
    }, [])

    // console.log('billingInfo', billingInfo)
    //* Biilling Info */
    const [billing, setBilling] = useState({
        name: '',
        nameColor: '#000',
        monthPrice: 0,
        price: 0,
    })
    useEffect(() => {
        setBilling({
            name: `${billingInfo.name} ${orderType == 'plan' && '서비스'}`,
            nameColor: billingInfo.nameColor,
            eachPrice: billingInfo.saleprice,
            price: parseInt(billingInfo.saleprice?.replace(/,/g, '')) * parseInt(billingInfo?.month) + (parseInt(billingInfo.saleprice?.replace(/,/g, '')) * parseInt(billingInfo?.month)) / 10,
        })
    }, [billingInfo])

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
    const [billingCardNumber, setBillingCardNumber] = useState(user?.payment?.length ? user?.payment[0]?.cardNumber : '')
    const handleBillingCardNumberChange = (selectedCardNumber) => {
        setBillingCardNumber(selectedCardNumber)
    }

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

    /* PageNation NextButton */
    const [billingAgree, setBillingAgree] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [nextButtonDisable, setNextButtonDisable] = useState(true)

    useEffect(() => {
        if ((billingMethodType == typeOptions[1].value && (!billingAgree || billingCardNumber == '')) || (billingMethodType == typeOptions[0].value && !billingAgree)) {
            setNextButtonDisable(true)
        } else {
            setNextButtonDisable(false)
        }
    }, [billingAgree, billingCardNumber])

    const pageClose = (e) => {
        e.preventDefault()
        setPageNumber(0)
        setBillingAgree(false)
        setBillingKeypad(shuffleArray(Array.from(Array(10).keys())))
        setBillingCardNumber('')
        onClose()
    }

    const pageNext = async (e) => {
        e.preventDefault()
        if (billingMethodType == typeOptions[0].value) {
            // console.log(billing)
            // alert(`일반결제`)
            setPageNumber(2)
            const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')

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
                console.log(pf)
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
                    orderType: 0,
                    orderName: orderName,
                    price: price,
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
                            router.push('/ws/payment')
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
                // console.log('error', error)
            }

            /*Iamport Payment Sync*/
            // IMP.request_pay(
            //     {
            //         // param
            //         pg: 'nice',
            //         pay_method: 'card',
            //         merchant_uid: orderType + '-' + uuidString.slice(0, 24) + '-' + Date.now(),
            //         name: billing.name,
            //         amount: 1000,
            //         buyer_name: user?.name,
            //         buyer_tel: user?.phone,
            //         buyer_addr: user?.address_road + ',' + user?.address_detail,
            //         buyer_postcode: user?.address_zip,
            //     },
            //     async (rsp) => {
            //         // console.log('billingRequest', rsp)
            //         if (rsp.success) {
            //             pageClose(e)
            //             alert(`결제가 완료되었습니다.`)
            //             router.push(returnUrl)
            //         } else {
            //             alert(
            //                 `결제정보가 올바르지 않거나, 결제가 취소되습니다.\n다시 시도부탁드리겠습니다.\n`,
            //             )
            //             pageBack(e)
            //             setBillingCardNumber('')
            //         }
            //     },
            // )
        } else {
            setPageNumber(1)
        }
    }

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

        const biillingRequestInfo = {
            UserCode: user?.code.data,
            customerUid: uuidString,
            cardNumber: billingCardNumber,
            billingPasswd: billingPasswd.join(''),
            merchantUid: orderType + '-' + uuidString.slice(0, 24) + '-' + Date.now(),
            orderType: orderType,
            orderName: billing.name,
            price: billing.price, // billing.price
        }
        await wait(500)
        const resBillingRequest = await API.post('payment/payBilling', biillingRequestInfo)
        // console.log('billingRequest', resBillingRequest)
        if (resBillingRequest.isSuccess) {
            setIsLoading(false)
            pageClose(e)
            alert(`결제가 완료되었습니다.`)
            router.push(returnUrl).catch(console.error)
        } else {
            alert(`결제정보가 올바르지 않거나, 결제가 취소되습니다.\n다시 시도부탁드리겠습니다.\n`)
            setIsLoading(false)
            pageBack(e)
            setBillingCardNumber('')
        }
    }

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            // onClose={pageClose}
            open={!!open}
            {...other}
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    pageClose(event, reason)
                }
            }}
        >
            {user?.code && (
                <div style={{ display: 'none' }}>
                    <form name="payForm" accept-charset="EUC-KR">
                        <input name="TYPE" defaultValue="P" />
                        <input name="PAYMETHOD" defaultValue="CARD" />
                        <input name="CPID" defaultValue="CMP67647" />
                        <input name="ORDERNO" defaultValue={`order-${UuidTool.toString(user?.code.data).replace(/-/g, '').slice(0, 24)}-${Date.now()}`} />
                        <input name="PRODUCTTYPE" defaultValue="1" />
                        <input name="BILLTYPE" defaultValue="1" />
                        <input name="TAXFREECD" defaultValue="00" />
                        <input name="AMOUNT" defaultValue={billing.price} />
                        {/* <input name="AMOUNT" defaultValue={`1000`} /> */}
                        <input name="PRODUCTNAME" defaultValue={billing.name} />
                        <input name="USERID" defaultValue={UuidTool.toString(user?.code.data).replace(/-/g, '')} />
                        {/* ENDOF */}
                        <input name="HOMEURL" defaultValue="" />
                        <input name="CLOSEURL" defaultValue="" />
                        <input name="FAILURL" defaultValue="" />
                    </form>
                </div>
            )}
            {pageNumber === 0 && (
                <>
                    <DialogTitle sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', px: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontWeight: 700 }}>결제정보</Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton edge="end" onClick={pageClose}>
                                <XIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        {/* </Tooltip> */}
                    </DialogTitle>
                    <DialogContent>
                        {/* Input Value */}
                        <Box sx={{ mt: 1, ml: 1 }}>
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
                                        상품명
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: billing.nameColor || '#000',
                                            fontSize: '1.3rem',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {billing?.name}
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
                                        결제 상세
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
                                            <PropertyListItem align="horizontal" divider label="이용기간" value={`${billingInfo?.month}개월`} />
                                            <PropertyListItem align="horizontal" divider label="상품가격" value={`월 ${billing.eachPrice}원 (VAT 미포함)`} />
                                            <PropertyListItem align="horizontal" label="산출금액" value={`${billing.eachPrice} x ${billingInfo?.month} `} />
                                            <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="VAT(10%)" value={`+ ${formatPrice(parseInt(billingInfo.saleprice?.replace(/,/g, '')) / 10)} x ${billingInfo?.month}`} />
                                            <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="" value={`= ${formatPrice(billing.price)}원`} />
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
                                        정기결제 여부
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Grid item xs={3}>
                                            <Switch defaultChecked value={billingSubscribe} onChange={() => setBillingSubscribe(!billingSubscribe)} />
                                        </Grid>

                                        <Typography
                                            sx={{
                                                color: billingSubscribe ? 'primary.main' : 'text.secondary',
                                                fontSize: '1rem',
                                                fontWeight: billingSubscribe ? '700' : '400',
                                            }}
                                        >
                                            정기결제 {billingSubscribe ? 'O' : 'X'}
                                        </Typography>
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
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                        }}
                                    >
                                        {`${formatPrice(billing?.price)}원`}
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
                                onClick={pageClose}
                            >
                                취소
                            </Button>
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button size="large" variant="contained" disabled={nextButtonDisable} onClick={(e) => pageNext(e)}>
                                    다음
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
                    </DialogContent>
                </>
            )}
            {pageNumber === 1 && (
                <>
                    <DialogTitle sx={{ mt: 2 }}>결제 비밀번호 입력</DialogTitle>

                    <DialogContent>
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
                    </DialogContent>
                </>
            )}
            {pageNumber === 2 && (
                <>
                    <DialogTitle sx={{ mt: 2 }}>일반 결제</DialogTitle>

                    <DialogContent>
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
                    </DialogContent>
                </>
            )}
        </Dialog>
    )
}

BillingPopover.propTypes = {
    orderType: PropTypes.string,
    billingInfo: PropTypes.object,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

BillingPopover.getLayout = (page) => <AuthGuard>{page}</AuthGuard>

export default BillingPopover
