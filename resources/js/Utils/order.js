export function statusOrderLabel(status, fulfillmentType = 'delivery') {
    const labels = {
        delivery: {
            pending: 'Dibuat',
            preparing: 'Diproses',
            out_for_delivery: 'Diantar',
            delivered: 'Diterima',
            completed: 'Diterima',
            cancelled: 'Dibatalkan',
        },
        pickup: {
            pending: 'Dibuat',
            preparing: 'Siap Diambil',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        },
    };

    const map = labels[fulfillmentType] || labels.delivery;
    return map[status] || status?.replace(/_/g, ' ') || '-';
}

export function fulfillmentSteps(fulfillmentType) {
    if (fulfillmentType === 'pickup') {
        return [
            { key: 'pending', label: 'Dibuat', statuses: ['pending', 'preparing'] },
            { key: 'siap_diambil', label: 'Siap Diambil', statuses: ['preparing', 'completed'] },
        ];
    }

    return [
        { key: 'dibuat', label: 'Dibuat', statuses: ['pending', 'preparing'] },
        { key: 'diantar', label: 'Diantar', statuses: ['out_for_delivery'] },
        { key: 'diterima', label: 'Diterima', statuses: ['delivered', 'completed'] },
    ];
}

export function isStepActive(step, currentStatus) {
    return step.statuses.includes(currentStatus);
}

export function isStepCompleted(stepIndex, steps, currentStatus) {
    for (let i = 0; i < stepIndex; i++) {
        if (steps[i].statuses.includes(currentStatus)) return true;
    }
    const currentStepIndex = steps.findIndex(s => s.statuses.includes(currentStatus));
    return currentStepIndex > stepIndex;
}
