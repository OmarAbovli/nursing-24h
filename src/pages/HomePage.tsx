
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-16 mx-auto space-y-12">
        <div className="text-center space-y-2">
          <Logo size={80} className="mx-auto" />
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Healthcare at your fingertips
          </h1>
          <p className="max-w-md mx-auto mt-4 text-lg text-muted-foreground">
            24/7 access to qualified nurses and healthcare services at your home
          </p>
        </div>

        <div className="grid w-full max-w-md gap-4">
          <Button asChild size="lg" className="text-lg">
            <Link to="/patient/login">I'm a Patient</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg">
            <Link to="/nurse/login">I'm a Nurse</Link>
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-full space-x-4">
            <hr className="flex-1 border-t" />
            <span className="text-muted-foreground">How it works</span>
            <hr className="flex-1 border-t" />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary">
                1
              </div>
              <h3 className="font-medium">Request a service</h3>
              <p className="text-sm text-muted-foreground">
                Choose from our range of healthcare services
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary">
                2
              </div>
              <h3 className="font-medium">Connect with a provider</h3>
              <p className="text-sm text-muted-foreground">
                Get matched with a qualified healthcare professional
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary">
                3
              </div>
              <h3 className="font-medium">Receive care</h3>
              <p className="text-sm text-muted-foreground">
                Get healthcare service right at your doorstep
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
