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

const PopupAccountAdmPasswdChange = (props) => {
    const { accountInfo, returnUrl, onClose, open, ...other } = props

    // console.log('accountInfo', accountInfo)

    const isMounted = useMounted()
    const router = useRouter()
    const { user } = useAuth()

    // Parameter
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    //* Biilling Info */
    const [accountInfoData, setAccountInfoData] = useState(accountInfo)
    useEffect(() => {
        setAccountInfoData(accountInfo)
        setPasswdOrigin('')
        setPasswdCheck('')
    }, [accountInfo, open])

    // useEffect(() => {
    //     console.log('accountInfoData', accountInfoData)
    // }, [accountInfoData])

    // OnChange

    const [passwdOrigin, setPasswdOrigin] = useState('')
    const [passwdCheck, setPasswdCheck] = useState('')

    // useEffect(() => {
    //     console.log('passwdOrigin', passwdOrigin)
    //     console.log('passwdCheck', passwdCheck)
    // }, [passwdOrigin, passwdCheck])

    // Submit
    const event_ChangeAccountPassword = async () => {
        try {
            // console.log('accountInfoData', accountInfoData)
            const uuidString = UuidTool.toString(accountInfoData?.code?.data).replace(/-/g, '')

            const res = await API.post('auth/change/passwd', {
                UserCode: uuidString,
                password: passwdCheck,
            })

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
    const handleChangeAdmPasswordEvent = async () => {
        await event_ChangeAccountPassword().then((res) => {
            if (res) {
                onClose()
            }
        })
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
            <>
                <DialogTitle sx={{ mt: 2 }}>비밀번호 변경</DialogTitle>
                <DialogContent>
                    {/* Input Value */}
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField color="free" fullWidth required label="비밀번호" name="password" type="password" onChange={(e) => setPasswdOrigin(e.target.value)} placeholder="" value={passwdOrigin} typ />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField color="free" fullWidth required label="비밀번호 확인" name="passwordCheck" type="password" onChange={(e) => setPasswdCheck(e.target.value)} placeholder="" value={passwdCheck} />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        {passwdCheck !== passwdOrigin && (
                            <>
                                <Typography color="error" variant="caption">
                                    {'동일한 비밀번호를 입력해주세요.'}
                                </Typography>
                            </>
                        )}
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
                            <Button size="large" variant="contained" color="free" disabled={!passwdOrigin || !passwdCheck || passwdOrigin !== passwdCheck} onClick={handleChangeAdmPasswordEvent}>
                                변경하기
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

PopupAccountAdmPasswdChange.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PopupAccountAdmPasswdChange.getLayout = (page) => <AuthGuard>{page}</AuthGuard>

export default PopupAccountAdmPasswdChange
