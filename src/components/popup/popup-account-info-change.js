import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
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
import PopupAccountAdmPasswdChange from '@components/popup/popup-account-adm-passwd-change'

const PopupAccountInfoChange = (props) => {
    const { accountInfo, returnUrl, onClose, open, ...other } = props

    // console.log('accountInfo', accountInfo)

    const isMounted = useMounted()
    const router = useRouter()
    const { user } = useAuth()

    // Parameter
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    //* Account Info */
    const [accountInfoData, setAccountInfoData] = useState(accountInfo)
    useEffect(() => {
        setAccountInfoData(accountInfo)
    }, [accountInfo, open])

    // useEffect(() => {
    //     console.log('accountInfoData', accountInfoData)
    // }, [accountInfoData])

    // OnChange
    const handleAccountInfoChange = (event) => {
        setAccountInfoData((prev) => {
            // console.log('prev', prev)
            let changeValue = null
            if (typeof event.target.value === 'string') {
                changeValue = event.target.value.replace(/\s/g, '')
            } else {
                changeValue = event.target.value
            }
            return {
                ...prev,
                [event.target.name]: changeValue,
            }
        })
    }
    // Submit
    const event_ChangeAccountInfo = async () => {
        try {
            // console.log('accountInfoData', accountInfoData)
            const uuidString = UuidTool.toString(accountInfoData?.code?.data).replace(/-/g, '')

            const res = await API.post('auth/change/info', {
                UserCode: uuidString,
                name: accountInfoData.name,
                phone: accountInfoData.phone.replace('-', ''),
                email: accountInfoData.email,
                mode: accountInfoData.mode,
                status: accountInfoData.status,
            })
            if (res.code === 402) {
                toast.error('이미 존재하는 이메일 주소입니다.')
                return false
            }
            if (res.isSuccess) {
                // console.log('res', res)
                toast.success('변경되었습니다.')
                return true
            } else {
                toast.error('변경하는데 문제가 있습니다.')
                return false
            }
        } catch (err) {
            console.error(err)
            toast.error('변경하는데 문제가 있습니다.')
        }
    }
    const handleChangeAccountEvent = async () => {
        await event_ChangeAccountInfo().then((res) => {
            if (res) {
                onClose()
                router.reload('/adm')
            }
        })
    }

    /*Popup*/
    // ChangePassword
    const [openDialogWarning_ChangePassword, setopenDialogWarning_ChangePassword] = useState(false)
    const handleOpenWarning_ChangePassword = () => {
        setopenDialogWarning_ChangePassword(true)
    }
    const handleCloseWarning_ChangePassword = async () => {
        setopenDialogWarning_ChangePassword(false)
    }

    //Delete Account
    const [openDialogWarning_DeleteAccount, setopenDialogWarning_DeleteAccount] = useState(false)
    const handleOpenWarning_DeleteAccount = () => {
        setopenDialogWarning_DeleteAccount(true)
    }
    const handleCloseWarning_DeleteAccount = async () => {
        setopenDialogWarning_DeleteAccount(false)
    }
    const event_DeleteAccount = async () => {
        try {
            const uuidString = UuidTool.toString(accountInfoData?.code).replace(/-/g, '')
            // const result = await axios
            //     // .get(`http://localhost:3400/json/sample/00`, null)
            //     .delete(`https://api.koaiarchitecture.com/adm/account/delete`, {
            //         UserCode: uuidString,
            //     })
            // if (result) toast.success('삭제되었습니다.')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
    }
    const handleDeleteAccountEvent = async () => {
        // await handleCloseWarning_MoveHome()
        // await router.push('/dashboard').catch(console.error)
        await handleCloseWarning_DeleteAccount()
        // await event_DeleteAccount()
        onClose()
        await router.push('/adm').catch(console.error)
    }

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
            <PopupAccountAdmPasswdChange accountInfo={accountInfo} onClose={handleCloseWarning_ChangePassword} open={openDialogWarning_ChangePassword} />
            <PopupWarningWithCancel_DeleteAccount accountInfo={accountInfoData} returnUrl={'/adm'} onClose={handleCloseWarning_DeleteAccount} open={openDialogWarning_DeleteAccount} color="error" />
            <>
                <DialogTitle sx={{ mt: 2 }}>정보 변경</DialogTitle>
                <DialogContent>
                    {/* Input Value */}
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField color="free" fullWidth required label="이름" name="name" onChange={handleAccountInfoChange} value={accountInfoData?.name} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField color="free" fullWidth required label="전화번호" name="phone" onChange={handleAccountInfoChange} placeholder="010XXXX0000" inputProps={{ maxLength: 19 }} value={accountInfoData?.phone} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField color="free" fullWidth required label="이메일" name="email" onChange={handleAccountInfoChange} placeholder="guest@votg.com" inputProps={{ maxLength: 19 }} value={accountInfoData?.email} />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.8rem',
                                        fontWeight: '400',
                                        ml: 1,
                                        mt: 1,
                                        mb: -1,
                                    }}
                                >
                                    모드
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Select color="free" name="mode" value={accountInfoData?.mode} onChange={handleAccountInfoChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                                        <MenuItem value={0}>사용자</MenuItem>
                                        <MenuItem value={2}>관리자</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.8rem',
                                        fontWeight: '400',
                                        ml: 1,
                                        mt: 1,
                                        mb: -1,
                                    }}
                                >
                                    상태
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Select
                                        color="free"
                                        name="status"
                                        value={accountInfoData?.status}
                                        onChange={handleAccountInfoChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        renderValue={() => (
                                            <Chip
                                                label={accountInfoData?.status === 0 ? '대기' : accountInfoData?.status === 1 ? '경고' : accountInfoData?.status === 2 ? '정지' : accountInfoData?.status === 3 ? '정상' : '삭제'}
                                                variant="contained"
                                                color={accountInfoData?.status === 0 ? 'disable' : accountInfoData?.status === 1 ? 'warning' : accountInfoData?.status === 2 ? 'error' : accountInfoData?.status === 3 ? 'success' : 'error'}
                                                size="large"
                                                sx={{
                                                    marginInline: 0,
                                                    paddingInline: 0.5,
                                                    height: '1.6rem',
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        )}
                                    >
                                        {/* 0:대기(회색), 1:경고(노랑), 2:정지(빨강), 3:승인(검정), 4:삭제(보라) */}
                                        <MenuItem value={0}>대기</MenuItem>
                                        {/* <MenuItem value={1}>경고</MenuItem> */}
                                        <MenuItem value={2}>정지</MenuItem>
                                        <MenuItem value={3}>정상</MenuItem>
                                        {/* <MenuItem value={4}>삭제</MenuItem> */}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.8rem',
                                        fontWeight: '400',
                                        ml: 1,
                                        mt: 1,
                                        mb: -1,
                                    }}
                                >
                                    타입
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Chip
                                    label={accountInfoData?.type === 0 ? 'Starter' : accountInfoData?.type === 1 ? 'Standard' : accountInfoData?.type === 2 ? 'Professional' : 'Dev'}
                                    variant="outlined"
                                    color={accountInfoData?.type === 0 ? 'free' : accountInfoData?.type === 1 ? 'basic' : accountInfoData?.type === 2 ? 'pro' : 'disable'}
                                    size="small"
                                    sx={{
                                        marginInline: 0,
                                        paddingInline: 0.5,
                                        height: '1.6rem',
                                        fontSize: '0.7rem',
                                    }}
                                />
                                <FormControl fullWidth>
                                    <Select
                                        color="free"
                                        name="type"
                                        value={accountInfoData?.type}
                                        onChange={handleAccountInfoChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        renderValue={() => (
                                            <Chip
                                                label={accountInfoData?.type === 0 ? 'Starter' : accountInfoData?.type === 1 ? 'Standard' : accountInfoData?.type === 2 ? 'Professional' : 'Dev'}
                                                variant="outlined"
                                                color={accountInfoData?.type === 0 ? 'free' : accountInfoData?.type === 1 ? 'basic' : accountInfoData?.type === 2 ? 'pro' : 'disable'}
                                                size="small"
                                                sx={{
                                                    marginInline: 0,
                                                    paddingInline: 0.5,
                                                    height: '1.6rem',
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        )}
                                    >
                                        <MenuItem value={0}>Starter</MenuItem>
                                        <MenuItem value={1}>Standard</MenuItem>
                                        <MenuItem value={2}>Professional</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid> */}
                        </Grid>
                    </Box>

                    {/* Change Value */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 5,
                        }}
                    >
                        {accountInfo?.mode >= 2 && (
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button size="large" variant="contained" color="disable" disabled={false} onClick={handleOpenWarning_ChangePassword}>
                                    비밀번호 변경
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
                        {/* <Box sx={{ m: 1, position: 'relative' }}>
                            <Button size="large" variant="contained" color="error" disabled={false} onClick={handleOpenWarning_DeleteAccount}>
                                계정삭제
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
                        </Box> */}
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
                            color="free"
                        >
                            취소
                        </Button>
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button size="large" variant="contained" color="free" disabled={false} onClick={() => handleChangeAccountEvent()}>
                                저장
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
        </Dialog>
    )
}

PopupAccountInfoChange.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PopupAccountInfoChange.getLayout = (page) => <AuthGuard>{page}</AuthGuard>

export default PopupAccountInfoChange
