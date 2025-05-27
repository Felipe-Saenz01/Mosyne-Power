import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Flashcard } from '@/components/Flashcard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis Flashcards',
        href: route('flashcards.index'),
    },
    {
        title: 'Nueva Flashcard',
        href: route('flashcards.create'),
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        front_content: '',
        back_content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('flashcards.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Flashcard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nueva Flashcard</CardTitle>
                            <CardDescription>
                                Crea una nueva flashcard para estudiar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Columna izquierda - Campos de entrada */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="front_content">
                                                Frente (Concepto/Pregunta)
                                            </Label>
                                            <Textarea
                                                id="front_content"
                                                value={data.front_content}
                                                onChange={e => setData('front_content', e.target.value)}
                                                rows={3}
                                                placeholder="Escribe el concepto o pregunta aquí..."
                                            />
                                            {errors.front_content && (
                                                <p className="text-sm text-destructive">
                                                    {errors.front_content}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="back_content">
                                                Respaldo (Respuesta/Explicación)
                                            </Label>
                                            <Textarea
                                                id="back_content"
                                                value={data.back_content}
                                                onChange={e => setData('back_content', e.target.value)}
                                                rows={5}
                                                placeholder="Escribe la respuesta o explicación aquí..."
                                            />
                                            {errors.back_content && (
                                                <p className="text-sm text-destructive">
                                                    {errors.back_content}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Columna derecha - Vista previa */}
                                    <div className="space-y-4">
                                        <Label>Vista previa</Label>
                                        <div className="flex items-center justify-center">
                                            <Flashcard
                                                frontContent={data.front_content || 'Frente de la tarjeta'}
                                                backContent={data.back_content || 'Respaldo de la tarjeta'}
                                                showAnswerButtons={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 mt-5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Crear Flashcard
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 