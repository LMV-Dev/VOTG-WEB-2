import { useEffect, useState, useRef, useCallback, Fragment, createRef } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { useAuth } from '@hooks/use-auth'
import axios from 'axios'
import {
    useMediaQuery,
    Box,
    Button,
    IconButton,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Container,
    Divider,
    Grid,
    MenuItem,
    Tooltip,
    TextField,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    Collapse,
    Rating,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    CircularProgress,
} from '@mui/material'

//BASE
import { PropertyList } from '@components/base/property-list'
import { PropertyListItem } from '@components/base/property-list-item'

//Util
import { formatPrice } from '@utils/auto-format'
import { formatInTimeZone } from 'date-fns-tz'

const RewardAleadyBuy = (props) => {
    const { rewardRequestItem } = props
    const { user } = useAuth()
    const router = useRouter()
    const theme = useTheme()
    const middleDevice = useMediaQuery(theme.breakpoints.down('md'))
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    // console.log('rewardRequestItem', rewardRequestItem)

    /*
     * Product Setting
     */
    const [producItem, setProductItem] = useState(null)
    const [productCategory, setProductCategory] = useState(null)
    const [totalProductPrice, setTotalProductPrice] = useState(0)

    /* Get Reward Product Item */
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .post(`/api/gift/goodsInfo/item`, {
                    productNumber: rewardRequestItem.productNumber,
                })
                .then((res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('DAU PRODUCT LIST', res.data.payload)
                            setProductItem(res.data.payload)
                            // setSurveyLoadData(JSON.parse(res.data.payload[0].survey))
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

    // useEffect(() => {
    //     console.log('producItem', producItem)
    // }, [producItem])

    return (
        <Box
            sx={{
                backgroundColor: 'background.white',
                marginTop: mobileDevice ? '0px' : '30px',
            }}
        >
            <Card sx={{ pb: 2, mb: 2 }}>
                <CardHeader
                    // action={
                    //     <IconButton>
                    //         <AddIcon fontSize="small" />
                    //     </IconButton>
                    // }
                    title={'리워드 구매 내역'}
                />
                <Divider sx={{ mb: '10px' }} />
                {producItem && (
                    <>
                        <Grid container sx={{ p: 3 }}>
                            <Grid item sm={5} xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageListItem sx={{ alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            width: '204px',
                                            border: '2px solid rgba(0,0,0,0)',
                                            borderColor: 'secondary.main',
                                            borderWidth: 2,
                                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                        }}
                                    >
                                        <img
                                            width="100%"
                                            style={{ width: '200px' }}
                                            src={`/reward/${producItem.NO_GOODS}.jpg`}
                                            // srcSet={`${imagePath}`}
                                            alt={producItem.NM_GOODS}
                                            loading="lazy"
                                        />
                                    </Box>
                                    <ImageListItemBar
                                        title={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'pre-line' }}>{producItem.NM_GOODS}</Typography>}
                                        subtitle={<span>{`${formatPrice(producItem.GOODS_PRICE)}원`}</span>}
                                        position="below"
                                        sx={{
                                            maxWidth: '200px',
                                        }}
                                    />
                                </ImageListItem>
                            </Grid>
                            <Grid item sm={7} xs={12}>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.8rem',
                                        fontWeight: '400',
                                        mb: 1,
                                    }}
                                >
                                    구매 상세
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
                                        <PropertyListItem align="horizontal" divider label="상품명" value={producItem ? `${producItem.NM_GOODS}` : `상품을 선택해주세요`} />
                                        <PropertyListItem align="horizontal" divider label="사용처" value={producItem ? `${producItem.NM_GOODS_COMPANY}` : ``} />
                                        <PropertyListItem align="horizontal" label="상품금액" value={producItem ? `${formatPrice(producItem.CPN_PRICE)}원` : `0원`} />
                                        <PropertyListItem align="horizontal" divider label="구매개수" value={producItem ? `${formatPrice(rewardRequestItem.orderCount)}개` : `0개`} />
                                        <PropertyListItem align="horizontal" label="구매금액" value={producItem ? `${formatPrice(producItem.CPN_PRICE)} x ${rewardRequestItem.orderCount}` : `0원`} />
                                        <PropertyListItem align="horizontal" divider label="" value={`= ${formatPrice(rewardRequestItem.amount)}원`} />
                                        {/* <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="VAT(10%)" value={`+ ${formatPrice(parseInt(billingInfo.saleprice?.replace(/,/g, '')) / 10)} x ${12}`} /> */}
                                        {/* <PropertyListItem sx={{ mt: -1, ml: 1 }} align="horizontal" label="" value={`= ${formatPrice(billing.price)}원`} /> */}
                                        <PropertyListItem align="horizontal" divider label="결제일" value={formatInTimeZone(rewardRequestItem.updatedAt, 'Asia/Seoul', 'yyyy.MM.dd, HH:mm:ss')} />
                                    </PropertyList>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Card>
        </Box>
    )
}

export default RewardAleadyBuy
