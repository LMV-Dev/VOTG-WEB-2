import { Fragment, useState, useEffect } from 'react'
import { useMediaQuery, Avatar, Box, Card, CardContent, Grid, Radio, LinearProgress, Typography, Divider } from '@mui/material'

import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
//Icon
import { IconCircleAdd } from '@public/votg/IconCircleAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
// Auth
import { useAuth } from '@hooks/use-auth'
import { useCookies } from 'react-cookie'
//Util
import { formatCardNumber } from '@utils/auto-format'

//BASE
import { PropertyList } from '@components/base/property-list'
import { PropertyListItem } from '@components/base/property-list-item'

//Popup
import PaymentAddPopover from '@components/popovers/popover-payment-add'

export const CardListSelected = (props) => {
    const { size, selected, onSelected } = props
    const viewSize = size === 'small' ? 'xl' : 'sm'
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down(viewSize))
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
                                scrollSnapType: 'x proximity',
                            }}
                        >
                            {user?.payment.map((v, index) => {
                                return (
                                    <Grid item key={`card-list-${index}`} sx={{ scrollSnapAlign: 'center' }}>
                                        <Card
                                            sx={{
                                                marginBlock: '20px',
                                                backgroundColor: '#3B73E0',
                                                ...(selected === v.cardNumber && {
                                                    borderColor: 'primary.light',
                                                    borderWidth: 2,
                                                    // backgroundColor: (theme) =>
                                                    //     alpha(theme.palette.primary.main, 0.08),
                                                    // m: '-1px',
                                                }),
                                            }}
                                            variant="outlined"
                                            onClick={() => onSelected(v.cardNumber)}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'strech',
                                                    minWidth: mobileDevice ? '210px' : '340px',
                                                    minHeight: mobileDevice ? '130px' : '200px',
                                                    paddingInline: '15px',
                                                    paddingBlock: '15px',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                    }}
                                                >
                                                    <Typography color="text.white" gutterBottom variant="overline">
                                                        [{v.cardName}]{` `}
                                                        {v.cardNickName}
                                                    </Typography>
                                                    <Box sx={{ flexGrow: 1 }} />
                                                    {selected === v.cardNumber && <CheckCircleIcon sx={{ color: 'white', mb: 1 }} />}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        paddingBottom: '15px',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: mobileDevice ? '1rem' : '1.3rem',
                                                        }}
                                                        color="text.white"
                                                    >
                                                        {formatCardNumber(v.cardNumber)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Grid>
                                )
                            })}
                            {user?.payment.length <= 3 && (
                                <Grid item sx={{ scrollSnapAlign: 'center' }}>
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
                                                minWidth: mobileDevice ? '220px' : '350px',
                                                minHeight: mobileDevice ? '140px' : '210px',
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
                                                minWidth: mobileDevice ? '210px' : '340px',
                                                minHeight: mobileDevice ? '130px' : '200px',
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
                                                <Typography
                                                    sx={{
                                                        fontSize: mobileDevice ? '1rem' : '1.2rem',
                                                    }}
                                                    color="text.secondary"
                                                >
                                                    카드를 등록해주세요
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                        <Box>
                            {user?.payment.map((v, index) => {
                                if (v.cardNumber === selected) {
                                    return (
                                        <PropertyList key={`selected-card-info-${index}`}>
                                            <PropertyListItem align="horizontal" label="선택카드" value={`[${v.cardName}] ${v.cardNickName}`} />
                                        </PropertyList>
                                    )
                                } else {
                                    return (
                                        <PropertyList key={`selected-card-info-${index}`}>
                                            <PropertyListItem align="horizontal" label="선택카드" value={`카드를 선택해주세요`} textColor="primary" />
                                        </PropertyList>
                                    )
                                }
                            })}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
