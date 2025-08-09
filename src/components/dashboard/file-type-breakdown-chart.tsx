"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { type FileItem } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Files",
  },
  text: { label: "Text", color: "hsl(var(--chart-1))" },
  image: { label: "Image", color: "hsl(var(--chart-2))" },
  video: { label: "Video", color: "hsl(var(--chart-3))" },
  audio: { label: "Audio", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

import { stats } from '@/lib/api/stats';

interface FileTypeBreakdownChartProps {
  files: FileItem[];
}

export function FileTypeBreakdownChart({ files }: FileTypeBreakdownChartProps) {
  const [chartData, setChartData] = React.useState<{ type: string; count: number; fill: string }[]>([]);
  const [totalFiles, setTotalFiles] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await stats.getFileTypeBreakdown(token);
        const total = data.reduce((sum, item) => sum + item.count, 0);
        
        setChartData(data.map(item => ({
          type: item.type,
          count: item.count,
          fill: `var(--color-${item.type.toLowerCase()})`
        })));
        setTotalFiles(total);
      } catch (error) {
        console.error('Failed to fetch file type stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>File Types</CardTitle>
        <CardDescription>Breakdown of uploaded file types</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.type}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="type" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing data for {totalFiles} total files.
        </div>
      </CardFooter>
    </Card>
  )
}
