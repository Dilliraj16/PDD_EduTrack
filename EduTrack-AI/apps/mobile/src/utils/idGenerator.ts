export const generateRegistrationNumber = (role: 'student' | 'faculty' | 'parent', department: string = 'CS') => {
    const year = new Date().getFullYear();
    const seq = Math.floor(1000 + Math.random() * 9000);
    switch (role) {
        case 'student': return `STD-${year}-${department}-${seq}`;
        case 'faculty': return `FAC-${year}-${department}-${seq}`;
        case 'parent': return `PRT-${year}-${seq}`;
        default: return `USR-${year}-${seq}`;
    }
};
