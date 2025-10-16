import { useEffect } from 'react'
import { useRouter } from 'next/router'
const Project = () => {
    const router = useRouter()
    useEffect(() => {
        if (!router.isReady) {
            return
        }
        router.push('/board/notice').catch(console.error)
    }, [router])
    return <></>
}

export default Project
