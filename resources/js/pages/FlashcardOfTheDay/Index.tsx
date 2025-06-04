import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Flashcard } from '@/components/Flashcard';

interface FlashcardOfTheDayProps {
    stats: {
        total_due: number;
        completed_today: number;
        success_rate: number;
    };
    flashcards: {
        id: number;
        front_content: string;
        back_content: string;
        leitner_box: {
            box_number: number;
            name: string;
        };
    }[];
    totalDue: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Flashcard del Día',
        href: route('dashboard'),
    },
];

export default function FlashcardOfTheDay({ stats, flashcards, totalDue }: FlashcardOfTheDayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedFlashcards, setCompletedFlashcards] = useState<number[]>([]);

    const currentFlashcard = flashcards[currentIndex];
    const progress = (completedFlashcards.length / flashcards.length) * 100;

    const handleRemembered = (remembered: boolean) => {
        if (!currentFlashcard || isSubmitting || completedFlashcards.includes(currentFlashcard.id)) return;
        
        setIsSubmitting(true);
        router.post(route('flashcards.review', currentFlashcard.id), {
            remembered
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setCompletedFlashcards(prev => [...prev, currentFlashcard.id]);
                
                // Si es la última flashcard o todas han sido completadas
                if (currentIndex === flashcards.length - 1 || completedFlashcards.length + 1 === flashcards.length) {
                    router.visit(route('dashboard'));
                } else {
                    // Buscar la siguiente flashcard no completada
                    let nextIndex = currentIndex + 1;
                    while (nextIndex < flashcards.length && completedFlashcards.includes(flashcards[nextIndex].id)) {
                        nextIndex++;
                    }
                    setCurrentIndex(nextIndex);
                }
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Si todas las flashcards han sido completadas, mostrar mensaje
    if (completedFlashcards.length === flashcards.length || flashcards.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Flashcard del Día" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>¡No hay más tarjetas para revisar!</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Has completado todas las revisiones programadas para hoy.
                                </p>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Flashcard del Día" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Tarjetas Pendientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{flashcards.length - completedFlashcards.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Por revisar hoy
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Completadas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{completedFlashcards.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Revisadas hoy
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
                                    {stats.success_rate.toFixed(1)}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Aciertos de hoy
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Progress Bar */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Progreso de Hoy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{completedFlashcards.length} completadas</span>
                                    <span>{flashcards.length - completedFlashcards.length} pendientes</span>
                                </div>
                                <Progress 
                                    value={progress} 
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flashcard Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Tarjeta {currentIndex + 1} de {flashcards.length}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Caja {currentFlashcard.leitner_box.name} (Nivel {currentFlashcard.leitner_box.box_number})
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <Flashcard
                                    frontContent={currentFlashcard.front_content}
                                    backContent={currentFlashcard.back_content}
                                    onRemembered={handleRemembered}
                                    showAnswerButtons
                                    disabled={isSubmitting}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 