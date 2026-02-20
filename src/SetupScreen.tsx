import React, { useState } from 'react';
import { Users, Settings, Plus, Minus } from 'lucide-react';

interface SetupScreenProps {
    onComplete: (names: string[], quarterCount: number) => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
    const [namesText, setNamesText] = useState('');
    const [quarters, setQuarters] = useState(4);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const names = namesText
            .split(/\s+/)
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        if (names.length === 0) {
            alert('Please enter at least one player name.');
            return;
        }
        onComplete(names, quarters);
    };

    return (
        <div className="glass-panel setup-form">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={24} color="var(--primary)" />
                Squad Setup
            </h2>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Player Names (space separated)
                </label>
                <textarea
                    rows={5}
                    placeholder="e.g. Messi Ronaldo Neymar Mbappe"
                    value={namesText}
                    onChange={(e) => setNamesText(e.target.value)}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    Total players: {namesText.split(/\s+/).filter(n => n.trim().length > 0).length}
                </small>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Number of Quarters / Blocks
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem', borderRadius: 8, border: '1px solid var(--panel-border)', width: 'fit-content' }}>
                    <button className="btn btn-secondary" onClick={() => setQuarters(Math.max(1, quarters - 1))} type="button" style={{ padding: '0.5rem', width: '40px', height: '40px' }}>
                        <Minus size={20} />
                    </button>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>
                        {quarters}
                    </div>
                    <button className="btn btn-secondary" onClick={() => setQuarters(Math.min(10, quarters + 1))} type="button" style={{ padding: '0.5rem', width: '40px', height: '40px' }}>
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <button className="btn" onClick={handleSubmit}>
                <Users size={18} />
                Next: Assign Positions
            </button>
        </div>
    );
}
