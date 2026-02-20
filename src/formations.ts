import type { FormationDict } from './types';

// X: 0-100 (left to right), Y: 0-100 (top to bottom, where 100 is our own goal)
// We are attacking upwards (towards Y=0)

export const formations: FormationDict = {
    '4-3-3': [
        { id: 'GK', x: 50, y: 90, label: 'GK', position: 'GK' },
        { id: 'LB', x: 15, y: 75, label: 'LB', position: 'DF' },
        { id: 'LCB', x: 35, y: 80, label: 'LCB', position: 'DF' },
        { id: 'RCB', x: 65, y: 80, label: 'RCB', position: 'DF' },
        { id: 'RB', x: 85, y: 75, label: 'RB', position: 'DF' },
        { id: 'LCM', x: 30, y: 55, label: 'LCM', position: 'MF' },
        { id: 'CDM', x: 50, y: 65, label: 'CDM', position: 'MF' },
        { id: 'RCM', x: 70, y: 55, label: 'RCM', position: 'MF' },
        { id: 'LW', x: 20, y: 25, label: 'LW', position: 'FW' },
        { id: 'ST', x: 50, y: 20, label: 'ST', position: 'FW' },
        { id: 'RW', x: 80, y: 25, label: 'RW', position: 'FW' }
    ],
    '4-2-3-1': [
        { id: 'GK', x: 50, y: 90, label: 'GK', position: 'GK' },
        { id: 'LB', x: 15, y: 75, label: 'LB', position: 'DF' },
        { id: 'LCB', x: 35, y: 80, label: 'LCB', position: 'DF' },
        { id: 'RCB', x: 65, y: 80, label: 'RCB', position: 'DF' },
        { id: 'RB', x: 85, y: 75, label: 'RB', position: 'DF' },
        { id: 'LDM', x: 35, y: 60, label: 'LDM', position: 'MF' },
        { id: 'RDM', x: 65, y: 60, label: 'RDM', position: 'MF' },
        { id: 'LAM', x: 25, y: 40, label: 'LAM', position: 'MF' },
        { id: 'CAM', x: 50, y: 35, label: 'CAM', position: 'MF' },
        { id: 'RAM', x: 75, y: 40, label: 'RAM', position: 'MF' },
        { id: 'ST', x: 50, y: 15, label: 'ST', position: 'FW' }
    ],
    '4-4-2': [
        { id: 'GK', x: 50, y: 90, label: 'GK', position: 'GK' },
        { id: 'LB', x: 15, y: 75, label: 'LB', position: 'DF' },
        { id: 'LCB', x: 35, y: 80, label: 'LCB', position: 'DF' },
        { id: 'RCB', x: 65, y: 80, label: 'RCB', position: 'DF' },
        { id: 'RB', x: 85, y: 75, label: 'RB', position: 'DF' },
        { id: 'LM', x: 15, y: 45, label: 'LM', position: 'MF' },
        { id: 'LCM', x: 35, y: 50, label: 'LCM', position: 'MF' },
        { id: 'RCM', x: 65, y: 50, label: 'RCM', position: 'MF' },
        { id: 'RM', x: 85, y: 45, label: 'RM', position: 'MF' },
        { id: 'LS', x: 35, y: 20, label: 'LS', position: 'FW' },
        { id: 'RS', x: 65, y: 20, label: 'RS', position: 'FW' }
    ],
    '3-5-2': [
        { id: 'GK', x: 50, y: 90, label: 'GK', position: 'GK' },
        { id: 'LCB', x: 25, y: 75, label: 'LCB', position: 'DF' },
        { id: 'CB', x: 50, y: 80, label: 'CB', position: 'DF' },
        { id: 'RCB', x: 75, y: 75, label: 'RCB', position: 'DF' },
        { id: 'LWB', x: 10, y: 50, label: 'LWB', position: 'MF' },
        { id: 'LCM', x: 30, y: 55, label: 'LCM', position: 'MF' },
        { id: 'CDM', x: 50, y: 65, label: 'CDM', position: 'MF' },
        { id: 'RCM', x: 70, y: 55, label: 'RCM', position: 'MF' },
        { id: 'RWB', x: 90, y: 50, label: 'RWB', position: 'MF' },
        { id: 'LS', x: 35, y: 20, label: 'LS', position: 'FW' },
        { id: 'RS', x: 65, y: 20, label: 'RS', position: 'FW' }
    ],
    'Custom': [
        { id: 'S1', x: 50, y: 90, label: 'Pos', position: 'Unassigned' },
        { id: 'S2', x: 15, y: 75, label: 'Pos', position: 'Unassigned' },
        { id: 'S3', x: 35, y: 75, label: 'Pos', position: 'Unassigned' },
        { id: 'S4', x: 65, y: 75, label: 'Pos', position: 'Unassigned' },
        { id: 'S5', x: 85, y: 75, label: 'Pos', position: 'Unassigned' },
        { id: 'S6', x: 25, y: 50, label: 'Pos', position: 'Unassigned' },
        { id: 'S7', x: 50, y: 50, label: 'Pos', position: 'Unassigned' },
        { id: 'S8', x: 75, y: 50, label: 'Pos', position: 'Unassigned' },
        { id: 'S9', x: 25, y: 25, label: 'Pos', position: 'Unassigned' },
        { id: 'S10', x: 50, y: 25, label: 'Pos', position: 'Unassigned' },
        { id: 'S11', x: 75, y: 25, label: 'Pos', position: 'Unassigned' }
    ]
};
