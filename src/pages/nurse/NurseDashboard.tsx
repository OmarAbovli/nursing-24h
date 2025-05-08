
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User, Navigation, Check } from "lucide-react";
import Logo from "@/assets/logo";
import { useToast } from "@/hooks/use-toast";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [serviceStarted, setServiceStarted] = useState(false);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    
    if (!isAvailable) {
      toast({
        title: "You're now available",
        description: "You will now receive service requests.",
      });
      
      // Simulate receiving a request after 5 seconds
      setTimeout(() => {
        setHasActiveRequest(true);
        toast({
          title: "New request received",
          description: "A patient has requested your service.",
        });
      }, 5000);
    } else {
      if (!hasActiveRequest) {
        toast({
          title: "You're now offline",
          description: "You will no longer receive service requests.",
        });
      } else {
        toast({
          title: "Cannot go offline",
          description: "You have an active request in progress.",
          variant: "destructive",
        });
        setIsAvailable(true);
      }
    }
  };

  const startService = () => {
    setServiceStarted(true);
    toast({
      title: "Service started",
      description: "You have started assisting the patient.",
    });
  };

  const completeService = () => {
    navigate("/nurse/service-summary");
  };

  const handleMenuToggle = () => {
    // Add menu handling logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
        <Logo size={36} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuToggle}
          className="rounded-full"
        >
          <User className="w-5 h-5" />
        </Button>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="p-3 mb-4 rounded-full bg-accent">
            <div className={`w-4 h-4 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"} ${isAvailable ? "animate-pulse" : ""}`} />
          </div>
          <h1 className="text-xl font-bold text-center">
            {isAvailable ? "You are available for duty" : "You are offline"}
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <Switch 
              checked={isAvailable} 
              onCheckedChange={toggleAvailability}
              disabled={hasActiveRequest && isAvailable} 
            />
            <span className="text-sm text-muted-foreground">
              {isAvailable ? "Available" : "Offline"}
            </span>
          </div>
        </div>

        {hasActiveRequest && (
          <Card className="mb-6 border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Active Request</span>
                <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Patient Name:</span>
                  <span className="font-medium">Ahmed Hassan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Age:</span>
                  <span className="font-medium">45 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service Type:</span>
                  <span className="font-medium">Prescribed treatment</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-accent">
                <h3 className="font-medium">Request Details:</h3>
                <p className="mt-1 text-sm">
                  Need assistance with daily insulin injection and blood pressure measurement. 
                  Patient has all necessary equipment and medication.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <span className="font-medium">123 El-Nasr St, Cairo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <Button variant="outline" size="sm" className="h-8">
                    <Navigation className="w-3 h-3 mr-1" />
                    Open in Maps
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {serviceStarted ? (
                <Button 
                  onClick={completeService} 
                  className="w-full"
                  variant="default"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark Service as Complete
                </Button>
              ) : (
                <Button 
                  onClick={startService} 
                  className="w-full"
                >
                  Start Assisting Patient
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
        
        {!hasActiveRequest && isAvailable && (
          <Card className="bg-accent border-0">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 border-4 rounded-full border-primary border-t-transparent animate-spin" />
              </div>
              <h2 className="text-lg font-medium">Waiting for requests...</h2>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                You'll be notified when a patient requests your service
              </p>
            </CardContent>
          </Card>
        )}
        
        {!hasActiveRequest && !isAvailable && (
          <Card className="bg-accent border-0">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-medium">You're currently offline</h2>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Toggle the switch above to make yourself available for service requests
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="py-4 mt-auto text-center text-sm text-muted-foreground">
        <p>© 2025 24h App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NurseDashboard;
