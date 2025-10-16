import Head from 'next/head'
import Image from 'next/image'

/* MUI */
import { Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE = '상담신청'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import { SubRequest } from '@components/home/sub-request'

const Privacy = () => {
    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} underTitle={'Survey Research Request'} src={'/background/service_bg_00.jpeg'} />

                {/* CONTENTS */}
                <SubRequest />
            </main>
        </>
    )
}

Privacy.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default Privacy
