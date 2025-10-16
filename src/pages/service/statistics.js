import Head from 'next/head'
import Image from 'next/image'

/* MUI */
import { Divider } from '@mui/material'

//ELEMENT
const PAGE_TITLE = '통계분석'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home/Service */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import SubStatistics from '@components/home/service/sub-statistics'

const ServiceStatistics = () => {
    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} underTitle={'Statistical analysis'} src={'/background/service_bg_03.jpeg'} />

                {/* CONTENTS */}
                <SubStatistics title={`${PAGE_TITLE} 개요`} contents={`통계분석 이란?`} />
            </main>
        </>
    )
}

ServiceStatistics.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default ServiceStatistics
