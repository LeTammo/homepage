/*
 * Structural skill data (grouping, gradient colors, order).
 * `transKey` points into the `skills` section of the locale files, which
 * holds the actual abbr/name/detail text for every skill (translated
 * even where the English and German copy happens to match).
 */

export const categories = [
    {
        transKey: 'categoryBackend',
        skills: [
            {transKey: 'php', from: '#06b6d4', to: '#3b82f6'},
            {transKey: 'java', from: '#10b981', to: '#16a34a'},
            {transKey: 'python', from: '#22d3ee', to: '#0891b2'},
            {transKey: 'node', from: '#16a34a', to: '#047857'},
            {transKey: 'databases', from: '#4f46e5', to: '#9333ea'},
            {transKey: 'architecture', from: '#64748b', to: '#475569'},
        ],
    },
    {
        transKey: 'categoryWorkAI',
        skills: [
            {transKey: 'projectManagement', from: '#16a34a', to: '#047857'},
            {transKey: 'agileMethods', from: '#14b8a6', to: '#0891b2'},
            {transKey: 'mathematics', from: '#6366f1', to: '#2563eb'},
            {transKey: 'llmApis', from: '#ec4899', to: '#f43f5e'},
            {transKey: 'promptEngineering', from: '#f59e0b', to: '#f97316'},
            {transKey: 'onPremiseAI', from: '#7c3aed', to: '#c026d3'},
        ],
    },
    {
        transKey: 'categoryFrontend',
        skills: [
            {transKey: 'javascript', from: '#3b82f6', to: '#2563eb'},
            {transKey: 'htmlCss', from: '#38bdf8', to: '#3b82f6'},
            {transKey: 'react', from: '#8b5cf6', to: '#9333ea'},
            {transKey: 'templating', from: '#64748b', to: '#475569'},
        ],
    },
    {
        transKey: 'categoryDevOps',
        skills: [
            {transKey: 'docker', from: '#2563eb', to: '#0ea5e9'},
            {transKey: 'nginx', from: '#10b981', to: '#14b8a6'},
            {transKey: 'git', from: '#f97316', to: '#dc2626'},
            {transKey: 'operatingSystems', from: '#64748b', to: '#475569'},
        ],
    },
];
