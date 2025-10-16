import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useAuth } from '@hooks/use-auth'

//Panel 유저만 들어오게
export const PanelGuard = (props) => {
    const { children } = props
    const auth = useAuth()
    const router = useRouter()
    const [checked, setChecked] = useState(false)

    useEffect(
        () => {
            if (!router.isReady) {
                return
            }

            if (!(auth.isAuthenticated && auth.panel)) {
                router
                    .push({
                        pathname: '/panel',
                        // pathname: '/welcome?disableguard=true',
                        query: { returnUrl: router.asPath },
                    })
                    .catch(console.error)
            } else {
                setChecked(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.isReady],
    )

    if (!checked) {
        return null // Not Login State
    }

    // If got here, it means that the redirect did not occur, and that tells us that the user is
    // authenticated / authorized.

    return <>{children}</>
}

PanelGuard.propTypes = {
    children: PropTypes.node,
}
