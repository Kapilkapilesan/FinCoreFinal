'use client';

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { ViewMeetingScheduling } from '../../components/centers/ViewMeetingScheduling';

export default function MeetingSchedulingPage() {
    return (
            <div className="p-6">
                <ViewMeetingScheduling />
            </div>
    );
}
