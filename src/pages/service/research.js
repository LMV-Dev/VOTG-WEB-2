import Head from 'next/head'
import Image from 'next/image'

/* MUI */
import { Avatar, Box, Button, Container, Typography, Paper, Grid } from '@mui/material'

//ELEMENT
const PAGE_TITLE = '서베이 조사'

/* Layouts */
import SubLayout from '@layouts/sub'

/* Compoent/Home/Service */
import HeadMeta from '@components/base/head-meta'
import Subtitle from '@components/home/service/sub-title'
import SubtResearch from '@components/home/service/sub-research'

const ServiceResearch = () => {
    return (
        <>
            {/* <Head>
                <title>{PAGE_TITLE} - 뷰즈온더고 :: Views On the Go</title>
            </Head> */}
            <HeadMeta title={PAGE_TITLE} />

            <main>
                {/* SUB TITLE */}
                <Subtitle title={PAGE_TITLE} underTitle={'Academic Survey Research'} src={'/background/service_bg_01.jpeg'} />

                {/* CONTENTS */}
                <SubtResearch title={`${PAGE_TITLE} 개요`} contents={`서베이 조사란?`} />
            </main>
        </>
    )
}

ServiceResearch.getLayout = (page) => <SubLayout>{page}</SubLayout>

export default ServiceResearch
