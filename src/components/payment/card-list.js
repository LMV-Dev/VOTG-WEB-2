import { Fragment, useState, useEffect } from 'react'
import { useMediaQuery, Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material'

import { useTheme } from '@mui/material/styles'
//Icon
import { IconCircleAdd } from '@public/votg/IconCircleAdd'
// Auth
import { useAuth } from '@hooks/use-auth'
import { useCookies } from 'react-cookie'
//Util
import { formatCardNumber } from '@utils/auto-format'

//Popup
import PaymentAddPopover from '@components/popovers/popover-payment-add'

export const CardList = (props) => {
    const { size } = props
    const viewSize = size === 'small' ? 'xl' : 'sm'
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))
    // To get the user from the authContext, you can use
    const { user } = useAuth()
    const [cookie, setCookie, rmCookie] = useCookies()

    const [openDialog, setOpenDialog] = useState(false)

    const handleOpenPaymentAddDialog = () => {
        setOpenDialog(true)
    }

    const handleClosePaymentAddDialog = () => {
        setOpenDialog(false)
    }

    return (
        <>
            <PaymentAddPopover returnUrl={'/ws/payment'} onClose={handleClosePaymentAddDialog} open={openDialog} />
            <Box
                sx={{
                    backgroundColor: 'background.white',
                    marginTop: mobileDevice ? '0px' : '30px',
                }}
            >
                <Card>
                    <CardContent
                        sx={{
                            padding: mobileDevice ? '10px !important' : '30px !important',
                        }}
                    >
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                overflow: 'auto',
                            }}
                        >
                            {user?.payment.map((v, index) => {
                                return (
                                    <Grid item key={`card-list-${index}`}>
                                        <Card
                                            sx={{
                                                marginBlock: '20px',
                                                backgroundColor: '#3B73E0',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'strech',
                                                    minWidth: mobileDevice ? '255px' : '340px',
                                                    minHeight: mobileDevice ? '150px' : '200px',
                                                    paddingInline: '15px',
                                                    paddingBlock: '15px',
                                                }}
                                            >
                                                <Typography color="text.white" gutterBottom variant="overline">
                                                    [{v.cardName}]{` `}
                                                    {v.cardNickName}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        paddingBottom: '15px',
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: '1.3rem' }} color="text.white">
                                                        {formatCardNumber(v.cardNumber)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Grid>
                                )
                            })}
                            {user?.payment.length <= 3 && (
                                <Grid item>
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            marginBlock: '20px',
                                            backgroundColor: '#F6F6F6',
                                            // border: 2,
                                            // borderStyle: 'dashed',
                                            // borderColor: '#AAA',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                minWidth: mobileDevice ? '265px' : '350px',
                                                minHeight: mobileDevice ? '160px' : '210px',
                                                border: 6,
                                                borderRadius: '10px',
                                                borderStyle: 'dashed',
                                                borderColor: '#AAA',
                                                top: '-5px',
                                                bottom: '-5px',
                                                left: '-5px',
                                                right: '-5px',
                                            },

                                            '&:hover': {
                                                cursor: 'pointer',
                                                backgroundColor: '#F6F6F6',
                                                boxShadow: theme.shadows[15],
                                                transition: 'all 0.5s',
                                            },
                                        }}
                                        onClick={handleOpenPaymentAddDialog}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'strech',
                                                minWidth: mobileDevice ? '255px' : '340px',
                                                minHeight: mobileDevice ? '150px' : '200px',
                                                paddingInline: '15px',
                                                paddingBlock: '15px',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    flex: '1',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'end',
                                                    paddingBottom: '15px',
                                                }}
                                            >
                                                <IconCircleAdd
                                                    sx={{
                                                        width: mobileDevice ? 50 : 80,
                                                    }}
                                                    variant="color"
                                                    customColor="#65748B"
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    flex: '1',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'start',
                                                }}
                                            >
                                                <Typography sx={{ fontSize: '1.2rem' }} color="text.secondary">
                                                    카드를 등록해주세요
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
