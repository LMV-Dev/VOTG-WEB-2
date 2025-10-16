import Head from 'next/head'
import Router from 'next/router'

import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* Global Css style */
import GlobalStyle from '@styles/GlobalStyle'

/* Emotion */
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '@utils/createEmotionCache'
const cache = createEmotionCache()

/* MUI */
import { LocalizationProvider } from '@mui/x-date-pickers'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

/* Themes */
import { createTheme } from '@themes/index'

/* Contexts */
import { AuthProvider, AuthConsumer } from '@contexts/jwt-context'
import { SettingsProvider, SettingsConsumer } from '@contexts/settings-context'

/* Components */
import { SplashScreen } from '@components/layout/splash'
import { SettingsButton } from '@components/settings/setting-button'

/* Language */
import '@components/lang'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

const App = (props) => {
    const { Component, pageProps, emotionCache = cache } = props
    const getLayout = Component.getLayout ?? ((page) => page)
    const router = useRouter()
    return (
        <>
            <CacheProvider value={emotionCache}>
                <Head>
                    <title>인공지능 기반 건축설계 자동화 기술개발 연구단</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <AuthProvider>
                        <SettingsProvider>
                            <SettingsConsumer>
                                {( context ) => {
                                    if (!context) {
                                        return <SplashScreen/>
                                    }
                        
                                    const { settings } = context;


                                    return <ThemeProvider
                                        theme={createTheme({
                                            asPath: router.asPath,
                                            direction: settings.direction,
                                            responsiveFontSizes: settings.responsiveFontSizes,
                                            mode: settings.theme,
                                        })}
                                    >
                                        <GlobalStyle />
                                        <CssBaseline />
                                        <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover />
                                        {/* <SettingsButton /> */}
                                        <AuthConsumer>{(auth) => (!auth.isInitialized ? <SplashScreen theme={settings.theme} /> : getLayout(<Component {...pageProps} />))}</AuthConsumer>
                                    </ThemeProvider>
                                }}
                            </SettingsConsumer>
                        </SettingsProvider>
                    </AuthProvider>
                </LocalizationProvider>
            </CacheProvider>
        </>
    )
}

export default App
