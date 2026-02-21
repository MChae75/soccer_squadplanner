import React, { useState, useRef } from 'react';
import type { Player, Quarter, Position, SlotCoordinate } from './types';
import { formations } from './formations';
import { DndContext, useDraggable, useDroppable, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { GripVertical, AlertTriangle, Move } from 'lucide-react';

interface PlannerScreenProps {
    players: Player[];
    quarters: Quarter[];
    onQuarterUpdate: (qId: number, update: Partial<Quarter>) => void;
    onFinish?: () => void;
}

function SidebarPlayer({ player, subCount, onField, onClick }: { player: Player; subCount: number; onField: boolean; onClick: () => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${player.id}`,
        data: { player, source: 'sidebar' },
        disabled: onField
    });

    const style = {
        opacity: onField ? 0.3 : (isDragging ? 0.5 : 1),
        cursor: onField ? 'not-allowed' : 'grab'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`roster-player ${subCount > 0 ? (subCount > 2 ? 'sub-high' : '') : ''}`}
            onClick={onClick}
            {...attributes}
            {...listeners}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GripVertical size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.9rem' }}>{player.name}</span>
            </div>
            {!onField && (
                <span className="sub-count" title="Times substituted before this quarter">
                    {subCount > 0 ? (
                        <>
                            {subCount >= 2 && <AlertTriangle size={12} color="var(--accent-red)" style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline-block' }} />}
                            Sub: {subCount}
                        </>
                    ) : (
                        'Sub: 0'
                    )}
                </span>
            )}
            {onField && <span className="sub-count" style={{ background: 'var(--primary)' }}>On Field</span>}
        </div>
    );
}

function PitchSlotNode({ slot, assignedPlayer, isSelected, onClick, isCustomMode, customPos }: { slot: SlotCoordinate; assignedPlayer?: Player; isSelected: boolean; onClick: () => void; isCustomMode: boolean; customPos: { x: number, y: number } }) {
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `slot-${slot.id}`,
        data: { slotId: slot.id }
    });

    const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
        id: `pitch-${slot.id}`,
        data: { player: assignedPlayer, source: 'pitch', slotId: slot.id },
        disabled: (!assignedPlayer && !isCustomMode)
    });

    const { attributes: moveAttrs, listeners: moveListeners, setNodeRef: setMoveDraggableRef, transform: moveTransform } = useDraggable({
        id: `move-slot-${slot.id}`,
        data: { source: 'move-slot', slotId: slot.id }
    });

    const setNodeRef = (node: HTMLElement | null) => {
        setDroppableRef(node);
        setDraggableRef(node);
    };

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${customPos.x}%`,
        top: `${customPos.y}%`,
        transform: `translate(-50%, -50%) ${moveTransform ? `translate3d(${moveTransform.x}px, ${moveTransform.y}px, 0)` : ''}`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: (isDragging || moveTransform) ? 10 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`pitch-slot ${assignedPlayer ? 'filled' : ''} ${isOver ? 'is-over' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            {...(assignedPlayer ? attributes : {})}
            {...(assignedPlayer ? listeners : {})}
            title={assignedPlayer ? assignedPlayer.name : `Drop player here for ${slot.label}`}
        >
            {isCustomMode && (
                <div
                    ref={setMoveDraggableRef}
                    {...moveAttrs}
                    {...moveListeners}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute', top: -10, right: -10, width: 20, height: 20,
                        background: 'white', borderRadius: '50%', color: 'black',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', zIndex: 100,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    <Move size={12} />
                </div>
            )}
            {assignedPlayer ? (
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>
                    {assignedPlayer.name.substring(0, 6)}
                </span>
            ) : (
                <span style={{ fontSize: '1.2rem', opacity: 0.8, color: 'white' }}>+</span>
            )}
            <span className="slot-name">{slot.label}</span>
            {!assignedPlayer && <span className="slot-pos">{slot.position}</span>}
        </div>
    );
}

export function PlannerScreen({ players, quarters, onQuarterUpdate }: PlannerScreenProps) {
    const pitchContainerRef = useRef<HTMLDivElement>(null);
    const [activeQuarterId, setActiveQuarterId] = useState<number>(0);
    const [activeDragData, setActiveDragData] = useState<any>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        })
    );

    const currentQuarter = quarters[activeQuarterId];

    const getSubCount = (playerId: string) => {
        let count = 0;
        for (let i = 0; i < activeQuarterId; i++) {
            const q = quarters[i];
            const isOnField = Object.values(q.assignments).includes(playerId);
            if (!isOnField) count++;
        }
        return count;
    };

    const handleSlotClick = (slotId: string) => {
        const newAssignments = { ...currentQuarter.assignments };
        if (newAssignments[slotId]) {
            delete newAssignments[slotId];
            onQuarterUpdate(activeQuarterId, { assignments: newAssignments });
            if (selectedSlotId === slotId) {
                setSelectedSlotId(null);
            }
            return;
        }

        setSelectedSlotId(prev => prev === slotId ? null : slotId);
    };

    const handleSidebarPlayerClick = (playerId: string) => {
        if (!selectedSlotId) return;

        const newAssignments = { ...currentQuarter.assignments };

        const oldSlotId = Object.keys(newAssignments).find(key => newAssignments[key] === playerId);
        if (oldSlotId) {
            delete newAssignments[oldSlotId];
        }

        const existingPlayerId = newAssignments[selectedSlotId];
        if (existingPlayerId && oldSlotId) {
            newAssignments[oldSlotId] = existingPlayerId;
        }

        newAssignments[selectedSlotId] = playerId;
        onQuarterUpdate(activeQuarterId, { assignments: newAssignments });
        setSelectedSlotId(null);
    };

    const { setNodeRef: setSidebarDroppableRef } = useDroppable({
        id: 'sidebar-drop-zone',
    });

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragData(event.active.data.current);
    };

    const slots = formations[currentQuarter.formation];
    const assignedPlayerIds = Object.values(currentQuarter.assignments);

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveDragData(null);
        const { active, over } = event;
        const sourceData = active.data.current;
        if (!sourceData) return;

        if (sourceData.source === 'move-slot') {
            const slotId = sourceData.slotId;
            const pitchRect = pitchContainerRef.current?.getBoundingClientRect();
            if (pitchRect) {
                const currentPos = currentQuarter.customCoordinates?.[slotId] || {
                    x: slots.find(s => s.id === slotId)?.x || 50,
                    y: slots.find(s => s.id === slotId)?.y || 50
                };

                const newX = currentPos.x + (event.delta.x / pitchRect.width) * 100;
                const newY = currentPos.y + (event.delta.y / pitchRect.height) * 100;

                const safeX = Math.max(0, Math.min(100, newX));
                const safeY = Math.max(0, Math.min(100, newY));

                const updatedCoords = { ...(currentQuarter.customCoordinates || {}) };
                updatedCoords[slotId] = { x: safeX, y: safeY };
                onQuarterUpdate(activeQuarterId, { customCoordinates: updatedCoords });
            }
            return;
        }

        if (!over) return;

        const overId = over.id as string;
        const newAssignments = { ...currentQuarter.assignments };
        const droppedPlayer = sourceData.player as Player;

        let oldSlotId: string | null = null;
        if (sourceData.source === 'pitch' && sourceData.slotId) {
            oldSlotId = sourceData.slotId as string;
            delete newAssignments[oldSlotId];
        }

        if (overId === 'sidebar-drop-zone') {
            onQuarterUpdate(activeQuarterId, { assignments: newAssignments });
            return;
        }

        if (overId.startsWith('slot-')) {
            const targetSlotId = overId.replace('slot-', '');

            const existingPlayerId = newAssignments[targetSlotId];
            if (existingPlayerId && oldSlotId) {
                newAssignments[oldSlotId] = existingPlayerId;
            }

            newAssignments[targetSlotId] = droppedPlayer.id;
            onQuarterUpdate(activeQuarterId, { assignments: newAssignments });
        }
    };



    const POSITIONS: Position[] = ['GK', 'DF', 'MF', 'FW', 'Unassigned'];

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="planner-layout">
                {/* Sidebar */}
                <div className="glass-panel planner-sidebar" ref={setSidebarDroppableRef}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0 }}>Quarters</h3>
                            {activeQuarterId > 0 && (
                                <button
                                    className="btn"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                    onClick={() => {
                                        const prevQuarter = quarters[activeQuarterId - 1];
                                        onQuarterUpdate(activeQuarterId, {
                                            formation: prevQuarter.formation,
                                            assignments: { ...prevQuarter.assignments },
                                            customCoordinates: prevQuarter.customCoordinates ? { ...prevQuarter.customCoordinates } : undefined
                                        });
                                    }}
                                >
                                    Keep last block
                                </button>
                            )}
                        </div>
                        <div className="quarter-tabs">
                            {quarters.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`quarter-tab ${idx === activeQuarterId ? 'active' : ''}`}
                                    onClick={() => setActiveQuarterId(idx)}
                                >
                                    Q{idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Formation</label>
                        <select
                            value={currentQuarter.formation}
                            onChange={(e) => {
                                onQuarterUpdate(activeQuarterId, { formation: e.target.value, assignments: {} });
                            }}
                        >
                            {Object.keys(formations).map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {POSITIONS.map(pos => {
                            const posPlayers = players.filter(p => p.position === pos);
                            if (posPlayers.length === 0) return null;
                            return (
                                <div key={pos} className="roster-group">
                                    <h3>{pos}</h3>
                                    {posPlayers.map(p => (
                                        <SidebarPlayer
                                            key={p.id}
                                            player={p}
                                            subCount={getSubCount(p.id)}
                                            onField={assignedPlayerIds.includes(p.id)}
                                            onClick={() => handleSidebarPlayerClick(p.id)}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* The Pitch */}
                <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="pitch-container" ref={pitchContainerRef}>
                        <div className="pitch-line-half" />
                        <div className="pitch-circle" />
                        <div className="pitch-penalty-top" />
                        <div className="pitch-penalty-bottom" />

                        {slots.map(slot => {
                            const customPos = currentQuarter.customCoordinates?.[slot.id] || { x: slot.x, y: slot.y };
                            return (
                                <PitchSlotNode
                                    key={slot.id}
                                    slot={slot}
                                    assignedPlayer={players.find(p => p.id === currentQuarter.assignments[slot.id])}
                                    isSelected={selectedSlotId === slot.id}
                                    onClick={() => handleSlotClick(slot.id)}
                                    isCustomMode={currentQuarter.formation === 'Custom'}
                                    customPos={customPos}
                                />
                            );
                        })}
                    </div>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeDragData && activeDragData.player ? (
                        <div className="player-card" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: 8, transform: 'scale(1.05)', whiteSpace: 'nowrap' }}>
                            {activeDragData.player.name}
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
