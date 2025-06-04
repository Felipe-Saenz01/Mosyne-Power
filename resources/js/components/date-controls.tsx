import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { FastForward, RotateCcw } from 'lucide-react';

export function DateControls() {
    const handleAdvanceDay = () => {
        router.post(route('system.advance-day'));
    };

    const handleResetDate = () => {
        router.post(route('system.reset-date'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Control de Tiempo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                    <Button 
                        variant="outline" 
                        onClick={handleAdvanceDay}
                        className="w-full"
                    >
                        <FastForward className="mr-2 h-4 w-4" />
                        Avanzar un Día
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={handleResetDate}
                        className="w-full"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reiniciar Fecha
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 