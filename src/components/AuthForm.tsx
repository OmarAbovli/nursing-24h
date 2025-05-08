
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assets/logo";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/authService";
import { AlertCircle, Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface AuthFormProps {
  type: "login" | "register";
  userType: "patient" | "nurse";
}

const AuthForm = ({ type, userType }: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Added for full name
  const [phone, setPhone] = useState(""); // Added for phone number
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [testCredentials, setTestCredentials] = useState<{email: string, password: string} | null>(null);

  // Check for test credentials on component mount
  useEffect(() => {
    const mockUser = authService.getTestCredentials();
    if (mockUser) {
      setTestCredentials(mockUser);
    }
  }, []);

  // Fill form with test credentials
  const applyTestCredentials = () => {
    if (testCredentials) {
      setEmail(testCredentials.email);
      setPassword(testCredentials.password);
      if (type === "register") {
        setConfirmPassword(testCredentials.password);
        setFullName("Test User"); // Set a default name for test credentials
        setPhone("+1234567890"); // Set a default phone for test credentials
        setAcceptTerms(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Form validation
    if (type === "register") {
      if (!acceptTerms) {
        setFormError("You must accept the terms and conditions to register.");
        toast({
          title: "Terms & Conditions Required",
          description: "You must accept the terms and conditions to register.",
          variant: "destructive",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (password.length < 6) {
        setFormError("Password must be at least 6 characters long.");
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate full name and phone for registration
      if (!fullName.trim()) {
        setFormError("Full name is required.");
        toast({
          title: "Full Name Required",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        return;
      }
      
      if (!phone.trim()) {
        setFormError("Phone number is required.");
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      console.log(`Attempting to ${type} as ${userType} with email: ${email}`);
      
      if (type === "login") {
        await authService.login({ email, password });
        console.log("Login successful");
        toast({
          title: "Success",
          description: "Login successful!",
        });
      } else {
        // Include name and phone in registration data
        await authService.register({ 
          email, 
          password, 
          userType,
          name: fullName,
          phone
        });
        console.log("Registration successful");
        toast({
          title: "Success",
          description: "Registration successful!",
        });
      }

      // Check if profile exists or create it
      try {
        const profile = await authService.getProfile();
        console.log("Retrieved profile:", profile);
        
        // Redirect based on user type and auth type
        if (userType === "patient") {
          if (profile && !profile.profileComplete && type === "register") {
            console.log("Redirecting to complete profile");
            navigate("/patient/complete-profile");
          } else {
            console.log("Redirecting to patient dashboard");
            navigate("/patient/dashboard");
          }
        } else if (userType === "nurse") {
          if (type === "register") {
            console.log("Redirecting to nurse register info");
            navigate("/nurse/register-info");
          } else if (profile && !profile.profileComplete) {
            console.log("Redirecting to nurse register info (incomplete profile)");
            navigate("/nurse/register-info");
          } else {
            console.log("Redirecting to nurse dashboard");
            navigate("/nurse/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        
        // Default redirects if profile check fails
        if (userType === "patient") {
          navigate("/patient/dashboard");
        } else if (userType === "nurse") {
          if (type === "register") {
            navigate("/nurse/register-info");
          } else {
            navigate("/nurse/dashboard");
          }
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage = error.response?.data?.message || "Please check your credentials and try again.";
      setFormError(errorMessage);
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-accent/50">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo size={60} />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {type === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {type === "login"
                ? `Sign in to your ${userType} account`
                : `Register as a new ${userType}`}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formError && (
                <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                  {formError}
                </div>
              )}
              
              {testCredentials && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Mock Backend Detected</AlertTitle>
                  <AlertDescription className="flex flex-col space-y-2">
                    <span>Using mock backend for testing. You can use these test credentials:</span>
                    <code className="bg-muted p-1 rounded text-xs">
                      Email: {testCredentials.email}<br />
                      Password: {testCredentials.password}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={applyTestCredentials}
                      type="button"
                    >
                      Apply Test Credentials
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Additional fields for registration */}
              {type === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {type === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {type === "register" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <Link to="/terms" className="text-primary underline">
                      Terms & Conditions
                    </Link>
                  </label>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-t-transparent rounded-full animate-spin" />
                    {type === "login" ? "Signing In..." : "Registering..."}
                  </>
                ) : (
                  type === "login" ? "Sign In" : "Register"
                )}
              </Button>

              <p className="text-sm text-center">
                {type === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  to={
                    userType === "patient"
                      ? type === "login"
                        ? "/patient/register"
                        : "/patient/login"
                      : type === "login"
                        ? "/nurse/register"
                        : "/nurse/login"
                  }
                  className="text-primary font-medium"
                >
                  {type === "login" ? "Register" : "Sign In"}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        <p className="text-xs text-center text-muted-foreground">
          <Link to="/terms" className="hover:underline">
            Terms & Conditions
          </Link>{" "}
          • © 2025 24h App
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
