import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface FlashcardType {
    id: number;
    front_content: string;
    back_content: string;
    next_review_at: string;
    consecutive_misses: number;
    days_overdue: number;
}

interface LeitnerBoxType {
    id: number;
    name: string;
    box_number: number;
    review_interval: number;
    flashcards: FlashcardType[];
    stats: {
        success_rate: number;
        total_reviews: number;
        average_days_to_advance: number;
    };
}

interface Props {
    box: LeitnerBoxType;
}

export default function Show({ box }: Props) {
    const dueFlashcards = box.flashcards.filter(
        f => new Date(f.next_review_at) <= new Date()
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Cajas de Leitner',
            href: route('leitner.index'),
        },
        {
            title: `Caja ${box.name}`,
            href: route('leitner.show', box.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Caja ${box.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={route('leitner.index')}>
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Caja {box.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Nivel {box.box_number} - Revisión cada {box.review_interval} día
                                    {box.review_interval > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {dueFlashcards.length > 0 && (
                            <Link href={route('flashcards.due')}>
                                <Button>
                                    Revisar {dueFlashcards.length} tarjeta
                                    {dueFlashcards.length > 1 ? 's' : ''} pendiente
                                    {dueFlashcards.length > 1 ? 's' : ''}
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tasa de Éxito</CardTitle>
                                <CardDescription>
                                    Porcentaje de respuestas correctas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(box.stats.success_rate)}%
                                </div>
                                <Progress
                                    value={box.stats.success_rate}
                                    className="h-2 mt-2"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revisiones Totales</CardTitle>
                                <CardDescription>
                                    Número total de revisiones
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {box.stats.total_reviews}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Promedio de Avance</CardTitle>
                                <CardDescription>
                                    Días promedio para avanzar de caja
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(box.stats.average_days_to_advance)} días
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tarjetas en esta caja</CardTitle>
                            <CardDescription>
                                {box.flashcards.length} tarjeta{box.flashcards.length !== 1 && 's'} en total
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y">
                                {box.flashcards.map((flashcard) => (
                                    <Link
                                        key={flashcard.id}
                                        href={route('flashcards.show', flashcard.id)}
                                        className="block py-4 hover:bg-muted/50 px-4 -mx-4"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-medium">
                                                {flashcard.front_content}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(flashcard.next_review_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {(flashcard.consecutive_misses > 0 || flashcard.days_overdue > 0) && (
                                            <div className="text-sm text-destructive">
                                                {flashcard.consecutive_misses > 0 && (
                                                    <span className="mr-4">
                                                        {flashcard.consecutive_misses} fallo
                                                        {flashcard.consecutive_misses !== 1 && 's'} consecutivo
                                                        {flashcard.consecutive_misses !== 1 && 's'}
                                                    </span>
                                                )}
                                                {flashcard.days_overdue > 0 && (
                                                    <span>
                                                        {flashcard.days_overdue} día
                                                        {flashcard.days_overdue !== 1 && 's'} de retraso
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 