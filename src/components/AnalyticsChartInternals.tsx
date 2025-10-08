import { useCallback, useRef, useState } from 'react'
import React from 'react'
import { LinePath } from '@visx/shape'
import { scaleTime, scaleLinear } from '@visx/scale'
import { extent, max } from 'd3-array'
import { voronoi } from '@visx/voronoi'
import { localPoint } from '@visx/event'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { ApiInvocationResponse } from '@/schemas'

export interface AnalyticsLineChartProps {
  data: Array<ApiInvocationResponse>
}

interface DailyPoint {
  date: Date
  count: number
}

const groupByDay = (data: ApiInvocationResponse[]) => {
  const dailyCounts: Record<string, number> = {}
  data.forEach((d) => {
    const day = d.timestamp.split('T')[0] // Extract the date part
    dailyCounts[day] = (dailyCounts[day] || 0) + 1 // Increment count
  })

  // Convert to an array of { date, count } objects
  return Object.entries(dailyCounts).map(([day, count]) => ({
    date: new Date(day),
    count,
  }))
}

const generateEmptyLastDays = (numDays: number) => {
  const today = new Date()
  const days = []
  for (let i = numDays - 1; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    days.push({ date: day, count: 0 })
  }
  return days
}

const mergeWithLast7Days = (groupedData: { date: Date; count: number }[]) => {
  const last7Days = generateEmptyLastDays(7)
  const groupedDataMap = new Map(
    groupedData.map((d) => [d.date.toISOString().split('T')[0], d.count]),
  )

  return last7Days.map((day) => ({
    date: day.date,
    count: groupedDataMap.get(day.date.toISOString().split('T')[0]) || 0,
  }))
}

export const AnalyticsChartInternals = ({ data }: AnalyticsLineChartProps) => {
  const groupedData = mergeWithLast7Days(groupByDay(data))
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const width = 585
  const height = 190
  const margin = { top: 20, right: 20, bottom: 40, left: 30 }

  const xScale = scaleTime({
    domain: extent(groupedData, (d) => d.date) as [Date, Date],
    range: [margin.left, width - margin.right],
  })

  const yScale = scaleLinear({
    domain: [0, max(groupedData, (d) => d.count) || 0],
    range: [height - margin.bottom, margin.top],
  })

  const [startDate, endDate] = xScale.domain()

  // Get the min and max values for y-axis ticks
  const [minY, maxY] = yScale.domain()

  const voronoiDiagram = voronoi({
    x: (d: DailyPoint) => xScale(d.date) ?? 0,
    y: (d: DailyPoint) => yScale(d.count) ?? 0,
    width,
    height,
  })(groupedData)

  // Event handlers
  const handleMouseMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!svgRef.current) return

      const point = localPoint(svgRef.current, event)
      if (!point) return

      const closest: any = voronoiDiagram.find(point.x, point.y, 100)
      if (closest) {
        const index = groupedData.findIndex(
          (d) => d.date === closest.data.date && d.count === closest.data.count,
        )
        setHoveredPoint(index)
      }
    },
    [voronoiDiagram, groupedData],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null)
  }, [])

  // Format date for tooltip
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseLeave}
      >
        <LinePath
          data={groupedData}
          x={(d) => xScale(d.date)!}
          y={(d) => yScale(d.count)!}
          stroke="#439773"
          strokeWidth={2}
        />
        <AxisBottom
          scale={xScale}
          top={height - margin.bottom + 5}
          // @ts-ignore idk how to get TickFormatter to be here
          tickFormat={formatDate}
          tickValues={[startDate, endDate]}
          tickLength={0}
          stroke="gray"
          tickStroke="gray"
          tickLabelProps={(_value, index) => ({
            fill: '#333',
            fontSize: 12,
            textAnchor: index === 0 ? 'start' : 'end',
            dy: '0.25em',
          })}
        />
        <AxisLeft
          scale={yScale}
          left={margin.left - 5}
          tickValues={[minY, maxY]}
          stroke="#333"
          tickLength={0}
          tickStroke="#333"
          tickLabelProps={() => ({
            fill: '#333',
            fontSize: 12,
            textAnchor: 'end',
            dx: '-0.25em',
          })}
        />
        {groupedData.map((d, i) => (
          <g key={i}>
            <circle
              cx={xScale(d.date)}
              cy={yScale(d.count)}
              r={hoveredPoint === i ? 4 : 0}
              fill="#439773"
              className="transition-all duration-200"
            />
            {hoveredPoint === i && (
              <g>
                <line
                  x1={xScale(d.date)}
                  x2={xScale(d.date)}
                  y1={yScale(minY)}
                  y2={yScale(maxY)}
                  width={1}
                  stroke="gray"
                  strokeDasharray="4"
                ></line>
                <rect
                  x={xScale(d.date) - 50}
                  y={yScale(d.count) - 40}
                  width={100}
                  height={30}
                  fill="white"
                  stroke="#439773"
                  strokeWidth={1}
                  rx={4}
                  className="shadow-lg"
                />
                <text
                  x={xScale(d.date)}
                  y={yScale(d.count) - 20}
                  textAnchor="middle"
                  fill="#333"
                  fontSize={12}
                >
                  {formatDate(d.date)}: {d.count}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
