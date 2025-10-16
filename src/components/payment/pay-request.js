import { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Box, Card, CardContent, Grid, LinearProgress, Typography, Tabs, Tab, TabPanel } from '@mui/material'

import { useTheme } from '@mui/material/styles'
import axios from 'axios'

//Icon
import { IconCircleAdd } from '@public/votg/IconCircleAdd'
// Auth
import { useAuth } from '@hooks/use-auth'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
//Util
import { formatCardNumber } from '@utils/auto-format'

//Popup
import PaymentAddPopover from '@components/popovers/popover-payment-add'

//Popup
import { PayRequestTable } from '@components/payment/pay-request-table'

export const PayRequest = () => {
    const theme = useTheme()
    // To get the user from the authContext, you can use
    const { user } = useAuth()
    const [cookie, setCookie, rmCookie] = useCookies()
    const router = useRouter()

    // Tab Tabs
    const [currentTab, setCurrentTab] = useState(0)

    const handleTabsChange = (event, value) => {
        setCurrentTab(value)
    }

    const [openDialog, setOpenDialog] = useState(false)

    const handleOpenPaymentAddDialog = () => {
        setOpenDialog(true)
    }

    const handleClosePaymentAddDialog = () => {
        setOpenDialog(false)
    }

    //*/ Load Survey Data
    const [paymentRequestListData, setPaymentRequestListData] = useState(null)
    useEffect(() => {
        // 1. Router Load Check
        if (!router.isReady) {
            return
        }
        // 2. Mount Setting
        let isMounted = true

        //3 .Data Fetch
        const fetchData = async () => {
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .post(`https://api.koaiarchitecture.com/payment/request/list`, {
                    UserCode: user?.code.data,
                })
                .then((res) => {
                    console.log('res.data', res.data)
                    if (res.data) {
                        if (isMounted) {
                            setPaymentRequestListData(res.data.payload)
                        }
                    }
                })
                .catch((error) => console.log(error))
        }
        // call the function
        fetchData().catch(console.error)
        return () => {
            isMounted = false
        }
    }, [router])
    //*/

    return (
        <>
            <PaymentAddPopover returnUrl={'/ws/payment'} onClose={handleClosePaymentAddDialog} open={openDialog} />
            <Box
                sx={{
                    backgroundColor: 'background.white',
                    marginTop: '30px',
                }}
            >
                <Card>
                    {/* <AppBar position="static" sx={{ backgroundColor: '#FFF !important' }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabsChange}
                            textColor="inherit"
                            variant="fullWidth"
                            indicatorColor="primary"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    color: '#fff',
                                    backgroundColor: 'primary.main',
                                    height: '100%',
                                    zIndex: 0,
                                },
                            }}
                        >
                            <Tab
                                label="플랜 구매 히스토리"
                                value={0}
                                sx={{
                                    color: 'text.black',
                                    '&[aria-selected=true]': {
                                        color: 'text.white',
                                        zIndex: 1,
                                    },
                                }}
                            />
                            <Tab
                                label="패널 구매 히스토리"
                                value={1}
                                sx={{
                                    color: 'text.black',
                                    '&[aria-selected=true]': {
                                        color: 'text.white',
                                        zIndex: 1,
                                    },
                                }}
                            />
                            <Tab
                                label="리워드 히스토리"
                                value={2}
                                sx={{
                                    color: 'text.black',
                                    '&[aria-selected=true]': {
                                        color: 'text.white',
                                        zIndex: 1,
                                    },
                                }}
                            />
                        </Tabs>
                    </AppBar> */}
                    <CardContent>
                        <div>
                            <Typography variant="h6">결제 내역</Typography>
                            <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                                {/* 기능에 따라 원하시는 플랜을 사용해보세요! */}
                            </Typography>
                        </div>
                        <>
                            {currentTab === 0 && (
                                <Box>
                                    <PayRequestTable data={paymentRequestListData} />
                                </Box>
                            )}
                            {/* {currentTab === 1 && (
                                <Box>
                                    <PayRequestTable data={paymentRequestListData} />
                                </Box>
                            )}
                            {currentTab === 2 && (
                                <Box>
                                    <PayRequestTable data={paymentRequestListData} />
                                </Box>
                            )} */}
                        </>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
