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

//Util
import { formatPrice } from '@utils/auto-format'

/* Import Component */

const RewardProductList = (props) => {
    const { selectedReward, handleChangeReward } = props
    const { user } = useAuth()
    const router = useRouter()
    const theme = useTheme()
    const middleDevice = useMediaQuery(theme.breakpoints.down('md'))
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    /*
     * Product Setting
     */
    const [producItemList, setProductItemList] = useState([])
    const [productCategoryList, setProductCategoryList] = useState([])

    /* Get Reward Product List */
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
                .post(`/api/gift/goodsInfo`, {})
                .then((res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('DAU PRODUCT LIST', res.data.payload)
                            setProductItemList(res.data.payload)
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

    /* Set Category List */
    useEffect(() => {
        // console.log('producItemList', producItemList)
        const allCategory = producItemList.map((item, index) => {
            return item.CATEGORY
        })
        // console.log('allCategory', allCategory)
        const set = new Set(allCategory)
        const uniqueCategory = [...set]
        setProductCategoryList(uniqueCategory)
        if (uniqueCategory.length > 0 && selectedReward == null) {
            // setSelectedCategory(uniqueCategory[0])
            console.log('selectedReward', selectedReward)
            handleChangeReward('category', uniqueCategory[0])
        }
    }, [producItemList])

    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'background.white',
                    marginTop: mobileDevice ? '0px' : '30px',
                }}
            >
                <Card>
                    <CardHeader
                        // action={
                        //     <IconButton>
                        //         <AddIcon fontSize="small" />
                        //     </IconButton>
                        // }
                        title={'리워드 상품 선택'}
                    />
                    <Divider />
                    <CardContent>
                        <Tabs indicatorColor="primary" onChange={(_, value) => handleChangeReward('category', value)} scrollButtons="auto" textColor="primary" value={selectedReward?.category} variant="scrollable" sx={{ mt: 3 }}>
                            {selectedReward?.category !== null && productCategoryList.map((tab, tIndex) => <Tab key={`product-category-${tIndex}`} label={tab} value={tab} />)}
                        </Tabs>
                        <Divider sx={{ mb: 3 }} />
                        <ImageList cols={mobileDevice ? 2 : middleDevice ? 3 : 4} gap={10}>
                            {producItemList.length > 0 &&
                                selectedReward?.category !== null &&
                                producItemList.map((item, index) => {
                                    if (item.CATEGORY !== selectedReward?.category) {
                                        return null
                                    }
                                    if (item.NM_REQ.includes('테스트')) {
                                        return null
                                    }
                                    const imagePath = `/reward/${item.NO_GOODS}.jpg`
                                    const reqData = item.NM_REQ.split('-')
                                    const productName = reqData[3]
                                    const productValid = reqData[4]

                                    const productLabel = `${productName} ${productValid}`

                                    return (
                                        <ImageListItem key={`product-item-list-${index}`} onClick={() => handleChangeReward('item', item)} sx={{ alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: '154px',
                                                    border: '2px solid rgba(0,0,0,0)',
                                                    ...(selectedReward?.item?.NO_GOODS === item.NO_GOODS && {
                                                        borderColor: 'primary.main',
                                                        borderWidth: 2,
                                                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                                    }),
                                                }}
                                            >
                                                <img
                                                    width="100%"
                                                    style={{ width: '150px' }}
                                                    // src={`${item.GOODS_IMAGE}?w=248&fit=crop&auto=format`}
                                                    // srcSet={`${item.GOODS_IMAGE}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                    src={imagePath}
                                                    // srcSet={`${imagePath}`}
                                                    alt={item.NM_GOODS}
                                                    loading="lazy"
                                                />
                                            </Box>
                                            <ImageListItemBar
                                                title={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'pre-line' }}>{productLabel}</Typography>}
                                                subtitle={<span>{`${formatPrice(item.GOODS_PRICE)}원`}</span>}
                                                position="below"
                                                sx={{
                                                    maxWidth: '150px',
                                                    ...(selectedReward?.item?.NO_GOODS === item.NO_GOODS && {
                                                        color: 'primary.main',
                                                    }),
                                                }}
                                            />
                                        </ImageListItem>
                                    )
                                })}
                        </ImageList>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default RewardProductList
