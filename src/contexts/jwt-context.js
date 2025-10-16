import { createContext, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import API from '@utils/API'
import { useCookies } from 'react-cookie'

// IIFE, Immediately invoked function expression
var ActionType
;(function (ActionType) {
    ActionType['INITIALIZE'] = 'INITIALIZE'
    ActionType['LOGIN'] = 'LOGIN'
    ActionType['LOGOUT'] = 'LOGOUT'
    ActionType['REGISTER'] = 'REGISTER'
})(ActionType || (ActionType = {}))

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
    survey: false,
    panel: false,
}

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user, survey, panel } = action.payload

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
            survey,
            panel,
        }
    },
    LOGIN: (state, action) => {
        const { user, survey, panel } = action.payload

        return {
            ...state,
            isAuthenticated: true,
            user,
            survey,
            panel,
        }
    },
    LOGOUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state, action) => {
        const { user, survey, panel } = action.payload

        return {
            ...state,
            isAuthenticated: true,
            user,
            survey,
            panel,
        }
    },
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state)

export const AuthContext = createContext({
    ...initialState,
    platform: 'JWT',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
    impPNCertify: () => Promise.resolve(),
})

export const AuthProvider = (props) => {
    const router = useRouter()
    const { children } = props
    const [state, dispatch] = useReducer(reducer, initialState)
    const expireTimeAcsTK = new Date(new Date().getTime() + 1000 * 60 * 5) // 1 Min
    const expireTimeRefTK = new Date(new Date().getTime() + 1000 * 60 * 60 * 3) // 1 d
    const cookieList = ['acsTK', 'refTK']
    const [cookie, setCookie, rmCookie] = useCookies(cookieList)

    useEffect(() => {
        const initialize = async () => {
            try {
                // const accessToken = globalThis.localStorage.getItem('accessToken')
                const accessToken = cookie.acsTK
                const refreshToken = cookie.refTK

                if (refreshToken === undefined) {
                    dispatch({
                        type: ActionType.INITIALIZE,
                        payload: {
                            isAuthenticated: false,
                            user: null,
                            survey: false,
                            panel: false,
                        },
                    })

                    cookieList.map((v) => {
                        rmCookie(v, { path: '/' })
                    })
                }

                if (accessToken !== undefined && refreshToken !== undefined) {
                    var user = null
                    var survey = false
                    var panel = false
                    if (!router.asPath.includes('panel')) {
                        user = await API.post('auth/user', { accessToken })
                        survey = true
                        panel = false
                    } else {
                        user = await API.post('auth/panel', { accessToken })
                        survey = false
                        panel = true
                    }

                    if (!user.isSuccess) {
                        cookieList.map((v) => {
                            rmCookie(v, { path: '/' })
                        })
                        throw new Error('데이터를 찾을 수 없습니다.')
                    }
                    dispatch({
                        type: ActionType.INITIALIZE,
                        payload: {
                            isAuthenticated: true,
                            user: user.payload,
                            survey: survey,
                            panel: panel,
                        },
                    })
                } else if (accessToken === undefined && refreshToken !== undefined) {
                    var token = null

                    if (!router.asPath.includes('panel')) {
                        token = await API.post('auth/user/verify', { refreshToken })
                        survey = true
                        panel = false
                    } else {
                        token = await API.post('auth/panel/verify', { refreshToken })
                        survey = false
                        panel = true
                    }

                    if (!token.isSuccess) {
                        cookieList.map((v) => {
                            rmCookie(v, { path: '/' })
                        })
                        throw new Error('데이터를 찾을 수 없습니다.')
                    }
                    setCookie('acsTK', token.payload.accessToken, {
                        path: '/',
                        expires: expireTimeAcsTK,
                    })
                    var user = null
                    if (!router.asPath.includes('panel')) {
                        user = await API.post('auth/user', {
                            accessToken: token.payload.accessToken,
                        })
                        survey = true
                        panel = false
                    } else {
                        user = await API.post('auth/panel', {
                            accessToken: token.payload.accessToken,
                        })
                        survey = false
                        panel = true
                    }
                    if (!user.isSuccess) {
                        cookieList.map((v) => {
                            rmCookie(v, { path: '/' })
                        })
                        throw new Error('데이터를 찾을 수 없습니다.')
                    }
                    dispatch({
                        type: ActionType.INITIALIZE,
                        payload: {
                            isAuthenticated: true,
                            user: user.payload,
                            survey: survey,
                            panel: panel,
                        },
                    })
                } else {
                    dispatch({
                        type: ActionType.INITIALIZE,
                        payload: {
                            isAuthenticated: false,
                            user: null,
                            survey: false,
                            panel: false,
                        },
                    })
                    cookieList.map((v) => {
                        rmCookie(v, { path: '/' })
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                        survey: false,
                        panel: false,
                    },
                })
            }
        }

        initialize()
    }, [])

    const login = async (email, password, type) => {
        var res = null
        var survey = false
        var panel = false
        if (type == undefined) {
            res = await API.post('auth/login', { email, password })
        } else if (type == 'pn') {
            res = await API.post('auth/pn/login', { email, password })
        }

        const { code, isSuccess, msg, payload } = res
        if (isSuccess) {
            // console.log('payload', payload)

            const accessToken = payload.accessToken
            const refreshToken = payload.refreshToken

            var user = null
            if (type == undefined) {
                user = await API.post('auth/user', { accessToken })
                survey = true
                panel = false
            } else if (type == 'pn') {
                user = await API.post('auth/panel', { accessToken })
                survey = false
                panel = true
            }
            if (!user.isSuccess) {
                cookieList.map((v) => {
                    rmCookie(v, { path: '/' })
                })
                throw new Error('데이터를 찾을 수 없습니다.')
            }

            // localStorage.setItem('accessToken', accessToken)
            setCookie('acsTK', accessToken, { path: '/', expires: expireTimeAcsTK })
            setCookie('refTK', refreshToken, { path: '/', expires: expireTimeRefTK })

            // console.log('user', user.payload)
            dispatch({
                type: ActionType.LOGIN,
                payload: {
                    user: user.payload,
                    survey: survey,
                    panel: panel,
                },
            })
        } else {
            throw new Error('존재하지 않는 아이디거나 비밀번호가 올바르지 않습니다.')
        }
    }

    const logout = async () => {
        // localStorage.removeItem('accessToken')
        cookieList.map((v) => {
            rmCookie(v, { path: '/' })
        })
        dispatch({ type: ActionType.LOGOUT })
    }

    const register = async (params, type) => {
        var res = null
        var survey = false
        var panel = false
        if (type == undefined) {
            res = await API.post('auth/signup', { ...params })
        } else if (type == 'pn') {
            res = await API.post('auth/pn/signup', { ...params })
        }
        const { code, isSuccess, msg, payload } = res

        const accessToken = payload.accessToken
        const refreshToken = payload.refreshToken

        if (isSuccess) {
            var user = null
            if (type == undefined) {
                user = await API.post('auth/user', { accessToken })
                survey = true
                panel = false
            } else if (type == 'pn') {
                user = await API.post('auth/panel', { accessToken })
                survey = false
                panel = true
            }
            if (!user.isSuccess) {
                cookieList.map((v) => {
                    rmCookie(v, { path: '/' })
                })
                throw new Error('데이터를 찾을 수 없습니다.')
            }
            // localStorage.setItem('accessToken', accessToken)
            setCookie('acsTK', accessToken, { path: '/', expires: expireTimeAcsTK })
            setCookie('refTK', refreshToken, { path: '/', expires: expireTimeRefTK })
            // console.log('user', user.payload)
            dispatch({
                type: ActionType.REGISTER,
                payload: {
                    user: user.payload,
                    survey: survey,
                    panel: panel,
                },
            })
        } else if (!isSuccess && code === 403) {
            throw new Error('이미 가입된 이메일 주소입니다. 다른 이메일 주소를 입력해주세요.')
        } else {
            throw new Error('회원가입 오류. 새로고침 후 가입 부탁드립니다.')
        }
    }

    const impPNCertify = async (params) => {
        const res = await API.post('auth/PNCertify', { ...params })
        const { code, isSuccess, msg, payload } = res
        // console.log('payload', payload)

        if (isSuccess) {
            // console.log('code', code)
            if (code === 202) {
                // console.log('user', user.payload)
                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
                cookieList.map((v) => {
                    rmCookie(v, { path: '/' })
                })
                setCookie('tempUser', payload, { path: '/', expires: expireTimeAcsTK })
            } else {
                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
                cookieList.map((v) => {
                    rmCookie(v, { path: '/' })
                })
                setCookie('tempUser', payload, { path: '/', expires: expireTimeAcsTK })
            }
        } else {
            throw new Error('존재하지 않는 아이디거나 비밀번호가 올바르지 않습니다.')
        }
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                platform: 'JWT',
                login,
                logout,
                register,
                impPNCertify,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const AuthConsumer = AuthContext.Consumer
