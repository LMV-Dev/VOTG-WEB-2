import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { UuidTool } from 'uuid-tool'
import { Badge, Box, Button, Container, CircularProgress, Dialog, DialogTitle, DialogContent, Divider, Grid, IconButton, InputAdornment, TextField, Typography, Paper } from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import { wait } from '@utils/wait'
import API from '@utils/API'
import { autoHypenCard, autoHypenCardWithSecret } from '@utils/auto-format'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { AuthGuard } from '@components/auth/auth-guard'

import { IconLogin } from '@public/votg/IconLogin'

const PaymentAddPopover = (props) => {
    const { returnUrl, onClose, open, ...other } = props
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // const [showResults, setShowResults] = useState(false)

    const isMounted = useMounted()
    const router = useRouter()
    const { user } = useAuth()

    //* Biilling Info */
    const [billing, setBilling] = useState({
        cardNickName: '',
        cardNumber: '',
        cardExpirationMonth: '',
        cardExpirationYear: '',
        pwd2Digit: '',
        customer_uid: '',
        birthday: '',
    })

    const handleBillingChange = (event) => {
        setBilling((prevBilling) => {
            if (event.target.name == 'cardNumber') {
                event.target.value = autoHypenCard(event.target.value)
            }
            return {
                ...prevBilling,
                [event.target.name]: event.target.value.replace(/\s/g, ''),
            }
        })
    }
    const [nextButtonDisable, setNextButtonDisable] = useState(true)
    useEffect(() => {
        if (billing.cardNickName == '' || billing.cardNumber == '' || billing.cardExpirationMonth == '' || billing.cardExpirationYear == '' || billing.pwd2Digit == '') {
            setNextButtonDisable(true)
        } else {
            setNextButtonDisable(false)
        }
    }, [billing])

    /* Imamport */
    useEffect(() => {
        if (user?.payment.length !== 0) {
            setPaymentExist(true)
        } else {
            setPaymentExist(false)
        }
    }, [user])

    /* Random Number */
    const shuffleArray = (array) => {
        return array.sort((a, b) => {
            return 0.5 - Math.random()
        })
    }
    /* Pagenation & Passwd*/
    const [paymentExist, setPaymentExist] = useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [billingKeypad, setBillingKeypad] = useState([])
    useEffect(() => {
        setBillingKeypad(shuffleArray(Array.from(Array(10).keys())))
    }, [])

    //* Biilling Info */
    const [billingPasswd, setBillingPasswd] = useState([])
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

    const pageNext = async (e) => {
        e.preventDefault()
        if (billing.cardNickName == '' || billing.cardNumber == '' || billing.cardExpirationMonth == '' || billing.cardExpirationYear == '' || billing.pwd2Digit == '') {
            // console.log(billing)
            alert(`카드정보를 정확히 입력 부탁드립니다.`)
            return
        }

        const exCard = await API.get('payment/check', {
            UserCode: user?.code.data,
            cardNumber: billing.cardNumber,
        })
        if (!exCard.isSuccess) {
            // console.log('exCard Payment', exCard)
            alert(`이미 등록된 카드 입니다.`)
            return
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
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (billing.cardNickName == '' || billing.cardNumber == '' || billing.cardExpirationMonth == '' || billing.cardExpirationYear == '' || billing.pwd2Digit == '') {
            // console.log(billing)
            alert(`카드정보를 정확히 입력 부탁드립니다.`)
            return
        }
        const exCard = await API.get('payment/check', {
            UserCode: user?.code.data,
            cardNumber: billing.cardNumber,
        })
        if (!exCard.isSuccess) {
            // console.log('exCard Payment', exCard)
            alert(`이미 등록된 카드 입니다.`)
            return
        }

        const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')

        const cardBillingDataRebuild = {
            ...billing,
            UserCode: user?.code.data,
            customerUid: uuidString,
            cardExpiration: '20' + billing.cardExpirationYear + billing.cardExpirationMonth,
            birthday: user?.birthday.replace(/-/g, '').substr(2, 6),
            billingPasswd: billingPasswd.join(''),
        }
        // console.log('BillingDataRebuild', cardBillingDataRebuild)

        const res = await API.post('payment/issueBilling', cardBillingDataRebuild)
        // const res = await API.post('imp/issueBilling', cardBillingDataRebuild)
        // const res = await API.post('imp/onetimeBilling', cardBillingDataRebuild)
        setIsLoading(true)
        // Do search here
        await wait(1500)
        setIsLoading(false)
        // console.log('issueBilling', res)
        if (res.isSuccess) {
            setBilling({
                cardNickName: '',
                cardNumber: '',
                cardExpirationMonth: '',
                cardExpirationYear: '',
                pwd2Digit: '',
                customer_uid: '',
                birthday: '',
            })
            onClose()
            alert(`카드가 등록되었습니다.`)
            router.reload(returnUrl)
        } else {
            alert(`카드 정보가 올바르지 않습니다.`)
        }
    }

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            // onClose={onClose}
            open={!!open}
            {...other}
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose(event, reason)
                    setBillingKeypad(shuffleArray(Array.from(Array(10).keys())))
                }
            }}
        >
            {pageNumber === 0 ? (
                <>
                    <DialogTitle sx={{ mt: 2 }}>결제카드 등록</DialogTitle>
                    <DialogContent>
                        {/* Input Value */}
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="카드이름" name="cardNickName" onChange={handleBillingChange} value={billing.cardNickName} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="카드번호" name="cardNumber" onChange={handleBillingChange} placeholder="XXXX-XXXX-XXXX-XXXX" inputProps={{ maxLength: 19 }} value={billing.cardNumber} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.8rem',
                                            fontWeight: '400',
                                            ml: 1,
                                            mt: 1,
                                        }}
                                    >
                                        카드 유효기간
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth required label="월 MM" name="cardExpirationMonth" onChange={handleBillingChange} placeholder="MM" inputProps={{ maxLength: 2 }} value={billing.cardExpirationMonth} />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth required label="년도 YY" name="cardExpirationYear" onChange={handleBillingChange} placeholder="YY" inputProps={{ maxLength: 2 }} value={billing.cardExpirationYear} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="카드 비밀번호 앞 두자리" name="pwd2Digit" onChange={handleBillingChange} placeholder="**" inputProps={{ maxLength: 2 }} value={billing.pwd2Digit} type="password" />
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
                                onClick={onClose}
                            >
                                취소
                            </Button>
                            {paymentExist ? (
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <Button size="large" variant="contained" disabled={isLoading} onClick={handleSubmit}>
                                        등록하기
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
                            ) : (
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
                            )}
                        </Box>
                    </DialogContent>
                </>
            ) : (
                <>
                    <DialogTitle sx={{ mt: 2 }}>결제 비밀번호 등록</DialogTitle>

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
                                6자리 비밀번호 설정해주세요
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
                                    등록하기
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

PaymentAddPopover.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PaymentAddPopover.getLayout = (page) => <AuthGuard>{page}</AuthGuard>

export default PaymentAddPopover
