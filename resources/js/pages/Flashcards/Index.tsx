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
import { Flashcard } from '@/components/Flashcard';
import { Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
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
    next_review_at: string;
}

interface Props {
    flashcards: FlashcardType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis Flashcards',
        href: route('flashcards.index'),
    },
];

export default function Index({ flashcards }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Flashcards" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Mis Flashcards</h2>
                        <Link href={route('flashcards.create')}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Flashcard
                            </Button>
                        </Link>
                    </div>

                    {flashcards.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No tienes flashcards</CardTitle>
                                <CardDescription>
                                    Comienza creando tu primera flashcard para empezar a aprender
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {flashcards.map((flashcard) => (
                                <Link
                                    key={flashcard.id}
                                    href={route('flashcards.show', flashcard.id)}
                                    className="block"
                                >
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span className="truncate">
                                                    {flashcard.front_content}
                                                </span>
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    Caja {flashcard.leitner_box.box_number}
                                                </span>
                                            </CardTitle>
                                            <CardDescription>
                                                Próxima revisión:{' '}
                                                {new Date(flashcard.next_review_at).toLocaleDateString()}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 