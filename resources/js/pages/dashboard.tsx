import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Brain, Plus, Clock, TrendingUp } from 'lucide-react';
import { DateControls } from '@/components/date-controls';

interface DashboardProps {
    stats: {
        total_flashcards: number;
        cards_due_today: number;
        completed_today: number;
        success_rate_today: number;
    };
    recent_activity: {
        date: string;
        action: string;
        details: string;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard({ stats, recent_activity }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Bienvenido a Mosyne Power
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Tu asistente personal para el aprendizaje espaciado
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <div className="flex space-x-4">
                            <Link href={route('flashcards.create')}>
                                <Button className="inline-flex items-center">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nueva Flashcard
                                </Button>
                            </Link>
                            <Link href={route('leitner.index')}>
                                <Button variant="outline" className="inline-flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Cajas de Leitner
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Total Flashcards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_flashcards}</div>
                                <p className="text-xs text-muted-foreground">
                                    Tarjetas creadas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Pendientes Hoy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.cards_due_today}</div>
                                <p className="text-xs text-muted-foreground">
                                    Tarjetas por revisar
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Completadas Hoy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completed_today}</div>
                                <p className="text-xs text-muted-foreground">
                                    Revisiones realizadas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Tasa de Éxito
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(stats.success_rate_today * 100).toFixed(1)}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Aciertos de hoy
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity and Next Reviews */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actividad Reciente</CardTitle>
                                    <CardDescription>
                                        Tus últimas interacciones con flashcards
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recent_activity.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-4 rounded-lg border p-3"
                                            >
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {activity.action}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.details}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {activity.date}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Próximas Revisiones</CardTitle>
                                    <CardDescription>
                                        Calendario de revisiones pendientes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center p-6">
                                        <div className="text-center">
                                            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">
                                                {stats.cards_due_today} tarjetas pendientes
                                            </h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Programa tus revisiones para mantener un aprendizaje constante
                                            </p>
                                            <Link href={route('review.analytics')}>
                                                <Button variant="outline" className="mt-4">
                                                    <TrendingUp className="mr-2 h-4 w-4" />
                                                    Ver Análisis
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <DateControls />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
