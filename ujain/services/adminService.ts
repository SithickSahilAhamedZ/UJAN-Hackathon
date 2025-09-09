// A simple mock for the admin login service.

const ADMIN_USER = {
    email: 'admin@pilgrimpath.com',
    password: 'admin',
};

/**
 * Simulates an admin login without a backend server.
 * @param email The admin's email.
 * @param password The admin's password.
 * @returns A promise that resolves to a mock token on success, or null on failure.
 */
export const loginAdmin = async (email: string, password: string): Promise<string | null> => {
    console.log("Attempting client-side admin login...");
    // Simulate network delay for a more realistic UX
    return new Promise(resolve => {
        setTimeout(() => {
            if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
                console.log("Admin login successful.");
                // In a real app, this would be a JWT. For this mock, a simple string is fine.
                const mockToken = 'fake-admin-token-from-client';
                resolve(mockToken);
            } else {
                console.log("Admin login failed: Invalid credentials.");
                resolve(null);
            }
        }, 500);
    });
};
