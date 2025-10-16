import { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/use-auth'
import { AuthGuard } from '@components/auth/auth-guard'

import axios from 'axios'
import { wait } from '@utils/wait'

/* MUI */
import { Box, Divider, Typography, CircularProgress } from '@mui/material'

//ELEMENT

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import ViewComponent from '@components/home/board-view'

const BoardView = () => {
    const router = useRouter()
    const { user } = useAuth()
    const { type, code } = router.query

    const [viewData, setViewData] = useState(null)

    const [PAGE_TITLE, set_PAGE_TITLE] = useState('게시판 보기')

    useEffect(() => {
        let isMounted = true
        // declare the async data fetching function
        let getUrl = 'board/notice/code'
        let returnUrl = '/board/notice'
        if (type === `1`) {
            getUrl = 'board/notice/code'
            returnUrl = '/board/notice'
        } else if (type === `2`) {
            getUrl = 'board/learn/code'
            returnUrl = '/board/learn'
        } else if (type === `3`) {
            getUrl = 'board/media/code'
            returnUrl = '/board/media'
        }

        const fetchData = async () => {
            console.log('code', code)
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .get(`https://api.koaiarchitecture.com/${getUrl}`, {
                    params: { BoardCode: code },
                })
                .then((res) => {
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setViewData(res.data.payload)
                            if (res.data.payload == null) {
                                router.push(returnUrl).catch(console.error)
                            }
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

    useEffect(() => {
        if (viewData !== null && viewData !== undefined) {
            set_PAGE_TITLE(viewData.title)
        }
    }, [viewData])

    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            {viewData !== null ? (
                <main>
                    {/* SUB TITLE */}
                    <Subtitle title={PAGE_TITLE} src={'/background/service_bg_00.jpeg'} />

                    {/* CONTENTS */}
                    <ViewComponent title={viewData.title} contents={viewData.contents} />
                </main>
            ) : (
                <Box sx={{ minHeight: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    )
}

BoardView.getLayout = (page) => <SubLayout>{page}</SubLayout>
export default BoardView
