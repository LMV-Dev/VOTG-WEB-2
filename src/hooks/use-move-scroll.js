//hook
// useMoveScroll.js

import { useCallback, useRef } from 'react'

export const useMoveScroll = () => {
    const element = useRef()
    
    // [수정] element ref가 변경되지 않는 한 함수를 재생성하지 않도록 useCallback으로 감싸줍니다.
    const onMoveToElement = useCallback(() => {
        element.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [element]) // 의존성 배열에 element 추가

    return { element, onMoveToElement }
}