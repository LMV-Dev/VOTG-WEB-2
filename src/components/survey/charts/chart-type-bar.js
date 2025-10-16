import { useEffect, useRef } from 'react'

import numeral from 'numeral'
import { Box, Card, CardContent, CardHeader, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Chart from '@components/survey/charts/chart'

const ChartType_Bar = (props) => {
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
        grid: {
            borderColor: theme.palette.divider,
            yaxis: {
                lines: {
                    show: true,
                },
            },
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
        legend: {
            show: true,
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '45',
                distributed: true,
            },
        },
        theme: {
            mode: theme.palette.mode,
        },
        xaxis: {
            axisBorder: {
                color: theme.palette.divider,
                show: true,
            },
            axisTicks: {
                color: theme.palette.divider,
                show: true,
            },
            categories: newDataSet.map((item) => item.category),
        },
        yaxis: {
            labels: {
                show: true,
            },
        },
    }

    const chartSeries = [
        {
            data: newDataSet?.map((i) => i.data),
            name: '',
        },
    ]
    // console.log('chartSeries', chartSeries)

    return (
        <>
            <Chart height={350} type="bar" options={chartOptions} series={chartSeries} />
        </>
    )
}

export default ChartType_Bar
