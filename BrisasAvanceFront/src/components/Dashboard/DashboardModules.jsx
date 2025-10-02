import UsersModule from "../Admin/UsersModule";
import RolesModule from "../Admin/RolesModule";
import EmployeesModule from "../Admin/EmployeesModule";
import PositionsModule from "../Admin/PositionsModule";
import LocationsModule from "../Admin/LocationsModule";
import AreasModule from "../Admin/AreasModule";
import ApplicationsModule from "../Admin/ApplicationsModule";
import ApplicationTypesModule from "../Admin/ApplicationTypesModule";
import ContractsModule from "../Admin/ContractsModule";
import AttendanceModule from "../Admin/AttendanceModule";
import TrainingsModule from "../Admin/TrainingsModule";
import EmployeePostModule from "../Admin/EmployeePostModule";
import InductionsModule from "../Admin/InductionsModule";
import AssignInductionModule from "../Admin/AssignInductionModule";

export default function DashboardModules({ active }) {
    switch (active) {
        case "users":
            return <UsersModule />;
        case "roles":
            return <RolesModule />;
        case "empleados":
            return <EmployeesModule />;
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
        case "contratos":
            return <ContractsModule />;
        case "attendance":
            return <AttendanceModule />;
        case "trainings":
            return <TrainingsModule />;
        case "inductions":
            return <InductionsModule />;
        case "assignInductions":
            return <AssignInductionModule />;
        case "employeePosts":
            return <EmployeePostModule />;
        default:
            return <p>Seleccione un módulo del menú</p>;
    }
}
