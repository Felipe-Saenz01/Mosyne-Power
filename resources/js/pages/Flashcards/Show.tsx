import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Flashcard } from '@/components/Flashcard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
    flashcard: {
        id: number;
        front_content: string;
        back_content: string;
        leitner_box: {
            name: string;
            box_number: number;
        };
        next_review_at: string;
        consecutive_misses: number;
        days_overdue: number;
    };
}

export default function Show({ flashcard }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mis Flashcards',
            href: route('flashcards.index'),
        },
        {
            title: 'Ver Flashcard',
            href: route('flashcards.show', flashcard.id),
        },
    ];

    const handleDelete = () => {
        router.delete(route('flashcards.destroy', flashcard.id));
    };

    const handleEdit = () => {
        router.get(route('flashcards.create'), {
            flashcard: flashcard.id,
            editing: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ver Flashcard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={route('flashcards.index')}>
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Ver Flashcard
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Caja {flashcard.leitner_box.name} (Nivel {flashcard.leitner_box.box_number})
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={route('flashcards.edit', flashcard.id)}>
                                <Button variant="outline">
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            </Link>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Se eliminará permanentemente esta flashcard
                                            y todo su historial de revisiones.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles</CardTitle>
                                <CardDescription>
                                    Información sobre la flashcard y su progreso
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-1">Próxima revisión</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(flashcard.next_review_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {flashcard.consecutive_misses > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-1 text-destructive">
                                            Fallos consecutivos
                                        </h3>
                                        <p className="text-sm text-destructive">
                                            {flashcard.consecutive_misses} fallo
                                            {flashcard.consecutive_misses !== 1 && 's'} consecutivo
                                            {flashcard.consecutive_misses !== 1 && 's'}
                                        </p>
                                    </div>
                                )}

                                {flashcard.days_overdue > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-1 text-destructive">
                                            Retraso en revisión
                                        </h3>
                                        <p className="text-sm text-destructive">
                                            {flashcard.days_overdue} día
                                            {flashcard.days_overdue !== 1 && 's'} de retraso
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center">
                            <Flashcard
                                frontContent={flashcard.front_content}
                                backContent={flashcard.back_content}
                                showAnswerButtons={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 