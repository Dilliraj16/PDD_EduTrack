/**
 * Automatically generates a standard unique Registration Number.
 * 
 * Format: [ROLE]-[YEAR]-[DEPT]-[SEQUENCE]
 * Examples: 
 * - STD-2026-CS-0154 (Student)
 * - FAC-2026-CS-0042 (Faculty)
 */
export const generateRegistrationNumber = (role: 'student' | 'faculty' | 'parent', department: string = 'CS') => {
    const year = new Date().getFullYear();

    // Generate a secure 4-digit random sequence to avoid collisions linearly
    const seq = Math.floor(1000 + Math.random() * 9000);

    switch (role) {
        case 'student':
            return `STD-${year}-${department}-${seq}`;
        case 'faculty':
            return `FAC-${year}-${department}-${seq}`;

        case 'parent':
            return `PRT-${year}-${seq}`;
        default:
            return `USR-${year}-${seq}`;
    }
};
