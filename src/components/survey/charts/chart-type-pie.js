import { useEffect, useRef } from 'react'

import numeral from 'numeral'
import { Box, Card, CardContent, CardHeader, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Chart from '@components/survey/charts/chart'

const ChartType_Pie = (props) => {
    const { colorArray, resultData } = props
    const theme = useTheme()

    // console.log('resultData', resultData)
    const newDataSet = resultData?.map((rd, aIndex) => {
        return {
            color: colorArray[aIndex % 5],
            category: rd.content,
            data: rd.result || 0,
        }
    })

    const chartOptions = {
        chart: {
            background: 'transparent',
            stacked: true,
            toolbar: {
                show: true,
            },
        },
        colors: newDataSet.map((item) => item.color),
        dataLabels: {
            enabled: true,
        },
        fill: {
            opacity: 1,
        },
        labels: newDataSet.map((item) => item.category),
        legend: {
            show: true,
        },
        stroke: {
            width: 0,
        },
        theme: {
            mode: theme.palette.mode,
        },
    }

    const chartSeries = newDataSet?.map((i) => i.data)
    // console.log('chartSeries', chartSeries)

    return (
        <>
            <Chart height={360} type="pie" options={chartOptions} series={chartSeries} />
        </>
    )
}

export default ChartType_Pie
