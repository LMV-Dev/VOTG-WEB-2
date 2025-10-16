import { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/use-auth'
import { AuthGuard } from '@components/auth/auth-guard'

/* MUI */
import { Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE_01 = '공지사항 글작성'
const PAGE_TITLE_02 = 'Learning is Action 글작성'
const PAGE_TITLE_03 = '대외활동 및 수상내역 글작성'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import CreateComponent from '@components/home/board-create'

const BoardCreate = () => {
    const router = useRouter()
    const { user } = useAuth()
    const { type } = router.query
    const [PAGE_TITLE, set_PAGE_TITLE] = useState(PAGE_TITLE_01)

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
                <CreateComponent />
            </main>
        </>
    )
}

BoardCreate.getLayout = (page) => (
    <AuthGuard>
        <SubLayout>{page}</SubLayout>
    </AuthGuard>
)

export default BoardCreate
