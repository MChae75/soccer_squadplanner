import type { Player, Position } from './types';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface PositionCategorizerProps {
    players: Player[];
    onPlayerMoved: (playerId: string, newPosition: Position) => void;
    onContinue: () => void;
}

const POSITIONS: Position[] = ['Unassigned', 'GK', 'DF', 'MF', 'FW'];

function DraggablePlayerCard({ player }: { player: Player }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: player.id,
        data: { player }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`player-card ${isDragging ? 'is-dragging' : ''}`}
            {...attributes}
            {...listeners}
        >
            <span style={{ fontWeight: 500 }}>{player.name}</span>
            <GripVertical size={16} color="var(--text-muted)" />
        </div>
    );
}

function Column({ position, players }: { position: Position; players: Player[] }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${position}`,
        data: { position }
    });

    return (
        <div
            ref={setNodeRef}
            className="glass-panel position-column"
            style={{ borderColor: isOver ? 'var(--primary)' : 'var(--panel-border)' }}
        >
            <div className={`column-header tag-${position.toLowerCase()}`}>
                {position} ({players.length})
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '100px' }}>
                {players.map((p) => (
                    <DraggablePlayerCard key={p.id} player={p} />
                ))}
                {players.length === 0 && (
                    <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
                        Drag here
                    </div>
                )}
            </div>
        </div>
    );
}

export function PositionCategorizer({ players, onPlayerMoved, onContinue }: PositionCategorizerProps) {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const playerId = active.id as string;

        // Check if dropping on a column
        if (over.data.current && over.data.current.position) {
            onPlayerMoved(playerId, over.data.current.position);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Assign Positions</h2>
                <button className="btn" onClick={onContinue}>
                    Confirm Positions
                </button>
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="categorizer-grid">
                    {POSITIONS.map((pos) => (
                        <Column key={pos} position={pos} players={players.filter((p) => p.position === pos)} />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
