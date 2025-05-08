
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceBox from "@/components/ServiceBox";
import { 
  List, 
  User, 
  Activity, 
  FlaskConical, 
  Phone, 
  Building 
} from "lucide-react";
import Logo from "@/assets/logo";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const handleNurseRequest = () => {
    navigate("/patient/request-service");
  };

  const handleOnlineSupport = () => {
    navigate("/patient/online-support");
  };

  const handleUserProfile = () => {
    navigate("/patient/profile");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
        <Logo size={36} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUserProfile}
          className="rounded-full"
        >
          <User className="w-5 h-5" />
        </Button>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Ready to Serve You</h1>
          <p className="mt-2 text-center text-muted-foreground">
            Select a service to get started
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <ServiceBox
            title="Doctor"
            icon={User}
            comingSoon={true}
          />
          <ServiceBox
            title="Nurse"
            icon={List}
            onClick={handleNurseRequest}
          />
          <ServiceBox
            title="Radiology"
            icon={Activity}
            comingSoon={true}
          />
          <ServiceBox
            title="Lab"
            icon={FlaskConical}
            comingSoon={true}
          />
          <ServiceBox
            title="Online Doctor Support"
            icon={Phone}
            onClick={handleOnlineSupport}
          />
          <ServiceBox
            title="Hospitals"
            icon={Building}
            comingSoon={true}
          />
        </div>
      </main>

      <footer className="py-4 mt-auto text-center text-sm text-muted-foreground">
        <p>© 2025 24h App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PatientDashboard;
