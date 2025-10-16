import { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/use-auth'
import { AuthGuard } from '@components/auth/auth-guard'
import API from '@utils/API'
import axios from 'axios'
import { wait } from '@utils/wait'

/* MUI */
import { Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE_01 = '공지사항 글 수정'
const PAGE_TITLE_02 = 'Learning is Action 글 수정'
const PAGE_TITLE_03 = '대외활동 및 수상내역 글 수정'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import UpdateComponent from '@components/home/board-update'

const BoardUpdate = () => {
    const router = useRouter()
    const { user } = useAuth()
    const { type, code } = router.query
    const [PAGE_TITLE, set_PAGE_TITLE] = useState(PAGE_TITLE_01)

    const [existData, setExistData] = useState(null)

    useEffect(() => {
        // console.log('adminPanel', user?.mode >= 2)
        if (!router.isReady) {
            return
        }
        if (user?.mode < 2) router.push(`/board/`).catch(console.error)
    }, [user])

    useEffect(() => {
        if (type == null) {
            router.push(`/board/create?type=1`).catch(console.error)
        } else if (type == 1) {
            set_PAGE_TITLE(PAGE_TITLE_01)
        } else if (type == 2) {
            set_PAGE_TITLE(PAGE_TITLE_02)
        } else if (type == 3) {
            set_PAGE_TITLE(PAGE_TITLE_03)
        } else {
            router.push(`/board/create?type=1`).catch(console.error)
        }
    }, [type, PAGE_TITLE])

    /* Load Exist Data */
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
                            setExistData(res.data.payload)
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
        if (existData !== null && existData !== undefined) {
            set_PAGE_TITLE(existData.title)
        }
    }, [existData])

    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} src={'/background/service_bg_00.jpeg'} />

                {/* CONTENTS */}
                <UpdateComponent existData={existData} />
            </main>
        </>
    )
}

BoardUpdate.getLayout = (page) => (
    <AuthGuard>
        <SubLayout>{page}</SubLayout>
    </AuthGuard>
)

export default BoardUpdate
