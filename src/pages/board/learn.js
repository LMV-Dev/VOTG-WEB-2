import { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { wait } from '@utils/wait'

/* MUI */
import { Box, Divider, CircularProgress } from '@mui/material'

//ELEMENT
const PAGE_TITLE = 'Learning is Action'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import { BoarMenu, BoardType_Table } from '@components/home/board-notice'

const BoardLearn = () => {
    const router = useRouter()

    const [dataList, setDataList] = useState(null)
    /* Loaded survey Data */
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        let isMounted = true
        // declare the async data fetching function
        // let currentCreateSureveyData = JSON.parse(globalThis.sessionStorage.getItem('current-create-survey'))

        const fetchData = async () => {
            // const uuidString = UuidTool.toString(user?.code.data).replace(/-/g, '')
            await axios
                // .get(`http://localhost:3400/json/sample/00`, null)
                .get(`https://api.koaiarchitecture.com/board/learn/list`, null)
                .then(async (res) => {
                    // console.log(res.data)
                    if (res.data) {
                        if (isMounted) {
                            // console.log('res.data', res.data.payload)
                            setDataList(res.data.payload)
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

    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} underTitle={'Learning is Action'} src={'/background/service_bg_00.jpeg'} />

                <BoarMenu />
                {/* CONTENTS */}
                {dataList === null ? <Box sx={{ minHeight: '800px' }}></Box> : <BoardType_Table typeNumber={2} dataList={dataList} />}
            </main>
        </>
    )
}

BoardLearn.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default BoardLearn
