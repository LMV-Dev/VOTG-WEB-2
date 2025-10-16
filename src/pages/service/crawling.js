import Head from 'next/head'
import Image from 'next/image'

/* MUI */
import { Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE = '크롤링'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home/Service */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import SubCrawling from '@components/home/service/sub-crawling'

const ServiceCrawling = () => {
    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} underTitle={'Crawling'} src={'/background/service_bg_04.jpeg'} />

                {/* CONTENTS */}
                <SubCrawling title={`${PAGE_TITLE} 개요`} contents={`크롤링 이란?`} />
            </main>
        </>
    )
}

ServiceCrawling.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default ServiceCrawling
