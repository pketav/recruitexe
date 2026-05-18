'use client'

import React, { useState } from 'react'
import { 
    Container, 
    Box,
    Fade
} from '@mui/material'
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation'

// Import components
import AdminNavbar from './components/AdminNavbar'
import UsersManagement from './components/UsersManagement'
import PlansManagement from './components/PlansManagement'
import BookedDemo from './components/BookedDemo';

function AdminPanel() {
    const [activeTab, setActiveTab] = useState(0)
    const { userData } = useAuth();
    const router = useRouter()
    if (userData && userData.role && !userData.role.includes("productOwner")) {
        router.push("/")
    }

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8fafc',
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(115,103,240,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
        }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Admin Navigation */}
                <AdminNavbar 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange} 
                    router={router}
                />

                {/* Tab Content */}
                <Fade in={true} timeout={500} key={activeTab}>
                    <Box>
                        {activeTab === 0 && <UsersManagement />}
                        {activeTab === 1 && <PlansManagement />}
                        {activeTab === 2 && <BookedDemo />}
                    </Box>
                </Fade>
            </Container>
        </Box>
    )
}

export default AdminPanel