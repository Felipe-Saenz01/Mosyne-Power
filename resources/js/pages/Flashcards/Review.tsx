import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Flashcard } from '@/components/Flashcard';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface FlashcardType {
    id: number;
    front_content: string;
    back_content: string;
    leitner_box: {
        name: string;
        box_number: number;
    };
}

interface Props {
    flashcards: FlashcardType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis Flashcards',
        href: route('flashcards.index'),
    },
    {
        title: 'Revisar',
        href: route('flashcards.due'),
    },
];

export default function Review({ flashcards }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviewedCount, setReviewedCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentFlashcard = flashcards[currentIndex];
    const progress = (reviewedCount / flashcards.length) * 100;

    const handleRemembered = (remembered: boolean) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        router.post(route('flashcards.review', currentFlashcard.id), {
            remembered,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSubmitting(false);
                if (currentIndex < flashcards.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                }
                setReviewedCount(prev => prev + 1);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    if (flashcards.length === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Revisar Flashcards" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>¡No hay tarjetas para revisar!</CardTitle>
                                <CardDescription>
                                    Has completado todas tus revisiones por ahora
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(route('dashboard'))}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver al inicio
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (reviewedCount === flashcards.length) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Revisión Completada" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>¡Revisión Completada!</CardTitle>
                                <CardDescription>
                                    Has revisado todas las tarjetas programadas para hoy
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(route('dashboard'))}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver al inicio
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revisar Flashcards" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">
                                Tarjeta {currentIndex + 1} de {flashcards.length}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(progress)}% completado
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revisar Flashcard</CardTitle>
                            <CardDescription>
                                Caja {currentFlashcard.leitner_box.name} (Nivel {currentFlashcard.leitner_box.box_number})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Flashcard
                                frontContent={currentFlashcard.front_content}
                                backContent={currentFlashcard.back_content}
                                onRemembered={handleRemembered}
                                showAnswerButtons
                                disabled={isSubmitting}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 