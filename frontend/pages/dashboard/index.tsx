import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './admin';
import SuperAdminDashboard from './superadmin';
import UnauthorizedPage from './UnauthorizedPage';
import Cookies from 'js-cookie';

interface User {
    email: string;
    sub: string;
    role: string[];
}

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const access_token = Cookies.get('token');
    const userRole = Cookies.get('role');

    useEffect(() => {
        const fetchUser = async () => {
            if (!access_token) {
                setLoading(false);
                return;
            }
            try {
                const userResponse = await axios.get('http://localhost:4000/users/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                console.log('User data:', userResponse.data);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [access_token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!access_token || !user) {
        return <UnauthorizedPage />;
    }

    if (userRole === 'SUPER_ADMIN') {
        return <SuperAdminDashboard />;
    } else if (userRole === 'ADMIN' || userRole === 'USER') {
        return <AdminDashboard />;
    } else {
        return <UnauthorizedPage />;
    }
};

export default Dashboard;
