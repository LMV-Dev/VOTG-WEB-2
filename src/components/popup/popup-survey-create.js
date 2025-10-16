import NextLink from 'next/link'
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Badge, Box, Button, CircularProgress, Dialog, DialogContent, Divider, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { X as XIcon } from '@components/icons/x'
import { wait } from '@utils/wait'
import API from '@utils/API'
import { useAuth } from '@hooks/use-auth'
import { useMounted } from '@hooks/use-mounted'
import { GuestGuard } from '@components/auth/guest-guard'
import { UuidTool } from 'uuid-tool'

/* Mui Icon */
import CloseIcon from '@mui/icons-material/Close'

/* Icons - New*/
import { IconCreateDragDrop } from '@public/votg/IconCreateDragDrop'
import { IconCreateOnlineForm } from '@public/votg/IconCreateOnlineForm'

/* Survey Id Creater*/
import { createResourceCode } from '@utils/create-resource-id'
/* Survey Schema */
import { surveyType } from '@schema/survey-type'

const PopupSurveyCreate = (props) => {
    const { onClose, open, ...other } = props
    const [isLoading, setIsLoading] = useState(false)
    const isMounted = useMounted()
    const router = useRouter()

    return (
        <Dialog fullWidth maxWidth="md" onClose={onClose} open={!!open} {...other}>
            {/* <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: 'primary.contrastText',
                    color: 'primary.contrastText',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 2,
                }}
            >
                <Typography variant="h6"></Typography>
                <IconButton color="inherit" onClick={onClose}>
                    <CloseIcon fontSize="small" color="primary" />
                </IconButton>
            </Box> */}
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'text.black', fontSize: '1.5rem', fontWeight: 700, textAlignt: 'center' }}>설문지 제작하기</Typography>
                    </Box>
                    <Box sx={{ my: 2 }} />
                    <Box sx={{ width: '100%', height: { sm: '45vh', xs: '20vh' }, px: 3, py: 2, display: 'flex', flexWrap: 'wrap', gap: '3rem', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        
                        <NextLink href={`/ws/survey/${createResourceCode()}/${surveyType[0].url}/editor`}>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    height: '100%',
                                    background: '#FF5353',
                                    display: 'flex',
                                    flexDirection: { sm: 'column', xs: 'row' },
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transition: 'all 0.5s', padding:'10px' ,
                                    '&:hover': {
                                        cursor: 'pointer',
                                        opacity: 0.8,
                                        transition: 'all 0.5s',
                                    },
                                }}
                            >
                                <Typography
                                    sx={{ flexGrow: { sm: 1, xs: 'none' }, fontSize: { sm: '2rem', xs: '1.5rem' }, fontWeight: 700, color: '#fff', display: { sm: 'flex', xs: 'none' }, flexDirection: 'column', justifyContent: 'end' }}
                                ></Typography>
                                <IconCreateOnlineForm customColor="#fff" sx={{ flexGrow: { sm: 1, xs: 'none' }, width: { sm: '5rem', xs: '30px' }, mr: 2 }} />
                                <Typography sx={{ flexGrow: { sm: 1, xs: 'none' }, fontSize: { sm: '2rem', xs: '1.5rem' }, fontWeight: 700, color: '#fff'}}>온라인 설문 제작하기</Typography>
                            </Box>
                        </NextLink>
                    </Box>
                    <Box sx={{ my: 2 }} />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

PopupSurveyCreate.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PopupSurveyCreate.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default PopupSurveyCreate
