import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FlashcardProps {
    frontContent: string;
    backContent: string;
    onRemembered?: (remembered: boolean) => void;
    showAnswerButtons?: boolean;
    disabled?: boolean;
}

export function Flashcard({
    frontContent,
    backContent,
    onRemembered,
    showAnswerButtons = false,
    disabled = false,
}: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        if (!disabled) {
            setIsFlipped(!isFlipped);
        }
    };

    const handleRemembered = (remembered: boolean) => {
        if (onRemembered && !disabled) {
            onRemembered(remembered);
            setIsFlipped(false);
        }
    };

    return (
        <div className="w-full max-w-md aspect-[3/2] relative [perspective:1000px]">
            <div
                role="button"
                tabIndex={0}
                className={cn(
                    'w-full h-full absolute transition-all duration-500 [transform-style:preserve-3d] cursor-pointer',
                    isFlipped ? '[transform:rotateY(180deg)]' : '',
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                )}
                onClick={handleFlip}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                        handleFlip();
                    }
                }}
            >
                {/* Frente */}
                <Card className="w-full h-full p-6 absolute [backface-visibility:hidden]">
                    <div className="flex items-center justify-center h-full text-center">
                        <p className="text-lg">{frontContent}</p>
                    </div>
                </Card>

                {/* Respaldo */}
                <Card className="w-full h-full p-6 absolute [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <p className="text-lg text-center">{backContent}</p>
                        
                        {showAnswerButtons && (
                            <div className="flex gap-4 mt-4">
                                <Button
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemembered(false);
                                    }}
                                    disabled={disabled}
                                >
                                    No recordé
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemembered(true);
                                    }}
                                    disabled={disabled}
                                >
                                    Sí recordé
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
} 