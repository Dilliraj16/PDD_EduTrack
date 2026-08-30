const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const executeMoves = () => {
    const moves = [
        // Web Layouts
        ['apps/web/src/layouts/DashboardLayout.tsx', 'apps/web/src/components/layout/DashboardLayout.tsx'],

        // Web Pages
        ['apps/web/src/pages/authentication/Login.tsx', 'apps/web/src/pages/auth/Login.tsx'],
        ['apps/web/src/pages/student/Dashboard.tsx', 'apps/web/src/pages/student/StudentDashboard.tsx'],
        ['apps/web/src/pages/faculty/Dashboard.tsx', 'apps/web/src/pages/faculty/FacultyDashboard.tsx'],
        ['apps/web/src/pages/faculty/StudentRegistration.tsx', 'apps/web/src/pages/faculty/StudentRegistrationPage.tsx'],

        // Web Services -> Features
        ['apps/web/src/services/authService.ts', 'apps/web/src/features/authentication/services/authService.ts'],
        ['apps/web/src/services/attendanceService.ts', 'apps/web/src/features/attendance/services/attendanceService.ts'],
        ['apps/web/src/services/studentService.ts', 'apps/web/src/features/profile/services/studentService.ts'],
        ['apps/web/src/services/chatService.ts', 'apps/web/src/features/notifications/services/chatService.ts'],

        // Mobile Screens -> Folders
        ['apps/mobile/src/screens/LoginScreen.tsx', 'apps/mobile/src/screens/auth/LoginScreen.tsx'],
        ['apps/mobile/src/screens/StudentDashboard.tsx', 'apps/mobile/src/screens/student/StudentDashboard.tsx'],
        ['apps/mobile/src/screens/FacultyDashboard.tsx', 'apps/mobile/src/screens/faculty/FacultyDashboard.tsx'],
        ['apps/mobile/src/screens/AttendanceScreen.tsx', 'apps/mobile/src/screens/faculty/AttendanceScreen.tsx'],
        ['apps/mobile/src/screens/StudentRegistrationScreen.tsx', 'apps/mobile/src/screens/faculty/StudentRegistrationScreen.tsx'],
        ['apps/mobile/src/screens/CreateCourseScreen.tsx', 'apps/mobile/src/screens/faculty/CreateCourseScreen.tsx'],
        ['apps/mobile/src/screens/FacultyAssignmentsScreen.tsx', 'apps/mobile/src/screens/faculty/AssignmentScreen.tsx'],
        ['apps/mobile/src/screens/FacultyResultsScreen.tsx', 'apps/mobile/src/screens/faculty/ResultsScreen.tsx'],
        ['apps/mobile/src/screens/EnrollmentScreen.tsx', 'apps/mobile/src/screens/student/EnrollmentScreen.tsx'],
        ['apps/mobile/src/screens/ODRequestScreen.tsx', 'apps/mobile/src/screens/student/ODRequestScreen.tsx'],
        ['apps/mobile/src/screens/ChatScreen.tsx', 'apps/mobile/src/screens/common/ChatScreen.tsx'],
        ['apps/mobile/src/screens/NotificationsScreen.tsx', 'apps/mobile/src/screens/common/NotificationsScreen.tsx'],
        ['apps/mobile/src/screens/ProfileScreen.tsx', 'apps/mobile/src/screens/common/ProfileScreen.tsx'],
        ['apps/mobile/src/screens/TimetableScreen.tsx', 'apps/mobile/src/screens/common/TimetableScreen.tsx'],
        ['apps/mobile/src/screens/GoalsScreen.tsx', 'apps/mobile/src/screens/student/GoalsScreen.tsx'],
        ['apps/mobile/src/screens/AssignmentScreen.tsx', 'apps/mobile/src/screens/student/AssignmentScreen.tsx'],
        ['apps/mobile/src/screens/CoursesScreen.tsx', 'apps/mobile/src/screens/student/CoursesScreen.tsx'],

        // Mobile Services
        ['apps/mobile/src/services/authService.ts', 'apps/mobile/src/features/authentication/services/authService.ts'],

        // Shared
        ['apps/web/src/lib/idGenerator.ts', 'packages/shared/src/utils/idGenerator.ts'],
        ['apps/web/src/utils/utils.ts', 'packages/shared/src/utils/index.ts']
    ];

    let successCount = 0;

    moves.forEach(([src, dest]) => {
        const srcPath = path.join(ROOT_DIR, src);
        const destPath = path.join(ROOT_DIR, dest);

        if (fs.existsSync(srcPath)) {
            const dir = path.dirname(destPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.renameSync(srcPath, destPath);
            console.log(`Moved: ${src} -> ${dest}`);
            successCount++;
        } else {
            console.log(`Skipped (not found): ${src}`);
        }
    });

    console.log(`\nCompleted ${successCount} accurate file moves.`);
};

const executeImportMends = () => {
    // Basic import fixes across the files
    console.log("Rewriting imports to utilize @ aliases where possible in web...");

    const webSrc = path.join(ROOT_DIR, 'apps/web/src');
    const updateImports = (dir) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (let file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                updateImports(fullPath);
            } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let original = content;

                // Web App Layout Replacements
                content = content.replace(/from\s+['"](?:\.\.\/)+layouts\/DashboardLayout['"]/g, "from '@/components/layout/DashboardLayout'");

                // Web App Auth Replacements
                content = content.replace(/from\s+['"](?:\.\.\/)+pages\/authentication\/Login['"]/g, "from '@/pages/auth/Login'");

                // Web App Student/Faculty Pages rename 
                content = content.replace(/from\s+['"](?:\.\.\/)+pages\/student\/Dashboard['"]/g, "from '@/pages/student/StudentDashboard'");
                content = content.replace(/from\s+['"](?:\.\.\/)+pages\/faculty\/Dashboard['"]/g, "from '@/pages/faculty/FacultyDashboard'");
                content = content.replace(/from\s+['"](?:\.\.\/)+pages\/faculty\/StudentRegistration['"]/g, "from '@/pages/faculty/StudentRegistrationPage'");

                // App.tsx specific routing fixes
                if (fullPath.endsWith('App.tsx')) {
                    content = content.replace(/import Login from ['"]\.\/pages\/authentication\/Login['"]/g, "import Login from '@/pages/auth/Login'");
                    content = content.replace(/import StudentDashboard from ['"]\.\/pages\/student\/Dashboard['"]/g, "import StudentDashboard from '@/pages/student/StudentDashboard'");
                    content = content.replace(/import FacultyDashboard from ['"]\.\/pages\/faculty\/Dashboard['"]/g, "import FacultyDashboard from '@/pages/faculty/FacultyDashboard'");
                    content = content.replace(/import StudentRegistration from ['"]\.\/pages\/faculty\/StudentRegistration['"]/g, "import StudentRegistration from '@/pages/faculty/StudentRegistrationPage'");
                    content = content.replace(/import DashboardLayout from ['"]\.\/layouts\/DashboardLayout['"]/g, "import DashboardLayout from '@/components/layout/DashboardLayout'");
                }

                // Shared Utilities replacements
                // Previous paths were 'src/lib/idGenerator' etc. Replace with generic.
                content = content.replace(/from\s+['"](?:\.\.\/)*lib\/idGenerator['"]/g, "from '@shared/utils/idGenerator'");
                content = content.replace(/from\s+['"]@\/lib\/idGenerator['"]/g, "from '@shared/utils/idGenerator'");
                content = content.replace(/from\s+['"](?:\.\.\/)*utils\/utils['"]/g, "from '@shared/utils'");
                content = content.replace(/from\s+['"]@\/utils\/utils['"]/g, "from '@shared/utils'");

                if (content !== original) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    // console.log(`Updated imports in ${fullPath}`);
                }
            }
        }
    };

    updateImports(webSrc);

    // Now mobile
    console.log("Rewriting relative imports in mobile...");
    const mobileSrc = path.join(ROOT_DIR, 'apps/mobile/src');

    const updateMobileImports = (dir) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (let file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                updateMobileImports(fullPath);
            } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let original = content;

                // Fix paths to StudentRegistrationScreen since we renamed it in faculty/
                content = content.replace(/import StudentRegistrationScreen from ['"]\.\/?StudentRegistrationScreen['"]/g, "import StudentRegistrationScreen from './StudentRegistrationScreen'");

                // For mobile imports moving 1 folder deep (e.g. into screens/faculty), old imports like '../config/supabase' become '../../config/supabase'
                if (fullPath.includes('screens\\faculty') || fullPath.includes('screens/faculty') ||
                    fullPath.includes('screens\\student') || fullPath.includes('screens/student') ||
                    fullPath.includes('screens\\common') || fullPath.includes('screens/common') ||
                    fullPath.includes('screens\\auth') || fullPath.includes('screens/auth')
                ) {
                    content = content.replace(/from ['"]\.\.\/config\/supabase['"]/g, "from '../../config/supabase'");
                    content = content.replace(/from ['"]\.\.\/store\/courseStore['"]/g, "from '../../store/courseStore'");
                    content = content.replace(/from ['"]\.\.\/store\/authStore['"]/g, "from '../../store/authStore'");
                    // Components
                    content = content.replace(/from ['"]\.\.\/components\/Sidebar['"]/g, "from '../../components/Sidebar'");
                }

                // Shared Mobile utils
                // Mobile idGenerator was in utils/idGenerator.ts
                content = content.replace(/from ['"](?:\.\.\/)+utils\/idGenerator['"]/g, "from '../../../../packages/shared/src/utils/idGenerator'");

                if (content !== original) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                }
            }
        }
    };
    updateMobileImports(mobileSrc);

    // Fix mobile App.tsx imports since it's above src
    const mobileAppTsx = path.join(ROOT_DIR, 'apps/mobile/App.tsx');
    if (fs.existsSync(mobileAppTsx)) {
        let content = fs.readFileSync(mobileAppTsx, 'utf8');
        let original = content;
        content = content.replace(/from '\.\/src\/screens\/LoginScreen'/g, "from './src/screens/auth/LoginScreen'");
        content = content.replace(/from '\.\/src\/screens\/StudentDashboard'/g, "from './src/screens/student/StudentDashboard'");
        content = content.replace(/from '\.\/src\/screens\/FacultyDashboard'/g, "from './src/screens/faculty/FacultyDashboard'");
        if (content !== original) {
            fs.writeFileSync(mobileAppTsx, content, 'utf8');
        }
    }
};

executeMoves();
executeImportMends();
