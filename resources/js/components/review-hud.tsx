import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReviewHUDProps {
    cardsToReview: number;
    completedToday: number;
    totalCards: number;
    successRate: number;
}

export function ReviewHUD({ cardsToReview, completedToday, totalCards, successRate }: ReviewHUDProps) {
    const progress = (completedToday / (completedToday + cardsToReview)) * 100;

    return (
        <div className="fixed top-16 right-0 z-50 p-4 w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-l shadow-lg h-screen">
            <div className="space-y-6">
                {/* Progress Section */}
                <div>
                    <h3 className="text-sm font-medium mb-2">Progreso de Hoy</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{completedToday} completadas</span>
                            <span>{cardsToReview} pendientes</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tasa de Éxito</span>
                        <span className="text-sm font-medium">{(successRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total de Tarjetas</span>
                        <span className="text-sm font-medium">{totalCards}</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-3">Acciones Rápidas</h3>
                    <div className="grid gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route('review.analytics')}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            Ver Análisis
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ver estadísticas detalladas</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route('leitner.index')}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Clock className="mr-2 h-4 w-4" />
                                            Cajas de Leitner
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Gestionar cajas de Leitner</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}