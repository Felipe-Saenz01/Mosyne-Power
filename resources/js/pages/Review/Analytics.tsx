import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface AnalyticsProps {
    dailyStats: {
        date: string;
        reviewCount: number;
        successRate: number;
        averageResponseTime: number;
    }[];
    boxDistribution: {
        boxNumber: number;
        cardCount: number;
    }[];
    totalReviews: number;
    averageSuccessRate: number;
    streakDays: number;
    mostReviewedTopics: {
        topic: string;
        count: number;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Review Analytics',
        href: route('review.analytics'),
    },
];

export default function Analytics({
    dailyStats,
    boxDistribution,
    totalReviews,
    averageSuccessRate,
    streakDays,
    mostReviewedTopics,
}: AnalyticsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalReviews}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Success Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {(averageSuccessRate * 100).toFixed(1)}%
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Current Streak</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{streakDays} days</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Active Cards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {boxDistribution.reduce((sum, box) => sum + box.cardCount, 0)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Daily Progress Chart */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Daily Progress</CardTitle>
                            <CardDescription>
                                Your review activity and success rate over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dailyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="reviewCount"
                                            stroke="#8884d8"
                                            name="Reviews"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="successRate"
                                            stroke="#82ca9d"
                                            name="Success Rate"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Box Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Box Distribution</CardTitle>
                                <CardDescription>
                                    Number of cards in each Leitner box
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {boxDistribution.map((box) => (
                                        <div key={box.boxNumber}>
                                            <div className="flex justify-between mb-1">
                                                <span>Box {box.boxNumber}</span>
                                                <span>{box.cardCount} cards</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{
                                                        width: `${
                                                            (box.cardCount /
                                                                Math.max(
                                                                    ...boxDistribution.map(
                                                                        (b) => b.cardCount
                                                                    )
                                                                )) *
                                                            100
                                                        }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Most Reviewed Topics</CardTitle>
                                <CardDescription>
                                    Topics you've reviewed the most
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mostReviewedTopics.map((topic) => (
                                        <div key={topic.topic}>
                                            <div className="flex justify-between mb-1">
                                                <span>{topic.topic}</span>
                                                <span>{topic.count} reviews</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{
                                                        width: `${
                                                            (topic.count /
                                                                Math.max(
                                                                    ...mostReviewedTopics.map(
                                                                        (t) => t.count
                                                                    )
                                                                )) *
                                                            100
                                                        }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 