import Head from 'next/head'
import Image from 'next/image'

/* MUI */
import { Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE = '빅데이터 분석'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home/Service */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import SubBigdata from '@components/home/service/sub-bigdata'

const ServiceBigdata = () => {
    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} underTitle={'Big data analysis'} src={'/background/service_bg_05.jpeg'} />

                {/* CONTENTS */}
                <SubBigdata title={`${PAGE_TITLE} 개요`} contents={`빅데이터 분석 이란?`} />
            </main>
        </>
    )
}

ServiceBigdata.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default ServiceBigdata
