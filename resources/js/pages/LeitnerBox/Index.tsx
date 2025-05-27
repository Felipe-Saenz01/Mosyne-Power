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
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface LeitnerBoxType {
    id: number;
    name: string;
    box_number: number;
    review_interval: number;
    flashcards_count: number;
    due_count: number;
}

interface Props {
    boxes: LeitnerBoxType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cajas de Leitner',
        href: route('leitner.index'),
    },
];

export default function Index({ boxes }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cajas de Leitner" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boxes.map((box) => (
                            <Link
                                key={box.id}
                                href={route('leitner.show', box.id)}
                                className="block"
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>{box.name}</span>
                                            <span className="text-sm font-normal text-muted-foreground">
                                                Nivel {box.box_number}
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            Revisión cada {box.review_interval} día
                                            {box.review_interval > 1 ? 's' : ''}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Tarjetas totales</span>
                                                    <span>{box.flashcards_count}</span>
                                                </div>
                                                <Progress
                                                    value={(box.flashcards_count / Math.max(...boxes.map(b => b.flashcards_count))) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Pendientes de revisión</span>
                                                    <span>{box.due_count}</span>
                                                </div>
                                                <Progress
                                                    value={(box.due_count / box.flashcards_count) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 