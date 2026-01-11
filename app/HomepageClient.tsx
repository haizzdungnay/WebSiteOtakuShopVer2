'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function HomepageClient() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
        />
    );
}
