import UsersModule from "../Admin/UsersModule";
import RolesModule from "../Admin/RolesModule";
import EmployeesModule from "../Admin/EmployeesModule";
import PositionsModule from "../Admin/PositionsModule";
import LocationsModule from "../Admin/LocationsModule";
import AreasModule from "../Admin/AreasModule";
import ApplicationsModule from "../Admin/ApplicationsModule";
import ApplicationTypesModule from "../Admin/ApplicationTypesModule";
import ContractsModule from "../Admin/ContractsModule";
import EmployeePostModule from "../Admin/EmployeePostModule";
import InductionsModule from "../Admin/InductionsModules";
import ResumesModule from "../Admin/ResumeModule";
import EmployeeScheduleModule from "../Admin/EmployeeScheduleModule";
import EmployeeLocationModule from "../Admin/EmployeeLocationModule";
import EmployeeAreaModule from "../Admin/EmployeeAreaModule";
import SchedulesModule from "../Admin/ScheduleModule";
import AttendanceModule from "../Admin/AttendanceModule";
import AssignInductionModule from "../Admin/AssignFormacionesModule";

export default function DashboardModules({ active }) {
    switch (active) {
        case "users":
            return <UsersModule />;
        case "roles":
            return <RolesModule />;
        case "empleados":
            return <EmployeesModule />;
        case "shedules":
            return <SchedulesModule />;
        case "attendance":
            return <AttendanceModule />;
        case "positions":
            return <PositionsModule />;
        case "locations":
            return <LocationsModule />;
        case "areas":
            return <AreasModule />;
        case "applications":
            return <ApplicationsModule />;
        case "applicationTypes":
            return <ApplicationTypesModule />;
        case "resumes":
            return <ResumesModule />;

        case "contratos":
            return <ContractsModule />;
        case "attendance":
            return <AttendanceModule />;
        case "inductions":
            return <InductionsModule />;
        case "assignInductions":
            return <AssignInductionModule />;
        case "employeePosts":
            return <EmployeePostModule />;
        case "employeeAreas":
            return <EmployeeAreaModule />;
        case "employeeLocations":
            return <EmployeeLocationModule />;
        case "employeeSchedules":
            return <EmployeeScheduleModule />;
        default:
            return <p>Seleccione un módulo del menú</p>;
    }
}
