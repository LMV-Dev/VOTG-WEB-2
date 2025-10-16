// _document.js
import { Children } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

/* Emotion */
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '@utils/createEmotionCache'

class ASHDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* HTML META & PWA Setting Info */}
                    <meta name="theme-color" content={`#fff`} />
                    <meta name="description" content="meta-content" />
                    {/* Favicon.ico */}
                    <link rel="apple-touch-icon" sizes="180x180" href="/ico/favicon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/ico/favicon.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/ico/favicon.png" />
                    <link rel="mask-icon" href="/ico/favicon.pnb" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff"></meta>

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="http://www.koaiarchitecture.com/" />
                    <meta property="og:title" content="인공지능 기반 건축설계 자동화 기술개발 연구단" />
                    <meta property="og:description" content="당신만의 커스텀서베이! 클릭만하면 서베이완성" />
                    <meta property="og:image" content="/icons/logo.png"></meta>

                    <meta
                        name="keywords"
                        content=" AI마케팅,
                                    AI빅데이터,
                                    AI솔루션,
                                    AI플랫폼,
                                    B2B마케팅,
                                    DMP,
                                    DRAG&SURVEY,
                                    FGD,
                                    FGI,
                                    FGI조사,
                                    NEO서베이,
                                    SURVEY,
                                    SURVEYMONKEY,
                                    TYPEFORM,
                                    갱서베이,
                                    기업조사,
                                    논문서베이,
                                    델파이조사,
                                    드래드앤서베이,
                                    로코모션뷰,
                                    리서치,
                                    마케팅리서치,
                                    만족도조사,
                                    모바일서베이,
                                    무료서베이,
                                    분석,
                                    뷰즈온더고,
                                    사회조사,
                                    산업조사,
                                    서베이,
                                    서베이대행,
                                    서베이몽키,
                                    서베이사이트,
                                    서베이서비스,
                                    서베이솔루션,
                                    서베이업체,
                                    서베이조사,
                                    서베이툴,
                                    서베이폼,
                                    서베이플랫폼,
                                    선호도조사,
                                    설문,
                                    설문사이트,
                                    설문조사,
                                    설문조사사이트,
                                    설문조사양식,
                                    설문조사플랫폼,
                                    설문지,
                                    설문지만들기,
                                    설문지양식,
                                    설문지작성,
                                    설문지조사,
                                    설문지폼,
                                    설문프로그램,
                                    수요조사,
                                    시장분석,
                                    시장조사,
                                    시장조사사이트,
                                    여론조사,
                                    오픈서베이,
                                    온라인리서치,
                                    온라인서베이,
                                    온라인설문,
                                    온라인설문지,
                                    인터넷설문조사,
                                    자료조사,
                                    좌담회,
                                    커스텀서베이,
                                    컨설팅,
                                    크라우드소싱,
                                    클라우드서베이,
                                    통계분석,
                                    통계자료,
                                    학술서베이,
                                    학술전문서베이"
                    />

                    {/* Mixed Contents URL - Image Load Error */}
                    {/* {!process.env.NEXT_PUBLIC_HOST.includes('localhost') && <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>} */}

                    {/* Font : Default */}
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    {/* Font : Poppins */}
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
                    {/* Font : Noto San KR */}
                    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
                    {/* Font : Inter */}
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" />
                    {/* Font : Roboto */}
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto+Slab|Roboto:300,400,500,700&display=optional" />
                    {/* Font : Comfortaa */}
                    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Comfortaa" />
                    {/* jQuery */}
                    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
                    {/* iamport.payment.js */}
                    <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.1.8.js"></script>
                    {/* Script */}
                    {/* <script defer src="https://url"></script> */}

                    {/* quilljs */}
                    <link href="https://cdn.quilljs.com/1.3.4/quill.snow.css" rel="stylesheet" />
                    <script src="https://cdn.quilljs.com/1.3.4/quill.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{
                            __html: `var _TRK_LID = "109960";var _L_TD = "ssl.logger.co.kr";var _TRK_CDMN = ".viewsonthego.com";`,
                        }}
                    />
                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{
                            __html: `var _CDN_DOMAIN = location.protocol == "https:" ? "https://fs.bizspring.net" : "http://fs.bizspring.net"; 
(function (b, s) { var f = b.getElementsByTagName(s)[0], j = b.createElement(s); j.async = true; j.src = '//fs.bizspring.net/fs4/bstrk.1.js'; f.parentNode.insertBefore(j, f); })(document, 'script');`,
                        }}
                    />

                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `<img alt="Logger Script" width="1" height="1" src="http://ssl.logger.co.kr/tracker.1.tsp?u=109960&amp;js=N"/>`,
                        }}
                    />

                    <script
                        type="text/javascript"
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-5TZJSM5')`,
                        }}
                    />
                </body>
            </Html>
        )
    }
}

ASHDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage
    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => {
                return <App emotionCache={cache} {...props} />
            },
        })

    const initialProps = await Document.getInitialProps(ctx)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ))

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
    }
}

export default ASHDocument
