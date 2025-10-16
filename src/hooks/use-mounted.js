import { useCallback, useEffect, useRef } from 'react'

export const useMounted = () => {
    const isMounted = useRef(false)
    //  prevent useEffect initialize if that created.
    // prevent componentDidMount

    useEffect(() => {
        isMounted.current = true
        // Back to isMounted True
        // Activate componentDidUpdate

        /*Cleanup function 
        -> If UseEffect ended, Cleanup fucntion return () => {} is called
        */
        return () => {
            isMounted.current = false
            // Deactivate componentDidUpdate
        }
    }, [])

    return useCallback(() => isMounted.current, [])
}
