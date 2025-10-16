import { Fragment, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { UuidTool } from 'uuid-tool'
import {
    Badge,
    Box,
    Button,
    Container,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import { wait } from '@utils/wait'
import API from '@utils/API'
import { autoHypenCard, autoHypenCardWithSecret } from '@utils/auto-format'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { AuthGuard } from '@components/auth/auth-guard'

import { IconLogin } from '@public/votg/IconLogin'

/*Import Component*/
import PopupWarningWithCancel_ChangePassword from '@components/popup/popup-warning-with-cancel'
import PopupWarningWithCancel_DeleteAccount from '@components/popup/popup-warning-with-cancel'

const PopupAccountUserPasswdChange = (props) => {
    const { onClose, open, ...other } = props

    const isMounted = useMounted()
    const router = useRouter()
    const { user, logout } = useAuth()
    // console.log('user', UuidTool.toString(user?.code?.data).replace(/-/g, ''))

    // Parameter
    /* Page State */
    const [pageStep, setPageStep] = useState(0)
    /* Form State */
    const [isPhoneExist, setPhoneExist] = useState(false)
    const [sendCode, setSendCode] = useState(false)
    const [sendError, setSendError] = useState(false)
    const [verifyComplete, setVerifyComplete] = useState(false)
    const [verifyError, setVerifyError] = useState(false)

    useEffect(() => {
        setPageStep(0)
        setPhoneExist(false)
        setSendCode(false)
        setSendError(false)
        setVerifyComplete(false)
        setVerifyError(false)
    }, [open])

    const onClickSendCode = useCallback(async (phone) => {
        setPhoneExist(false)
        setSendError(false)
        const res = await API.post('auth/sendCodeSENS', {
            phoneNumber: phone,
        })
        // const res = await API.post('auth/sendCodeTW', {
        //     phoneNumber: phone,
        // })
        console.log('onClickSendCode Result', res)
        if (res?.isSuccess === true) {
            setSendCode(true)
        } else {
            setSendError(true)
        }
    })

    const onClickVerify = useCallback(async (phone, code) => {
        const res = await API.post('auth/verifyNumberSENS', {
            phoneNumber: phone,
            verifyCode: code,
        })
        // console.log('onClickVerify Result', res)
        if (res?.isSuccess === true) {
            setVerifyError(false)
            setVerifyComplete(true)
            await wait(1000)
            setPageStep(1)
        } else {
            setVerifyError(true)
        }
    })

    /* Form Setting */
    const formik = useFormik({
        initialValues: {
            name: user?.name,
            phone: user?.phone,
            code: '',
            password: '',
            passwordcheck: '',
            submit: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required('이름을 입력해주세요.'),
            phone: Yup.string()
                .max(255)
                .required('휴대폰 번호를 입력해주세요.')
                .matches(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/, '올바른 휴대폰 번호를 입력해주세요.'),
            code: Yup.string().min(6, '인증코드 6자리를 입력해주세요.').max(6, '인증코드 6자리를 입력해주세요.').required('인증코드를 입력해주세요.'),
            password: Yup.string()
                .min(7, '비밀번호는 7자 이상이어야 합니다.')
                .max(255, '암호 확인은 최대 255자여야 합니다.')
                .required('비밀번호를 입력해주세요.')
                .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~@$!%*#?&^>/<])[A-Za-z\d`~@$!%*#?&^>/<]{8,}$/, '대소문자, 숫자 및 특수 문자 하나 이상을 포함 필수'),
            passwordcheck: Yup.string()
                .required('동일한 비밀번호를 입력해주세요.')
                .oneOf([Yup.ref('password'), null], '동일한 비밀번호를 입력해주세요.'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const uuidString = UuidTool.toString(user?.code?.data).replace(/-/g, '')
                // console.log('uuidString', uuidString)
                const res = await API.post('auth/change/passwd', {
                    UserCode: uuidString,
                    password: values.password,
                })

                if (isMounted()) {
                    if (res.isSuccess) {
                        // console.log('res', res)
                        toast.success('변경되었습니다.')
                        await wait(1000)
                        alert('변경된 비밀번호로 다시 로그인 부탁드립니다.')
                        await logout()
                        // return true
                        router.push('/auth/login').catch(console.error)
                    } else {
                        toast.error('변경하는데 문제가 있습니다.')
                        // return false
                    }
                }
            } catch (error) {
                if (isMounted()) {
                    helpers.setStatus({ success: false })
                    helpers.setErrors({ submit: error.message })
                    helpers.setSubmitting(false)
                }
            }
        },
    })

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            // onClose={onClose}
            open={!!open}
            {...other}
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose(event, reason)
                }
            }}
        >
            <>
                <DialogTitle sx={{ mt: 2 }}>비밀번호 변경</DialogTitle>
                <DialogContent>
                    {/* Input Value */}
                    <form noValidate onSubmit={formik.handleSubmit}>
                        {pageStep === 0 && (
                            <>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        mt: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            border: (theme) => `1px solid ${theme.palette.divider}`,
                                            borderRadius: 20,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 'fontWeightBold' }} variant="subtitle1">
                                            1
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ ml: 2 }} variant="subtitle1">
                                        본인인증
                                    </Typography>
                                </Box>
                                <TextField
                                    error={Boolean(formik.touched.name && formik.errors.name)}
                                    fullWidth
                                    helperText={formik.touched.name && formik.errors.name}
                                    label={'이름'}
                                    margin="normal"
                                    name="name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    disabled
                                />
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{
                                        justifyContent: 'center',
                                        alignItems: 'top',
                                    }}
                                >
                                    <Grid item xs={9}>
                                        <TextField
                                            // disabled={sendCode}
                                            error={Boolean(formik.touched.phone && formik.errors.phone)}
                                            fullWidth
                                            helperText={formik.touched.phone && formik.errors.phone}
                                            label={'휴대폰 번호'}
                                            margin="normal"
                                            name="phone"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.phone}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            disabled={Boolean(formik.errors.name || formik.errors.phone) || sendCode}
                                            fullWidth
                                            size="large"
                                            type="button"
                                            sx={{ padding: 1.5, mt: 2 }}
                                            variant="outlined"
                                            onClick={() => onClickSendCode(formik.values.phone)}
                                        >
                                            전송
                                        </Button>
                                    </Grid>
                                </Grid>
                                {sendCode && (
                                    <>
                                        <Typography color="textSecondary" variant="caption">
                                            {'인증번호를 받지 못하셨나요? '}
                                            <Button
                                                size="saml"
                                                type="button"
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 400,
                                                    lineHeight: 1,
                                                }}
                                                onClick={() => onClickSendCode(formik.values.phone)}
                                            >
                                                {'인증번호 재전송'}
                                            </Button>
                                        </Typography>
                                    </>
                                )}

                                {sendCode && (
                                    <>
                                        <TextField
                                            error={Boolean(formik.touched.code && formik.errors.code)}
                                            fullWidth
                                            helperText={formik.touched.code && formik.errors.code}
                                            label={'인증 번호'}
                                            margin="normal"
                                            name="code"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.code}
                                        />

                                        {verifyError && (
                                            <Box sx={{ mb: 2 }}>
                                                <FormHelperText error>{'인증번호가 올바르지 않습니다.'}</FormHelperText>
                                            </Box>
                                        )}

                                        {verifyComplete && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography color="text.main" variant="caption">
                                                    {'인증되었습니다.'}
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                )}
                                <Box sx={{ mt: 2 }}>
                                    <Button disabled={Boolean(formik.errors.code)} fullWidth size="large" type="button" variant="contained" onClick={() => onClickVerify(formik.values.phone, formik.values.code)}>
                                        {'확인'}
                                    </Button>
                                </Box>
                                {isPhoneExist && <FormHelperText error>{'이미 가입된 정보입니다.'}</FormHelperText>}
                                {sendError && <FormHelperText error>{'인증문자 발송 오류. 새로고침 후 가입 부탁드립니다.'}</FormHelperText>}
                            </>
                        )}
                        {pageStep === 1 && (
                            <>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        mt: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            border: (theme) => `1px solid ${theme.palette.divider}`,
                                            borderRadius: 20,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 'fontWeightBold' }} variant="subtitle1">
                                            2
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ ml: 2 }} variant="subtitle1">
                                        새로운 비밀번호
                                    </Typography>
                                </Box>

                                <TextField
                                    error={Boolean(formik.touched.password && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password && formik.errors.password}
                                    label={'비밀번호'}
                                    margin="normal"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.password}
                                    disabled={!verifyComplete}
                                />
                                <TextField
                                    error={Boolean(formik.touched.passwordcheck && formik.errors.passwordcheck)}
                                    fullWidth
                                    helperText={formik.touched.passwordcheck && formik.errors.passwordcheck}
                                    label={'비밀번호 확인'}
                                    margin="normal"
                                    name="passwordcheck"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.passwordcheck}
                                    disabled={!verifyComplete}
                                />
                            </>
                        )}
                        {formik.errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{formik.errors.submit}</FormHelperText>
                            </Box>
                        )}
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
                                onClick={() => {
                                    onClose()
                                    formik.resetForm()
                                }}
                                color="free"
                            >
                                취소
                            </Button>
                            {verifyComplete && (
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <Button type="submit" size="large" variant="contained" color="free" disabled={!formik.isValid}>
                                        변경하기
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </form>
                </DialogContent>
            </>
        </Dialog>
    )
}

PopupAccountUserPasswdChange.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PopupAccountUserPasswdChange.getLayout = (page) => <AuthGuard>{page}</AuthGuard>

export default PopupAccountUserPasswdChange
