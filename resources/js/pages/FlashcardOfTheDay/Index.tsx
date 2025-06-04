import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentFlashcard = flashcards[currentIndex];
    const progress = (stats.completed_today / (stats.completed_today + stats.total_due)) * 100;

    const handleFlip = () => {
        if (!isAnswered && !isSubmitting) {
            setIsFlipped(!isFlipped);
        }
    };

    const handleResponse = (remembered: boolean) => {
        if (!currentFlashcard || isAnswered || isSubmitting) return;
        
        setIsSubmitting(true);
        router.post(route('flashcards.review', currentFlashcard.id), {
            remembered
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsAnswered(true);
                setTimeout(() => {
                    if (currentIndex < flashcards.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                        setIsFlipped(false);
                        setIsAnswered(false);
                    } else {
                        router.visit(route('dashboard'), { method: 'get' });
                    }
                }, 1000);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleAdvanceDay = () => {
        if (isAdvancing) return;
        
        setIsAdvancing(true);
        router.visit(route('system.advance-day'), { 
            method: 'post',
            preserveScroll: true,
            onError: () => setIsAdvancing(false)
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Flashcard del Día" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Flashcard del Día
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Revisa tus tarjetas diarias para mantener tu aprendizaje constante
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Tarjetas Pendientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_due}</div>
                                <p className="text-xs text-muted-foreground">
                                    Por revisar hoy
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
                                    <span>{stats.completed_today} completadas</span>
                                    <span>{stats.total_due} pendientes</span>
                                </div>
                                <Progress 
                                    value={progress} 
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flashcard Section */}
                    {flashcards.length > 0 ? (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Tarjeta {currentIndex + 1} de {flashcards.length}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Caja {currentFlashcard.leitner_box.name} (Nivel {currentFlashcard.leitner_box.box_number})
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div 
                                    className={`p-6 min-h-[200px] cursor-pointer transition-all duration-500 relative rounded-lg border ${
                                        isFlipped ? 'bg-muted' : ''
                                    } ${(isAnswered || isSubmitting) ? 'opacity-50' : ''}`}
                                    onClick={handleFlip}
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-lg text-center">
                                            {isFlipped ? currentFlashcard.back_content : currentFlashcard.front_content}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 mt-6">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => handleResponse(false)}
                                        disabled={!isFlipped || isAnswered || isSubmitting}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        No lo recordé
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={() => handleResponse(true)}
                                        disabled={!isFlipped || isAnswered || isSubmitting}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Lo recordé
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12 space-y-4">
                                <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h2 className="text-2xl font-semibold">¡No hay más tarjetas para revisar hoy!</h2>
                                <p className="text-muted-foreground">
                                    Has completado todas tus revisiones programadas. ¡Buen trabajo!
                                </p>
                                <Button
                                    size="lg"
                                    onClick={handleAdvanceDay}
                                    disabled={isAdvancing}
                                    className="mt-4"
                                >
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    {isAdvancing ? 'Avanzando...' : 'Avanzar al siguiente día'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 