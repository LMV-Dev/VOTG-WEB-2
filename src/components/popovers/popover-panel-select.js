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

import { IconLogin } from '@public/votg/IconLogin'

const PanelSelectPopover = (props) => {
    const { onClose, open, ...other } = props
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // const [showResults, setShowResults] = useState(false)

    return (
        <Dialog fullWidth maxWidth="xs" onClose={onClose} open={!!open} {...other}>
            {/* <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 2,
                }}
            >
                <Typography variant="h6">서비스 이용하기</Typography>
                <IconButton color="inherit" onClick={onClose}>
                    <XIcon fontSize="small" />
                </IconButton>
            </Box> */}
            <DialogContent>
                {isLoading && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 3,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        mt: 2,
                    }}
                >
                    <Button
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexFlow: 'column',
                            justifyContent: 'center',
                            backgroundColor: 'primary.main',
                            mt: 1,
                            borderRadius: 2,
                            height: 250,
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: '0.9',
                                transition: 'all 0.5s',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexFlow: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBlock: 3,
                            }}
                        >
                            <IconLogin
                                sx={{
                                    width: 80,
                                }}
                                variant="light"
                            />
                        </Box>
                        <Typography variant="h6" color="primary.contrastText" sx={{ textAlign: 'center' }}>
                            패널 구매하기
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexFlow: 'column',
                            justifyContent: 'center',
                            backgroundColor: 'primary.main',
                            mt: 1,
                            borderRadius: 2,
                            height: 250,
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: '0.9',
                                transition: 'all 0.5s',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexFlow: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBlock: 3,
                            }}
                        >
                            <IconLogin
                                sx={{
                                    width: 80,
                                }}
                                variant="light"
                            />
                        </Box>
                        <Typography variant="h6" color="primary.contrastText" sx={{ textAlign: 'center' }}>
                            직접 배포하기
                        </Typography>
                    </Button>
                </Box>
                {/* <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'wrap',
                        mt: 2,
                    }}
                >
                    <NextLink href={'/privacy'} passHref>
                        <Button align="left" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: 13 }} onClick={onClose}>
                            개인정보보호정책
                        </Button>
                    </NextLink>
                    <Box sx={{ flexGrow: 1 }} />
                    <NextLink href={'/terms'} passHref>
                        <Button align="right" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: 13 }} onClick={onClose}>
                            전자상거래이용약관
                        </Button>
                    </NextLink>
                </Box> */}
            </DialogContent>
        </Dialog>
    )
}

PanelSelectPopover.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
}

PanelSelectPopover.getLayout = (page) => <GuestGuard>{page}</GuestGuard>

export default PanelSelectPopover
